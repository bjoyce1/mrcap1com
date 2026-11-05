import { ARTISTS } from "./config.ts";

// Owner decision 2026-11-05: every Legend is on the reels for every player, signed in or not.
// Owning a Legend (hit on the reels or bought in the Vault) adds its card to your collection; it never changes the odds.
export const STARTER_LEGENDS: readonly string[] = Object.freeze(["mr-cap"]);
export type LegendOwnership = { collection?: readonly string[]; unlocks?: readonly string[] };

/** Legends this account owns: the starter, ones found on the reels, and Vault unlocks, in roster order. */
export function ownedLegends(ownership: LegendOwnership): string[] {
  const owned = new Set([...STARTER_LEGENDS, ...(ownership.collection ?? []), ...(ownership.unlocks ?? []).filter((id: string) => id.startsWith("legend-")).map((id: string) => id.slice(7))]);
  return ARTISTS.filter((artist: { id: string }) => owned.has(artist.id)).map((artist: { id: string }) => artist.id);
}
