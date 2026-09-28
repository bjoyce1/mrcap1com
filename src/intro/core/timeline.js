// The whole story is authored in "units": 1 unit = one viewport height of scrolling.
// Camera paths, 3D events and HTML stations all key off the same numbers.

export const TOTAL = 40;

export const SCENE_SWITCH = 6; // booth (turntable) → universe (inside the record)

export const MOMENTS = {
  heroOut: 0.9,
  needleLift: [2.0, 2.8],
  needleDrop: [2.8, 3.15],
  dive: [3.4, 6.0],
  flash: [5.45, 6.0, 6.55], // in, peak, out
  stepInside: [6.1, 7.7],
};

// Chapter words fly-through: [appear, fill-screen, pass-through, done]
export const WORDS = [
  { id: 'origin', word: 'ORIGIN', index: '01', tagline: 'Born in South Park. Raised by the block.', through: 'O', u: [8.4, 9.3, 10.0, 10.3], z: -130 },
  { id: 'sound', word: 'SOUND', index: '02', tagline: 'Stream direct. No middleman.', through: 'O', u: [16.6, 17.5, 18.2, 18.5], z: -320 },
  { id: 'legacy', word: 'LEGACY', index: '03', tagline: 'Own the work. Outlast the hype.', through: 'split', u: [25.2, 26.0, 26.6, 26.9], z: -510 },
  { id: 'stage', word: 'STAGE', index: '04', tagline: 'Three decades of shows without missing a beat.', through: 'rise', u: [33.2, 34.1, 34.8, 35.1], z: -700 },
];

export const CHAPTERS = [
  { id: 'origin', label: 'Origin', start: 8.4, end: 16.6 },
  { id: 'sound', label: 'Sound', start: 16.6, end: 25.0 },
  { id: 'legacy', label: 'Legacy', start: 25.0, end: 33.2 },
  { id: 'stage', label: 'Stage', start: 33.2, end: TOTAL },
];

// HTML stations: [in, out]. `hold` keeps a station visible to the end.
export const STATIONS = {
  hero: [0, 0.9],
  caption: [1.25, 4.9],
  stepInside: [6.1, 7.7],
  who: [10.35, 12.05],
  blueprint: [12.2, 13.65],
  timeline: [13.8, 16.45],
  listening: [18.55, 19.95],
  latest: [20.1, 21.45],
  charts: [21.6, 22.85],
  wall: [23.0, 24.85],
  first: [26.95, 28.4],
  book: [28.55, 29.95],
  receipts: [30.1, 31.45],
  screening: [31.6, 33.05],
  booking: [35.15, 36.6],
  merch: [36.75, 38.05],
  outro: [38.25, TOTAL + 1],
};

// ── tiny math kit ───────────────────────────────────────────────────────────
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const range = (u, a, b) => clamp((u - a) / (b - a));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (t) => t * t * (3 - 2 * t);
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t) => 1 - Math.pow(1 - t, 3);
export const easeIn = (t) => t * t * t;

// in → hold → out envelope for a [a, b] window with `f` fade length (units)
export function envelope(u, a, b, f = 0.38) {
  if (u < a || u > b) return 0;
  return smooth(clamp((u - a) / f)) * smooth(clamp((b - u) / f));
}
