import { Play, Music, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { gsap } from "@/hooks/useGSAP";
import { MagneticWrapper } from "@/hooks/useMagneticHover";
import heroImage from "@/assets/mrcap-hero-bg.jpg";
import albumTies from "@/assets/album-ties.jpg";
import albumArtOfIsm from "@/assets/album-art-of-ism.png";
import albumGrave from "@/assets/album-grave.jpg";

type Stat = { value: string; label: string };

const stats: Stat[] = [
  { value: "30+", label: "years in the game" },
  { value: "100+", label: "tracks released" },
  { value: "1st", label: "Houston NFT rapper" },
  { value: "SPC", label: "original member" },
];

function AlbumCard({
  className = "",
  img,
  label,
  primary = false,
}: {
  className?: string;
  img: string;
  label: string;
  primary?: boolean;
}) {
  return (
    <div
      className={[
        "overflow-hidden rounded-3xl border",
        primary ? "border-accent-gold/30" : "border-foreground/10",
        "bg-card/60 shadow-2xl",
        primary ? "shadow-[0_0_40px_hsl(43_91%_61%/0.15)]" : "shadow-black/40",
        className,
      ].join(" ")}
    >
      <div className="relative aspect-square w-full">
        <img
          src={img}
          alt={label}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/10" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className="rounded-full bg-foreground/10 px-3 py-1 text-xs text-foreground/85 backdrop-blur">
            {label}
          </span>
          {primary && (
            <span className="rounded-full bg-accent-gold/15 px-3 py-1 text-xs text-accent-gold backdrop-blur">
              Out Now
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".hero-left > *", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.2,
      });

      gsap.from(".hero-card", {
        y: 60,
        opacity: 0,
        rotation: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.5,
      });

      gsap.from(".hero-stats > *", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        delay: 1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative overflow-hidden bg-background text-foreground"
    >
      {/* Ambient glows using brand gold */}
      <div className="pointer-events-none absolute -top-40 left-1/3 h-[520px] w-[520px] rounded-full bg-accent-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 right-1/4 h-[520px] w-[520px] rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto max-w-6xl px-6 pt-28 pb-12">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* LEFT */}
          <div className="hero-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 text-sm text-foreground/80">
              <span className="h-2 w-2 rounded-full bg-accent-gold" />
              Houston · SPC · Innovation
            </p>

            <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl uppercase">
              The sound of{" "}
              <span className="bg-gradient-to-r from-accent-gold to-primary bg-clip-text text-transparent">
                Houston
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Mr. CAP — South Park Coalition original member, creative technologist,
              and the first Houston rapper to sell a Hip-Hop NFT. Over 30 years
              of groundbreaking music.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <MagneticWrapper strength={0.12}>
                <Button
                  size="lg"
                  className="rounded-xl bg-accent-gold px-5 py-3 text-sm font-semibold text-background shadow-lg shadow-accent-gold/20 transition hover:-translate-y-px hover:bg-accent-gold/90"
                  asChild
                >
                  <a
                    href="https://www.sound.xyz/mrcap/releases"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Listen Now
                  </a>
                </Button>
              </MagneticWrapper>

              <MagneticWrapper strength={0.12}>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-xl border-foreground/15 bg-foreground/5 px-5 py-3 text-sm font-semibold text-foreground/90 transition hover:bg-foreground/10"
                  asChild
                >
                  <a href="/about">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    The Story
                  </a>
                </Button>
              </MagneticWrapper>
            </div>

            {/* Social proof row */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="h-9 w-9 rounded-full border border-background bg-accent-gold/20 flex items-center justify-center">
                  <Music className="h-4 w-4 text-accent-gold" />
                </div>
                <div className="h-9 w-9 rounded-full border border-background bg-foreground/10" />
                <div className="h-9 w-9 rounded-full border border-background bg-foreground/10" />
              </div>
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="text-accent-gold">★★★★★</span>
                  <span>Streaming on all platforms</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: stacked album cards */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="relative h-[360px] sm:h-[420px]">
              <AlbumCard
                className="hero-card absolute right-10 top-10 w-[200px] rotate-[-8deg] opacity-80 sm:w-[240px]"
                img={albumGrave}
                label="2 Tha Grave"
              />
              <AlbumCard
                className="hero-card absolute right-6 top-6 w-[220px] rotate-[4deg] opacity-90 sm:w-[270px]"
                img={albumArtOfIsm}
                label="The Art of ISM"
              />
              <AlbumCard
                className="hero-card absolute right-0 top-0 w-[250px] rotate-[-1deg] sm:w-[300px]"
                img={albumTies}
                label="The Ties That Bind Us"
                primary
              />
              {/* Subtle frame */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl border border-foreground/10" />
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="hero-stats mt-12 grid gap-4 rounded-2xl border border-foreground/10 bg-foreground/5 p-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center sm:text-left">
              <div className="text-2xl font-display font-bold tracking-tight text-accent-gold">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
