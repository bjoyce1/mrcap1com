import { describe, expect, test } from 'vitest';
import fixture from './unity-board.fixture.json';
import { analyzeUnityPaths, explainUnityPath, inspectWinningLines } from './unity-paths';
import { evaluateBoard, UNITY_ROUTES } from './engine';
import { evaluateBoard as serverEvaluate } from '../../../supabase/functions/_shared/legends/engine';
import { ARTISTS, XP_TABLE } from './config';
const aliases: Record<string, string> = fixture.symbolAliases;
export const board = fixture.sourceBoard.map(col => col.map(id => aliases[id] ?? id));
describe('exact supplied six-reel board', () => {
  test('contains exactly 32 distinct Unity cell routes', () => {
    const result = analyzeUnityPaths(board);
    expect(result.qualifying).toHaveLength(32);
    expect(new Set(result.qualifying.map(p => p.id)).size).toBe(32);
    expect(result.qualifying.map(p=>p.id)).toEqual('000011 000111 000121 001011 001111 001121 010011 010111 010121 011011 011111 011121 012111 012121 100011 101011 110011 111011 121011 210011 210111 210121 211011 211111 211121 212111 212121 221011 221111 221121 222111 222121'.split(' '));
    expect(result.qualifying.length + result.rejected.length).toBe(239);
    for (const p of result.qualifying) { expect(new Set(p.symbols).size).toBe(6); expect(p.cells).toHaveLength(6); expect(p.rows.every((r,c)=>!c||Math.abs(r-p.rows[c-1])<=1)).toBe(true); }
  });
  for (const [name, rows] of Object.entries(fixture.paths)) test(`Path ${name} is included with exact positions`, () => {
    expect(analyzeUnityPaths(board).qualifying.find(p => p.id === rows.join(''))?.cells).toEqual(rows.map((r,c)=>`${c}:${r}`));
    expect(explainUnityPath(board, rows).reasons).toEqual([]);
  });
  test('Unity pays once for its connected routes, on the client and the server alike', () => {
    const current = evaluateBoard(board);
    const unity = current.wins.filter(w=>w.type==='unity');
    expect(unity).toHaveLength(1);
    expect(unity[0]).toMatchObject({ xp: XP_TABLE.unity, cells: analyzeUnityPaths(board).qualifying[0].cells });
    expect(current.xp).toBe(XP_TABLE.supreme + XP_TABLE.unity);
    expect(serverEvaluate(board)).toEqual(current);
  });
  test('viewer lists every route and marks the paid one', () => {
    const current=evaluateBoard(board), inspection=inspectWinningLines(board,current.wins,current.xp);
    expect(inspection.qualifying).toHaveLength(32); expect(inspection.rejected).toHaveLength(207); expect(inspection.standard).toHaveLength(26);
    expect(inspection.qualifying.filter(l=>l.label.includes('(paid)'))).toHaveLength(1);
    expect(inspection.qualifying[0].win.xp).toBe(XP_TABLE.unity);
  });
});
test('no top-to-bottom jumps, repeated artists, wilds or nonartists qualify', () => {
  expect(explainUnityPath(board,[0,2,2,1,1,1]).reasons.some(r=>r.includes('row jump'))).toBe(true);
  expect(explainUnityPath(board,[1,1,1,1,1,1]).reasons.some(r=>r.includes('repeats'))).toBe(true);
  const b=board.map(col=>[...col]); b[0][0]='wild';
  expect(explainUnityPath(b,fixture.paths.A).reasons.some(r=>r.includes('not an SPC artist'))).toBe(true);
});
test('the engine checks the same 239 routes the viewer does, straight rows first', () => {
  expect(UNITY_ROUTES).toHaveLength(239);
  expect(UNITY_ROUTES.slice(0,3).map(r=>r.join(''))).toEqual(['000000','111111','222222']);
  expect(new Set(UNITY_ROUTES.map(r=>r.join(''))).size).toBe(239);
});
test('three Unity rows still pay one award, on the top row', () => {
  const b=ARTISTS.slice(0,6).map(a=>[a.id,a.id,a.id]);
  expect(analyzeUnityPaths(b).qualifying).toHaveLength(239);
  const unity=evaluateBoard(b).wins.filter(w=>w.type==='unity');
  expect(unity).toHaveLength(1);
  expect(unity[0]).toMatchObject({ row: 0, cells: ['0:0','1:0','2:0','3:0','4:0','5:0'] });
});
test('the board from the owner\'s screenshot pays Unity along a connected route', () => {
  const shot = [
    ['k-water','headphones','klondike-kat'], ['rapper-k','rapper-k','klondike-kat'], ['rapper-k','point-blank','komodo-dbx'],
    ['murder-one','k-rino','rapper-k'], ['dope-e','klondike-kat','ganxsta-nip'], ['legend','komodo-dbx','k-rino'],
  ];
  const r = evaluateBoard(shot);
  expect(r.wins.map(w=>w.type).sort()).toEqual(['supreme','unity']);
  expect(r.xp).toBe(XP_TABLE.supreme + XP_TABLE.unity);
  expect(analyzeUnityPaths(shot).qualifying).toHaveLength(15);
  expect(serverEvaluate(shot)).toEqual(r);
});
test('multipliers apply to Unity like any other win', () => {
  const b=board.map(col=>[...col]);b[4][0]='double';b[5][0]='triple';
  const r=evaluateBoard(b);
  expect(r.multiplier).toBe(6);
  expect(r.xp).toBe(r.baseXp*6);
  expect(r.wins.filter(w=>w.type==='unity').length).toBeLessThanOrEqual(1);
});

test('a leading middle-row Wild contributes only when three consecutive positions match', () => {
  const b = [
    ['k-rino', 'wild', 'mic'], ['mr-cap', 'k-rino', 'mic'], ['point-blank', 'k-rino', 'mic'],
    ['klondike-kat', 'mr-cap', 'mic'], ['ganxsta-nip', 'dope-e', 'mic'], ['murder-one', 'rapper-k', 'mic'],
  ];
  const result = evaluateBoard(b);
  expect(result.wins.find(w => w.type === 'line' && w.payline === 1)).toMatchObject({ count: 3, symbol: 'k-rino', xp: 50, cells: ['0:1', '1:1', '2:1'] });
  expect(inspectWinningLines(b, result.wins, result.xp).wilds[0].cell).toBe('0:1');
  expect(serverEvaluate(b)).toEqual(result);
  b[2][1] = 'screw-tape';
  const broken = evaluateBoard(b);
  expect(broken.wins.some(w => w.type === 'line' && w.payline === 1)).toBe(false);
  expect(inspectWinningLines(b, broken.wins, broken.xp).standard[0].accepted).toBe(false);
  expect(serverEvaluate(b)).toEqual(broken);
});
