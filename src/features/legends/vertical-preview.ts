import { validateBoard, verticalStacks } from './engine';

export type VerticalPreview = { type: 'vertical'; reel: number; symbol: string; count: 3; xp: number; cells: string[] };

/** The paid vertical stacks on a board (the engine's own rule), for the winning-lines viewer. Read-only. */
export function verticalPreviews(board: string[][]): VerticalPreview[] {
  if (!validateBoard(board)) throw new TypeError('Expected six reels with three valid symbols each');
  return verticalStacks(board) as VerticalPreview[];
}
