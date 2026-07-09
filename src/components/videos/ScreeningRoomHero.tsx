import { useEffect, useRef } from "react";
import { Clapperboard } from "lucide-react";
import { gsap } from "@/hooks/useGSAP";

/**
 * The Screening Room — theater-marquee header for /videos.
 * A glowing marquee strip, slab title, and projector-beam light cone.
 */
const ScreeningRoomHero = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(".screen-reveal", { autoAlpha: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        ".screen-reveal",
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.12, ease: "power3.out", delay: 0.15 }
      );
      // Projector flicker — subtle, cinematic
      gsap.to(".projector-beam", {
        opacity: 0.5,
        duration: 0.12,
        repeat: -1,
        yoyo: true,
        repeatDelay: 2.8,
        ease: "none",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden">
      {/* Projector beam from top center */}
      <div
        aria-hidden="true"
        className="projector-beam pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 w-[130%] h-[420px] opacity-70"
        style={{
          background:
            "conic-gradient(from 90deg at 50% 0%, transparent 82deg, hsl(var(--accent-gold) / 0.10) 90deg, hsl(38 33% 89% / 0.06) 98deg, transparent 106deg)",
        }}
      />
      {/* Floor glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 inset-x-0 h-40 bg-[radial-gradient(ellipse_at_bottom,hsl(var(--primary)/0.08),transparent_70%)]"
      />

      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Marquee lights strip */}
        <div className="screen-reveal inline-flex items-center gap-3 rounded-full border border-[hsl(var(--accent-gold)/0.35)] bg-card/60 backdrop-blur px-5 py-2 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent-gold))] animate-pulse" />
          <span className="catalog-stamp">Now Showing</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent-gold))] animate-pulse" />
        </div>

        <h1 className="screen-reveal font-display text-5xl md:text-7xl text-foreground leading-[1.02]">
          The Screening
          <span className="text-gradient-gold"> Room</span>
        </h1>

        <p className="screen-reveal mt-5 text-lg text-muted-foreground max-w-xl mx-auto">
          Official music videos, promos, interviews, and behind-the-scenes —
          the visual side of the ISM.
        </p>

        <div className="screen-reveal mt-6 flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.25em] uppercase text-foreground/50">
          <Clapperboard className="w-4 h-4 text-gold" />
          Direct from the Mr. CAP channel
        </div>
      </div>
    </section>
  );
};

export default ScreeningRoomHero;
