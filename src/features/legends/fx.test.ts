import { describe, expect, it } from "vitest";
import { countUpMs, sweepTease, tiersFor } from "./fx";
import { evaluateBoard } from "./engine";

const quiet = () => [["mic", "mixer", "vinyl"], ["tape", "headphones", "legend"], ["speakers", "houston", "mic"], ["mixer", "vinyl", "tape"], ["legend", "speakers", "houston"], ["headphones", "mic", "mixer"]];

describe("Big Win tiers", () => {
  it("escalates through every tier the XP passes", () => {
    expect(tiersFor(499).map((t) => t.tier)).toEqual([]);
    expect(tiersFor(500).map((t) => t.tier)).toEqual(["big"]);
    expect(tiersFor(2000).map((t) => t.tier)).toEqual(["big", "mega"]);
    expect(tiersFor(25250).map((t) => t.label)).toEqual(["BIG WIN", "MEGA WIN", "LEGENDARY WIN"]);
  });
  it("gives bigger wins a longer count-up", () => {
    expect(countUpMs(100)).toBe(0);
    expect(countUpMs(600)).toBeLessThan(countUpMs(2500));
    expect(countUpMs(2500)).toBeLessThan(countUpMs(30000));
  });
  it("puts every Legend Sweep in the top tier", () => {
    const board = quiet();
    [0, 0, 2, 2, 0, 0].forEach((row, col) => (board[col][row] = "k-water"));
    expect(tiersFor(evaluateBoard(board).xp).at(-1)?.tier).toBe("legendary");
  });
});

describe("Legend Sweep tease", () => {
  it("lights reel 5 when one artist is on reels 1 to 4, and reel 6 only if reel 5 has them too", () => {
    const board = quiet();
    for (let col = 0; col < 4; col++) board[col][1] = "cl-che";
    expect(sweepTease(board)).toEqual({ reels: [false, false, false, false, true, false], artist: "cl-che" });
    board[4][0] = "cl-che";
    expect(sweepTease(board).reels).toEqual([false, false, false, false, true, true]);
  });
  it("does nothing with three reels, or when wilds fill a gap", () => {
    const board = quiet();
    for (let col = 0; col < 3; col++) board[col][0] = "mr-cap";
    expect(sweepTease(board).artist).toBeNull();
    board[3][0] = "wild";
    expect(sweepTease(board).reels.some(Boolean)).toBe(false);
  });
  it("never changes the outcome", () => {
    const board = quiet();
    for (let col = 0; col < 4; col++) board[col][2] = "rapper-k";
    const before = JSON.stringify(evaluateBoard(board));
    sweepTease(board);
    expect(JSON.stringify(evaluateBoard(board))).toBe(before);
  });
});
