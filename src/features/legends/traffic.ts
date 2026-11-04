// Freeway traffic for the Houston scenes: glowing car lights driven along traced lanes by transform alone.
// The cars follow the game: they speed up while the reels spin and surge on a hit (data-lg-stage / data-lg-level on
// .legends-world, set by stage.ts). Decoration only; none while motion is reduced.

/** A lane: points in percent of its host box, the light type, how many cars and how long one trip takes. */
export type Lane = { points: [number, number][]; kind: "tail" | "head"; cars: number; ms: number };

// Speed by game stage, and the surge a hit of each level gives before easing back.
const SPIN_RATE = 2.2;
const SURGE = [1, 2.4, 3.2, 4];
const SURGE_MS = 1800;

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
    for (const lane of lanes) {
      const pts = lane.points.map(([x, y]) => [(x / 100) * width, (y / 100) * height]);
      const seg = pts.map((p, i) => (i ? Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0));
      const total = seg.reduce((a, b) => a + b, 0) || 1;
      let walked = 0;
      const frames = pts.map((p, i) => { walked += seg[i]; return { transform: `translate(${p[0]}px,${p[1]}px)`, offset: walked / total }; });
      for (let i = 0; i < lane.cars; i++) {
        const car = document.createElement("i");
        car.className = `lg-car is-${lane.kind}`;
        host.append(car);
        const a = car.animate(frames, { duration: lane.ms, iterations: Infinity, delay: -(lane.ms / lane.cars) * i - Math.random() * 600 });
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
    else if (stage === "celebrating" && level) { setRate(SURGE[level] ?? 1); surge = window.setTimeout(() => setRate(1.3), SURGE_MS); }
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
  if (world) mo.observe(world, { attributes: true, attributeFilter: ["class", "data-lg-stage", "data-lg-level"] });
  const ro = new ResizeObserver(build);
  ro.observe(host);
  osReduced.addEventListener("change", build);
  build();
  return () => { ro.disconnect(); mo.disconnect(); osReduced.removeEventListener("change", build); window.clearTimeout(surge); cars.forEach((c) => c.remove()); };
}

/** Lanes traced on the city cut-outs (marquee/city-left and city-right, from the hero art). */
export const CITY_LANES: Record<"left" | "right", Lane[]> = {
  left: [
    { points: [[-4, 62.6], [30, 63.4], [60, 64.2], [104, 65.2]], kind: "tail", cars: 3, ms: 5200 },
    { points: [[104, 67.4], [60, 66.6], [30, 65.9], [-4, 65.2]], kind: "head", cars: 3, ms: 4600 },
  ],
  right: [
    { points: [[-4, 83.6], [20, 80], [40, 76.8], [65, 73], [104, 67.4]], kind: "tail", cars: 3, ms: 5600 },
    { points: [[104, 70.2], [65, 75.6], [40, 79.4], [20, 82.6], [-4, 86.2]], kind: "head", cars: 2, ms: 5000 },
    { points: [[-4, 90.4], [15, 89.6], [30, 90.6], [42, 94], [49, 101]], kind: "tail", cars: 2, ms: 3200 },
  ],
};
