import { expect, test } from 'vitest';
import { verticalPreviews } from './vertical-preview';
import { evaluateBoard } from './engine';

const board = () => Array.from({ length: 6 }, () => ['k-rino', 'mr-cap', 'mic']);
test('three matching symbols qualify on every reel with exact top-to-bottom cells and zero XP', () => {
  const b = Array.from({ length: 6 }, () => ['mr-cap', 'mr-cap', 'mr-cap']);
  expect(verticalPreviews(b)).toHaveLength(6);
  expect(verticalPreviews(b)[2]).toEqual({ type: 'vertical', reel: 2, symbol: 'mr-cap', count: 3, xp: 0, cells: ['2:0', '2:1', '2:2'] });
});
test('Wild and Double Wild substitute without granting XP', () => {
  const b = board(); b[0] = ['wild', 'mic', 'double-wild'];
  expect(verticalPreviews(b)).toEqual([{ type: 'vertical', reel: 0, symbol: 'mic', count: 3, xp: 0, cells: ['0:0', '0:1', '0:2'] }]);
});
test('different artists, all Wilds, scatter stacks and multiplier stacks are rejected', () => {
  const b = board(); b[0] = ['wild', 'double-wild', 'wild']; b[1] = ['bonus', 'bonus', 'bonus']; b[2] = ['double', 'double', 'double'];
  expect(verticalPreviews(b)).toEqual([]);
});
test('inspection does not mutate boards or credited outcomes', () => {
  const b = board(); b[0] = ['mr-cap', 'wild', 'mr-cap'];
  const snapshot = structuredClone(b), before = evaluateBoard(b);
  verticalPreviews(b);
  expect(b).toEqual(snapshot); expect(evaluateBoard(b)).toEqual(before);
});