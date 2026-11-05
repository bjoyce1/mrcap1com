import { createBoard, evaluateBoard } from './engine';
import type { SpinResult } from './account';

/** A.C. Chill on guest reels: development builds, or a build made with VITE_LEGENDS_AC_CHILL=true. Accounts follow the
 * server secret LEGENDS_AC_CHILL_ENABLED instead. Off in production until the owner approves the Legacy Blessing. */
export function guardianOnGuestReels(env: { DEV?: boolean; VITE_LEGENDS_AC_CHILL?: string } = import.meta.env) {
  return !!env.DEV || env.VITE_LEGENDS_AC_CHILL === 'true';
}

/** Development preview: a fixed board where A.C. Chill always lands with four K-Rinos on the middle row, so the
 * Legacy Blessing plays every time. Used only when guardianOnGuestReels() and the page URL has ?blessing. */
export const BLESSING_PREVIEW_BOARD: readonly (readonly string[])[] = Object.freeze([
  ['mic', 'k-rino', 'tape'],
  ['mr-cap', 'k-rino', 'vinyl'],
  ['speakers', 'k-rino', 'dope-e'],
  ['ac-chill', 'k-rino', 'mixer'],
  ['klondike-kat', 'bonus', 'headphones'],
  ['houston', 'tape', 'cl-che'],
].map(col => Object.freeze(col)));

/** The next guest board: the preview board when asked for, otherwise a random one (with A.C. Chill where he is on). */
export function guestBoard(search = typeof location === 'undefined' ? '' : location.search, env?: { DEV?: boolean; VITE_LEGENDS_AC_CHILL?: string }) {
  const on = guardianOnGuestReels(env);
  if (on && new URLSearchParams(search).has('blessing')) return BLESSING_PREVIEW_BOARD.map(col => [...col]);
  return createBoard(undefined, { guardian: on });
}

/** Temporary guest play is session-only and never credits or spends account spins. */
export function guestSpin(collection: readonly string[], board = guestBoard()): SpinResult {
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