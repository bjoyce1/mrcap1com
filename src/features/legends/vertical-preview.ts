import { ARTISTS, MUSIC } from './config';
import { validateBoard } from './engine';

const eligible = new Set([...ARTISTS, ...MUSIC].map(s => s.id));
export type VerticalPreview = { type: 'vertical'; reel: number; symbol: string; count: 3; xp: 0; cells: string[] };

/** Read-only stack detection. Never pass these previews into reward commits. */
export function verticalPreviews(board: string[][]): VerticalPreview[] {
  if (!validateBoard(board)) throw new TypeError('Expected six reels with three valid symbols each');
  return board.flatMap((col, reel) => {
    const symbol = col.find(id => id !== 'wild' && id !== 'double-wild');
    if (!symbol || !eligible.has(symbol) || !col.every(id => id === symbol || id === 'wild' || id === 'double-wild')) return [];
    return [{ type: 'vertical' as const, reel, symbol, count: 3 as const, xp: 0 as const, cells: [0, 1, 2].map(row => `${reel}:${row}`) }];
  });
}