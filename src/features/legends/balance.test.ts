import { describe, expect, it } from "vitest";
import { activePool, balanceFromRow, totalSpins } from "./balance";

const now = new Date("2026-10-31T19:00:00Z"); // 2026-10-31 in Houston

describe("balanceFromRow", () => {
  it("treats a missing row as a new player with 25 welcome and 3 daily spins", () => {
    expect(balanceFromRow(null, now)).toEqual({ welcomeLeft: 25, dailyLeft: 3, paidSpins: 0 });
  });
  it("counts today's spins only on the same Houston day", () => {
    const row = { welcome_left: 0, paid_spins: 10, spins_today: 2, day: "2026-10-31" };
    expect(balanceFromRow(row, now)).toEqual({ welcomeLeft: 0, dailyLeft: 1, paidSpins: 10 });
    expect(balanceFromRow({ ...row, day: "2026-10-30" }, now).dailyLeft).toBe(3);
    // 04:30 UTC on Nov 1 is still Oct 31 in Houston.
    expect(balanceFromRow(row, new Date("2026-11-01T04:30:00Z")).dailyLeft).toBe(1);
  });
});

describe("activePool", () => {
  it("spends welcome, then today's free spins, then paid spins", () => {
    expect(activePool({ welcomeLeft: 4, dailyLeft: 3, paidSpins: 25 })).toMatchObject({ source: "welcome", count: 4, label: "WELCOME SPINS" });
    expect(activePool({ welcomeLeft: 0, dailyLeft: 2, paidSpins: 25 })).toMatchObject({ source: "daily", count: 2, label: "SPINS TODAY" });
    expect(activePool({ welcomeLeft: 0, dailyLeft: 0, paidSpins: 25 })).toMatchObject({ source: "paid", count: 25, label: "PAID SPINS" });
    expect(activePool({ welcomeLeft: 0, dailyLeft: 0, paidSpins: 0 })).toMatchObject({ source: "none", count: 0 });
  });
  it("adds up every pool", () => {
    expect(totalSpins({ welcomeLeft: 1, dailyLeft: 3, paidSpins: 25 })).toBe(29);
  });
});
