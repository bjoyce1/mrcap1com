import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Play, Pause, ExternalLink } from "lucide-react";
import albumArtOfIsm from "@/assets/nft-art-of-ism.png";

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
  const [selectedTrack, setSelectedTrack] = useState<RawNft | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

        const tracks = data?.nfts || [];
        setNfts(tracks);
        // Auto-select first track with audio
        const firstPlayable = tracks.find((t: RawNft) => t.display_animation_url);
        if (firstPlayable) {
          setSelectedTrack(firstPlayable);
        }
      } catch (err) {
        console.error(err);
        setError("Error loading album collection.");
      } finally {
        setLoading(false);
      }
    }

    fetchAlbumNfts();
  }, []);

  const handleTrackSelect = (nft: RawNft) => {
    if (selectedTrack?.identifier === nft.identifier && isPlaying) {
      // Pause if clicking the same track that's playing
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      // Select new track
      setSelectedTrack(nft);
      setIsPlaying(false);
      // Will auto-play after audio loads
      setTimeout(() => {
        if (nft.display_animation_url) {
          audioRef.current?.play();
          setIsPlaying(true);
        }
      }, 100);
    }
  };

  const handleAlbumCoverClick = () => {
    if (!selectedTrack?.display_animation_url) return;
    
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    // Auto-play next track
    if (selectedTrack) {
      const currentIndex = nfts.findIndex(n => n.identifier === selectedTrack.identifier);
      const nextTrack = nfts[currentIndex + 1];
      if (nextTrack?.display_animation_url) {
        setSelectedTrack(nextTrack);
        setTimeout(() => {
          audioRef.current?.play();
          setIsPlaying(true);
        }, 100);
      }
    }
  };

  if (loading) {
    return (
      <div className="mb-16">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 supports-[backdrop-filter]:bg-white/[0.03] backdrop-blur-xl ring-1 ring-white/10 rounded-full mb-4">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              NFT Album Collection
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-display text-foreground mb-2">
            The Art of <span className="text-gradient-orange">ISM</span>
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
        <div className="inline-flex items-center gap-3 px-5 py-2.5 supports-[backdrop-filter]:bg-white/[0.03] backdrop-blur-xl ring-1 ring-white/10 rounded-full mb-4">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            NFT Album Collection
          </span>
        </div>
        <h3 className="text-2xl md:text-3xl font-display text-foreground mb-2">
          The Art of <span className="text-gradient-orange">ISM</span>
        </h3>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          Complete album tokenized as individual music NFTs on the blockchain.
        </p>
      </div>
      
      <div className="supports-[backdrop-filter]:bg-white/[0.03] backdrop-blur-xl ring-1 ring-white/5 rounded-2xl p-6 md:p-8">
        <div className="grid md:grid-cols-[320px_1fr] lg:grid-cols-[380px_1fr] gap-8">
          
          {/* Album Cover Player */}
          <div className="flex flex-col items-center">
            <button
              onClick={handleAlbumCoverClick}
              disabled={!selectedTrack?.display_animation_url}
              className="relative group w-full max-w-[320px] lg:max-w-[380px] aspect-square rounded-xl overflow-hidden 
                         ring-1 ring-white/10 hover:ring-primary/50 transition-all duration-500
                         disabled:cursor-default shadow-2xl shadow-primary/10"
            >
              <img
                src={albumArtOfIsm}
                alt="The Art of ISM"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Play/Pause Overlay */}
              {selectedTrack?.display_animation_url && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center
                                  transform group-hover:scale-110 transition-transform duration-300">
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-primary-foreground" />
                    ) : (
                      <Play className="w-8 h-8 text-primary-foreground ml-1" />
                    )}
                  </div>
                </div>
              )}
              
              {/* Playing Indicator */}
              {isPlaying && (
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 
                                px-4 py-2 bg-black/60 backdrop-blur-sm rounded-lg">
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-6 bg-primary rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                    <span className="w-1 h-5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
                  </div>
                  <span className="text-xs text-white/90 truncate flex-1">
                    {selectedTrack?.name || 'Playing...'}
                  </span>
                </div>
              )}
            </button>
            
            <p className="mt-4 text-sm text-muted-foreground text-center">
              Click album cover to {isPlaying ? 'pause' : 'play'}
            </p>
          </div>

          {/* Tracklist */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-foreground">Tracklist</h4>
              <span className="text-xs text-muted-foreground">{nfts.length} tracks</span>
            </div>
            
            <div className="flex-1 overflow-y-auto max-h-[400px] md:max-h-[340px] lg:max-h-[380px] 
                            scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-2">
              <ul className="space-y-1">
                {nfts.map((nft, idx) => {
                  const name = nft.name || `Track #${nft.identifier ?? idx}`;
                  const hasMedia = !!nft.display_animation_url;
                  const isSelected = selectedTrack?.identifier === nft.identifier;
                  const isCurrentlyPlaying = isSelected && isPlaying;

                  return (
                    <li key={`track-${nft.identifier}-${idx}`}>
                      <button
                        onClick={() => handleTrackSelect(nft)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left
                                   transition-all duration-200 group
                                   ${isSelected 
                                     ? 'bg-primary/10 ring-1 ring-primary/30' 
                                     : 'hover:bg-white/5'}`}
                      >
                        {/* Track Number / Play Icon */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                                        transition-colors duration-200
                                        ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-white/5 text-muted-foreground group-hover:bg-white/10'}`}>
                          {isCurrentlyPlaying ? (
                            <Pause className="w-3.5 h-3.5" />
                          ) : hasMedia ? (
                            <Play className="w-3.5 h-3.5 ml-0.5" />
                          ) : (
                            <span className="text-xs font-medium">{idx + 1}</span>
                          )}
                        </div>
                        
                        {/* Track Info */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate transition-colors duration-200
                                        ${isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
                            {name}
                          </p>
                          {hasMedia && (
                            <p className="text-xs text-muted-foreground">Music NFT</p>
                          )}
                        </div>
                        
                        {/* Playing Indicator */}
                        {isCurrentlyPlaying && (
                          <div className="flex items-center gap-0.5">
                            <span className="w-0.5 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                            <span className="w-0.5 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                            <span className="w-0.5 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                          </div>
                        )}
                        
                        {/* OpenSea Link */}
                        {nft.opensea_url && (
                          <a
                            href={nft.opensea_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-md hover:bg-white/10 text-muted-foreground hover:text-foreground
                                       transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      {selectedTrack?.display_animation_url && (
        <audio
          ref={audioRef}
          src={selectedTrack.display_animation_url}
          onEnded={handleAudioEnded}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />
      )}
      
      <p className="text-center text-muted-foreground text-xs mt-4">
        {nfts.length} track{nfts.length !== 1 ? 's' : ''} from The Art of ISM • Sony Music / The Orchard
      </p>
    </div>
  );
}