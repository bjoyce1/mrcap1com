import { describe, expect, it, test, vi } from 'vitest';
import { ARTIST_SONGS, pickWinSong, songUrl, winningArtist, WIN_CUE_SECONDS, WIN_SONGS, WinSoundtrack, winSongTier } from './soundtrack';
import { evaluateBoard } from './engine';

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
    const lines = [0, 1, 2, 3].map(() => t.play({ ...base, xp: 100 }, false)?.title);
    expect(lines[0]).toBe(WIN_SONGS.line[2].title);
    expect(new Set(lines).size).toBe(4);
    expect(t.play({ ...base, xp: 250 }, false)?.title).toBe(WIN_SONGS.supreme[1].title);
    expect(t.play({ ...base, xp: 750 }, false)?.title).toBe('The Coalition');
  });
});

const picturedBoard = [
  ['mr-cap', 'mr-cap', 'mr-cap'], ['south-park', 'headphones', 'mic'],
  ['south-park', 'mr-cap', '5th-ward'], ['legend', 'rapper-k', 'klondike-kat'],
  ['klondike-kat', 'tape', 'point-blank'], ['speakers', 'rapper-k', 'point-blank'],
];

test('the supplied screenshot vertical selects Cap International instead of its XP song', () => {
  const outcome = evaluateBoard(picturedBoard);
  expect(outcome.wins.some(w => w.type === 'vertical' && w.symbol === 'mr-cap')).toBe(true);
  const artist = winningArtist(outcome.wins, picturedBoard);
  expect(artist).toBe('mr-cap');
  expect(pickWinSong({ ...base, xp: outcome.xp, artist })?.title).toBe('Cap International');
});

test.each(['vertical', 'line', 'sweep'])('%s Mr. CAP hits use his supplied song, including Wild-assisted hits', type => {
  const wins = [{ type, symbol: 'mr-cap', xp: 250, cells: ['0:0', '0:1', '0:2'] }];
  const artist = winningArtist(wins, [['wild', 'mr-cap', 'double-wild']]);
  expect(artist).toBe('mr-cap');
  expect(pickWinSong({ ...base, artist })?.file).toBe('cap-international.mp3');
});

test.each(['unity', 'supreme'])('%s uses the actual first-reel leader, not another Mr. CAP elsewhere', type => {
  const win = { type, xp: 500, cells: ['1:0', '0:1', '2:0'] };
  expect(winningArtist([win], [['wild', 'mr-cap', 'mic'], ['k-rino'], ['point-blank']])).toBe('mr-cap');
  expect(winningArtist([win], [['mr-cap', 'k-rino', 'mic'], ['mr-cap'], ['point-blank']])).toBe('k-rino');
});

test('an artist without supplied songs falls back to the original XP tier', () => {
  expect(pickWinSong({ ...base, xp: 750, artist: 'k-rino' })?.title).toBe('The Coalition');
  expect(winningArtist([{ type: 'bonus', xp: 300, cells: ['0:0'] }], picturedBoard)).toBeNull();
});

test('named vertical hits take priority over mixed Supreme and larger studio lines', () => {
  expect(winningArtist([
    { type: 'supreme', xp: 250, cells: ['0:0'] },
    { type: 'line', symbol: 'mic', xp: 750, cells: ['0:0'] },
    { type: 'vertical', symbol: 'mr-cap', xp: 250, cells: ['0:1'] },
  ], [['k-rino', 'mr-cap']])).toBe('mr-cap');
});

test('artist and XP pools rotate independently', () => {
  const player = new WinSoundtrack(() => 0);
  expect(player.play({ ...base, xp: 250 }, false)?.title).toBe('Eternal Legacy');
  expect(player.play({ ...base, artist: 'mr-cap' }, false)?.title).toBe('Cap International');
  expect(player.play({ ...base, xp: 250 }, false)?.title).toBe('Respect');
});

test('the supplied artist audio starts at 15 seconds and stops on mute', () => {
  let metadata: (() => void) | undefined;
  const pause = vi.fn();
  const audio = { volume: 1, duration: 303.67, currentTime: 0, paused: false, pause, play: vi.fn().mockResolvedValue(undefined), addEventListener: (_: string, cb: () => void) => { metadata = cb; } };
  const AudioMock = vi.fn(function () { return audio; });
  vi.stubGlobal('Audio', AudioMock);
  try {
    const player = new WinSoundtrack(() => 0);
    player.play({ ...base, artist: 'mr-cap' }, true);
    expect(AudioMock).toHaveBeenCalledWith(songUrl(ARTIST_SONGS['mr-cap'][0]));
    metadata?.();
    expect(audio.currentTime).toBe(15);
    player.stopNow();
    expect(pause).toHaveBeenCalledOnce();
  } finally { vi.unstubAllGlobals(); }
});
