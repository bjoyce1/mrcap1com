import { expect, test } from 'vitest';
import { verticalPreviews } from './vertical-preview';
import { evaluateBoard, lineMatch } from './engine';
import { evaluateBoard as serverEvaluate } from '../../../supabase/functions/_shared/legends/engine';
import { XP_TABLE } from './config';

// No lines, no Supreme, no stacks: every reel mixes music, a hood and an artist.
const quiet = () => [['mic','south-park','k-rino'],['vinyl','tape','3rd-ward'],['mixer','5th-ward','speakers'],['tape','acres-homes','headphones'],['legend','mic','mcgregor-park'],['houston','vinyl','mixer']];

test('a reel of one artist pays 250 base XP, with exact top-to-bottom cells', () => {
  const b = Array.from({ length: 6 }, () => ['mr-cap', 'mr-cap', 'mr-cap']);
  expect(verticalPreviews(b)).toHaveLength(6);
  expect(verticalPreviews(b)[2]).toEqual({ type: 'vertical', reel: 2, symbol: 'mr-cap', count: 3, xp: 250, cells: ['2:0', '2:1', '2:2'] });
});
test('Wild and Double Wild fill in; music and Houston hood stacks pay 125', () => {
  const b = quiet(); b[0] = ['wild', 'mic', 'double-wild']; b[3] = ['south-park', 'wild', 'south-park'];
  expect(verticalPreviews(b)).toEqual([
    { type: 'vertical', reel: 0, symbol: 'mic', count: 3, xp: 125, cells: ['0:0', '0:1', '0:2'] },
    { type: 'vertical', reel: 3, symbol: 'south-park', count: 3, xp: 125, cells: ['3:0', '3:1', '3:2'] },
  ]);
});
test('mixed reels, all Wilds, scatter stacks and multiplier stacks do not stack', () => {
  const b = quiet(); b[0] = ['wild', 'double-wild', 'wild']; b[1] = ['bonus', 'bonus', 'bonus']; b[2] = ['double', 'double', 'double'];
  expect(verticalPreviews(b)).toEqual([]);
});
test('the engine pays vertical stacks, multipliers apply, and the server agrees', () => {
  expect(evaluateBoard(quiet()).xp).toBe(0);
  const b = quiet(); b[1] = ['k-rino', 'k-rino', 'k-rino'];
  const one = evaluateBoard(b);
  expect(one.xp).toBe(XP_TABLE.vertical.character);
  expect(one.wins).toEqual([{ type: 'vertical', reel: 1, symbol: 'k-rino', count: 3, xp: 250, cells: ['1:0', '1:1', '1:2'] }]);
  expect(one.hitCells).toEqual(['1:0', '1:1', '1:2']);
  b[5] = ['houston', 'double', 'mixer'];
  expect(evaluateBoard(b).xp).toBe(500);
  expect(serverEvaluate(b)).toEqual(evaluateBoard(b));
});
test('Houston hoods pay on paylines at music rates', () => {
  expect(lineMatch(['5th-ward', '5th-ward', 'wild', '5th-ward', 'mic', 'mic'])).toEqual({ symbol: '5th-ward', count: 4 });
  const b = quiet(); for (let c = 0; c < 3; c++) b[c][0] = '3rd-ward';
  const line = evaluateBoard(b).wins.find((w) => w.type === 'line');
  expect(line).toMatchObject({ symbol: '3rd-ward', count: 3, xp: XP_TABLE.hood[3] });
});
