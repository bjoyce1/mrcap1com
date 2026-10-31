import { expect, test } from 'vitest';
import { guestSpin } from './guest';

test('signed-out play scores the board without paid or account spins', () => {
  const board = [['k-rino','mic','mixer'],['k-rino','tape','vinyl'],['k-rino','headphones','legend'],['speakers','houston','mic'],['mixer','vinyl','tape'],['legend','speakers','houston']];
  const result = guestSpin([], board);
  expect(result.board).toEqual(board);
  expect(result.outcome.xp).toBe(50);
  expect(result.newCharacters).toEqual(['k-rino']);
  expect(result.balance).toEqual({ welcomeLeft: 0, dailyLeft: 0, paidSpins: 0 });
  expect(guestSpin(['k-rino'], board).newCharacters).toEqual([]);
});