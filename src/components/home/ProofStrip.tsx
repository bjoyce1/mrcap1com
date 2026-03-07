import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/hooks/useGSAP";

const stats = [
  { value: 30, suffix: "+", label: "Years in the Game" },
  { value: 5, suffix: "", label: "Studio Albums" },
  { value: 1, suffix: "st", label: "Houston NFT Rapper" },
  { value: 0, suffix: "", label: "SPC", isText: true, textValue: "SPC" },
];

const ProofStrip = () => {
  const stripRef = useRef<HTMLDivElement>(null);
  const valueRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!stripRef.current) return;

    const ctx = gsap.context(() => {
      // Staggered item reveal
      gsap.fromTo(
        itemRefs.current.filter(Boolean),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: stripRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Counter animations for numeric values
      stats.forEach((stat, i) => {
        if (stat.isText) return;
        const el = valueRefs.current[i];
        if (!el) return;

        const obj = { val: 0 };
        gsap.to(obj, {
          val: stat.value,
          duration: 1.8,
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
        });
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              ref={(el) => { itemRefs.current[i] = el; }}
              className="text-center"
              style={{ opacity: 0 }}
            >
              <p
                ref={(el) => { valueRefs.current[i] = el; }}
                className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-1"
              >
                {stat.isText ? stat.textValue : `0${stat.suffix}`}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest font-medium">
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
