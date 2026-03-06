import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type WalletState = "disconnected" | "checking" | "verified" | "not-holder";

interface WalletConnectPanelProps {
  onStatusChange?: (verified: boolean) => void;
}

const WalletConnectPanel = ({ onStatusChange }: WalletConnectPanelProps) => {
  const [state, setState] = useState<WalletState>("disconnected");

  const handleConnect = async () => {
    if (!(window as any).ethereum) {
      alert("Please install a Web3 wallet (e.g. MetaMask) to connect.");
      return;
    }

    try {
      setState("checking");
      const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const wallet = accounts[0];

      const { data, error } = await supabase.functions.invoke("opensea-wallet-nfts", {
        body: { walletAddress: wallet },
      });

      if (error) throw error;

      const hasNft = data?.nfts?.length > 0;
      setState(hasNft ? "verified" : "not-holder");
      onStatusChange?.(hasNft);
    } catch {
      setState("disconnected");
    }
  };

  return (
    <section id="wallet-connect" className="py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-card/40 border border-border/30 rounded-2xl p-6 md:p-8 text-center">
          {state === "disconnected" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Wallet className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="font-display font-bold text-foreground text-lg mb-2">Connect Your Wallet</h3>
              <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
                Connect a wallet that holds an official Mr. CAP NFT to unlock collector-only access.
              </p>
              <Button onClick={handleConnect} className="rounded-2xl gap-2">
                <Wallet className="w-4 h-4" /> Connect Wallet
              </Button>
            </motion.div>
          )}

          {state === "checking" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4">
              <Loader2 className="w-8 h-8 text-primary mx-auto mb-3 animate-spin" />
              <p className="text-sm text-muted-foreground">Checking holder status…</p>
            </motion.div>
          )}

          {state === "verified" && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
              <h3 className="font-display font-bold text-foreground text-lg mb-1">Verified Holder</h3>
              <p className="text-sm text-muted-foreground">Collector-only content is unlocked below.</p>
            </motion.div>
          )}

          {state === "not-holder" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <XCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-display font-bold text-foreground text-lg mb-1">No NFTs Found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This wallet doesn't hold an official Mr. CAP NFT. You can still browse the public collection.
              </p>
              <Button variant="fluxOutline" onClick={handleConnect} className="rounded-2xl">
                Try Another Wallet
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WalletConnectPanel;
