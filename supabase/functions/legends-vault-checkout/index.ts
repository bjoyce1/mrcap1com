import { admin, corsHeaders, json, requireUser } from "../_shared/legends/http.ts";
import { vaultItem } from "../_shared/legends/vault.ts";
import { getPaypalAccessToken, paypalBaseUrl } from "../_shared/paypal.ts";
import { eligibleLegends } from "../_shared/legends/reel-access.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const user = await requireUser(req);
  if (!user) return json({ error: "Sign in required" }, 401);
  if (Deno.env.get("LEGENDS_PAYMENTS_ENABLED") !== "true") return json({ error: "Sales unavailable" }, 503);
  const body = await req.json().catch(() => null);
  const item = typeof body?.itemId === "string" ? vaultItem(body.itemId) : null;
  if (!item?.priceCents) return json({ error: "Unknown cash item" }, 400);
  const db = admin();
  let reservation: string | null = null;
  try {
    const { data: player, error: playerError } = await db.from("legends_players").select("unlocks, collection").eq("user_id", user).maybeSingle();
    if (playerError) throw playerError;
    if (player?.unlocks.includes(item.id) || (item.artist && eligibleLegends(player ?? {}).includes(item.artist))) return json({ error: "Already owned" }, 409);
    const { data: pending, error: pendingError } = await db.from("legends_vault_purchases").select("id, status, paypal_order_id").eq("user_id", user).eq("item_id", item.id).in("status", ["creating", "created", "paid"]).maybeSingle();
    if (pendingError) throw pendingError;
    if (pending?.status === "created" && pending.paypal_order_id) return json({ orderID: pending.paypal_order_id });
    if (pending) return json({ error: "Existing purchase needs confirmation" }, 409);
    const { data: row, error } = await db.from("legends_vault_purchases").insert({ user_id: user, item_id: item.id, amount_cents: item.priceCents }).select("id").single();
    if (error || !row) return json({ error: "Checkout is already starting" }, 409);
    reservation = row.id;
    const token = await getPaypalAccessToken();
    const response = await fetch(`${paypalBaseUrl()}/v2/checkout/orders`, {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "PayPal-Request-Id": row.id },
      body: JSON.stringify({ intent: "CAPTURE", purchase_units: [{ description: `SPC Legends Vault: ${item.name}`, custom_id: `vault:${row.id}`, amount: { currency_code: "USD", value: (item.priceCents / 100).toFixed(2) } }], application_context: { shipping_preference: "NO_SHIPPING", brand_name: "Mr. CAP Legacy" } }),
    });
    const order = await response.json();
    if (!response.ok || !order.id) throw new Error("PayPal order creation failed");
    const { error: saveError } = await db.from("legends_vault_purchases").update({ paypal_order_id: order.id, status: "created" }).eq("id", row.id);
    if (saveError) throw saveError;
    return json({ orderID: order.id });
  } catch {
    if (reservation) await db.from("legends_vault_purchases").update({ status: "failed" }).eq("id", reservation).eq("status", "creating");
    return json({ error: "Checkout could not start" }, 502);
  }
});