import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { paypalClientId } from "./account";
import { legendsPayPalSdkUrl, legendsPayPalButtonStyle } from "./paypal-options";
import type { VaultItem, VaultState } from "./vault";

type PayPalButtons = { render: (el: HTMLElement) => Promise<void>; close: () => Promise<void> };
type Namespace = { Buttons: (options: Record<string, unknown>) => PayPalButtons };
const namespace = () => (window as unknown as { legendsPayPal?: Namespace }).legendsPayPal;
let sdk: Promise<Namespace | null> | null = null;
function loadSdk() {
  if (namespace()) return Promise.resolve(namespace() ?? null);
  sdk ??= (async () => {
    const id = await paypalClientId();
    if (!id) return null;
    return new Promise<Namespace | null>((resolve) => {
      const script = document.createElement("script");
      script.src = legendsPayPalSdkUrl(id);
      script.setAttribute("data-namespace", "legendsPayPal");
      script.onload = () => resolve(namespace() ?? null);
      script.onerror = () => { sdk = null; resolve(null); };
      document.body.appendChild(script);
    });
  })();
  return sdk;
}

export default function VaultCheckout({ item, userId, onPaid, onClose }: { item: VaultItem; userId: string; onPaid: (state: VaultState) => void; onClose: () => void }) {
  const container = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("Loading secure checkout...");
  const [pending, setPending] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const confirming = useRef(false);
  const approval = useRef<string | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    supabase.from("legends_vault_purchases").select("paypal_order_id").eq("user_id", userId).eq("item_id", item.id).eq("status", "created").maybeSingle().then(({ data, error }) => {
      if (!active) return;
      if (error) { setMessage("Checkout history could not load. Close and try again."); return; }
      setPending(data?.paypal_order_id ?? null);
      setReady(true);
    });
    return () => { active = false; };
  }, [item.id, userId]);

  async function confirm(orderID: string) {
    if (confirming.current) return;
    confirming.current = true; approval.current = orderID; setPending(orderID); setBusy(true);
    setMessage("Confirming payment...");
    try {
      const { data, error } = await supabase.functions.invoke("legends-vault-capture", { body: { orderID } });
      if (error || !data?.unlocks?.includes(item.id)) throw new Error("Unconfirmed");
      setPending(null); approval.current = null;
      onPaid(data as VaultState);
    } catch {
      setMessage("Payment is not confirmed. Retry confirmation before paying again. If charged, do not pay again.");
    } finally { setBusy(false); confirming.current = false; }
  }

  useEffect(() => {
    if (!ready) return;
    let active = true;
    let buttons: PayPalButtons | null = null;
    loadSdk().then(async (paypal) => {
      if (!active || !container.current) return;
      if (!paypal) { setMessage("PayPal could not load. Close and try again."); return; }
      buttons = paypal.Buttons({
        style: legendsPayPalButtonStyle,
        onClick: (_data: unknown, actions: { resolve: () => void; reject: () => void }) => confirming.current || approval.current ? actions.reject() : actions.resolve(),
        createOrder: async () => {
          const { data, error } = await supabase.functions.invoke("legends-vault-checkout", { body: { itemId: item.id } });
          if (error || !data?.orderID) { setMessage("Checkout could not start. You may already own this item. Close and try again."); throw new Error("Checkout failed"); }
          setPending(data.orderID);
          return data.orderID;
        },
        onApprove: async (data: { orderID: string }) => { if (active) await confirm(data.orderID); },
        onCancel: () => { if (active) setMessage("Checkout cancelled. No item unlocked. You can resume this order below."); },
        onError: () => { if (active) setMessage("PayPal could not finish. Check payment confirmation before paying again."); },
      });
      await buttons.render(container.current).catch(() => { if (active) setMessage("PayPal could not load. Close and try again."); });
      if (active) setMessage("$0.99 USD. Your XP and coins will not be spent.");
      else await buttons.close().catch(() => undefined);
    });
    return () => { active = false; void buttons?.close().catch(() => undefined); };
  }, [ready, item.id]);

  return <section className="bg-card rounded-lg p-6 space-y-4" aria-label={`Checkout for ${item.name}`}>
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-serif text-2xl">{item.name} · $0.99</h2><Button variant="secondary" disabled={busy} onClick={onClose}>Close</Button></div>
    <p role="status" className="text-sm text-muted-foreground">{message}</p>
    <div ref={container} className="max-w-sm min-h-24" />
    {pending && <Button variant="secondary" disabled={busy} onClick={() => confirm(pending)}>{busy ? "Confirming..." : "Retry payment confirmation"}</Button>}
  </section>;
}