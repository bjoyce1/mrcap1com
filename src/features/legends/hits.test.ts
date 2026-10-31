import { describe, expect, it } from "vitest";
import { evaluateBoard } from "./engine";
import { hitSchedule, isArtist, type HitWin } from "./hits";

const line = (payline: number, xp: number, cells: string[], symbol = "k-rino"): HitWin => ({ type: "line", payline, xp, symbol, count: cells.length, cells });

describe("hitSchedule", () => {
  it("celebrates Unity, then the 713 Bonus, then lines by XP", () => {
    const wins: HitWin[] = [
      line(1, 50, ["0:1", "1:1", "2:1"]),
      { type: "bonus", xp: 300, count: 3, cells: ["4:0", "0:2", "2:2"] },
      line(4, 150, ["0:0", "1:1", "2:2", "3:2"]),
      { type: "unity", xp: 2000, cells: ["0:1", "1:1", "2:1", "3:1", "4:1", "5:1"] },
    ];
    expect(hitSchedule(wins).map((s) => s.win.type + (s.win.payline ?? ""))).toEqual(["unity", "bonus", "line4", "line1"]);
  });

  it("keeps payline order for equal XP and caps the number of steps", () => {
    const wins = [line(9, 50, ["0:0", "1:0", "2:0"]), line(2, 50, ["0:1", "1:1", "2:1"]), line(3, 50, ["0:2", "1:2", "2:2"])];
    const steps = hitSchedule(wins, { maxWins: 2, perWin: 1000 });
    expect(steps.map((s) => s.win.payline)).toEqual([9, 2]);
    expect(steps.map((s) => s.start)).toEqual([0, 1000]);
  });

  it("pops cells left to right with a per reel delay", () => {
    const [step] = hitSchedule([{ type: "bonus", xp: 300, count: 3, cells: ["5:1", "1:0", "3:2"] }], { cellStagger: 100 });
    expect(step.cells.map((c) => c.key)).toEqual(["1:0", "3:2", "5:1"]);
    expect(step.cells.map((c) => c.delay)).toEqual([0, 200, 400]);
  });

  it("schedules exactly the cells the engine reports", () => {
    const board = Array.from({ length: 6 }, () => ["mic", "mixer", "headphones"]);
    for (let i = 0; i < 4; i++) board[i][1] = "mr-cap";
    const outcome = evaluateBoard(board);
    const steps = hitSchedule(outcome.wins);
    // The top row is six microphones (750 XP), so it plays before the 4x Mr. CAP line (150 XP).
    expect(steps[0].win).toMatchObject({ symbol: "mic", count: 6 });
    const capStep = steps.find((s) => s.win.symbol === "mr-cap")!;
    expect(capStep.cells.map((c) => c.key)).toEqual(["0:1", "1:1", "2:1", "3:1"]);
    expect(isArtist("mr-cap")).toBe(true);
    expect(isArtist("wild")).toBe(false);
  });

  it("returns nothing for a losing spin", () => {
    expect(hitSchedule([])).toEqual([]);
  });
});
