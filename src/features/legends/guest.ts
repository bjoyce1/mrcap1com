import { createBoard, evaluateBoard } from './engine';
import type { SpinResult } from './account';

/** Temporary guest play is session-only and never credits or spends account spins. */
export function guestSpin(collection: readonly string[], board = createBoard()): SpinResult {
  const outcome = evaluateBoard(board);
  return {
    board,
    outcome,
    newCharacters: outcome.found.filter((id: string) => !collection.includes(id)),
    source: 'welcome',
    balance: { welcomeLeft: 0, dailyLeft: 0, paidSpins: 0 },
  };
}