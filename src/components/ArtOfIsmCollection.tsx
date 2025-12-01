import React, { useEffect, useState } from "react";
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

export function ArtOfIsmCollection() {
  const [nfts, setNfts] = useState<RawNft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNft, setSelectedNft] = useState<RawNft | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function fetchAlbumNfts() {
      try {
        const { data, error: fnError } = await supabase.functions.invoke('opensea-collection-nfts', {
          body: { collection: 'artofism', limit: 50 }
        });
        
        if (fnError) {
          console.error("Edge function error:", fnError);
          setError("Failed to load album collection.");
          return;
        }

        setNfts(data?.nfts || []);
      } catch (err) {
        console.error(err);
        setError("Error loading album collection.");
      } finally {
        setLoading(false);
      }
    }

    fetchAlbumNfts();
  }, []);

  const handleNftClick = (nft: RawNft) => {
    setSelectedNft(nft);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="mb-16">
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
        </div>
        <div className="flex items-center justify-center gap-4 py-12">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading album tracks…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-16 text-center py-8">
        <p className="text-destructive text-sm">{error}</p>
      </div>
    );
  }

  if (nfts.length === 0) return null;

  return (
    <div className="mb-16">
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
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6 
                      p-6 md:p-8 bg-card/30 border border-accent/20 rounded-2xl backdrop-blur-sm">
        {nfts.map((nft, idx) => {
          const image = nft.display_image_url || nft.image_url || nft.image?.url;
          const name = nft.name || `Track #${nft.identifier ?? idx}`;
          const hasMedia = !!nft.display_animation_url;

          return (
            <button
              key={`album-${nft.identifier}-${idx}`}
              onClick={() => handleNftClick(nft)}
              className="group relative rounded-xl overflow-hidden bg-card-gradient border border-border/50 
                         transition-all duration-500 ease-out text-left
                         hover:border-primary/60 hover:shadow-glow hover:-translate-y-2
                         focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
              
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

              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary/50 
                              group-hover:bg-accent group-hover:shadow-gold transition-all duration-300" />
            </button>
          );
        })}
      </div>
      
      <p className="text-center text-accent/70 text-xs mt-4">
        {nfts.length} track{nfts.length !== 1 ? 's' : ''} from The Art of ISM
      </p>

      <NftDetailModal 
        nft={selectedNft} 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
      />
    </div>
  );
}
