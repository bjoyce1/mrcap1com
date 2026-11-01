// Presentation rules for the big moments. Pure: they read a finished outcome or the reels already shown,
// and never change what lands or what it pays.
import { ARTISTS } from "./config";

export type WinTier = "big" | "mega" | "legendary";
/** XP a single spin must reach for each Big Win tier, lowest first. */
export const WIN_TIERS: readonly { tier: WinTier; label: string; min: number }[] = Object.freeze([
  { tier: "big", label: "BIG WIN", min: 500 },
  { tier: "mega", label: "MEGA WIN", min: 2000 },
  { tier: "legendary", label: "LEGENDARY WIN", min: 10000 },
]);

/** Every tier a spin's XP passes, in order, so the Big Win show can escalate through them. */
export function tiersFor(xp: number): typeof WIN_TIERS[number][] {
  return WIN_TIERS.filter((t) => xp >= t.min);
}

/** How long the XP count-up runs: longer for bigger wins, capped so it never drags. */
export function countUpMs(xp: number): number {
  const top = tiersFor(xp).length;
  return [0, 1800, 3000, 4600][top];
}

/**
 * Legend Sweep tease: reel 5 glows if one artist sits on each of reels 1 to 4, and reel 6 glows if that artist is
 * also on reel 5. It only looks at reels that have already stopped when the tease starts, so it never gives away
 * a reel before it lands.
 */
export function sweepTease(board: string[][]): { reels: boolean[]; artist: string | null } {
  const reels = board.map(() => false);
  for (const { id } of ARTISTS) {
    const onReel = board.map((col) => col.includes(id));
    if (!onReel.slice(0, 4).every(Boolean)) continue;
    reels[4] = true;
    if (onReel[4]) reels[5] = true;
    return { reels, artist: id };
  }
  return { reels, artist: null };
}
