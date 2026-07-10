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
    if (!authHeader) return json({ error: "Sign in required" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) return json({ error: "Invalid session" }, 401);
    const userId = userData.user.id;

    const body = await req.json().catch(() => null) as { orderID?: string } | null;
    const orderID = body?.orderID;
    if (!orderID || typeof orderID !== "string") {
      return json({ error: "Missing orderID" }, 400);
    }

    const admin = createClient(supabaseUrl, serviceKey);

    // Verify the purchase row belongs to this user
    const { data: row, error: rowErr } = await admin
      .from("purchases")
      .select("id, user_id, status")
      .eq("paypal_order_id", orderID)
      .maybeSingle();
    if (rowErr || !row) return json({ error: "Order not found" }, 404);
    if (row.user_id !== userId) return json({ error: "Forbidden" }, 403);
    if (row.status === "paid") return json({ ok: true, alreadyPaid: true });

    // Capture with PayPal
    const token = await getPaypalAccessToken();
    const capRes = await fetch(
      `${paypalBaseUrl()}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    const capData = await capRes.json();
    const status = capData?.status;

    if (!capRes.ok || status !== "COMPLETED") {
      console.error("Capture failed:", capData);
      await admin.from("purchases")
        .update({ status: "failed" })
        .eq("id", row.id);
      return json({ error: "Payment was not completed" }, 402);
    }

    await admin.from("purchases")
      .update({ status: "paid", paid_at: new Date().toISOString() })
      .eq("id", row.id);

    return json({ ok: true });
  } catch (e) {
    console.error("paypal-capture-order error:", e);
    return json({ error: "Internal server error" }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
