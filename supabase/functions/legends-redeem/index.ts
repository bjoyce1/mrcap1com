import { z } from "npm:zod@3";
import { admin, corsHeaders, json, requireUser } from "../_shared/legends/http.ts";
import { vaultItem } from "../_shared/legends/vault.ts";

const Body = z.object({ itemId: z.string().min(3).max(80).regex(/^[a-z0-9-]+$/) });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const userId = await requireUser(req);
  if (!userId) return json({ error: "Sign in required" }, 401);

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ error: "itemId is required" }, 400);
  const item = vaultItem(parsed.data.itemId);
  if (!item) return json({ error: "unknown_item" }, 404);
  if (item.priceCents !== undefined) return json({ error: "PayPal payment required" }, 400);

  try {
    // Price comes from the server catalog; the browser only names the item.
    const { data, error } = await admin().rpc("legends_redeem", {
      _user: userId, _item: item.id, _cost: item.cost, _artist: item.artist ?? null,
    });
    if (error) throw error;
    const result = data as Record<string, unknown>;
    if (result.error === "owned") return json({ error: "owned" }, 409);
    if (result.error === "not_enough") return json({ error: "not_enough", coins: result.coins }, 402);
    return json(result);
  } catch (e) {
    console.error("legends-redeem failed", e);
    return json({ error: "Redeem failed, please try again" }, 500);
  }
});
