import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/hooks/useGSAP";

const SectionDivider = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: reduce ? 0.4 : 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-2">
      <div ref={ref} className="relative flex items-center justify-center" style={{ transform: "scaleX(0)" }} aria-hidden="true">
        <div className="h-px flex-1 bg-[hsl(var(--accent-gold)/0.25)]" />
        <span className="mx-3 inline-block w-1.5 h-1.5 rotate-45 bg-[hsl(var(--accent-gold)/0.6)]" />
        <div className="h-px flex-1 bg-[hsl(var(--accent-gold)/0.25)]" />
      </div>
    </div>
  );
};

export default SectionDivider;
