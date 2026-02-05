import { Lock, Wallet } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface NFTGateProps {
  children: React.ReactNode;
  locked?: React.ReactNode;
}

/**
 * NFTGate wraps content that requires NFT holder verification.
 * Uses the existing opensea-wallet-nfts verification pattern.
 * In Phase 1, this is a simple UI gate - full wallet verification comes in Phase 3.
 */
const NFTGate = ({ children, locked }: NFTGateProps) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    // Phase 1: Show locked state with message
    // Phase 3: Full wallet connect + on-chain verification
    setIsVerifying(true);
    setError(null);

    try {
      // Check if ethereum provider exists
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
        if (accounts && accounts.length > 0) {
          const walletAddress = accounts[0];
          
          // Verify NFT ownership via edge function
          const { data, error: fnError } = await supabase.functions.invoke("opensea-wallet-nfts", {
            body: { walletAddress, verifyOnly: true },
          });

          if (fnError) throw new Error("Verification failed");
          if (data?.isHolder) {
            setIsVerified(true);
          } else {
            setError("No qualifying NFTs found in this wallet.");
          }
        }
      } else {
        setError("No wallet detected. Install MetaMask or a Web3 wallet to verify.");
      }
    } catch (err: any) {
      setError(err.message || "Verification failed. Try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (isVerified) return <>{children}</>;

  return (
    locked || (
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary/50 border border-border/30">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Lock className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">Collector-Only Track</p>
          <p className="text-xs text-muted-foreground">Connect your wallet to verify NFT ownership and unlock this track.</p>
          {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>
        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Wallet className="w-3 h-3" />
          {isVerifying ? "Verifying..." : "Verify"}
        </button>
      </div>
    )
  );
};

export default NFTGate;
