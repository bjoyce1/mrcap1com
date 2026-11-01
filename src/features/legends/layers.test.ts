import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ARTISTS } from "./config";
import manifest from "./layers.json";
import { layersFor } from "./layers";

describe("Legend layers", () => {
  it("are cut from every Legend's current portrait", () => {
    // Fails after a portrait changes in Lovable: run `py -3 scripts/legends-layers.py <id>` to cut new layers.
    for (const a of ARTISTS) expect(layersFor(a.id), a.id).not.toBeNull();
  });

  it("ship all three images for each Legend", () => {
    for (const e of Object.values(manifest))
      for (const f of ["bg", "char", "plate"]) expect(existsSync(`public/games/spc-legends/layers/${e.dir}/${f}.webp`), `${e.dir}/${f}`).toBe(true);
  });

  it("are skipped when the portrait no longer matches", () => {
    const entries = { "k-rino": { asset: "old", dir: "k-rino.old", slam: true, split: 0.7 } };
    expect(layersFor("k-rino", entries, new Map([["k-rino", "new"]]))).toBeNull();
    expect(layersFor("k-rino", entries, new Map([["k-rino", "old"]]))).toEqual({
      bg: "/games/spc-legends/layers/k-rino.old/bg.webp",
      char: "/games/spc-legends/layers/k-rino.old/char.webp",
      plate: "/games/spc-legends/layers/k-rino.old/plate.webp",
      slam: true,
      split: 0.7,
    });
  });

  it("place the plate's top where the character is cut", () => {
    for (const e of Object.values(manifest)) {
      expect(e.split).toBeGreaterThan(0.6);
      expect(e.split).toBeLessThan(0.8);
    }
  });
});
