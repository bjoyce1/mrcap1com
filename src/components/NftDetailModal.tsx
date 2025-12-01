import React, { useRef, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink, Play, Pause, Volume2, VolumeX } from "lucide-react";

type NftData = {
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

interface NftDetailModalProps {
  nft: NftData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NftDetailModal({ nft, open, onOpenChange }: NftDetailModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Reset state when modal closes or NFT changes
  useEffect(() => {
    if (!open) {
      setIsPlaying(false);
      setIsMuted(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [open, nft]);

  if (!nft) return null;

  const image = nft.display_image_url || nft.image_url || nft.image?.url;
  const animationUrl = nft.display_animation_url;
  const name = nft.name || `${nft.collection ?? "NFT"} #${nft.identifier ?? "Unknown"}`;
  const openseaLink = nft.opensea_url || "https://opensea.io/0xf69120023756f1d1f539c23ade135efb66e3f494";

  // Determine media type from URL
  const isVideo = animationUrl && (
    animationUrl.includes('.mp4') || 
    animationUrl.includes('.webm') || 
    animationUrl.includes('.mov') ||
    animationUrl.includes('video')
  );
  const isAudio = animationUrl && (
    animationUrl.includes('.mp3') || 
    animationUrl.includes('.wav') || 
    animationUrl.includes('.ogg') ||
    animationUrl.includes('audio')
  );
  const hasMedia = isVideo || isAudio;

  const togglePlay = () => {
    if (isVideo && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else if (isAudio && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-card border-border/50 p-0 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Media Section */}
          <div className="relative aspect-square bg-secondary overflow-hidden">
            {isVideo && animationUrl ? (
              <>
                <video
                  ref={videoRef}
                  src={animationUrl}
                  poster={image}
                  className="w-full h-full object-cover"
                  loop
                  playsInline
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                {/* Video Controls Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={togglePlay}
                    className="w-16 h-16 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center
                               transition-transform duration-300 hover:scale-110 hover:shadow-glow"
                  >
                    {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                  </button>
                </div>
                {/* Mute Button */}
                <button
                  onClick={toggleMute}
                  className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center
                             transition-all duration-300 hover:bg-black/80"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </>
            ) : isAudio && animationUrl ? (
              <>
                {/* Audio with album art */}
                {image ? (
                  <img
                    src={image}
                    alt={name}
                    className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : ''}`}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-muted">
                    <span className="text-muted-foreground">No Image</span>
                  </div>
                )}
                <audio
                  ref={audioRef}
                  src={animationUrl}
                  loop
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                {/* Audio Controls Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`absolute inset-0 bg-black/40 ${isPlaying ? 'opacity-30' : 'opacity-0 hover:opacity-100'} transition-opacity duration-300`} />
                  <button
                    onClick={togglePlay}
                    className={`relative z-10 w-20 h-20 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center
                               transition-all duration-500 hover:scale-110 hover:shadow-glow
                               ${isPlaying ? 'animate-pulse shadow-glow' : ''}`}
                  >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                  </button>
                </div>
                {/* Audio Visualizer Indicator */}
                {isPlaying && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-accent rounded-full animate-pulse"
                        style={{
                          height: `${12 + Math.random() * 20}px`,
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: `${0.4 + Math.random() * 0.3}s`
                        }}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : image ? (
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
            {/* Gradient overlay at bottom for mobile */}
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
              {hasMedia && (
                <span className="px-3 py-1 text-xs font-medium bg-accent/20 text-accent rounded-full">
                  {isVideo ? '🎬 Video' : '🎵 Audio'}
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
              {hasMedia && (
                <button
                  onClick={togglePlay}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 
                             bg-accent text-accent-foreground rounded-lg font-medium text-sm
                             transition-all duration-300 hover:shadow-gold hover:-translate-y-0.5"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
              )}
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
