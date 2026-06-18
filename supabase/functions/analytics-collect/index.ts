// Public collector for the Mr. CAP analytics tracker.
// Accepts a single event or a batch and stores into public.analytics_events.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type, x-client-info, apikey, authorization",
  "access-control-max-age": "86400",
};

const MAX_BATCH = 25;

function sanitizeString(value: unknown, max = 300): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001f\u007f]/g, "").slice(0, max);
}
function sanitizeNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}
function sanitizeObject(obj: unknown, depth = 0): Record<string, unknown> {
  if (!obj || typeof obj !== "object" || depth > 3) return {};
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const safeKey = sanitizeString(key, 64);
    if (!safeKey) continue;
    if (typeof value === "string") out[safeKey] = sanitizeString(value, 400);
    else if (typeof value === "number") out[safeKey] = sanitizeNumber(value);
    else if (typeof value === "boolean") out[safeKey] = value;
    else if (value && typeof value === "object" && !Array.isArray(value)) {
      out[safeKey] = sanitizeObject(value, depth + 1);
    }
  }
  return out;
}
function normalizePath(p: string): string {
  if (!p || typeof p !== "string") return "/";
  try {
    return new URL(p, "https://example.test").pathname || "/";
  } catch (_) {
    return p.startsWith("/") ? p.slice(0, 200) : `/${p.slice(0, 199)}`;
  }
}

async function hashHex(input: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(input));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 24);
}

async function normalizeEvent(input: Record<string, unknown>, req: Request, secret: string) {
  if (!input || typeof input !== "object") return null;
  const eventType = sanitizeString(input.event_type || (input as any).type || "event", 48)
    .toLowerCase()
    .replace(/[^a-z0-9_:-]/g, "_");
  if (!eventType) return null;

  const now = new Date().toISOString();
  const clientTs = (input as any).ts ? new Date((input as any).ts) : null;
  const ts = clientTs && Number.isFinite(clientTs.getTime()) ? clientTs.toISOString() : now;
  const url = sanitizeString(input.url || "", 800);
  let parsedUrl: URL | null = null;
  try { parsedUrl = url ? new URL(url) : null; } catch (_) {}

  const rawIp = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for") || "";
  const ip = String(rawIp).split(",")[0].trim();

  return {
    event_id: sanitizeString((input as any).event_id || crypto.randomUUID(), 80),
    event_type: eventType,
    site_id: sanitizeString((input as any).site_id || parsedUrl?.hostname || "mrcap1.com", 120),
    ts,
    received_at: now,
    visitor_id: sanitizeString((input as any).visitor_id || "", 120),
    session_id: sanitizeString((input as any).session_id || "", 120),
    url,
    path: normalizePath((input as any).path || parsedUrl?.pathname || "/"),
    title: sanitizeString((input as any).title || "", 200),
    referrer: sanitizeString((input as any).referrer || "", 800),
    source: sanitizeString((input as any).source || "", 120),
    medium: sanitizeString((input as any).medium || "", 120),
    campaign: sanitizeString((input as any).campaign || "", 160),
    term: sanitizeString((input as any).term || "", 160),
    content: sanitizeString((input as any).content || "", 160),
    device: sanitizeObject((input as any).device || {}),
    geo: {
      country: sanitizeString(
        req.headers.get("cf-ipcountry") || (input as any).geo?.country || "",
        80,
      ),
      timezone: sanitizeString((input as any).geo?.timezone || "", 80),
      language: sanitizeString((input as any).geo?.language || "", 80),
    },
    metrics: sanitizeObject((input as any).metrics || {}),
    props: sanitizeObject((input as any).props || {}),
    user_agent_hash: await hashHex(
      String((input as any).user_agent || req.headers.get("user-agent") || ""),
      secret,
    ),
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  }
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const hashSecret = Deno.env.get("ANALYTICS_HASH_SECRET") || "fallback-rotate-me";
    const supabase = createClient(supabaseUrl, serviceKey);

    const raw = await req.text();
    if (raw.length > 64 * 1024) {
      return new Response(JSON.stringify({ error: "Payload too large" }), {
        status: 413,
        headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }
    const parsed = JSON.parse(raw || "{}");
    const batch = Array.isArray(parsed)
      ? parsed
      : (Array.isArray(parsed.events) ? parsed.events : [parsed]);
    const cleaned = (
      await Promise.all(
        batch.slice(0, MAX_BATCH).map((e: Record<string, unknown>) =>
          normalizeEvent(e, req, hashSecret)
        ),
      )
    ).filter(Boolean);

    if (!cleaned.length) {
      return new Response(JSON.stringify({ error: "No valid events" }), {
        status: 400,
        headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }

    const { error } = await supabase.from("analytics_events").insert(cleaned);
    if (error) throw error;

    return new Response(JSON.stringify({ ok: true, accepted: cleaned.length }), {
      status: 202,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message || "Invalid request" }), {
      status: 400,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  }
});
