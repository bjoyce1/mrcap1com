import { admin, corsHeaders, json, requireUser } from "../_shared/legends/http.ts";
import { getPaypalAccessToken, paypalBaseUrl } from "../_shared/paypal.ts";
import { verifiedVaultCapture } from "../_shared/legends/vault-payment.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const user = await requireUser(req);
  if (!user) return json({ error: "Sign in required" }, 401);
  const body = await req.json().catch(() => null);
  if (typeof body?.orderID !== "string" || !/^[A-Za-z0-9-]{5,64}$/.test(body.orderID)) return json({ error: "Invalid order" }, 400);
  const db = admin();
  try {
    const { data: row, error } = await db.from("legends_vault_purchases").select("id, status, amount_cents, paypal_capture_id").eq("paypal_order_id", body.orderID).eq("user_id", user).maybeSingle();
    if (error) throw error;
    if (!row) return json({ error: "Order not found" }, 404);
    let captureId = row.paypal_capture_id;
    if (row.status !== "paid") {
      if (row.status !== "created") return json({ error: "Order not payable" }, 409);
      const token = await getPaypalAccessToken();
      const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "PayPal-Request-Id": `capture-${row.id}` };
      const response = await fetch(`${paypalBaseUrl()}/v2/checkout/orders/${body.orderID}/capture`, { method: "POST", headers });
      let order = await response.json();
      if (!response.ok) {
        if (!order?.details?.some((detail: { issue?: string }) => detail.issue === "ORDER_ALREADY_CAPTURED")) return json({ error: "Payment not completed" }, 402);
        const lookup = await fetch(`${paypalBaseUrl()}/v2/checkout/orders/${body.orderID}`, { headers });
        if (!lookup.ok) throw new Error("Order verification failed");
        order = await lookup.json();
      }
      captureId = verifiedVaultCapture(order, row.id, row.amount_cents);
      if (!captureId) return json({ error: "Payment could not be verified" }, 402);
    }
    const { data, error: creditError } = await db.rpc("legends_vault_credit", { _user: user, _order: body.orderID, _capture: captureId });
    if (creditError) throw creditError;
    return json(data);
  } catch {
    return json({ error: "Confirmation incomplete. Retry before paying again." }, 500);
  }
});