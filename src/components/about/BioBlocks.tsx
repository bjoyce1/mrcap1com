import { ReactNode, useEffect, useRef } from "react";
import { gsap } from "@/hooks/useGSAP";

/**
 * Editorial chapter header for the biography — catalog stamp eyebrow,
 * ghost chapter numeral, and the section title sliding in over it.
 */
export const ChapterHeader = ({
  number,
  eyebrow,
  children,
}: {
  number: string;
  eyebrow: string;
  children: ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".chapter-ghost",
        { x: -40, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        }
      );
      gsap.fromTo(
        ".chapter-title",
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          delay: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="relative mb-10">
      <span
        aria-hidden="true"
        className="chapter-ghost absolute -top-10 -left-2 md:-left-6 font-display text-8xl md:text-9xl leading-none text-transparent select-none pointer-events-none"
        style={{ WebkitTextStroke: "1.5px hsl(38 33% 89% / 0.13)" }}
      >
        {number}
      </span>
      <div className="chapter-title relative">
        <p className="catalog-stamp mb-3">{eyebrow}</p>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">{children}</h2>
      </div>
    </div>
  );
};

/**
 * Full-width cinematic pull quote with a parallax background image.
 */
export const PullQuoteBand = ({
  quote,
  attribution,
  image,
}: {
  quote: string;
  attribution?: string;
  image: string;
}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        bgRef.current,
        { yPercent: -12 },
        {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
      gsap.fromTo(
        ".pull-quote-text",
        { y: 50, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%", once: true },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-28 md:py-40 overflow-hidden grain-overlay">
      <div ref={bgRef} className="absolute -inset-y-16 inset-x-0 will-change-transform">
        <img src={image} alt="" aria-hidden="true" className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-background/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,hsl(var(--background))_95%)]" />
      </div>
      <blockquote className="pull-quote-text relative z-10 max-w-4xl mx-auto px-6 text-center">
        <p className="font-display text-3xl md:text-5xl leading-tight text-foreground">
          &ldquo;{quote}&rdquo;
        </p>
        {attribution && (
          <footer className="mt-6 catalog-stamp">{attribution}</footer>
        )}
      </blockquote>
    </section>
  );
};
