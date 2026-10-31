// A player's spin balance as the server keeps it (legends_players), and how the HUD shows it. Pure.
import { GAME_CONFIG } from "./config";
import { localDay } from "./engine";

export type Balance = { welcomeLeft: number; dailyLeft: number; paidSpins: number };
export type PlayerRow = { welcome_left: number; paid_spins: number; spins_today: number; day: string } | null;

/** Mirrors the SQL legends_balance(): no row yet means a new player; a past `day` means today's spins reset. */
export function balanceFromRow(row: PlayerRow, now = new Date()): Balance {
  if (!row) return { welcomeLeft: GAME_CONFIG.welcomeSpins, dailyLeft: GAME_CONFIG.dailySpins, paidSpins: 0 };
  const dailyLeft = row.day === localDay(now) ? Math.max(0, GAME_CONFIG.dailySpins - row.spins_today) : GAME_CONFIG.dailySpins;
  return { welcomeLeft: Math.max(0, row.welcome_left), dailyLeft, paidSpins: Math.max(0, row.paid_spins) };
}

export const totalSpins = (b: Balance) => b.welcomeLeft + b.dailyLeft + b.paidSpins;

/** The pool the next spin comes from (welcome, then today's free spins, then paid) and its HUD label. */
export function activePool(b: Balance): { label: string; count: number; source: "welcome" | "daily" | "paid" | "none" } {
  if (b.welcomeLeft > 0) return { label: "WELCOME SPINS", count: b.welcomeLeft, source: "welcome" };
  if (b.dailyLeft > 0) return { label: "SPINS TODAY", count: b.dailyLeft, source: "daily" };
  if (b.paidSpins > 0) return { label: "PAID SPINS", count: b.paidSpins, source: "paid" };
  return { label: "SPINS LEFT", count: 0, source: "none" };
}
