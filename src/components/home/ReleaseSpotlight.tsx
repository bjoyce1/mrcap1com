import { Play, Pause, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { trackMusicPlay } from "@/components/GoogleAnalytics";
import ScrollReveal from "@/components/ScrollReveal";
import albumTies from "@/assets/album-ties.jpg";

const ReleaseSpotlight = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        trackMusicPlay("Bet'n On Me");
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background pointer-events-none" />
      <audio ref={audioRef} src="/audio/betn-on-me.mp3" onEnded={() => setIsPlaying(false)} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <ScrollReveal width="100%">
          <div className="grid md:grid-cols-[1fr_1.2fr] gap-8 md:gap-14 items-center">
            {/* Cover Art */}
            <div className="relative group cursor-pointer" onClick={togglePlay}>
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl ring-1 ring-primary/10">
                <img
                  src={albumTies}
                  alt="The Ties That Bind Us — SPC Group Album"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-background/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-primary-foreground" fill="currentColor" />
                  ) : (
                    <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
                  )}
                </div>
              </div>
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold uppercase tracking-wider">
                  Latest Release
                </span>
                <span className="text-muted-foreground text-xs">2024</span>
              </div>

              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3">
                The Ties That{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cap-gold">
                  Bind Us
                </span>
              </h2>

              <p className="text-muted-foreground text-lg mb-2 font-light">
                South Park Coalition · 19 Tracks
              </p>

              <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-lg">
                A grown-man statement album — honest, reflective, and unflinching.
                Featuring K-Rino, Point Blank, Klondike Kat & more. Slowed-and-chopped
                version released January 2025.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="flux"
                  size="lg"
                  className="rounded-full"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? "Pause Preview" : "Play \"Bet'n On Me\""}
                </Button>
                <Button variant="fluxOutline" size="lg" className="rounded-full" asChild>
                  <a
                    href="https://open.spotify.com/artist/1pSXGKxJIw95dV3xQX4TjS"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Stream Album
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ReleaseSpotlight;
