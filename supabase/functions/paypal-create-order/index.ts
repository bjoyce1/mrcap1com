import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { getPaypalAccessToken, paypalBaseUrl } from "../_shared/paypal.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ error: "Sign in required" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) return json({ error: "Invalid session" }, 401);
    const userId = userData.user.id;

    const body = await req.json().catch(() => null) as
      | { item_type?: string; item_id?: string }
      | null;
    const itemType = body?.item_type;
    const itemId = body?.item_id;
    if (!itemType || !["track", "album"].includes(itemType) || !itemId) {
      return json({ error: "Invalid item" }, 400);
    }

    const admin = createClient(supabaseUrl, serviceKey);

    // Look up price + title
    let priceCents = 0;
    let title = "";
    if (itemType === "track") {
      const { data, error } = await admin
        .from("tracks")
        .select("title, price_cents, is_public")
        .eq("id", itemId)
        .maybeSingle();
      if (error || !data || !data.is_public) return json({ error: "Track not found" }, 404);
      priceCents = data.price_cents ?? 99;
      title = data.title;
    } else {
      const { data, error } = await admin
        .from("albums")
        .select("title, price_cents, is_public")
        .eq("id", itemId)
        .maybeSingle();
      if (error || !data || !data.is_public) return json({ error: "Album not found" }, 404);
      priceCents = data.price_cents ?? 999;
      title = data.title;
    }

    const amount = (priceCents / 100).toFixed(2);

    // Create PayPal order
    const token = await getPaypalAccessToken();
    const orderRes = await fetch(`${paypalBaseUrl()}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          amount: { currency_code: "USD", value: amount },
          description: `${title} (${itemType})`.slice(0, 127),
          custom_id: `${itemType}:${itemId}:${userId}`.slice(0, 127),
        }],
        application_context: {
          brand_name: "Mr. CAP Legacy",
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
        },
      }),
    });
    if (!orderRes.ok) {
      const txt = await orderRes.text();
      console.error("PayPal create order failed:", txt);
      return json({ error: "Could not start checkout" }, 502);
    }
    const order = await orderRes.json();

    // Record purchase as 'created'
    await admin.from("purchases").insert({
      user_id: userId,
      item_type: itemType,
      item_id: itemId,
      paypal_order_id: order.id,
      amount_cents: priceCents,
      currency: "USD",
      status: "created",
    });

    return json({ orderID: order.id });
  } catch (e) {
    console.error("paypal-create-order error:", e);
    return json({ error: e instanceof Error ? e.message : "Unknown error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
