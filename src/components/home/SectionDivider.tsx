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
      <div
        ref={ref}
        className="h-[1px] w-full origin-center bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        style={{ transform: "scaleX(0)" }}
        aria-hidden="true"
      />
    </div>
  );
};

export default SectionDivider;
