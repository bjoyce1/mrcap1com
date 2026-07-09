import { useEffect, useRef } from "react";
import { gsap } from "@/hooks/useGSAP";

const STATS = [
  { value: 30, suffix: "+", label: "Years in the Game" },
  { value: 12, suffix: "+", label: "Albums & Projects" },
  { value: 1, suffix: "st", label: "Houston Hip-Hop NFT", static: "1" },
  { value: 1987, suffix: "", label: "South Park, Houston", noFormat: true },
];

/** Scroll-triggered odometer counters over a candy-gradient hairline grid */
const LegacyStats = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const numbers = gsap.utils.toArray<HTMLElement>(".stat-number");

      numbers.forEach((el) => {
        const target = Number(el.dataset.value ?? 0);
        const noFormat = el.dataset.noformat === "true";

        if (reduced) {
          el.textContent = noFormat ? String(target) : target.toLocaleString();
          return;
        }

        const proxy = { v: 0 };
        gsap.to(proxy, {
          v: target,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
          onUpdate: () => {
            const n = Math.round(proxy.v);
            el.textContent = noFormat ? String(n) : n.toLocaleString();
          },
        });
      });

      gsap.fromTo(
        ".stat-cell",
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 82%", once: true },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24" aria-label="Career highlights">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border/60 rounded-2xl overflow-hidden border border-border/60">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="stat-cell relative bg-card/80 backdrop-blur px-6 py-10 md:py-14 text-center group hover:bg-card transition-colors duration-500"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.08),transparent_70%)]"
              />
              <div className="relative">
                <span
                  className="stat-number font-display text-4xl md:text-6xl text-foreground tabular-nums"
                  data-value={stat.value}
                  data-noformat={stat.noFormat ? "true" : "false"}
                >
                  0
                </span>
                <span className="font-display text-2xl md:text-4xl text-gold">{stat.suffix}</span>
                <p className="mt-3 text-[11px] md:text-xs font-medium tracking-[0.25em] uppercase text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LegacyStats;
