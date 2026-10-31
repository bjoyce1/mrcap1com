// Order and timing for the win celebration. Pure: reads engine wins, never changes them.
import { ARTISTS } from "./config";

export type HitWin = { type: string; payline?: number; count?: number; symbol?: string; xp: number; cells: string[] };
export type HitCell = { key: string; col: number; row: number; delay: number };
export type HitStep = { win: HitWin; start: number; cells: HitCell[] };

const ARTIST_IDS = new Set(ARTISTS.map((a) => a.id));
const RANK: Record<string, number> = { unity: 0, bonus: 1, line: 2 };

export const isArtist = (id: string) => ARTIST_IDS.has(id);

/**
 * Which wins to celebrate and when: SPC Unity first, then the 713 Bonus, then lines by XP (ties keep
 * payline order). At most `maxWins` steps, `perWin` ms apart; inside a step the cells pop left to right,
 * `cellStagger` ms per reel, so a line reads like it is being dealt across the board.
 */
export function hitSchedule(
  wins: HitWin[],
  { maxWins = 4, perWin = 1250, cellStagger = 95 }: { maxWins?: number; perWin?: number; cellStagger?: number } = {},
): HitStep[] {
  const ordered = wins
    .map((win, index) => ({ win, index }))
    .sort((a, b) => (RANK[a.win.type] ?? 3) - (RANK[b.win.type] ?? 3) || b.win.xp - a.win.xp || a.index - b.index)
    .slice(0, Math.max(0, maxWins));
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
