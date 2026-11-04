import { expect, test } from "vitest";
import { pickWinSong, WIN_CUE_SECONDS, WIN_SONGS } from "./soundtrack";

const base = { supreme: false, unity: false, sweep: false, major: false, bonus: false, xp: 100 };

test("no track is selected for a losing spin", () => {
  expect(pickWinSong({ ...base, xp: 0 })).toBeNull();
  expect(pickWinSong({ ...base, xp: -1 })).toBeNull();
});

test("each game reward level has a distinct song", () => {
  const cases = [
    { ...base, xp: 100, expected: WIN_SONGS.line[0] },
    { ...base, supreme: true, xp: 250, expected: WIN_SONGS.supreme },
    { ...base, unity: true, xp: 500, expected: WIN_SONGS.unity },
    { ...base, bonus: true, xp: 300, expected: WIN_SONGS.bonus },
    { ...base, major: true, xp: 750, expected: WIN_SONGS.major },
    { ...base, xp: 1000, expected: WIN_SONGS.big },
    { ...base, xp: 2000, expected: WIN_SONGS.mega },
    { ...base, xp: 10000, expected: WIN_SONGS.legendary },
    { ...base, sweep: true, xp: 25000, expected: WIN_SONGS.sweep },
  ];
  for (const { expected, ...kind } of cases) {
    expect(pickWinSong(kind)?.title).toBe(expected.title);
    expect(pickWinSong(kind)?.file).toBe(expected.file);
  }
  expect(new Set(cases.map(({ expected }) => expected.file)).size).toBe(cases.length);
});

test("major XP tier overrides Supreme, Unity and bonus flags", () => {
  const multiple = { ...base, supreme: true, unity: true, bonus: true, major: true };
  expect(pickWinSong({ ...multiple, xp: 1000 })).toEqual(WIN_SONGS.big);
  expect(pickWinSong({ ...multiple, xp: 2000 })).toEqual(WIN_SONGS.mega);
  expect(pickWinSong({ ...multiple, xp: 10000 })).toEqual(WIN_SONGS.legendary);
});

test("Legend Sweep takes priority even with other awards", () => {
  expect(pickWinSong({ ...base, supreme: true, unity: true, sweep: true, major: true, xp: 25000 })).toEqual(WIN_SONGS.sweep);
});

test("Unity has priority over Supreme when below Big Win threshold", () => {
  expect(pickWinSong({ ...base, supreme: true, unity: true, xp: 750 })).toEqual(WIN_SONGS.unity);
});

test("Win song thresholds match the actual tier boundaries", () => {
  expect(pickWinSong({ ...base, xp: 999 })).toEqual(WIN_SONGS.line[0]);
  expect(pickWinSong({ ...base, xp: 1000 })).toEqual(WIN_SONGS.big);
  expect(pickWinSong({ ...base, xp: 1999 })).toEqual(WIN_SONGS.big);
  expect(pickWinSong({ ...base, xp: 2000 })).toEqual(WIN_SONGS.mega);
  expect(pickWinSong({ ...base, xp: 9999 })).toEqual(WIN_SONGS.mega);
  expect(pickWinSong({ ...base, xp: 10000 })).toEqual(WIN_SONGS.legendary);
});

test("ordinary line wins rotate through their own tracks", () => {
  expect(pickWinSong(base, 0)).toEqual(WIN_SONGS.line[0]);
  expect(pickWinSong(base, 1)).toEqual(WIN_SONGS.line[1]);
  expect(pickWinSong(base, 2)).toEqual(WIN_SONGS.line[0]);
});

test("win songs cue at the 15 second mark", () => {
  expect(WIN_CUE_SECONDS).toBe(15);
});
