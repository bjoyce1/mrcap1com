import { paypalClientId } from "./account";

export type StorePayPalButtons = { render: (element: HTMLElement) => Promise<void>; close: () => Promise<void> };
export type StorePayPal = { Buttons: (options: Record<string, unknown>) => StorePayPalButtons };
let sdkPromise: Promise<StorePayPal> | null = null;

export const approvedOrderKey = (userId: string) => `legends-approved-order:${userId}`;
export function readApprovedOrder(userId: string): string | null {
  try { return localStorage.getItem(approvedOrderKey(userId)); } catch { return null; }
}
export function saveApprovedOrder(userId: string, orderID: string | null) {
  try {
    if (orderID) localStorage.setItem(approvedOrderKey(userId), orderID);
    else localStorage.removeItem(approvedOrderKey(userId));
  } catch { /* Capture works even when browser storage is unavailable. */ }
}

export async function loadStorePayPal(): Promise<StorePayPal> {
  const existing = (window as unknown as { legendsStorePayPal?: StorePayPal }).legendsStorePayPal;
  if (existing) return existing;
  sdkPromise ??= (async () => {
    const clientId = await paypalClientId();
    if (!clientId) throw new Error("PayPal is unavailable. Please try again later.");
    return new Promise<StorePayPal>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=USD&intent=capture&components=buttons`;
      script.setAttribute("data-namespace", "legendsStorePayPal");
      script.async = true;
      script.onload = () => {
        const sdk = (window as unknown as { legendsStorePayPal?: StorePayPal }).legendsStorePayPal;
        if (sdk) resolve(sdk); else reject(new Error("PayPal could not load."));
      };
      script.onerror = () => { script.remove(); reject(new Error("PayPal could not load. Check your connection and try again.")); };
      document.body.appendChild(script);
    });
  })();
  try { return await sdkPromise; } catch (error) { sdkPromise = null; throw error; }
}