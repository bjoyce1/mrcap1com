import { expect, it } from "vitest";
import { confirmedSpendCents, type SpendPurchase } from "./spend-history";
it("counts only server-confirmed USD purchases, not pending or failed orders", () => {
  const row: SpendPurchase = { id: "1", item_id: "skin-purple-lightning", amount_cents: 99, currency: "USD", status: "paid", created_at: "2026-11-05", paid_at: null, paypal_order_id: "ORDER" };
  expect(confirmedSpendCents([row, { ...row, id: "2", status: "created" }, { ...row, id: "3", status: "failed" }])).toBe(99);
  expect(confirmedSpendCents([row, { ...row, id: "4" }])).toBe(198);
});