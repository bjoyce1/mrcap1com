import { createBoard, evaluateBoard } from './engine';
import type { SpinResult } from './account';

/** Temporary guest play is session-only and never credits or spends account spins. */
export function guestSpin(collection: readonly string[], board = createBoard()): SpinResult {
  const evaluated = evaluateBoard(board);
  const outcome: SpinResult['outcome'] = {
    ...evaluated,
    hitCells: evaluated.hitCells.filter((cell): cell is string => typeof cell === 'string'),
    found: evaluated.found.filter((id): id is string => typeof id === 'string'),
  };
  return {
    board,
    outcome,
    newCharacters: outcome.found.filter((id: string) => !collection.includes(id)),
    source: 'welcome',
    balance: { welcomeLeft: 0, dailyLeft: 0, paidSpins: 0 },
  };
}