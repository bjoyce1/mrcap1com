import { admin, corsHeaders, json, requireUser } from "../_shared/legends/http.ts";
import { DAILY_SPEND_CAP_CENTS, PACK_CURRENCY, fitsDailyCap, packById, paypalAmount } from "../_shared/legends/packs.ts";
import { getPaypalAccessToken, paypalBaseUrl } from "../_shared/paypal.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const userId = await requireUser(req);
  if (!userId) return json({ error: "Sign in required" }, 401);

  // Feature flag: nothing is charged unless the owner turns sales on.
  if (Deno.env.get("LEGENDS_PAYMENTS_ENABLED") !== "true") {
    return json({ error: "Spin packs are not on sale yet" }, 503);
  }

  // The buyer picks a pack by id; its price and spin count come from packs.ts, never from the request.
  const pack = packById((await req.json().catch(() => null))?.pack ?? "p1");
  if (!pack) return json({ error: "Unknown spin pack" }, 400);

  try {
    // At most $100 of packs per player per Houston day (paid today plus checkouts still open).
    const { data: spent, error: spentError } = await admin().rpc("legends_spent_today", { _user: userId });
    if (spentError) throw spentError;
    if (!fitsDailyCap(pack, Number(spent ?? 0))) {
      return json({ error: "Daily spin pack limit reached", capCents: DAILY_SPEND_CAP_CENTS, spentCents: Number(spent ?? 0) }, 429);
    }

    const token = await getPaypalAccessToken();
    const res = await fetch(`${paypalBaseUrl()}/v2/checkout/orders`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          description: `SPC Legends: ${pack.spins.toLocaleString("en-US")} spins`,
          custom_id: `legends:${userId}`,
          amount: { currency_code: PACK_CURRENCY, value: paypalAmount(pack.cents) },
        }],
        application_context: { shipping_preference: "NO_SHIPPING", brand_name: "Mr. CAP Legacy" },
      }),
    });
    const order = await res.json();
    if (!res.ok || !order.id) {
      console.error("PayPal order failed", res.status, order);
      return json({ error: "Could not start checkout" }, 502);
    }

    const { error } = await admin().from("legends_spin_purchases").insert({
      user_id: userId, paypal_order_id: order.id, pack: pack.id, amount_cents: pack.cents, spins: pack.spins, status: "created",
    });
    if (error) throw error;

    return json({ orderID: order.id });
  } catch (e) {
    console.error("legends-spins-checkout failed", e);
    return json({ error: "Could not start checkout" }, 500);
  }
});
