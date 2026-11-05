import { describe, expect, it } from "vitest";
import { ownedLegends } from "../../../supabase/functions/_shared/legends/reel-access";
import { createBoard, weightedSymbol } from "./engine";
import { createBoard as serverBoard, weightedSymbol as serverSymbol } from "../../../supabase/functions/_shared/legends/engine";
import { ARTISTS, SYMBOL_WEIGHTS } from "./config";

describe("Legend ownership and reels", () => {
  it("gives empty accounts a Mr. CAP starter card", () => expect(ownedLegends({})).toEqual(["mr-cap"]));
  it("combines Legends found on the reels with Vault unlocks", () => {
    expect(ownedLegends({ collection: ["k-rino"], unlocks: ["legend-dope-e", "skin-purple-lightning", "legend-invalid"] })).toEqual(["k-rino", "mr-cap", "dope-e"]);
  });
  it("puts every Legend on the reels with its full weight, on client and server alike", () => {
    const total = Object.values(SYMBOL_WEIGHTS).reduce((sum, w) => sum + w, 0);
    const seen = new Set<string>();
    for (let ticket = 0; ticket < total; ticket++) {
      const symbol = weightedSymbol(() => ticket);
      expect(serverSymbol(() => ticket)).toBe(symbol);
      seen.add(symbol);
    }
    for (const artist of ARTISTS) expect(seen.has(artist.id)).toBe(true);
    expect(serverBoard(() => 0)).toEqual(createBoard(() => 0));
  });
});
