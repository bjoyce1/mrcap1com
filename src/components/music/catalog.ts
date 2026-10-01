import type { Track } from "@/stores/playerStore";
import { COVER_MANIFEST } from "./coverManifest";

/** One container for every /music section, so the hero and the shelves share a left edge. */
export const WRAP = "mx-auto w-full max-w-[1400px] px-5 md:px-10";

export const PLACEHOLDER_COVER = "/placeholder.svg";

/**
 * Cover art as <img> props. Covers listed in the manifest have right-sized WebP
 * copies (480w / 960w); anything else (a new upload, the placeholder) is used as-is.
 */
export function coverImg(url: string | null | undefined, sizes: string) {
  const src = url || PLACEHOLDER_COVER;
  const m = COVER_MANIFEST[src];
  if (!m) return { src };
  return {
    src: `${m.base}-${m.widths[0]}.webp`,
    srcSet: m.widths.map((w) => `${m.base}-${w}.webp ${w}w`).join(", "),
    sizes,
  };
}

/** The smallest copy of a cover, for record labels and thumbnails. */
export function coverThumb(url: string | null | undefined) {
  const src = url || PLACEHOLDER_COVER;
  const m = COVER_MANIFEST[src];
  return m ? `${m.base}-${m.widths[0]}.webp` : src;
}

/** "3:05", or "" when the length isn't known yet (rather than a dash that reads like a glitch). */
export function fmtDuration(seconds: number | null | undefined): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export const credit = (t: Pick<Track, "artist" | "featured_artists">) =>
  t.featured_artists ? `${t.artist} ft. ${t.featured_artists}` : t.artist;

/** Group tracks by release year, newest first. Tracks without a year go last. */
export function groupByYear(tracks: Track[]): { year: number | null; tracks: Track[] }[] {
  const map = new Map<number | null, Track[]>();
  for (const t of tracks) {
    const y = t.release_year ?? null;
    if (!map.has(y)) map.set(y, []);
    map.get(y)!.push(t);
  }
  return [...map.entries()]
    .sort(([a], [b]) => (b ?? -1) - (a ?? -1))
    .map(([year, tracks]) => ({ year, tracks }));
}
