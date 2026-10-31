/** Request PayPal's hosted debit and credit checkout alongside its wallet button. */
export function legendsPayPalSdkUrl(clientId: string): string {
  const params = new URLSearchParams({
    "client-id": clientId,
    currency: "USD",
    intent: "capture",
    components: "buttons",
    "enable-funding": "card",
  });
  return `https://www.paypal.com/sdk/js?${params}`;
}

// Card funding is supported in the vertical stack; PayPal determines buyer eligibility.
export const legendsPayPalButtonStyle = {
  layout: "vertical",
  color: "gold",
  shape: "pill",
  label: "pay",
  tagline: false,
  height: 42,
} as const;