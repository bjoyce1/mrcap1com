import { ARTISTS, PAYLINES, SYMBOL_MAP, XP_TABLE } from './config';
import { evaluateBoard, lineMatch, validateBoard } from './engine';
import type { SpinWin } from './account';

const artists = new Set(ARTISTS.map(a => a.id));
export type UnityPath = { id: string; rows: number[]; cells: string[]; symbols: string[]; reasons: string[] };
export const UNITY_PREVIEW_RULES = Object.freeze({ extraPathXp: 0, maxExtraPaths: 0 });
export function explainUnityPath(board: string[][], rows: readonly number[]): UnityPath {
  if (!validateBoard(board)) throw new TypeError('Expected six reels with three valid symbols each');
  if (rows.length !== 6 || rows.some(r => !Number.isInteger(r) || r < 0 || r > 2)) throw new TypeError('Expected six row indices from 0 to 2');
  const symbols = rows.map((r, c) => board[c][r]);
  const reasons: string[] = [];
  rows.forEach((r, c) => { if (c && Math.abs(r - rows[c - 1]) > 1) reasons.push(`Reels ${c} to ${c + 1}: row jump exceeds one.`); });
  symbols.forEach((id, c) => { if (!artists.has(id)) reasons.push(`Reel ${c + 1}: ${SYMBOL_MAP[id]?.name ?? id} is not an SPC artist.`); });
  const seen = new Set<string>();
  symbols.forEach(id => { if (artists.has(id) && seen.has(id)) reasons.push(`${SYMBOL_MAP[id].name} repeats.`); seen.add(id); });
  return { id: rows.join(''), rows: [...rows], cells: rows.map((r, c) => `${c}:${r}`), symbols, reasons };
}
/** Enumerate all 239 continuous geometric paths, including deterministic rejection reasons. */
export function analyzeUnityPaths(board: string[][]) {
  const paths: UnityPath[] = [];
  const visit = (rows: number[]) => {
    if (rows.length === 6) { paths.push(explainUnityPath(board, rows)); return; }
    for (let row = 0; row < 3; row++) if (!rows.length || Math.abs(row - rows[rows.length - 1]) <= 1) visit([...rows, row]);
  };
  visit([]);
  return { qualifying: paths.filter(p => !p.reasons.length), rejected: paths.filter(p => p.reasons.length) };
}
/** Shadow scoring only. Never pass this result to balances, badges, history or account commits. */
export function proposedUnityScore(board: string[][], rules: { extraPathXp: number; maxExtraPaths: number } = UNITY_PREVIEW_RULES) {
  for (const value of [rules.extraPathXp, rules.maxExtraPaths]) if (!Number.isSafeInteger(value) || value < 0) throw new RangeError('Unity settings must be nonnegative safe integers');
  const paths = analyzeUnityPaths(board).qualifying;
  const unique = [...new Map(paths.map(p => [p.id, p])).values()];
  const paidExtraPaths = Math.min(Math.max(0, unique.length - 1), rules.maxExtraPaths);
  const extraXp = paidExtraPaths * rules.extraPathXp;
  const mainXp = unique.length ? XP_TABLE.unity : 0;
  const legacy = evaluateBoard(board);
  const baseXp = legacy.baseXp - legacy.wins.filter(w => w.type === 'unity').reduce((sum, w) => sum + w.xp, 0) + mainXp + extraXp;
  const xp = baseXp * legacy.multiplier;
  if (!Number.isSafeInteger(xp)) throw new RangeError('Unity XP exceeds safe integer range');
  return { paths: unique, mainAwards: unique.length ? 1 : 0, mainXp, paidExtraPaths, extraXp, baseXp, multiplier: legacy.multiplier, xp };
}
export type InspectedLine = { id: string; label: string; cells: string[]; explanation: string; accepted: boolean; win: SpinWin };
export function inspectWinningLines(board: string[][], wins: SpinWin[], creditedXp: number) {
  const analysis = analyzeUnityPaths(board);
  const preview = proposedUnityScore(board);
  const multiplier = wins.filter(w => w.type === 'multiplier').reduce((m, w) => m * (w.multiplier ?? 1), 1);
  const awards = wins.map(w => `${w.type === 'line' ? `Matching payline ${w.payline}: ${w.count} ${SYMBOL_MAP[w.symbol ?? '']?.name ?? 'symbols'}` : w.type === 'unity' ? 'SPC Unity horizontal row' : w.type === 'supreme' ? 'Supreme Legendary: a real artist on every reel' : w.type === 'sweep' ? `Legend Sweep: ${SYMBOL_MAP[w.symbol ?? '']?.name}` : w.type === 'bonus' ? '713 scatter bonus' : 'Multiplier increment'}: +${w.xp.toLocaleString()} ${w.type === 'multiplier' ? 'additional' : 'base'} XP.`);
  const qualifying: InspectedLine[] = analysis.qualifying.map((p, i) => ({
    id: `unity-${p.id}`, label: `Unity route ${i + 1}`, cells: p.cells, accepted: true,
    explanation: `Six different artists, six reels, adjacent steps. ${p.symbols.map(id => SYMBOL_MAP[id].name).join(' → ')}. Rows [${p.rows.join(', ')}]. ${i === 0 ? `Proposed main award: ${preview.mainXp} base XP once per spin.` : 'Included in the same once-per-spin Unity award. Additional-route XP is disabled.'} Current credited Unity awards: ${wins.filter(w => w.type === 'unity').length}. Proposed rules are not active.`,
    win: { type: 'unity', xp: 0, cells: p.cells },
  }));
  const standard: InspectedLine[] = PAYLINES.map((rows, i) => {
    const win = wins.find(w => w.type === 'line' && w.payline === i + 1);
    const match = lineMatch(rows.map((r, c) => board[c][r]));
    const cells = win?.cells ?? rows.map((r, c) => `${c}:${r}`);
    return { id: `line-${i + 1}`, label: `Matching payline ${i + 1}`, cells, accepted: !!win,
      explanation: win ? `${win.count} matching ${SYMBOL_MAP[win.symbol ?? '']?.name} symbols from reel 1. +${win.xp} base XP. The illuminated cells are the actual paid run. Standard matching paylines are separate from Unity.` : match ? 'The matching symbol has no standard XP award. Not an SPC Unity decision.' : 'Rejected: fewer than three matching symbols from reel 1. Wilds substitute, but specials cannot form paid runs. This fixed payline is separate from Unity adjacency rules.',
      win: win ?? { type: 'unity', xp: 0, cells },
    };
  });
  const rejected: InspectedLine[] = analysis.rejected.map(p => ({ id: `reject-${p.id}`, label: `Rejected route [${p.rows.join(', ')}]`, cells: p.cells, accepted: false, explanation: p.reasons.join(' '), win: { type: 'unity', xp: 0, cells: p.cells } }));
  return { qualifying, standard, rejected, awards, creditedXp, multiplier, previewXp: preview.xp };
}