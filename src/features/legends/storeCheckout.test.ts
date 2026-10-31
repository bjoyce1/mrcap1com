import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("./account", () => ({ paypalClientId: vi.fn() }));
import { approvedOrderKey, readApprovedOrder, saveApprovedOrder } from "./storeCheckout";

beforeEach(() => {
  const entries = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => entries.get(key) ?? null,
    setItem: (key: string, value: string) => entries.set(key, value),
    removeItem: (key: string) => entries.delete(key),
  });
});

describe("approved payment recovery", () => {
  it("keeps the approved order separate for each signed-in buyer", () => {
    saveApprovedOrder("buyer-one", "ORDER-ONE");
    expect(readApprovedOrder("buyer-one")).toBe("ORDER-ONE");
    expect(readApprovedOrder("buyer-two")).toBeNull();
    expect(approvedOrderKey("buyer-one")).toBe("legends-approved-order:buyer-one");
  });
  it("clears an order only when confirmation succeeds", () => {
    saveApprovedOrder("buyer", "APPROVED");
    expect(readApprovedOrder("buyer")).toBe("APPROVED");
    saveApprovedOrder("buyer", null);
    expect(readApprovedOrder("buyer")).toBeNull();
  });
});