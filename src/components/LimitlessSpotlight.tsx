import { forwardRef, useState, useRef } from "react";
import { ExternalLink, Play, Pause, Film, Music, ShoppingBag } from "lucide-react";
import limitlessCover from "@/assets/limitless-cover.png";
import limitlessBg from "@/assets/limitless-bg.jpg";

const LimitlessSpotlight = forwardRef<HTMLElement>((_, ref) => {
  const [showVideo, setShowVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <section
      ref={ref}
      className="py-16 md:py-24 relative border-b border-white/5 overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={limitlessBg}
          alt=""
          className="w-full h-full object-cover opacity-40"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/70 to-background" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium mb-2">
            Featured Release
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-medium text-foreground tracking-tight">
            "Limitless"{" "}
            <span className="text-muted-foreground font-light text-xl md:text-2xl">
              ft. K-Rino
            </span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Single · Music Video · NFT · February 2021
          </p>
        </div>

        <div className="grid md:grid-cols-[340px_1fr] gap-8 lg:gap-12 items-start">
          {/* Left — Cover Art + Audio */}
          <div className="space-y-4">
            <div className="relative group rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
              <img
                src={limitlessCover}
                alt="Limitless — Mr. CAP ft. K-Rino"
                className="w-full aspect-square object-cover"
                loading="lazy"
              />
              {/* Play overlay */}
              <button
                onClick={toggleAudio}
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={isPlaying ? "Pause preview" : "Play preview"}
              >
                <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm">
                  {isPlaying ? (
                    <Pause className="w-7 h-7 text-primary-foreground" />
                  ) : (
                    <Play className="w-7 h-7 text-primary-foreground ml-1" />
                  )}
                </div>
              </button>
              {isPlaying && (
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm">
                  <span className="text-[11px] text-primary font-medium animate-pulse">
                    ♫ Now Playing
                  </span>
                </div>
              )}
            </div>
            <audio
              ref={audioRef}
              src="/audio/limitless.mp3"
              onEnded={() => setIsPlaying(false)}
              preload="none"
            />

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div className="rounded-xl bg-white/[0.03] ring-1 ring-white/10 px-3 py-2.5">
                <p className="text-muted-foreground uppercase tracking-wider mb-0.5">
                  NFT Status
                </p>
                <p className="font-semibold text-primary">Sold · 1/1</p>
              </div>
              <div className="rounded-xl bg-white/[0.03] ring-1 ring-white/10 px-3 py-2.5">
                <p className="text-muted-foreground uppercase tracking-wider mb-0.5">
                  Blockchain
                </p>
                <p className="font-semibold text-foreground">Ethereum</p>
              </div>
            </div>
          </div>

          {/* Right — Story + Video + Links */}
          <div className="space-y-6">
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Houston rapper Mr. CAP made history by selling the first-ever Hip
              Hop NFT, <span className="text-foreground font-medium">"Limitless,"</span> on
              OpenSea. Featuring legendary Houston emcee{" "}
              <span className="text-foreground font-medium">K-Rino</span>, this
              groundbreaking release highlights the potential of NFTs as a new
              way to monetize artistic work and could revolutionize the music
              industry.
            </p>

            {/* Embedded video */}
            <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 bg-black">
              {showVideo ? (
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/nojd0u9jBr0?autoplay=1"
                    title="Limitless — Mr. CAP ft. K-Rino (Official Video)"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <button
                  onClick={() => setShowVideo(true)}
                  className="relative w-full aspect-video group cursor-pointer"
                >
                  <img
                    src={`https://img.youtube.com/vi/nojd0u9jBr0/maxresdefault.jpg`}
                    alt="Limitless music video thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-background/40 flex items-center justify-center group-hover:bg-background/30 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center shadow-lg">
                      <Play className="w-7 h-7 text-destructive-foreground ml-1" />
                    </div>
                  </div>
                  <span className="absolute bottom-3 left-3 text-xs text-white/80 bg-black/50 px-2 py-1 rounded">
                    Official Music Video
                  </span>
                </button>
              )}
            </div>

            {/* Action links */}
            <div className="flex flex-wrap gap-3 text-sm">
              <a
                href="https://opensea.io/item/ethereum/0x495f947276749ce646f68ac8c248420045cb7b5e/111525374491507330879718694062290749651333153209192724132274812129449556836353"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                View NFT on OpenSea
              </a>
              <a
                href="https://www.imdb.com/title/tt34446160/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full ring-1 ring-white/10 text-muted-foreground hover:text-foreground hover:ring-white/20 transition-colors"
              >
                <Film className="w-4 h-4" />
                IMDb
              </a>
              <a
                href="https://www.youtube.com/watch?v=nojd0u9jBr0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full ring-1 ring-white/10 text-muted-foreground hover:text-foreground hover:ring-white/20 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                YouTube
              </a>
            </div>

            {/* Streaming platforms */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground mr-1">
                Stream
              </span>
              <a
                href="https://open.spotify.com/track/3MViYAlAMJOxnFEGYXXYJR"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(141,73%,42%)]/10 ring-1 ring-[hsl(141,73%,42%)]/30 text-sm text-[hsl(141,73%,42%)] hover:bg-[hsl(141,73%,42%)]/20 transition-colors"
              >
                <Music className="w-3.5 h-3.5" />
                Spotify
              </a>
              <a
                href="https://music.apple.com/us/album/limitless-feat-k-rino/1553349553?i=1553349554"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(357,97%,63%)]/10 ring-1 ring-[hsl(357,97%,63%)]/30 text-sm text-[hsl(357,97%,63%)] hover:bg-[hsl(357,97%,63%)]/20 transition-colors"
              >
                <Music className="w-3.5 h-3.5" />
                Apple Music
              </a>
              <a
                href="https://music.youtube.com/watch?v=nojd0u9jBr0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(0,100%,50%)]/10 ring-1 ring-[hsl(0,100%,50%)]/30 text-sm text-[hsl(0,100%,50%)] hover:bg-[hsl(0,100%,50%)]/20 transition-colors"
              >
                <Music className="w-3.5 h-3.5" />
                YouTube Music
              </a>
            </div>

            {/* Quote */}
            <blockquote className="border-l-2 border-primary/60 pl-4 text-sm italic text-muted-foreground">
              "I'm extremely proud to be the first Houston rap artist to sell a
              Hip Hop NFT on the blockchain. This is a major milestone for
              independent artists and the city of Houston."
              <span className="block mt-1 not-italic text-xs text-primary">
                — Mr. CAP
              </span>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
});

LimitlessSpotlight.displayName = "LimitlessSpotlight";
export default LimitlessSpotlight;
