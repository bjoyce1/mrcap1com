import { describe, expect, it } from "vitest";
import { ARTISTS } from "./config";
import { VAULT, coinsFor, isOwned, vaultSongUrl } from "./vault";

describe("Legends Vault", () => {
  it("spending coins never lowers XP: coins are XP minus spent, floored at 0", () => {
    expect(coinsFor(5000, 2000)).toBe(3000);
    expect(coinsFor(100, 500)).toBe(0);
  });
  it("offers every Legend at 2,000 coins", () => {
    const legends = VAULT.filter((i) => i.kind === "legend");
    expect(legends.map((i) => i.artist).sort()).toEqual(ARTISTS.map((a) => a.id).sort());
    expect(legends.every((i) => i.cost === 2000)).toBe(true);
  });
  it("never sells spins", () => {
    expect(VAULT.some((i) => /spin/i.test(i.id))).toBe(false);
  });
  it("treats a Legend already found on the reels as owned", () => {
    const item = VAULT.find((i) => i.artist === ARTISTS[0].id)!;
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
