import { describe, expect, it } from "vitest";
import { isSellableVariant } from "./catalog";

describe("isSellableVariant", () => {
  it("offers active Printful variants", () => {
    expect(isSellableVariant({ is_ignored: false, availability_status: "active" })).toBe(true);
  });

  it("keeps variants when older Printful responses omit availability", () => {
    expect(isSellableVariant({ is_ignored: false })).toBe(true);
  });

  it("does not offer the temporarily out of stock black SPC bucket hat", () => {
    expect(isSellableVariant({ is_ignored: false, availability_status: "temporary_out_of_stock" })).toBe(false);
  });

  it("does not offer ignored variants", () => {
    expect(isSellableVariant({ is_ignored: true, availability_status: "active" })).toBe(false);
  });
});
