// Freeway traffic for the Houston scenes: glowing car lights & candy-painted SLAB cruisers driven along traced lanes
// by transform alone. Cars orient along their travel vector and react to the game: they speed up while reels spin and
// surge on a hit (data-lg-stage / data-lg-level / data-lg-hit on .legends-world, set by stage.ts). Decoration only.

/** A lane: points in percent of its host box, the light type, how many cars and how long one trip takes. */
export type Lane = { points: [number, number][]; kind: "tail" | "head" | "slab"; cars: number; ms: number };

// Speed by game stage, and the surge a hit of each level gives before easing back.
const SPIN_RATE = 2.35;
const SURGE = [1, 2.6, 3.5, 4.4];
const SURGE_MS = 2400;
const SLAB_COLORS = ["#c084fc", "#38bdf8", "#ff4fd8", "#22c55e", "#ffd76a"];

export function runTraffic(host: HTMLElement, lanes: Lane[]): () => void {
  if (typeof host.animate !== "function") return () => {};
  const world = host.closest<HTMLElement>(".legends-world");
  const osReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let cars: HTMLElement[] = [], anims: Animation[] = [], rate = 1, surge = 0;

  const setRate = (r: number) => { rate = r; for (const a of anims) a.updatePlaybackRate(r); };
  const build = () => {
    cars.forEach((c) => c.remove());
    cars = []; anims = [];
    const { width, height } = host.getBoundingClientRect();
    if (!width || osReduced.matches || world?.classList.contains("reduce-motion")) return;
    let slabIdx = 0;
    for (const lane of lanes) {
      const pts = lane.points.map(([x, y]) => [(x / 100) * width, (y / 100) * height]);
      const seg = pts.map((p, i) => (i ? Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0));
      const angles = pts.map((p, i) => {
        const prev = i > 0 ? pts[i - 1] : pts[0];
        const next = i > 0 ? p : (pts[1] ?? p);
        return (Math.atan2(next[1] - prev[1], next[0] - prev[0]) * 180) / Math.PI;
      });
      const total = seg.reduce((a, b) => a + b, 0) || 1;
      let walked = 0;
      const frames = pts.map((p, i) => {
        walked += seg[i];
        return {
          transform: `translate3d(${p[0].toFixed(1)}px,${p[1].toFixed(1)}px,0) rotate(${angles[i].toFixed(1)}deg)`,
          offset: walked / total,
        };
      });
      for (let i = 0; i < lane.cars; i++) {
        const car = document.createElement("i");
        car.className = `lg-car is-${lane.kind}`;
        if (lane.kind === "slab") {
          car.style.setProperty("--slab", SLAB_COLORS[slabIdx++ % SLAB_COLORS.length]);
        }
        host.append(car);
        const a = car.animate(frames, { duration: lane.ms, iterations: Infinity, delay: -(lane.ms / lane.cars) * i - Math.random() * 550 });
        a.updatePlaybackRate(rate);
        cars.push(car); anims.push(a);
      }
    }
  };

  // Follow the game: faster while spinning, a surge on a hit that eases back, normal again at idle.
  const follow = () => {
    const stage = world?.dataset.lgStage, level = Number(world?.dataset.lgLevel || 0);
    window.clearTimeout(surge);
    if (stage === "spin-start" || stage === "spinning" || stage === "stopping") setRate(SPIN_RATE);
    else if (stage === "celebrating" && level) { setRate(SURGE[level] ?? 1); surge = window.setTimeout(() => setRate(1.35), SURGE_MS); }
    else setRate(1);
  };
  // The root's classes change on every spin and win; rebuild only when the motion switch itself flips.
  let reduced = world?.classList.contains("reduce-motion") ?? false;
  const mo = new MutationObserver((records) => {
    if (records.some((r) => r.attributeName === "class")) {
      const now = world?.classList.contains("reduce-motion") ?? false;
      if (now !== reduced) { reduced = now; build(); }
    } else follow();
  });
  if (world) mo.observe(world, { attributes: true, attributeFilter: ["class", "data-lg-stage", "data-lg-level", "data-lg-hit"] });
  const ro = new ResizeObserver(build);
  ro.observe(host);
  osReduced.addEventListener("change", build);
  build();
  return () => { ro.disconnect(); mo.disconnect(); osReduced.removeEventListener("change", build); window.clearTimeout(surge); cars.forEach((c) => c.remove()); };
}

/** Lanes traced on the city cut-outs (marquee/city-left and city-right, from the hero art). */
export const CITY_LANES: Record<"left" | "right", Lane[]> = {
  left: [
    { points: [[-4, 62.6], [30, 63.4], [60, 64.2], [104, 65.2]], kind: "tail", cars: 5, ms: 4600 },
    { points: [[104, 67.4], [60, 66.6], [30, 65.9], [-4, 65.2]], kind: "head", cars: 5, ms: 4100 },
    { points: [[-4, 64.0], [30, 64.8], [60, 65.5], [104, 66.4]], kind: "slab", cars: 2, ms: 5400 },
  ],
  right: [
    { points: [[-4, 83.6], [20, 80], [40, 76.8], [65, 73], [104, 67.4]], kind: "tail", cars: 5, ms: 4900 },
    { points: [[104, 70.2], [65, 75.6], [40, 79.4], [20, 82.6], [-4, 86.2]], kind: "head", cars: 4, ms: 4400 },
    { points: [[-4, 90.4], [15, 89.6], [30, 90.6], [42, 94], [49, 101]], kind: "tail", cars: 3, ms: 3000 },
    { points: [[104, 68.8], [65, 74.2], [40, 78.0], [20, 81.2], [-4, 84.8]], kind: "slab", cars: 2, ms: 5200 },
  ],
};

/** Full-width Houston I-45 / 610 South Loop elevated freeway interchange spanning behind the cabinet. */
export const FREEWAY_LANES: Lane[] = [
  // Upper deck eastbound (red tail-light streams heading toward downtown & MLK exit)
  { points: [[-6, 36], [18, 34], [38, 31], [62, 31], [82, 34], [106, 37]], kind: "tail", cars: 8, ms: 6800 },
  // Upper deck H-Town SLAB cruise lane (candy-painted cruisers with neon underglow)
  { points: [[-6, 42], [18, 40], [38, 37], [62, 37], [82, 40], [106, 43]], kind: "slab", cars: 5, ms: 7400 },
  // Lower deck westbound (bright Xenon headlights sweeping across the overpass)
  { points: [[106, 62], [82, 58], [62, 55], [38, 55], [18, 58], [-6, 63]], kind: "head", cars: 8, ms: 6200 },
  // Lower deck express lane (fast H-Town SLABs + headlights)
  { points: [[106, 69], [82, 65], [62, 62], [38, 62], [18, 65], [-6, 70]], kind: "slab", cars: 4, ms: 5500 },
];
