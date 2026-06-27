import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/hooks/useGSAP";

interface HorizontalShelfProps {
  eyebrow: string;
  title: ReactNode;
  icon?: ReactNode;
  description?: ReactNode;
  /** Header controls / filters rendered between description and rail */
  toolbar?: ReactNode;
  /** Used to recompute pin distance when contents change (e.g. era filter) */
  refreshKey?: string | number;
  children: ReactNode;
}

/**
 * Shared "Catalog-style" rail used across every Music page section.
 * Desktop (≥901px, motion-OK): pins the section and horizontally scrubs the
 * track on scroll. Smaller / reduced-motion: native snap-scroll.
 */
export default function HorizontalShelf({
  eyebrow,
  title,
  icon,
  description,
  toolbar,
  refreshKey,
  children,
}: HorizontalShelfProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);
      // Skip pinning when the rail already fits on screen
      if (distance() <= 0) return;
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });
    // Recompute after layout settles
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 60);
    return () => {
      window.clearTimeout(t);
      mm.revert();
    };
  }, [refreshKey]);

  return (
    <section ref={sectionRef} className="catalog-section relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-2 md:px-4 pt-6 pb-6">
        <span className="catalog-stamp mb-3 block">{eyebrow}</span>
        <h2 className="font-display text-xl text-foreground flex items-center gap-2">
          {icon}
          {title}
        </h2>
        <div className="archive-rule mt-4 mb-4 w-24" />
        {description && (
          <p className="text-sm text-muted-foreground font-mono mb-4">{description}</p>
        )}
        {toolbar}
      </div>

      {/* Desktop horizontal scrub */}
      <div className="hidden min-[901px]:block overflow-hidden">
        <div ref={trackRef} className="flex gap-8 px-10 py-10 will-change-transform">
          {children}
        </div>
      </div>

      {/* Mobile native scroll */}
      <div className="min-[901px]:hidden flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 py-6">
        {children}
      </div>
    </section>
  );
}
