import { z } from "npm:zod@3";
import { admin, corsHeaders, json, requireUser } from "../_shared/legends/http.ts";
import { createBoard, evaluateBoard } from "../_shared/legends/engine.ts";

const Body = z.object({ idempotencyKey: z.string().min(8).max(100).regex(/^[A-Za-z0-9_:.-]+$/) });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const userId = await requireUser(req);
  if (!userId) return json({ error: "Sign in required" }, 401);

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ error: "idempotencyKey is required" }, 400);

  try {
    // Board is generated and scored on the server with crypto randomness.
    const board = createBoard();
    const o = evaluateBoard(board);
    const outcome = { wins: o.wins, hitCells: o.hitCells, xp: o.xp, found: o.found, highest: o.highest };

    const { data, error } = await admin().rpc("legends_commit_spin", {
      _user: userId,
      _key: parsed.data.idempotencyKey,
      _board: board,
      _outcome: outcome,
    });
    if (error) throw error;

    const result = data as Record<string, unknown>;
    if (result.error === "cooldown") return json({ error: "cooldown" }, 429);
    if (result.error === "no_spins") return json({ error: "no_spins", balance: result.balance }, 402);
    delete result.replayed;
    return json(result);
  } catch (e) {
    console.error("legends-spin failed", e);
    return json({ error: "Spin failed, please try again" }, 500);
  }
});
