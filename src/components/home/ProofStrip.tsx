import { useEffect, useRef } from "react";
import { gsap } from "@/hooks/useGSAP";

const stats = [
  { value: 30, suffix: "+", label: "Years in Hip-Hop" },
  { value: 5, suffix: "", label: "Studio Albums" },
  { value: 1, suffix: "st", label: "Houston NFT Rapper", highlight: true },
  { value: 0, suffix: "", label: "Original Member", isText: true, textValue: "SPC" },
];

const ProofStrip = () => {
  const stripRef = useRef<HTMLDivElement>(null);
  const valueRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const underlineRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!stripRef.current) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        itemRefs.current.filter(Boolean),
        { y: reduce ? 0 : 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: reduce ? 0.4 : 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: stripRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      stats.forEach((stat, i) => {
        if (stat.isText) return;
        const el = valueRefs.current[i];
        if (!el) return;

        const obj = { val: 0 };
        gsap.to(obj, {
          val: stat.value,
          duration: reduce ? 0.6 : 1.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: stripRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
            onLeaveBack: () => {
              obj.val = 0;
              el.textContent = "0" + stat.suffix;
            },
          },
          onUpdate: () => {
            el.textContent = Math.round(obj.val) + stat.suffix;
          },
          onComplete: () => {
            // Draw underline
            const ul = underlineRefs.current[i];
            if (ul) {
              gsap.to(ul, { scaleX: 1, duration: 0.7, ease: "power3.out" });
            }
          },
        });
      });

      // Trigger underline for text stat too
      gsap.to({}, {
        duration: 1.8,
        scrollTrigger: {
          trigger: stripRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        onComplete: () => {
          stats.forEach((stat, i) => {
            if (stat.isText) {
              const ul = underlineRefs.current[i];
              if (ul) gsap.to(ul, { scaleX: 1, duration: 0.7, ease: "power3.out" });
            }
          });
        },
      });
    }, stripRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={stripRef}
      className="relative border-y border-primary/10 bg-card/40 backdrop-blur-sm"
    >
      <div className="max-w-6xl mx-auto px-6 py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 relative">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              ref={(el) => { itemRefs.current[i] = el; }}
              className="text-center relative"
              style={{ opacity: 0 }}
            >
              {/* Vertical separator (not on first or on mobile-leftcol) */}
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-12 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"
                />
              )}
              <div className="relative inline-block">
                <p
                  ref={(el) => { valueRefs.current[i] = el; }}
                  className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-1 relative inline-block"
                >
                  {stat.isText ? stat.textValue : `0${stat.suffix}`}
                </p>
                {/* Highlight pulsing dot */}
                {stat.highlight && (
                  <span
                    aria-hidden="true"
                    className="absolute -top-1 -right-3 w-2 h-2 rounded-full bg-cap-gold shadow-[0_0_8px_hsl(var(--primary))] animate-pulse"
                  />
                )}
                {/* Underline draw */}
                <span
                  ref={(el) => { underlineRefs.current[i] = el; }}
                  aria-hidden="true"
                  className="block h-[2px] bg-gradient-to-r from-primary/0 via-primary to-primary/0 origin-center mt-1"
                  style={{ transform: "scaleX(0)" }}
                />
              </div>
              <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest font-medium mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProofStrip;
