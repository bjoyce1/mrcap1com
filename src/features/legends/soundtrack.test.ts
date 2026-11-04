import { describe, expect, it, test } from 'vitest';
import { pickWinSong, WIN_CUE_SECONDS, WIN_SONGS, WinSoundtrack, winSongTier } from './soundtrack';

const base = { supreme: false, unity: false, sweep: false, major: false, bonus: false, xp: 100 };

test('losing and invalid XP do not select music', () => {
  for (const xp of [0, -1, NaN, Infinity]) expect(pickWinSong({ ...base, xp })).toBeNull();
});

test.each([
  [25, 'line'], [249, 'line'], [250, 'supreme'], [499, 'supreme'],
  [500, 'major'], [749, 'major'], [750, 'unity'], [999, 'unity'],
  [1000, 'big'], [1999, 'big'], [2000, 'mega'], [9999, 'mega'], [10000, 'legendary'],
] as const)('%i credited XP selects the %s pool regardless of hit flags', (xp, tier) => {
  expect(winSongTier(xp)).toBe(tier);
  expect(pickWinSong({ ...base, xp, supreme: true, unity: true, sweep: true, major: true, bonus: true })).toEqual(WIN_SONGS[tier][0]);
});

test('250, 500 and 750 XP always use different songs', () => {
  for (let rotation = 0; rotation < 12; rotation++) {
    const songs = [250, 500, 750].map(xp => pickWinSong({ ...base, xp }, rotation)?.file);
    expect(new Set(songs).size).toBe(3);
  }
});

test('no XP tier shares tracks with another tier', () => {
  const files = Object.values(WIN_SONGS).flatMap(pool => pool.map(s => s.file));
  expect(new Set(files).size).toBe(files.length);
});

test('250 XP cycles Eternal Legacy, Respect and A.C. Chill without consecutive repeats', () => {
  expect([0, 1, 2, 3].map(i => pickWinSong({ ...base, xp: 250 }, i)?.title)).toEqual(['Eternal Legacy', 'Respect', 'A.C. Chill', 'Eternal Legacy']);
});

test('each tier maintains its own visit rotation when other tiers intervene', () => {
  const player = new WinSoundtrack(() => 0);
  expect(player.play({ ...base, xp: 250 }, false)?.title).toBe('Eternal Legacy');
  expect(player.play({ ...base, xp: 1000 }, false)?.title).toBe("Bet'n On Me");
  expect(player.play({ ...base, xp: 250 }, false)?.title).toBe('Respect');
  expect(player.play({ ...base, xp: 1000 }, false)?.title).toBe('Nobody Comes Close');
});

test('win songs retain the 15-second cue', () => {
  expect(WIN_CUE_SECONDS).toBe(15);
});
describe('WinSoundtrack tier rotation', () => {
  it('plays each tier its own pool, starting at a random song and rotating', async () => {
    const { WinSoundtrack, WIN_SONGS } = await import('./soundtrack');
    const base = { supreme: false, unity: false, sweep: false, major: false, bonus: false };
    const t = new WinSoundtrack(() => 0.5);
    const lines = [0, 1, 2, 3].map(() => t.play({ ...base, xp: 100 }, false)!.title);
    expect(lines[0]).toBe(WIN_SONGS.line[2].title);
    expect(new Set(lines).size).toBe(4);
    expect(t.play({ ...base, xp: 250 }, false)!.title).toBe(WIN_SONGS.supreme[1].title);
    expect(t.play({ ...base, xp: 750 }, false)!.title).toBe('The Coalition');
  });
});
