import { describe, expect, it } from "vitest";
import { TEMPOS, rateFor } from "./tempo";

const target = (selector: string, stage: string, level = 0) => TEMPOS.find((t) => t.selector === selector)!.ms(stage, level);

describe("tempo", () => {
  it("turns a target loop length into a playback rate", () => {
    expect(rateFor(10000, 2500)).toBe(4);
    expect(rateFor(10000, null)).toBe(1);
  });
  it("speeds the searchlights up while spinning and more for bigger hits", () => {
    expect(target(".lw-beam", "idle")).toBeNull();
    expect(target(".lw-beam", "spinning")).toBe(3400);
    expect(target(".lw-beam", "celebrating", 1)).toBeNull();
    expect(target(".lw-beam", "celebrating", 2)).toBe(1500);
    expect(target(".lw-beam", "celebrating", 3)).toBe(1050);
  });
  it("drives the equalizer with the spin and every hit", () => {
    expect(target(".lw-equalizer i", "stopping")).toBe(550);
    expect(target(".lw-equalizer i", "celebrating", 1)).toBe(320);
  });
});
