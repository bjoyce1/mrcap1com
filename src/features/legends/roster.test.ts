import { expect, test } from 'vitest';
import { ARTISTS, SYMBOL_WEIGHTS } from './config';
import { ARTISTS as SERVER_ARTISTS, SYMBOL_WEIGHTS as SERVER_WEIGHTS } from '../../../supabase/functions/_shared/legends/config';
import { evaluateBoard as serverEvaluate } from '../../../supabase/functions/_shared/legends/engine';
import { guestSpin } from './guest';

test('guest and account rosters include Murder One and Rapper K with equal artist weights', () => {
  expect(ARTISTS).toHaveLength(8);
  expect(ARTISTS.slice(-2).map(({ id, name }) => ({ id, name }))).toEqual([
    { id: 'murder-one', name: 'Murder One' },
    { id: 'rapper-k', name: 'Rapper K' },
  ]);
  expect(SERVER_ARTISTS).toEqual(ARTISTS);
  expect(SERVER_WEIGHTS).toEqual(SYMBOL_WEIGHTS);
  expect(SYMBOL_WEIGHTS['murder-one']).toBe(10);
  expect(SYMBOL_WEIGHTS['rapper-k']).toBe(10);
});

for (const id of ['murder-one', 'rapper-k']) {
  test(`${id} can be collected and earns the existing character XP in both engines`, () => {
    const board = [
      [id, 'mic', 'mixer'], [id, 'tape', 'vinyl'], [id, 'headphones', 'legend'],
      ['speakers', 'houston', 'mic'], ['mixer', 'vinyl', 'tape'], ['legend', 'speakers', 'houston'],
    ];
    const guest = guestSpin([], board);
    expect(guest.newCharacters).toEqual([id]);
    expect(guest.outcome.xp).toBe(50);
    expect(serverEvaluate(board).xp).toBe(50);
    expect(serverEvaluate(board).found).toEqual([id]);
  });
}