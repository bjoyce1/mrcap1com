import { expect, test } from 'vitest';
import { applySpin, initialState } from './engine';
import { ARTISTS } from './config';
import { supremePrizeState } from './supreme-prize';

test('only Supreme Legendary unlocks the cosmetic reward', () => {
  expect(supremePrizeState([])).toEqual({ unlocked: false, equipped: false });
  expect(supremePrizeState(['legend-sweep', 'spc-unity'])).toEqual({ unlocked: false, equipped: false });
  expect(supremePrizeState(['supreme-legends'])).toEqual({ unlocked: true, equipped: true });
});

test('a six-reel Supreme win unlocks the reward without awarding extra spins', () => {
  const board = Array.from({ length: 6 }, (_, col) => [ARTISTS[col].id, 'mic', 'mixer']);
  const won = applySpin(initialState(), board).state;
  expect(supremePrizeState(won.badges).equipped).toBe(true);
  expect(won.welcomeLeft).toBe(24);
  expect(won.spinsToday).toBe(0);
});

test('turning the cosmetic off preserves the earned unlock on reload', () => {
  expect(supremePrizeState(['supreme-legends'], false)).toEqual({ unlocked: true, equipped: false });
  expect(supremePrizeState(['supreme-legends']).equipped).toBe(true);
  expect(supremePrizeState([], true).equipped).toBe(false);
});