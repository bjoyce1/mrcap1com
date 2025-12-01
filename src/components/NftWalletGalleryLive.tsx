import React, { useEffect, useState, useCallback, useMemo } from "react";
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

// Album collection track names from "The Art of ISM"
const ALBUM_COLLECTION_NAMES = [
  "Capism",
  "Nothing Without It",
  "For Money",
  "The Realest",
  "Space Age Ism",
  "Let Me Touch It",
  "Words Of ISM",
  "Words of ISM",
  "How You Feel",
  "International Club Hopper",
  "Focus",
  "Evolution of the 16th Letter",
  "Evolution Of The 16th Letter",
];

// Helper to check if NFT is part of album collection
const isAlbumNft = (nft: RawNft): boolean => {
  const name = nft.name?.toLowerCase() || "";
  return ALBUM_COLLECTION_NAMES.some(track => 
    name.includes(track.toLowerCase())
  );
};

export function NftWalletGalleryLive() {
  const [nfts, setNfts] = useState<RawNft[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [selectedNft, setSelectedNft] = useState<RawNft | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Separate album collection NFTs from other NFTs
  const { albumNfts, otherNfts } = useMemo(() => {
    const album: RawNft[] = [];
    const others: RawNft[] = [];
    
    nfts.forEach(nft => {
      if (isAlbumNft(nft)) {
        album.push(nft);
      } else {
        others.push(nft);
      }
    });
    
    return { albumNfts: album, otherNfts: others };
  }, [nfts]);

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

  // Reusable NFT Card component
  const NftCard = ({ nft, idx }: { nft: RawNft; idx: number }) => {
    const image = nft.display_image_url || nft.image_url || nft.image?.url;
    const name = nft.name || `${nft.collection ?? "NFT"} #${nft.identifier ?? idx}`;
    const hasMedia = !!nft.display_animation_url;

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
        
        {/* Media badge */}
        {hasMedia && (
          <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2 py-1 
                          bg-primary/90 backdrop-blur-sm rounded-full">
            <svg className="w-3 h-3 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <span className="text-[10px] font-medium text-primary-foreground uppercase tracking-wide">
              Play
            </span>
          </div>
        )}
        
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
            {hasMedia ? "Play Track" : "View Details"}
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

        {/* NFT Content */}
        {!loading && !error && (
          <>
            {nfts.length === 0 ? (
              <p className="text-muted-foreground text-center py-12">No NFTs found in wallet.</p>
            ) : (
              <>
                {/* Album Collection Section */}
                {albumNfts.length > 0 && (
                  <div className="mb-16">
                    {/* Album Section Header */}
                    <div className="mb-8 text-center">
                      <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-accent/10 border border-accent/30 rounded-full mb-4">
                        <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                        <span className="text-sm font-medium text-accent uppercase tracking-wider">
                          NFT Album Collection
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-display text-foreground mb-2">
                        The Art of <span className="text-gradient-gold">ISM</span>
                      </h3>
                      <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                        Complete album tokenized as individual music NFTs on the blockchain. 
                        Click any track to play.
                      </p>
                    </div>
                    
                    {/* Album Grid - 3 columns on larger screens for featured feel */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6 
                                    p-6 md:p-8 bg-card/30 border border-accent/20 rounded-2xl backdrop-blur-sm">
                      {albumNfts.map((nft, idx) => (
                        <NftCard key={`album-${nft.identifier}-${idx}`} nft={nft} idx={idx} />
                      ))}
                    </div>
                    
                    {/* Album track count */}
                    <p className="text-center text-accent/70 text-xs mt-4">
                      {albumNfts.length} track{albumNfts.length !== 1 ? 's' : ''} from The Art of ISM
                    </p>
                  </div>
                )}

                {/* Divider if both sections exist */}
                {albumNfts.length > 0 && otherNfts.length > 0 && (
                  <div className="flex items-center gap-4 mb-12">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">
                      Other NFTs
                    </span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                  </div>
                )}

                {/* Other NFTs Grid */}
                {otherNfts.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {otherNfts.map((nft, idx) => (
                      <NftCard key={`other-${nft.identifier}-${idx}`} nft={nft} idx={idx} />
                    ))}
                  </div>
                )}

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
