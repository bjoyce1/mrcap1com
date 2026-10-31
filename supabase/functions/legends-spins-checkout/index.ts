import { admin, corsHeaders, json, requireUser, PACK_AMOUNT, PACK_CURRENCY } from "../_shared/legends/http.ts";
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

  try {
    // Price and spin count are fixed here; the request body is ignored.
    const token = await getPaypalAccessToken();
    const res = await fetch(`${paypalBaseUrl()}/v2/checkout/orders`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          description: "SPC Legends: 25 spins",
          custom_id: `legends:${userId}`,
          amount: { currency_code: PACK_CURRENCY, value: PACK_AMOUNT },
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
      user_id: userId, paypal_order_id: order.id, amount_cents: 100, spins: 25, status: "created",
    });
    if (error) throw error;

    return json({ orderID: order.id });
  } catch (e) {
    console.error("legends-spins-checkout failed", e);
    return json({ error: "Could not start checkout" }, 500);
  }
});
