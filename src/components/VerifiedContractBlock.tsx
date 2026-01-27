import { ExternalLink, Shield } from "lucide-react";

const CONTRACT_ADDRESS = "0x495f947276749ce646f68ac8c248420045cb7b5e";
const CREATOR_ADDRESS = "0xf69120023756f1d1f539c23ade135efb66e3f494";

export function VerifiedContractBlock() {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 md:p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-display font-medium text-foreground mb-2">
                Verified On-Chain Details
              </h2>
              <p className="text-muted-foreground text-sm">
                All NFTs are verifiable on the Ethereum blockchain
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="text-sm text-muted-foreground w-20 flex-shrink-0">Contract:</span>
              <code className="text-sm text-foreground font-mono break-all">
                {CONTRACT_ADDRESS}
              </code>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="text-sm text-muted-foreground w-20 flex-shrink-0">Standard:</span>
              <span className="text-sm text-foreground">ERC-1155</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="text-sm text-muted-foreground w-20 flex-shrink-0">Creator:</span>
              <code className="text-sm text-foreground font-mono break-all">
                {CREATOR_ADDRESS}
              </code>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={`https://etherscan.io/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full 
                         border border-white/10 text-sm text-foreground
                         hover:bg-white/5 hover:border-white/20 transition-colors"
            >
              View Contract on Etherscan
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="https://opensea.io/mrcap1/created"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full 
                         border border-white/10 text-sm text-foreground
                         hover:bg-white/5 hover:border-white/20 transition-colors"
            >
              View Created NFTs on OpenSea
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
