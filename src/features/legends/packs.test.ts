import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DAILY_SPEND_CAP_CENTS, SPIN_PACKS, bonusPercent, fitsDailyCap, packById, paypalAmount } from "../../../supabase/functions/_shared/legends/packs";

describe("spin packs", () => {
  it("runs $1, $5, $10, $25, $50, $100 with more spins per dollar at every step", () => {
    expect(SPIN_PACKS.map((p) => p.cents)).toEqual([100, 500, 1000, 2500, 5000, 10000]);
    expect(SPIN_PACKS.map((p) => p.spins)).toEqual([25, 150, 350, 1000, 2250, 5000]);
    const perDollar = SPIN_PACKS.map((p) => p.spins / (p.cents / 100));
    perDollar.slice(1).forEach((rate, i) => expect(rate).toBeGreaterThan(perDollar[i]));
    expect(SPIN_PACKS.map(bonusPercent)).toEqual([0, 20, 40, 60, 80, 100]);
  });
  it("matches the database's allowed packs exactly", () => {
    const sql = readFileSync(new URL("../../../drizzle/migrations/0005_legends_launch.sql", import.meta.url), "utf8");
    const allowed = [...sql.matchAll(/\('(p\d+)', (\d+), (\d+)\)/g)].map(([, id, cents, spins]) => ({ id, cents: +cents, spins: +spins }));
    expect(allowed).toEqual(SPIN_PACKS.map(({ id, cents, spins }) => ({ id, cents, spins })));
  });
  it("prices for PayPal and looks packs up by id only", () => {
    expect(paypalAmount(2500)).toBe("25.00");
    expect(packById("p50")?.spins).toBe(2250);
    expect(packById("p999")).toBeNull();
    expect(packById({ cents: 1 })).toBeNull();
  });
  it("caps spending at $100 a Houston day", () => {
    expect(DAILY_SPEND_CAP_CENTS).toBe(10000);
    expect(fitsDailyCap(packById("p100")!, 0)).toBe(true);
    expect(fitsDailyCap(packById("p1")!, 9900)).toBe(true);
    expect(fitsDailyCap(packById("p1")!, 10000)).toBe(false);
    expect(fitsDailyCap(packById("p50")!, 5100)).toBe(false);
  });
});
