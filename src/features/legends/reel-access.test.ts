import { describe, expect, it } from "vitest";
import { eligibleLegends, reelWeights, reelOdds } from "../../../supabase/functions/_shared/legends/reel-access";
import { createBoard, weightedSymbol } from "./engine";
import { createBoard as serverBoard, weightedSymbol as serverSymbol } from "../../../supabase/functions/_shared/legends/engine";
import { ARTISTS, SYMBOL_WEIGHTS } from "./config";

describe("Locked Legend account reels", () => {
  it("gives empty accounts a Mr. CAP starter", () => expect(eligibleLegends({})).toEqual(["mr-cap"]));
  it("retains existing collection and purchased unlock ownership", () => {
    expect(eligibleLegends({ collection: ["k-rino"], unlocks: ["legend-dope-e", "skin-purple-lightning", "legend-invalid"] })).toEqual(["k-rino", "mr-cap", "dope-e"]);
  });
  it("excludes every locked artist for every possible random ticket", () => {
    const allowed = eligibleLegends({});
    const weights = reelWeights(allowed);
    const total = weights.reduce((sum, [, w]) => sum + w, 0);
    for (let ticket = 0; ticket < total; ticket++) {
      const symbol = weightedSymbol(() => ticket, allowed);
      if (ARTISTS.some((a) => a.id === symbol)) expect(symbol).toBe("mr-cap");
      expect(serverSymbol(() => ticket, allowed)).toBe(symbol);
    }
    expect(weights).not.toContainEqual(["k-rino", 10]);
  });
  it("a purchased Legend changes its chance from zero to its normalized weight", () => {
    const before = reelOdds({});
    const after = reelOdds({ unlocks: ["legend-k-rino"] });
    expect(before.some((entry) => entry.id === "k-rino")).toBe(false);
    expect(after.find((entry) => entry.id === "k-rino")?.probability).toBe(10 / 97);
    expect(before.find((entry) => entry.id === "mr-cap")?.probability).toBe(10 / 87);
    expect(after.find((entry) => entry.id === "mr-cap")?.probability).toBe(10 / 97);
  });
  it("client and server produce identical filtered six-by-three boards", () => {
    const allowed = eligibleLegends({ unlocks: ["legend-dope-e"] });
    const board = createBoard(() => 0, allowed);
    expect(serverBoard(() => 0, allowed)).toEqual(board);
    expect(board).toEqual(Array.from({ length: 6 }, () => Array(3).fill("mr-cap")));
  });
  it("guest reels retain all original weights and artists", () => {
    expect(reelWeights()).toEqual(Object.entries(SYMBOL_WEIGHTS));
    expect(createBoard(() => 0).flat()).toEqual(Array(18).fill("k-rino"));
  });
});