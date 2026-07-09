import { useEffect, useRef } from "react";
import { Newspaper } from "lucide-react";
import { gsap } from "@/hooks/useGSAP";

/**
 * The Pressroom — newspaper-masthead hero for /press.
 * Hairline rules, a dateline, and slab headline like a front page.
 */
const PressroomHero = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const dateline = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    if (!sectionRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(".press-reveal", { autoAlpha: 1, y: 0 });
        gsap.set(".press-rule", { scaleX: 1 });
        return;
      }
      const tl = gsap.timeline({ delay: 0.15 });
      tl.fromTo(
        ".press-rule",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.9, stagger: 0.12, ease: "power3.inOut", transformOrigin: "left center" }
      ).fromTo(
        ".press-reveal",
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" },
        "-=0.6"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative pt-32 pb-14 md:pt-40 md:pb-18 overflow-hidden noise-overlay"
    >
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        {/* Masthead top rule */}
        <div className="press-rule h-[3px] bg-foreground/80 mb-1.5" />
        <div className="press-rule h-px bg-foreground/40 mb-5" />

        {/* Dateline row */}
        <div className="press-reveal flex flex-wrap items-center justify-between gap-2 text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground">
          <span className="flex items-center gap-2">
            <Newspaper className="w-3.5 h-3.5 text-gold" />
            The Official Press Archive
          </span>
          <span>Houston, TX — {dateline}</span>
        </div>

        {/* Masthead headline */}
        <h1 className="press-reveal font-display text-5xl md:text-7xl text-center text-foreground leading-[0.95] mt-8 mb-6">
          The <span className="text-gradient-gold">Record</span>
        </h1>

        <p className="press-reveal text-center text-sm md:text-base font-mono uppercase tracking-[0.3em] text-muted-foreground">
          Documenting the Legacy · Est. Houston TX
        </p>

        <p className="press-reveal mt-6 text-center text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Approved bios, press photos, logos, and every headline that documented
          the journey — for journalists, bloggers, and researchers.
        </p>

        {/* Masthead bottom rule */}
        <div className="press-rule h-px bg-foreground/40 mt-8 mb-1.5" />
        <div className="press-rule h-[3px] bg-foreground/80" />
      </div>
    </section>
  );
};

export default PressroomHero;
