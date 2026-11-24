import { describe, expect, it } from "vitest";
import { readPendingSpin, writePendingSpin } from "./pending-spin";
function storage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  };
}
describe("pending Legends spin recovery", () => {
  it("restores the same request after a new mount and removes it only when cleared", () => {
    const store = storage();
    writePendingSpin(store, "player-a", "request-0001");
    expect(readPendingSpin(store, "player-a")).toBe("request-0001");
    writePendingSpin(store, "player-a", null);
    expect(readPendingSpin(store, "player-a")).toBeNull();
  });
  it("separates accounts and rejects invalid request IDs", () => {
    const store = storage();
    writePendingSpin(store, "player-a", "request-0001");
    expect(readPendingSpin(store, "player-b")).toBeNull();
    writePendingSpin(store, "player-b", "bad!");
    expect(readPendingSpin(store, "player-b")).toBeNull();
    expect(readPendingSpin(store, "player-a")).toBe("request-0001");
  });
  it("does not throw when browser storage is blocked", () => {
    const fail = () => { throw new Error("storage unavailable"); };
    const store = { getItem: fail, setItem: fail, removeItem: fail };
    expect(readPendingSpin(store, "player")).toBeNull();
    expect(() => writePendingSpin(store, "player", "request-0001")).not.toThrow();
    expect(() => writePendingSpin(store, "player", null)).not.toThrow();
  });
});
