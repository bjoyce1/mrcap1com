import { describe, expect, test } from 'vitest';
import fixture from './unity-board.fixture.json';
import { analyzeUnityPaths, explainUnityPath, proposedUnityScore, inspectWinningLines } from './unity-paths';
import { evaluateBoard } from './engine';
import { evaluateBoard as serverEvaluate } from '../../../supabase/functions/_shared/legends/engine';
import { ARTISTS } from './config';
const aliases: Record<string, string> = fixture.symbolAliases;
export const board = fixture.sourceBoard.map(col => col.map(id => aliases[id] ?? id));
describe('exact supplied six-reel board', () => {
  test('contains exactly 32 distinct Unity cell routes', () => {
    const result = analyzeUnityPaths(board);
    expect(result.qualifying).toHaveLength(32);
    expect(new Set(result.qualifying.map(p => p.id)).size).toBe(32);
    expect(result.qualifying.length + result.rejected.length).toBe(239);
    for (const p of result.qualifying) { expect(new Set(p.symbols).size).toBe(6); expect(p.cells).toHaveLength(6); expect(p.rows.every((r,c)=>!c||Math.abs(r-p.rows[c-1])<=1)).toBe(true); }
  });
  for (const [name, rows] of Object.entries(fixture.paths)) test(`Path ${name} is included with exact positions`, () => {
    expect(analyzeUnityPaths(board).qualifying.find(p => p.id === rows.join(''))?.cells).toEqual(rows.map((r,c)=>`${c}:${r}`));
    expect(explainUnityPath(board, rows).reasons).toEqual([]);
  });
  test('existing rules credit only Supreme, not diagonal Unity', () => {
    const current = evaluateBoard(board);
    expect(current.xp).toBe(250); expect(current.wins.filter(w=>w.type==='unity')).toHaveLength(0);
    expect(serverEvaluate(board)).toEqual(current);
    expect(proposedUnityScore(board)).toMatchObject({ mainAwards: 1, mainXp: 2000, extraXp: 0, xp: 2250 });
    expect(evaluateBoard(board)).toEqual(current);
  });
  test('extra routes are capped without counting the main path twice', () => {
    expect(proposedUnityScore(board, { extraPathXp: 10, maxExtraPaths: 3 })).toMatchObject({ paidExtraPaths: 3, extraXp: 30, xp: 2280 });
    expect(proposedUnityScore(board, { extraPathXp: 10, maxExtraPaths: 100 })).toMatchObject({ paidExtraPaths: 31, extraXp: 310 });
    expect(() => proposedUnityScore(board, { extraPathXp: -1, maxExtraPaths: 3 })).toThrow(RangeError);
  });
  test('viewer exposes every Unity and rejected route independently of animation cap', () => {
    const current=evaluateBoard(board), inspection=inspectWinningLines(board,current.wins,current.xp);
    expect(inspection.qualifying).toHaveLength(32); expect(inspection.rejected).toHaveLength(207); expect(inspection.standard).toHaveLength(26);
    expect(inspection.qualifying[31].cells).toHaveLength(6);
  });
});
test('no top-to-bottom jumps, repeated artists, wilds or nonartists qualify', () => {
  expect(explainUnityPath(board,[0,2,2,1,1,1]).reasons.some(r=>r.includes('row jump'))).toBe(true);
  expect(explainUnityPath(board,[1,1,1,1,1,1]).reasons.some(r=>r.includes('repeats'))).toBe(true);
  const b=board.map(col=>[...col]); b[0][0]='wild';
  expect(explainUnityPath(b,fixture.paths.A).reasons.some(r=>r.includes('not an SPC artist'))).toBe(true);
});
test('three horizontal Unity rows still yield one proposed main award', () => {
  const b=ARTISTS.slice(0,6).map(a=>[a.id,a.id,a.id]);
  expect(analyzeUnityPaths(b).qualifying).toHaveLength(239);
  expect(evaluateBoard(b).wins.filter(w=>w.type==='unity')).toHaveLength(3);
  expect(proposedUnityScore(b).mainAwards).toBe(1);
});
test('cap is pre-multiplier and both multiplier symbols apply once', () => {
  const b=board.map(col=>[...col]);b[4][0]='double';b[5][0]='triple';
  expect(proposedUnityScore(b,{extraPathXp:10,maxExtraPaths:3})).toMatchObject({baseXp:2280,multiplier:6,xp:13680});
  expect(()=>proposedUnityScore(b,{extraPathXp:Infinity,maxExtraPaths:3})).toThrow(RangeError);
  expect(()=>proposedUnityScore(b,{extraPathXp:0,maxExtraPaths:-1})).toThrow(RangeError);
});