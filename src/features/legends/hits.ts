// Order and timing for the win celebration. Pure: reads engine wins, never changes them.
import { ARTISTS } from "./config";

export type HitWin = { type: string; payline?: number; count?: number; symbol?: string; multiplier?: number; xp: number; cells: string[] };
export type HitCell = { key: string; col: number; row: number; delay: number };
export type HitStep = { win: HitWin; start: number; cells: HitCell[] };

const ARTIST_IDS = new Set(ARTISTS.map((a) => a.id));
// Multipliers (Double and Triple Bonus) play last, as the finale that multiplies everything before them.
const RANK: Record<string, number> = { unity: 0, bonus: 1, line: 2, multiplier: 3 };

export const isArtist = (id: string) => ARTIST_IDS.has(id);

/**
 * Which wins to celebrate and when: SPC Unity first, then the 713 Bonus, then lines by XP (ties keep
 * payline order), then the Double and Triple Bonus multipliers. At most `maxWins` regular steps (multipliers always play), `perWin` ms apart; inside a step the cells pop left to right,
 * `cellStagger` ms per reel, so a line reads like it is being dealt across the board.
 */
export function hitSchedule(
  wins: HitWin[],
  { maxWins = 4, perWin = 1250, cellStagger = 95 }: { maxWins?: number; perWin?: number; cellStagger?: number } = {},
): HitStep[] {
  const sorted = wins
    .map((win, index) => ({ win, index }))
    // Lines go biggest first; multipliers keep the engine's order so the finale builds (x2, then x3).
    .sort((a, b) => (RANK[a.win.type] ?? 4) - (RANK[b.win.type] ?? 4) || (a.win.type === "multiplier" ? 0 : b.win.xp - a.win.xp) || a.index - b.index);
  // The cap trims regular wins only; the multiplier finale always plays.
  const ordered = [
    ...sorted.filter((s) => s.win.type !== "multiplier").slice(0, Math.max(0, maxWins)),
    ...sorted.filter((s) => s.win.type === "multiplier"),
  ];
  return ordered.map(({ win }, i) => {
    const cells = win.cells
      .map((key) => {
        const [col, row] = key.split(":").map(Number);
        return { key, col, row };
      })
      .sort((a, b) => a.col - b.col || a.row - b.row);
    const firstCol = cells.length ? cells[0].col : 0;
    return { win, start: i * perWin, cells: cells.map((c) => ({ ...c, delay: (c.col - firstCol) * cellStagger })) };
  });
}
