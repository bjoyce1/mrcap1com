import { useState, useEffect, ReactNode } from "react";
import { Wallet, Loader2, ShieldCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface NFTGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      isMetaMask?: boolean;
    };
  }
}

export function NFTGate({ children, fallback }: NFTGateProps) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isHolder, setIsHolder] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing connection on mount
  useEffect(() => {
    const checkExistingConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const accounts = await window.ethereum.request({ 
            method: "eth_accounts" 
          }) as string[];
          
          if (accounts && accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        } catch (err) {
          console.log("No existing wallet connection");
        }
      }
    };
    
    checkExistingConnection();
  }, []);

  // Verify holder status when wallet is connected
  useEffect(() => {
    if (walletAddress) {
      verifyHolder(walletAddress);
    }
  }, [walletAddress]);

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      setError("Please install MetaMask or another Web3 wallet to continue.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({ 
        method: "eth_requestAccounts" 
      }) as string[];
      
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
      } else {
        setError("No wallet accounts found. Please try again.");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to connect wallet";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyHolder = async (address: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("nft-holder", {
        body: { address }
      });

      if (fnError) {
        console.error("NFT verification error:", fnError);
        setError("Failed to verify NFT ownership. Please try again.");
        setIsHolder(false);
        return;
      }

      console.log("NFT verification result:", data);
      setIsHolder(data?.isHolder === true);

      if (!data?.isHolder) {
        setError("You need to own an NFT from Mr. CAP's collection to access this content.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError("Network error. Please try again.");
      setIsHolder(false);
    } finally {
      setIsLoading(false);
    }
  };

  // If verified holder, show children
  if (isHolder === true) {
    return <>{children}</>;
  }

  // Show gate UI
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 text-center">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-display font-medium text-foreground mb-3">
            NFT Holder Access
          </h1>
          
          <p className="text-muted-foreground text-sm mb-8">
            Connect your wallet to verify ownership of an NFT from Mr. CAP's collection 
            and unlock exclusive content.
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Connection Status */}
          {walletAddress && (
            <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-muted-foreground mb-1">Connected Wallet</p>
              <p className="text-sm text-foreground font-mono truncate">
                {walletAddress}
              </p>
            </div>
          )}

          {/* Action Button */}
          {!walletAddress ? (
            <Button 
              onClick={connectWallet}
              disabled={isLoading}
              className="w-full py-6 text-lg rounded-xl bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="w-5 h-5 mr-2" />
                  Connect Wallet
                </>
              )}
            </Button>
          ) : isLoading ? (
            <Button disabled className="w-full py-6 text-lg rounded-xl">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Verifying Ownership...
            </Button>
          ) : (
            <Button 
              onClick={() => verifyHolder(walletAddress)}
              className="w-full py-6 text-lg rounded-xl bg-primary hover:bg-primary/90"
            >
              <ShieldCheck className="w-5 h-5 mr-2" />
              Retry Verification
            </Button>
          )}

          {/* Get NFT CTA */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-sm text-muted-foreground mb-4">
              Don't have an NFT? Get one on OpenSea:
            </p>
            <a
              href="https://opensea.io/0xf69120023756f1d1f539c23ade135efb66e3f494"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 
                         text-sm text-foreground hover:bg-white/5 transition-colors"
            >
              View Collection on OpenSea
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Custom fallback content */}
        {fallback && (
          <div className="mt-8">
            {fallback}
          </div>
        )}
      </div>
    </div>
  );
}
