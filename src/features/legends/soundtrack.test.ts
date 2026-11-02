import { expect, test } from "vitest";
import { pickWinSong, WIN_CUE_SECONDS, WIN_SONGS } from "./soundtrack";

const base = { supreme: false, unity: false, sweep: false, major: false, bonus: false, xp: 100 };

test("no song plays without a win", () => {
  expect(pickWinSong({ ...base, xp: 0 })).toBeNull();
});
test("Supreme Legendary plays Eternal Legacy, even alongside other wins", () => {
  expect(pickWinSong({ ...base, supreme: true, unity: true, major: true })?.title).toBe("Eternal Legacy");
});
test("SPC Unity plays The Coalition and a Legend Sweep plays Ties That Bind Us", () => {
  expect(pickWinSong({ ...base, unity: true })?.title).toBe("The Coalition");
  expect(pickWinSong({ ...base, sweep: true })?.title).toBe("Ties That Bind Us");
});
test("big wins play Bet'n On Me and line hits rotate album cuts", () => {
  expect(pickWinSong({ ...base, major: true })?.title).toBe("Bet'n On Me");
  expect(pickWinSong(base, 1)?.title).toBe(WIN_SONGS.line[1].title);
});
test("win songs cue at the 15 second mark", () => {
  expect(WIN_CUE_SECONDS).toBe(15);
});
