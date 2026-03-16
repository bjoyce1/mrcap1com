import { Heart, ExternalLink, Play } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";

type RawNft = {
  identifier?: string;
  name?: string;
  description?: string;
  display_image_url?: string;
  display_animation_url?: string;
  image_url?: string;
  image?: { url?: string };
  collection?: string;
  opensea_url?: string;
  contract?: string;
  token_standard?: string;
};

interface NFTCardProps {
  nft: RawNft;
  index: number;
  onClick: (nft: RawNft) => void;
}

/** Generate a deterministic mock price from the NFT identifier */
function mockPrice(nft: RawNft, idx: number): number {
  const seed = (nft.identifier ? parseInt(nft.identifier, 10) || idx : idx) + 1;
  return Math.round(((seed * 137 + 42) % 900 + 100));
}

export function NFTCard({ nft, index, onClick }: NFTCardProps) {
  const [liked, setLiked] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-40px" });

  const image = nft.display_image_url || nft.image_url || nft.image?.url;
  const name = nft.name || `${nft.collection ?? "NFT"} #${nft.identifier ?? index}`;
  const hasMedia = !!nft.display_animation_url;
  const totalSales = mockPrice(nft, index);
  const lastSale = Math.round(totalSales * (0.6 + (index % 5) * 0.08));
  const hasDirectPrice = index % 4 === 0;

  const openseaLink =
    nft.opensea_url ||
    "https://opensea.io/0xf69120023756f1d1f539c23ade135efb66e3f494";

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.07, ease: "easeOut" }}
      className="group relative rounded-2xl overflow-hidden bg-[hsl(220_14%_10%)] ring-1 ring-white/5
                 transition-all duration-300 hover:ring-primary/30 hover:-translate-y-1 hover:shadow-[0_8px_32px_hsl(200_80%_50%/0.12)]
                 cursor-pointer flex flex-col"
      onClick={() => onClick(nft)}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-muted">
            <span className="text-xs text-muted-foreground">No Image</span>
          </div>
        )}

        {/* Total Sales badge — top-left */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold
                           bg-gradient-to-r from-[hsl(200_80%_50%)] to-[hsl(190_75%_45%)] text-white shadow-md">
            Total Sales: ${totalSales >= 1000 ? `${(totalSales / 1000).toFixed(0)}K` : totalSales}
          </span>
        </div>

        {/* Like button — top-right */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm
                     flex items-center justify-center transition-colors hover:bg-black/70"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${liked ? "fill-red-500 text-red-500" : "text-white/70"}`}
          />
        </button>

        {/* Play indicator for media */}
        {hasMedia && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 z-10">
            <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center">
              <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        {/* Collection row */}
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-5 h-5 rounded-full bg-primary/20 ring-1 ring-primary/30 flex items-center justify-center shrink-0">
            <span className="text-[8px] font-bold text-primary">✓</span>
          </div>
          <span className="text-xs text-muted-foreground truncate">
            {nft.collection || "Collection"}
          </span>
          <svg className="w-3.5 h-3.5 text-[hsl(200_80%_55%)] shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>

        {/* Name */}
        <p className="font-medium text-foreground text-sm truncate mb-0.5 group-hover:text-primary transition-colors">
          {name}
        </p>

        {/* Minted */}
        <span className="text-[11px] text-muted-foreground mb-3">1 minted</span>

        {/* Price row */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
              {hasDirectPrice ? "Price" : "Last Sale"}
            </p>
            <p className="text-sm font-semibold text-foreground">
              $ {hasDirectPrice ? totalSales : lastSale}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          {hasDirectPrice ? (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); window.open(openseaLink, "_blank"); }}
                className="flex-1 py-2 rounded-lg text-xs font-semibold text-[hsl(200_80%_55%)]
                           ring-1 ring-[hsl(200_80%_55%/0.3)] hover:bg-[hsl(200_80%_55%/0.1)] transition-colors"
              >
                Add
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); window.open(openseaLink, "_blank"); }}
                className="flex-1 py-2 rounded-lg text-xs font-semibold text-[hsl(200_80%_55%)]
                           ring-1 ring-[hsl(200_80%_55%/0.3)] hover:bg-[hsl(200_80%_55%/0.1)] transition-colors"
              >
                Buy
              </button>
            </>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); window.open(openseaLink, "_blank"); }}
              className="w-full py-2 rounded-lg text-xs font-semibold text-[hsl(200_80%_55%)]
                         ring-1 ring-[hsl(200_80%_55%/0.3)] hover:bg-[hsl(200_80%_55%/0.1)] transition-colors"
            >
              Offer
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
