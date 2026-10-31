import { describe, expect, it } from "vitest";
import { legendsPayPalButtonStyle, legendsPayPalSdkUrl } from "./paypal-options";

describe("Legends PayPal card checkout", () => {
  it("requests card funding with the configured client ID and USD capture", () => {
    const url = new URL(legendsPayPalSdkUrl("configured-client-id"));
    expect(url.searchParams.get("enable-funding")).toBe("card");
    expect(url.searchParams.get("client-id")).toBe("configured-client-id");
    expect(url.searchParams.get("currency")).toBe("USD");
    expect(url.searchParams.get("intent")).toBe("capture");
  });
  it("uses a vertical stack to support the debit and credit funding button", () => {
    expect(legendsPayPalButtonStyle.layout).toBe("vertical");
  });
});