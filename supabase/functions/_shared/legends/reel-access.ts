import { ARTISTS, SYMBOL_WEIGHTS } from "./config.ts";

// Default account starter until the owner supplies a different starting roster.
export const STARTER_LEGENDS: readonly string[] = Object.freeze(["mr-cap"]);
export type ReelOwnership = { collection?: readonly string[]; unlocks?: readonly string[] };

export function eligibleLegends(ownership: ReelOwnership): string[] {
  const owned = new Set([...STARTER_LEGENDS, ...(ownership.collection ?? []), ...(ownership.unlocks ?? []).filter((id: string) => id.startsWith("legend-")).map((id: string) => id.slice(7))]);
  return ARTISTS.filter((artist: { id: string }) => owned.has(artist.id)).map((artist: { id: string }) => artist.id);
}

/** Omitted access means the unchanged full-roster guest demo. */
export function reelWeights(allowedArtists?: readonly string[]): [string, number][] {
  const artistIds = new Set(ARTISTS.map((artist: { id: string }) => artist.id));
  const allowed = allowedArtists === undefined ? null : new Set(allowedArtists);
  return Object.entries(SYMBOL_WEIGHTS).filter(([id]: [string, number]) => !artistIds.has(id) || allowed === null || allowed.has(id));
}

export function reelOdds(ownership: ReelOwnership): { id: string; probability: number }[] {
  const weights = reelWeights(eligibleLegends(ownership));
  const total = weights.reduce((sum: number, [, weight]: [string, number]) => sum + weight, 0);
  return weights.map(([id, weight]: [string, number]) => ({ id, probability: weight / total }));
}