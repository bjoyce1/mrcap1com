import { z } from "npm:zod@3";
import { admin, corsHeaders, json, requireUser, PACK_AMOUNT, PACK_CURRENCY } from "../_shared/legends/http.ts";
import { getPaypalAccessToken, paypalBaseUrl } from "../_shared/paypal.ts";

const Body = z.object({ orderID: z.string().min(5).max(64).regex(/^[A-Za-z0-9-]+$/) });

// deno-lint-ignore no-explicit-any
function check(order: any, userId: string): { ok: boolean; captureId: string | null } {
  const unit = order?.purchase_units?.[0];
  const cap = unit?.payments?.captures?.[0];
  const ok = order?.status === "COMPLETED" &&
    unit?.custom_id === `legends:${userId}` &&
    cap?.status === "COMPLETED" &&
    cap?.amount?.currency_code === PACK_CURRENCY &&
    cap?.amount?.value === PACK_AMOUNT;
  return { ok, captureId: cap?.id ?? null };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const userId = await requireUser(req);
  if (!userId) return json({ error: "Sign in required" }, 401);

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ error: "orderID is required" }, 400);
  const orderID = parsed.data.orderID;

  const db = admin();
  try {
    const { data: row } = await db.from("legends_spin_purchases")
      .select("status").eq("paypal_order_id", orderID).eq("user_id", userId).maybeSingle();
    if (!row) return json({ error: "Order not found" }, 404);

    const balance = async () => (await db.rpc("legends_balance", { _user: userId })).data;
    if (row.status === "paid") return json({ balance: await balance() });
    if (row.status !== "created") return json({ error: "Order is not payable" }, 409);

    const token = await getPaypalAccessToken();
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
    const res = await fetch(`${paypalBaseUrl()}/v2/checkout/orders/${orderID}/capture`, { method: "POST", headers });
    let order = await res.json();
    if (!res.ok) {
      const already = order?.details?.some((d: { issue?: string }) => d.issue === "ORDER_ALREADY_CAPTURED");
      if (!already) {
        console.error("PayPal capture failed", res.status, order);
        return json({ error: "Payment was not completed" }, 402);
      }
      const get = await fetch(`${paypalBaseUrl()}/v2/checkout/orders/${orderID}`, { headers });
      order = await get.json();
    }

    const { ok, captureId } = check(order, userId);
    if (!ok) {
      await db.from("legends_spin_purchases").update({ status: "failed" })
        .eq("paypal_order_id", orderID).eq("user_id", userId).eq("status", "created");
      console.error("Legends capture verification failed", orderID);
      return json({ error: "Payment could not be verified" }, 402);
    }

    const { data, error } = await db.rpc("legends_credit_purchase", {
      _user: userId, _order: orderID, _capture: captureId,
    });
    if (error) throw error;
    return json({ balance: (data as { balance: unknown }).balance });
  } catch (e) {
    console.error("legends-spins-capture failed", e);
    return json({ error: "Capture failed" }, 500);
  }
});
