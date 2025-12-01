import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink } from "lucide-react";

type NftData = {
  identifier?: string;
  name?: string;
  description?: string;
  display_image_url?: string;
  image_url?: string;
  image?: { url?: string };
  collection?: string;
  opensea_url?: string;
  contract?: string;
  token_standard?: string;
};

interface NftDetailModalProps {
  nft: NftData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NftDetailModal({ nft, open, onOpenChange }: NftDetailModalProps) {
  if (!nft) return null;

  const image = nft.display_image_url || nft.image_url || nft.image?.url;
  const name = nft.name || `${nft.collection ?? "NFT"} #${nft.identifier ?? "Unknown"}`;
  const openseaLink = nft.opensea_url || "https://opensea.io/0xf69120023756f1d1f539c23ade135efb66e3f494";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-card border-border/50 p-0 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative aspect-square bg-secondary overflow-hidden">
            {image ? (
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-muted">
                <span className="text-muted-foreground">No Image</span>
              </div>
            )}
            {/* Gradient overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card to-transparent md:hidden" />
          </div>

          {/* Details Section */}
          <div className="p-6 md:p-8 flex flex-col">
            <DialogHeader className="mb-4">
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-2">
                {nft.collection || "NFT Collection"}
              </p>
              <DialogTitle className="text-2xl md:text-3xl font-display text-foreground leading-tight">
                {name}
              </DialogTitle>
            </DialogHeader>

            {/* Token Info */}
            <div className="flex flex-wrap gap-3 mb-6">
              {nft.token_standard && (
                <span className="px-3 py-1 text-xs font-medium bg-secondary text-muted-foreground rounded-full uppercase">
                  {nft.token_standard}
                </span>
              )}
              {nft.identifier && (
                <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  #{nft.identifier}
                </span>
              )}
            </div>

            {/* Description */}
            {nft.description && (
              <div className="flex-1 mb-6 overflow-y-auto max-h-40">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {nft.description.length > 400 
                    ? `${nft.description.substring(0, 400)}...` 
                    : nft.description}
                </p>
              </div>
            )}

            {/* Contract Address */}
            {nft.contract && (
              <div className="mb-6">
                <p className="text-xs text-muted-foreground mb-1">Contract</p>
                <p className="text-xs font-mono text-foreground/70 truncate">
                  {nft.contract}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="mt-auto pt-4 border-t border-border/50 flex flex-col sm:flex-row gap-3">
              <a
                href={openseaLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 
                           bg-primary text-primary-foreground rounded-lg font-medium text-sm
                           transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5"
              >
                View on OpenSea
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => onOpenChange(false)}
                className="inline-flex items-center justify-center px-6 py-3 
                           bg-secondary text-foreground rounded-lg font-medium text-sm
                           transition-all duration-300 hover:bg-muted"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default NftDetailModal;
