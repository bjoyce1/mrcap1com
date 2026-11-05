import { describe, it, expect } from "vitest";
import { verifiedVaultCapture, type VaultPayment } from "../../../supabase/functions/_shared/legends/vault-payment";
const payment = (): VaultPayment => ({ status: "COMPLETED", purchase_units: [{ custom_id: "vault:purchase-1", payments: { captures: [{ id: "CAPTURE1", status: "COMPLETED", amount: { currency_code: "USD", value: "0.99" } }] } }] });
describe("Vault payment verification", () => {
  it("accepts a completed $0.99 USD purchase", () => expect(verifiedVaultCapture(payment(), "purchase-1", 99)).toBe("CAPTURE1"));
  it("rejects a different purchase owner binding", () => expect(verifiedVaultCapture(payment(), "another-purchase", 99)).toBeNull());
  it("rejects a different paid amount", () => expect(verifiedVaultCapture(payment(), "purchase-1", 100)).toBeNull());
  it("rejects an uncompleted payment", () => expect(verifiedVaultCapture({ ...payment(), status: "APPROVED" }, "purchase-1", 99)).toBeNull());
  it("rejects a non-USD capture", () => {
    const p = payment();
    const amount = p.purchase_units?.[0].payments?.captures?.[0].amount;
    if (!amount) throw new Error("Missing amount");
    amount.currency_code = "EUR";
    expect(verifiedVaultCapture(p, "purchase-1", 99)).toBeNull();
  });
});