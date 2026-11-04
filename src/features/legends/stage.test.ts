import { describe, expect, it } from "vitest";
import { celebrationLevel, createStage } from "./stage";
import { evaluateBoard } from "./engine";

describe("celebrationLevel", () => {
  it("is 0 without XP", () => {
    expect(celebrationLevel({ xp: 0, wins: [] })).toBe(0);
  });
  it("is 1 for a standard line", () => {
    expect(celebrationLevel({ xp: 50, wins: [{ type: "line" }] })).toBe(1);
  });
  it("is 1 for Supreme Legendary, which lands on most spins", () => {
    expect(celebrationLevel({ xp: 250, wins: [{ type: "supreme" }] })).toBe(1);
  });
  it("is 2 for Unity, a bonus, a multiplier or a Big Win tier", () => {
    expect(celebrationLevel({ xp: 750, wins: [{ type: "supreme" }, { type: "unity" }] })).toBe(2);
    expect(celebrationLevel({ xp: 100, wins: [{ type: "bonus" }] })).toBe(2);
    expect(celebrationLevel({ xp: 100, wins: [{ type: "line" }, { type: "multiplier" }] })).toBe(2);
    expect(celebrationLevel({ xp: 5000, wins: [{ type: "line" }] })).toBe(2);
  });
  it("is 3 for a Legend Sweep or a LEGENDARY WIN", () => {
    expect(celebrationLevel({ xp: 25250, wins: [{ type: "sweep" }] })).toBe(3);
    expect(celebrationLevel({ xp: 12000, wins: [{ type: "line" }, { type: "multiplier" }] })).toBe(3);
  });
  it("follows the engine's real outcome for a Legend Sweep board", () => {
    const board = Array.from({ length: 6 }, () => ["k-rino", "mic", "vinyl"]);
    expect(celebrationLevel(evaluateBoard(board))).toBe(3);
  });
});

describe("createStage", () => {
  it("walks a spin through every stage and back to idle", () => {
    const el = { dataset: {} as DOMStringMap };
    const stage = createStage(el);
    expect(el.dataset.lgStage).toBe("idle");
    for (const s of ["spin-start", "spinning", "stopping", "evaluating"] as const) expect(stage.set(s)).toBe(true);
    expect(stage.set("celebrating", 2)).toBe(true);
    expect(el.dataset).toMatchObject({ lgStage: "celebrating", lgLevel: "2" });
    expect(stage.set("idle")).toBe(true);
    expect(el.dataset).toMatchObject({ lgStage: "idle", lgLevel: "0" });
  });
  it("ignores out-of-order moves, but a new spin can always start", () => {
    const el = { dataset: {} as DOMStringMap };
    const stage = createStage(el);
    expect(stage.set("celebrating", 3)).toBe(false);
    expect(el.dataset.lgStage).toBe("idle");
    stage.set("spin-start");
    stage.set("spinning");
    expect(stage.set("spin-start")).toBe(true);
    expect(stage.get()).toBe("spin-start");
  });
});
