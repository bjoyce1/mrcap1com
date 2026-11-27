import { ARTISTS, GAME_CONFIG, PAYLINES } from "@/features/legends/config";
import { layersFor } from "@/features/legends/layers";

/**
 * Shared figures and artwork for the homepage SPC Legends showcase. Kept apart from the component
 * so the numbers can be checked without rendering anything.
 */

/**
 * The card art a symbol shows on the homepage board: the layered cut while it matches today's
 * portrait, otherwise the flat reel tile. Presentation only, never the game's own reel output.
 */
export const cardFor = (id: string) =>
  layersFor(id)?.rest ?? `/games/spc-legends/symbols/${id}.webp`;

/** Three reels of a six reel board, with a matched middle row so the win line reads at a glance. */
export const BOARD: string[][] = [
  ["k-rino", "klondike-kat", "point-blank"],
  ["mr-cap", "mr-cap", "mr-cap"],
  ["k-water", "cl-che", "vinyl"],
];

/** Figures the section shows, all read from the game's own config so the copy cannot drift. */
export const LEGENDS_STATS = [
  { label: "Legends", value: String(ARTISTS.length) },
  { label: "Reels", value: String(GAME_CONFIG.reels) },
  { label: "Paylines", value: String(PAYLINES.length) },
  { label: "Free Spins", value: GAME_CONFIG.welcomeSpins.toLocaleString("en-US") },
];

/** Where the two calls to action lead. */
export const LEGENDS_LINKS = {
  play: "/legends",
  rewards: "/legends/rewards",
};
