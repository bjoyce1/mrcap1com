// SPC Legends spin packs (owner decisions 2026-11-04): bigger packs give more spins per dollar, the $100 pack is double
// spins, and one player can buy at most $100 of packs per Houston day. Shared by the game page and the checkout and
// capture edge functions; drizzle/migrations/0005_legends_launch.sql holds the same table, keep them in step.

export type SpinPack = { id: string; cents: number; spins: number; label?: string };

export const SPIN_PACKS: readonly SpinPack[] = Object.freeze([
  { id: "p1", cents: 100, spins: 25 },
  { id: "p5", cents: 500, spins: 150, label: "+20% SPINS" },
  { id: "p10", cents: 1000, spins: 350, label: "+40% SPINS" },
  { id: "p25", cents: 2500, spins: 1000, label: "+60% SPINS" },
  { id: "p50", cents: 5000, spins: 2250, label: "+80% SPINS" },
  { id: "p100", cents: 10000, spins: 5000, label: "DOUBLE SPINS" },
]);

export const PACK_CURRENCY = "USD";
export const DAILY_SPEND_CAP_CENTS = 10000;

export const packById = (id: unknown): SpinPack | null => SPIN_PACKS.find((p) => p.id === id) ?? null;

/** PayPal's amount string for a price in cents, e.g. 2500 -> "25.00". */
export const paypalAmount = (cents: number) => (cents / 100).toFixed(2);

/** Extra spins over the $1 rate, as a whole percent (the $5 pack gives 20). */
export const bonusPercent = (p: SpinPack) => Math.round((p.spins / (p.cents / 100) / 25 - 1) * 100);

/** Whether a pack fits under the daily cap after `spentCents` already committed today. */
export const fitsDailyCap = (p: SpinPack, spentCents: number) => spentCents + p.cents <= DAILY_SPEND_CAP_CENTS;
