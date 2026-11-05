// Shared Vault catalog: real-money items and coin-only songs.
// The client imports this same file, so prices can never drift between browser and server.
import { ARTISTS } from "./config.ts";

export type VaultKind = "legend" | "skin" | "title" | "song";
export type VaultItem = { id: string; kind: VaultKind; name: string; cost: number; priceCents?: number; artist?: string; detail: string };
export const VAULT_PRICE_CENTS = 99;

export const LEGEND_UNLOCK_COST = 2000;
export const SONG_UNLOCK_COST = 1500;

const SONGS = [
  "Ties That Bind Us", "Respect", "Come Get It If You Want It", "Bet'n On Me", "So Thankful",
  "New Better Do Better", "Eternal Legacy", "Lips N Hips", "If I Say So", "Something You're Not",
  "Letter to Me", "Nobody Comes Close", "A.C. Chill", "The Coalition",
];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const VAULT: readonly VaultItem[] = Object.freeze([
  ...ARTISTS.map((a: { id: string; name: string }) => ({
    id: `legend-${a.id}`, kind: "legend" as const, name: a.name, cost: LEGEND_UNLOCK_COST, priceCents: VAULT_PRICE_CENTS, artist: a.id,
    detail: "Unlocks this Legend for your account reels. All eligible Legends share equal symbol weight; adding one changes the odds.",
  })),
  { id: "skin-purple-lightning", kind: "skin", name: "Purple Lightning", cost: 5000, priceCents: VAULT_PRICE_CENTS, detail: "Violet storm glow around the cabinet." },
  { id: "skin-diamond-ice", kind: "skin", name: "Diamond Ice", cost: 7500, priceCents: VAULT_PRICE_CENTS, detail: "Frosted cyan cabinet with diamond sparkle." },
  { id: "skin-houston-chrome", kind: "skin", name: "Houston Chrome", cost: 10000, priceCents: VAULT_PRICE_CENTS, detail: "Candy red chrome, slab style." },
  { id: "title-third-coast-rider", kind: "title", name: "Third Coast Rider", cost: 1000, priceCents: VAULT_PRICE_CENTS, detail: "Player title on your cabinet." },
  { id: "title-south-park-original", kind: "title", name: "South Park Original", cost: 3000, priceCents: VAULT_PRICE_CENTS, detail: "Player title on your cabinet." },
  { id: "title-coalition-captain", kind: "title", name: "Coalition Captain", cost: 6000, priceCents: VAULT_PRICE_CENTS, detail: "Player title on your cabinet." },
  { id: "title-houston-royalty", kind: "title", name: "Houston Royalty", cost: 15000, priceCents: VAULT_PRICE_CENTS, detail: "Player title on your cabinet." },
  ...SONGS.map((t) => ({
    id: `song-${slug(t)}`, kind: "song" as const, name: t, cost: SONG_UNLOCK_COST,
    detail: "Replay this album track anytime in the Vault.",
  })),
]);

export const vaultItem = (id: string) => VAULT.find((i) => i.id === id) ?? null;
