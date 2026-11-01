import { expect, test } from "vitest";
import { XP_TABLE } from "./config";
import { applySpin, evaluateBoard, initialState } from "./engine";
import { hitSchedule } from "./hits";
import { evaluateBoard as serverEvaluate } from "../../../supabase/functions/_shared/legends/engine";

// No wins at all: no symbol appears on more than one reel.
const quiet = () => [["mic", "mixer", "vinyl"], ["tape", "headphones", "legend"], ["speakers", "houston", "mic"], ["mixer", "vinyl", "tape"], ["legend", "speakers", "houston"], ["headphones", "mic", "mixer"]];
/** Put `id` on every reel in rows top, top, bottom, bottom, top, top: no payline follows that path past two reels. */
const sweepBoard = (id: string) => {
  const board = quiet();
  [0, 0, 2, 2, 0, 0].forEach((row, col) => (board[col][row] = id));
  return board;
};

test("the same artist on all six reels, any rows, is a Legend Sweep worth 25,000 XP", () => {
  const outcome = evaluateBoard(sweepBoard("klondike-kat"));
  const sweep = outcome.wins.find((w) => w.type === "sweep");
  expect(XP_TABLE.sweep).toBe(25000);
  expect(sweep).toEqual({ type: "sweep", symbol: "klondike-kat", count: 6, xp: 25000, cells: ["0:0", "1:0", "2:2", "3:2", "4:0", "5:0"] });
  // It is also a Supreme (an artist on every reel), so both pay.
  expect(outcome.xp).toBe(XP_TABLE.sweep + XP_TABLE.supreme);
  expect(outcome.hitCells).toEqual(expect.arrayContaining(sweep!.cells));
  expect(serverEvaluate(sweepBoard("klondike-kat"))).toEqual(outcome);
});

test("five reels are not a sweep, and wilds never stand in for the artist", () => {
  const five = sweepBoard("k-rino");
  five[5][0] = "mixer";
  expect(evaluateBoard(five).wins.some((w) => w.type === "sweep")).toBe(false);
  five[5][0] = "wild";
  expect(evaluateBoard(five).wins.some((w) => w.type === "sweep")).toBe(false);
});

test("its path uses the artist's top-most cell on each reel", () => {
  const board = sweepBoard("cl-che");
  board[0][1] = "cl-che"; // a second Cl'Che' lower on reel 1
  expect(evaluateBoard(board).wins.find((w) => w.type === "sweep")!.cells[0]).toBe("0:0");
});

test("Double and Triple Bonus multiply a sweep like any other win", () => {
  const board = sweepBoard("mr-cap");
  board[1][1] = "double";
  board[4][1] = "triple";
  const outcome = evaluateBoard(board);
  expect(outcome.baseXp).toBe(XP_TABLE.sweep + XP_TABLE.supreme);
  expect(outcome.xp).toBe((XP_TABLE.sweep + XP_TABLE.supreme) * 6);
});

test("two artists sweeping one board both pay, and the sweep plays first in the hit show", () => {
  const board = Array.from({ length: 6 }, () => ["rapper-k", "murder-one", "mic"]);
  board[2][2] = "vinyl";
  const outcome = evaluateBoard(board);
  expect(outcome.wins.filter((w) => w.type === "sweep").map((w) => w.symbol).sort()).toEqual(["murder-one", "rapper-k"]);
  expect(hitSchedule(outcome.wins)[0].win.type).toBe("sweep");
});

test("a sweep earns the Legend Sweep badge once and never adds spins", () => {
  const board = sweepBoard("point-blank");
  const first = applySpin(initialState(), board);
  expect(first.state.badges).toContain("legend-sweep");
  expect(first.state.welcomeLeft).toBe(24);
  const second = applySpin(first.state, board);
  expect(second.state.badges.filter((b) => b === "legend-sweep")).toHaveLength(1);
  expect(second.state.welcomeLeft).toBe(23);
});
