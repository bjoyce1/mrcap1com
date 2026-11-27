import { describe, expect, it } from "vitest";
import { ARTISTS, GAME_CONFIG, PAYLINES } from "@/features/legends/config";
import {
  BOARD,
  LEGENDS_LINKS,
  LEGENDS_STATS,
  cardFor,
} from "./legends-showcase.data";

describe("homepage SPC Legends showcase", () => {
  it("reads its figures from game config so the homepage cannot go stale", () => {
    expect(LEGENDS_STATS).toEqual([
      { label: "Legends", value: String(ARTISTS.length) },
      { label: "Reels", value: String(GAME_CONFIG.reels) },
      { label: "Paylines", value: String(PAYLINES.length) },
      { label: "Free Spins", value: GAME_CONFIG.welcomeSpins.toLocaleString("en-US") },
    ]);
  });

  it("shows the welcome and daily spin figures the owner set", () => {
    const freeSpins = LEGENDS_STATS.find((stat) => stat.label === "Free Spins")?.value;
    expect(freeSpins).toBe("1,000");
    expect(GAME_CONFIG.dailySpins).toBe(20);
  });

  it("links the calls to action to the game and its rewards page", () => {
    expect(LEGENDS_LINKS).toEqual({ play: "/legends", rewards: "/legends/rewards" });
  });

  it("has artwork for every symbol on the preview board and in the roster", () => {
    const symbols = new Set(BOARD.flat());
    for (const artist of ARTISTS) symbols.add(artist.id);
    for (const id of symbols) {
      expect(cardFor(id), `missing artwork for ${id}`).toMatch(/^\/games\/spc-legends\//);
    }
  });
});
