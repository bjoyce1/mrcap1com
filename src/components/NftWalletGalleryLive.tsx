import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NftDetailModal } from "./NftDetailModal";

type RawNft = {
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

export function NftWalletGalleryLive() {
  const [nfts, setNfts] = useState<RawNft[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [selectedNft, setSelectedNft] = useState<RawNft | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadNFTs = useCallback(async (cursor?: string) => {
    const isLoadingMore = !!cursor;
    
    if (isLoadingMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const { data, error: fnError } = await supabase.functions.invoke('opensea-wallet-nfts', {
        body: cursor ? { next: cursor } : {}
      });
      
      if (fnError) {
        console.error("Edge function error:", fnError);
        setError("Failed to load NFTs from OpenSea.");
        return;
      }

      const list = data?.nfts || data?.assets || [];
      
      if (isLoadingMore) {
        setNfts(prev => [...prev, ...list]);
      } else {
        setNfts(list);
      }
      
      setNextCursor(data?.next || null);
      console.log("Loaded NFTs:", list.length, "Has more:", !!data?.next);

    } catch (err) {
      console.error(err);
      setError("Error contacting NFT server.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadNFTs();
  }, [loadNFTs]);

  const handleLoadMore = () => {
    if (nextCursor && !loadingMore) {
      loadNFTs(nextCursor);
    }
  };

  const handleNftClick = (nft: RawNft) => {
    setSelectedNft(nft);
    setModalOpen(true);
  };

  return (
    <section id="nft-wallet-gallery" className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-red-glow opacity-30 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-primary font-medium mb-3">
            Web3 · Live On-Chain Collection
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-foreground mb-4">
            NFT <span className="text-gradient-gold">Gallery</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Live on-chain NFTs pulled directly from MR. CAP's wallet on OpenSea. 
            Pioneering Houston hip-hop in Web3.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <div className="relative">
              <div className="w-12 h-12 border-2 border-primary/30 rounded-full" />
              <div className="absolute inset-0 w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-muted-foreground text-sm animate-pulse">
              Loading NFTs from the blockchain…
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-destructive text-sm bg-destructive/10 inline-block px-6 py-3 rounded-lg border border-destructive/20">
              {error}
            </p>
          </div>
        )}

        {/* NFT Grid */}
        {!loading && !error && (
          <>
            {nfts.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">No NFTs found in wallet.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {nfts.map((nft, idx) => {
                    const image =
                      nft.display_image_url ||
                      nft.image_url ||
                      nft.image?.url;

                    const name =
                      nft.name ||
                      `${nft.collection ?? "NFT"} #${nft.identifier ?? idx}`;

                    return (
                      <button
                        key={`${nft.identifier}-${idx}`}
                        onClick={() => handleNftClick(nft)}
                        className="group relative rounded-xl overflow-hidden bg-card-gradient border border-border/50 
                                   transition-all duration-500 ease-out text-left
                                   hover:border-primary/60 hover:shadow-glow hover:-translate-y-2
                                   focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        {/* Hover glow overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent 
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
                        
                        {/* Image Container */}
                        <div className="aspect-square overflow-hidden bg-secondary">
                          {image ? (
                            <img
                              src={image}
                              alt={name}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-700 ease-out
                                         group-hover:scale-110"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full bg-muted">
                              <span className="text-xs text-muted-foreground">No Image</span>
                            </div>
                          )}
                        </div>

                        {/* Card Content */}
                        <div className="p-4 md:p-5 relative z-20 bg-gradient-to-t from-card via-card/95 to-transparent">
                          <p className="font-medium text-foreground truncate text-sm md:text-base mb-2 
                                        group-hover:text-accent transition-colors duration-300">
                            {name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground 
                                          group-hover:text-primary transition-colors duration-300">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            View Details
                            <svg 
                              className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-300" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>

                        {/* Corner accent */}
                        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary/50 
                                        group-hover:bg-accent group-hover:shadow-gold transition-all duration-300" />
                      </button>
                    );
                  })}
                </div>

                {/* Load More Button */}
                {nextCursor && (
                  <div className="mt-12 text-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="group relative inline-flex items-center gap-3 px-8 py-4 
                                 bg-card-gradient border border-border/50 rounded-xl
                                 text-foreground font-medium text-sm
                                 transition-all duration-300
                                 hover:border-primary/60 hover:shadow-glow hover:-translate-y-1
                                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      {loadingMore ? (
                        <>
                          <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                          Loading more...
                        </>
                      ) : (
                        <>
                          <span className="text-gradient-gold">Load More NFTs</span>
                          <svg 
                            className="w-4 h-4 text-accent transform group-hover:translate-y-1 transition-transform duration-300" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* NFT Count */}
                <p className="text-center text-muted-foreground text-xs mt-6">
                  Showing {nfts.length} NFT{nfts.length !== 1 ? 's' : ''}
                  {!nextCursor && ' · All loaded'}
                </p>
              </>
            )}
          </>
        )}
      </div>

      {/* NFT Detail Modal */}
      <NftDetailModal 
        nft={selectedNft} 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
      />
    </section>
  );
}

export default NftWalletGalleryLive;
