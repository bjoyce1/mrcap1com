import { useEffect, useRef, type CSSProperties } from "react";
import layout from "./marquee.json";

// The hero marquee, rebuilt from the approved artwork (ui/hero-marquee.webp) as live layers cut by
// scripts/legends-marquee.py: the city stays put while smoke, embers and highway traffic move through it, the ribbons
// and crown float on their own, and light travels across the chrome title and the gold frame. Decoration only.
const art = (name: string) => `/games/spc-legends/marquee/${name}.webp`;
type Box = { left: number; top: number; width: number; height: number };
const place = (b: Box): CSSProperties => ({ left: `${b.left}%`, top: `${b.top}%`, width: `${b.width}%`, height: `${b.height}%` });

// Highway lanes, as points in percent of the artwork, traced on its red light trails (the road dips to the bottom
// centre and climbs away to the upper right). Tail lights head away up the ramp, headlights come down it.
const LANES: { points: [number, number][]; kind: "tail" | "head"; cars: number; ms: number }[] = [
  { points: [[40, 83.5], [45, 84.5], [50, 87.5], [55, 89], [60, 89.5], [65, 89], [70, 87.5], [74, 85.5], [78, 82], [82, 78], [86, 73.5], [89, 70], [92, 67]], kind: "tail", cars: 4, ms: 9000 },
  { points: [[92.5, 69], [89, 72], [86, 75.5], [82, 80], [78, 84], [74, 87.5], [70, 89.5], [65, 91], [60, 91.5], [55, 91], [50, 89.5], [45, 86.5], [40, 85.5]], kind: "head", cars: 3, ms: 8000 },
];

/** Cars as glowing dots driven along each lane by transform alone, rebuilt when the marquee resizes. None while motion
 *  is reduced (the OS setting or the game's own switch, which toggles .reduce-motion on the game root). */
function useTraffic(host: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const el = host.current;
    if (!el || typeof el.animate !== "function") return;
    const world = el.closest(".legends-world");
    const osReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cars: HTMLElement[] = [];
    const build = () => {
      cars.forEach((c) => c.remove());
      cars = [];
      const { width, height } = el.getBoundingClientRect();
      if (!width || osReduced.matches || world?.classList.contains("reduce-motion")) return;
      for (const lane of LANES) {
        const pts = lane.points.map(([x, y]) => [(x / 100) * width, (y / 100) * height]);
        const seg = pts.map((p, i) => (i ? Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0));
        const total = seg.reduce((a, b) => a + b, 0) || 1;
        let walked = 0;
        const frames = pts.map((p, i) => { walked += seg[i]; return { transform: `translate(${p[0]}px,${p[1]}px)`, offset: walked / total }; });
        for (let i = 0; i < lane.cars; i++) {
          const car = document.createElement("i");
          car.className = `mq-car is-${lane.kind}`;
          el.append(car);
          car.animate(frames, { duration: lane.ms, iterations: Infinity, delay: -(lane.ms / lane.cars) * i - Math.random() * 600 });
          cars.push(car);
        }
      }
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(el);
    // The root's classes change on every spin and win; rebuild only when the motion switch itself flips.
    let reduced = world?.classList.contains("reduce-motion") ?? false;
    const mo = new MutationObserver(() => {
      const now = world?.classList.contains("reduce-motion") ?? false;
      if (now !== reduced) { reduced = now; build(); }
    });
    if (world) mo.observe(world, { attributes: true, attributeFilter: ["class"] });
    osReduced.addEventListener("change", build);
    return () => { ro.disconnect(); mo.disconnect(); osReduced.removeEventListener("change", build); cars.forEach((c) => c.remove()); };
  }, [host]);
}

// Sparkles on the crown's jewels, the title's diamonds and the frame's corner flares (percent of the artwork).
const SPARKS: [number, number, number][] = [
  [50, 13, 0], [44.5, 21, 1.4], [56.4, 20.4, 2.6], [50.6, 4.5, 3.6],
  [31, 58, 0.8], [47, 61, 2.1], [63.5, 60, 3.2], [72, 46, 4.3],
  [2.6, 3.6, 1.1], [97.4, 3.6, 2.9], [2.4, 95.6, 4.1], [97.6, 95.8, 0.4],
];

export function Marquee() {
  const traffic = useRef<HTMLDivElement>(null);
  useTraffic(traffic);
  const p = layout.pieces;
  return (
    <div className="mq" style={{ "--frame-mask": `url(${art("frame-mask")})`, "--title-mask": `url(${art("title-mask")})` } as CSSProperties}>
      <h1 className="lg-sr">SPC Legends: Spin the Mix</h1>
      <img className="mq-scene" src={art("scene")} alt="" width={layout.size[0]} height={layout.size[1]} />
      <div className="mq-inner" style={place(layout.inner)} aria-hidden="true">
        <span className="mq-dusk" />
        <div className="mq-smoke"><i /><i /><i /><i /></div>
        <div className="mq-embers">{Array.from({ length: 12 }, (_, i) => <i key={i} style={{ "--x": `${6 + ((i * 37) % 88)}%`, "--d": `${(i * 0.83) % 9}s`, "--s": `${7 + (i % 4) * 1.6}s` } as CSSProperties} />)}</div>
      </div>
      <div className="mq-traffic" ref={traffic} aria-hidden="true" />
      <div className="mq-title-sheen" style={place(layout.title)} aria-hidden="true"><b /></div>
      <img className="mq-ribbon is-left" src={art("ribbon-left")} alt="713 MIXHOUSE" style={place(p["ribbon-left"])} />
      <img className="mq-ribbon is-right" src={art("ribbon-right")} alt="South Park Coalition" style={place(p["ribbon-right"])} />
      <span className="mq-crown-glow" style={place(p.crown)} aria-hidden="true" />
      <img className="mq-crown" src={art("crown")} alt="" style={place(p.crown)} />
      <div className="mq-sparks" aria-hidden="true">{SPARKS.map(([x, y, d], i) => <i key={i} style={{ left: `${x}%`, top: `${y}%`, "--d": `${d}s` } as CSSProperties} />)}</div>
      <div className="mq-frame-sheen" aria-hidden="true"><b /></div>
      <span className="mq-neon" style={place(layout.inner)} aria-hidden="true" />
    </div>
  );
}
