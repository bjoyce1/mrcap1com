import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NftDetailModal } from "./NftDetailModal";

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

const ART_OF_ISM_COLLECTION = "artofism";

export function OtherNftsGallery() {
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

      const list = (data?.nfts || data?.assets || []).filter(
        (nft: RawNft) => 
          nft.collection !== ART_OF_ISM_COLLECTION &&
          !nft.name?.toLowerCase().includes('ugly kid') &&
          !nft.collection?.toLowerCase().includes('ugly kid')
      );
      
      if (isLoadingMore) {
        setNfts(prev => [...prev, ...list]);
      } else {
        setNfts(list);
      }
      
      setNextCursor(data?.next || null);

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-primary/30 rounded-full" />
          <div className="absolute inset-0 w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-muted-foreground text-sm animate-pulse">
          Loading NFTs from the blockchain…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive text-sm bg-destructive/10 inline-block px-6 py-3 rounded-lg border border-destructive/20">
          {error}
        </p>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-12">No other NFTs found in wallet.</p>
    );
  }

  return (
    <>
      {/* Section Header */}
      <div className="mb-8 text-center">
        <h3 className="text-2xl md:text-3xl font-display text-foreground mb-2">
          Other <span className="text-primary">Collectibles</span>
        </h3>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          Collaborations, exclusive drops, and unique digital art pieces.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {nfts.map((nft, idx) => {
          const image = nft.display_image_url || nft.image_url || nft.image?.url;
          const name = nft.name || `${nft.collection ?? "NFT"} #${nft.identifier ?? idx}`;
          const hasMedia = !!nft.display_animation_url;

          return (
            <button
              key={`other-${nft.identifier}-${idx}`}
              onClick={() => handleNftClick(nft)}
              className="group relative rounded-2xl overflow-hidden bg-card border border-border/50 
                         transition-all duration-500 ease-out text-left
                         hover:border-primary/60 hover:shadow-glow hover:-translate-y-2
                         focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
              
              {/* Media badge */}
              {hasMedia && (
                <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1.5 
                                bg-primary/90 backdrop-blur-sm rounded-full">
                  <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <span className="text-[10px] font-semibold text-primary-foreground uppercase tracking-wide">
                    Media
                  </span>
                </div>
              )}

              {/* Collection badge */}
              {nft.collection && (
                <div className="absolute top-3 right-3 z-20 px-2.5 py-1 bg-background/80 backdrop-blur-sm rounded-full">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide truncate max-w-[100px] block">
                    {nft.collection}
                  </span>
                </div>
              )}
              
              {/* Image */}
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

              {/* Content */}
              <div className="p-5 relative z-20">
                <p className="font-medium text-foreground truncate text-base mb-2 
                              group-hover:text-accent transition-colors duration-300">
                  {name}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground 
                                  group-hover:text-primary transition-colors duration-300">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    {hasMedia ? "Play Media" : "View Details"}
                  </div>
                  <svg 
                    className="w-4 h-4 text-muted-foreground transform group-hover:translate-x-1 group-hover:text-primary transition-all duration-300" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Load More */}
      {nextCursor && (
        <div className="mt-12 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="group relative inline-flex items-center gap-3 px-8 py-4 
                       bg-card border border-border/50 rounded-xl
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

      {/* Count */}
      <p className="text-center text-muted-foreground text-xs mt-6">
        Showing {nfts.length} NFT{nfts.length !== 1 ? 's' : ''}
        {!nextCursor && ' · All loaded'}
      </p>

      {/* Modal */}
      <NftDetailModal 
        nft={selectedNft} 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
      />
    </>
  );
}
