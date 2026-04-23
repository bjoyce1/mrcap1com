import { Play, Pause, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import { trackMusicPlay } from "@/components/GoogleAnalytics";
import { gsap } from "@/hooks/useGSAP";
import albumTies from "@/assets/album-ties.jpg";
import SectionShell from "@/components/home/SectionShell";
import AudioWaveform from "@/components/home/AudioWaveform";

const ReleaseSpotlight = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const coverImgRef = useRef<HTMLImageElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
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

  // Vinyl rotation when playing
  useEffect(() => {
    if (!coverImgRef.current) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    if (isPlaying) {
      const tween = gsap.to(coverImgRef.current, {
        rotation: "+=360",
        duration: 24,
        ease: "none",
        repeat: -1,
      });
      return () => { tween.kill(); };
    }
  }, [isPlaying]);

  // Pulsing glow when playing
  useEffect(() => {
    if (!glowRef.current) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    if (isPlaying) {
      const tween = gsap.to(glowRef.current, {
        opacity: 0.7,
        scale: 1.15,
        duration: 1.4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      return () => {
        tween.kill();
        if (glowRef.current) gsap.set(glowRef.current, { opacity: 0.2, scale: 1 });
      };
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (!reduce) {
        gsap.to(coverRef.current, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      gsap.fromTo(
        infoRef.current,
        { y: reduce ? 0 : 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: reduce ? 0.5 : 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.fromTo(
        coverRef.current,
        { scale: reduce ? 1 : 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: reduce ? 0.5 : 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef}>
      <SectionShell
        index="02"
        eyebrow="Latest Release"
        title={null}
        className="overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background pointer-events-none" />
        <audio ref={audioRef} src="/audio/betn-on-me.mp3" onEnded={() => setIsPlaying(false)} />

        <div className="grid md:grid-cols-[1fr_1.2fr] gap-8 md:gap-14 items-center relative z-10">
          {/* Cover Art */}
          <div ref={coverRef} className="relative group cursor-pointer will-change-transform" onClick={togglePlay}>
            {/* Pulsing glow */}
            <div
              ref={glowRef}
              className="absolute -inset-8 rounded-full bg-primary/20 blur-3xl pointer-events-none"
              style={{ opacity: 0.2 }}
              aria-hidden="true"
            />
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl ring-1 ring-primary/10">
              <img
                ref={coverImgRef}
                src={albumTies}
                alt="The Ties That Bind Us — SPC Group Album"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                style={{ transformOrigin: "50% 50%" }}
              />
            </div>
            <div className="absolute inset-0 rounded-2xl flex items-center justify-center bg-background/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-primary-foreground" fill="currentColor" />
                ) : (
                  <Play className="w-8 h-8 text-primary-foreground ml-1" fill="currentColor" />
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div ref={infoRef} className="flex flex-col justify-center will-change-transform">
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

            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-lg">
              A grown-man statement album — honest, reflective, and unflinching.
              Featuring K-Rino, Point Blank, Klondike Kat & more. Slowed-and-chopped
              version released January 2025.
            </p>

            {/* Audio Waveform */}
            <div className="mb-6">
              <AudioWaveform audioEl={audioRef.current} active={isPlaying} bars={32} />
            </div>

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
      </SectionShell>
    </div>
  );
};

export default ReleaseSpotlight;
