import { describe, expect, it } from "vitest";
import { ARTISTS } from "./config";
import { VAULT, coinsFor, isOwned, vaultSongUrl } from "./vault";

describe("Legends Vault", () => {
  it("spending coins never lowers XP: coins are XP minus spent, floored at 0", () => {
    expect(coinsFor(5000, 2000)).toBe(3000);
    expect(coinsFor(100, 500)).toBe(0);
  });
  it("offers every Legend at $0.99 USD", () => {
    const legends = VAULT.filter((i) => i.kind === "legend");
    expect(legends.map((i) => i.artist).sort()).toEqual(ARTISTS.map((a) => a.id).sort());
    expect(legends.map((i) => i.priceCents)).toEqual(ARTISTS.map(() => 99));
  });
  it("prices every skin at $0.99 USD", () => {
    expect(VAULT.filter((i) => i.kind === "skin").map((i) => i.priceCents)).toEqual([99, 99, 99]);
  });
  it("prices every title at $0.99 USD", () => {
    expect(VAULT.filter((i) => i.kind === "title").map((i) => i.priceCents)).toEqual([99, 99, 99, 99]);
  });
  it("keeps songs purchasable with earned coins", () => {
    for (const item of VAULT.filter((i) => i.kind === "song")) {
      expect(item.priceCents).toBeUndefined();
      expect(item.cost).toBe(1500);
    }
  });
  it("never sells spins", () => {
    expect(VAULT.some((i) => /spin/i.test(i.id))).toBe(false);
  });
  it("treats a Legend already found on the reels as owned", () => {
    const item = VAULT.find((i) => i.artist === ARTISTS[0].id);
    if (!item) throw new Error("Missing Legend");
    expect(isOwned(item, { unlocks: [], collection: [ARTISTS[0].id] })).toBe(true);
    expect(isOwned(item, { unlocks: [], collection: [] })).toBe(false);
  });
  it("every song unlock plays a real album file", () => {
    for (const s of VAULT.filter((i) => i.kind === "song")) expect(vaultSongUrl(s.name)).toMatch(/\.mp3$/);
  });
  it("has unique ids", () => {
    expect(new Set(VAULT.map((i) => i.id)).size).toBe(VAULT.length);
  });
});
