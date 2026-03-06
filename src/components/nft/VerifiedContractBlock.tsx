import { motion } from "framer-motion";
import { ExternalLink, Shield, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface ContractData {
  collection: string;
  chain: string;
  standard: string;
  contractAddress: string;
  creatorWallet: string;
  etherscanUrl: string;
  openseaUrl: string;
}

const VerifiedContractBlock = ({ data }: { data: ContractData }) => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied` });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="py-12"
    >
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-card/40 border border-border/30 rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-xs font-medium tracking-widest uppercase text-primary">
              Verified On-Chain Details
            </span>
          </div>

          <div className="space-y-4">
            <Row label="Collection" value={data.collection} />
            <Row label="Chain" value={data.chain} />
            <Row label="Token Standard" value={data.standard} />
            <Row
              label="Contract"
              value={data.contractAddress}
              mono
              onCopy={() => copyToClipboard(data.contractAddress, "Contract")}
            />
            <Row
              label="Creator Wallet"
              value={data.creatorWallet}
              mono
              onCopy={() => copyToClipboard(data.creatorWallet, "Wallet")}
            />
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <a href={data.etherscanUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="fluxOutline" size="sm" className="rounded-2xl gap-2">
                <ExternalLink className="w-3.5 h-3.5" /> View Contract on Etherscan
              </Button>
            </a>
            <a href={data.openseaUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="fluxOutline" size="sm" className="rounded-2xl gap-2">
                <ExternalLink className="w-3.5 h-3.5" /> View Created NFTs on OpenSea
              </Button>
            </a>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

const Row = ({
  label,
  value,
  mono,
  onCopy,
}: {
  label: string;
  value: string;
  mono?: boolean;
  onCopy?: () => void;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
    <span className="text-xs text-muted-foreground/60 uppercase tracking-wide w-32 shrink-0">{label}</span>
    <div className="flex items-center gap-2 min-w-0">
      <span className={`text-sm text-foreground truncate ${mono ? "font-mono" : ""}`}>{value}</span>
      {onCopy && (
        <button onClick={onCopy} className="shrink-0 text-muted-foreground hover:text-primary transition-colors">
          <Copy className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  </div>
);

export default VerifiedContractBlock;
