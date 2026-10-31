import { beforeEach, describe, expect, it, vi } from "vitest";

const { invoke } = vi.hoisted(() => ({ invoke: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { functions: { invoke } } }));
import { capturePack, paypalClientId, requestSpin, startCheckout } from "./account";

beforeEach(() => invoke.mockReset());

describe("Legends server integration", () => {
  it("creates a pack through the server without browser price or spin overrides", async () => {
    invoke.mockResolvedValue({ data: { orderID: "REAL-ORDER" }, error: null });
    expect(await startCheckout()).toEqual({ orderID: "REAL-ORDER" });
    expect(invoke).toHaveBeenCalledWith("legends-spins-checkout", { body: {} });
  });
  it("uses the approved order and server balance when 25 paid spins stack", async () => {
    invoke.mockResolvedValue({ data: { balance: { welcomeLeft: 10, dailyLeft: 3, paidSpins: 50 } }, error: null });
    expect(await capturePack("APPROVED-ORDER")).toEqual({ balance: { welcomeLeft: 10, dailyLeft: 3, paidSpins: 50 } });
    expect(invoke).toHaveBeenCalledWith("legends-spins-capture", { body: { orderID: "APPROVED-ORDER" } });
  });
  it("retries the same spin key and uses the server outcome", async () => {
    const result = { board: [["cap"]], outcome: { xp: 500 }, balance: { welcomeLeft: 24, dailyLeft: 3, paidSpins: 25 } };
    invoke.mockResolvedValue({ data: result, error: null });
    expect(await requestSpin("same-spin-key")).toBe(result);
    await requestSpin("same-spin-key");
    expect(invoke).toHaveBeenNthCalledWith(2, "legends-spin", { body: { idempotencyKey: "same-spin-key" } });
  });
  it("gets the real configured client ID from the existing endpoint", async () => {
    invoke.mockResolvedValue({ data: { clientId: "configured-client-id" }, error: null });
    expect(await paypalClientId()).toBe("configured-client-id");
    expect(invoke).toHaveBeenCalledWith("paypal-checkout?action=client-id");
  });
  it("never accepts the sb sandbox shim", async () => {
    invoke.mockResolvedValue({ data: { clientId: "sb" }, error: null });
    expect(await paypalClientId()).toBeNull();
  });
  it("requires sign-in before a pack can be created", async () => {
    invoke.mockResolvedValue({ error: { context: new Response(JSON.stringify({ error: "Sign in required" }), { status: 401 }) } });
    expect(await startCheckout()).toEqual({ error: "signed_out" });
  });
});