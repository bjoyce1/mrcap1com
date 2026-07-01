// Unified public API for mrcap1.com and partner sites.
// Auth: Bearer <api-key> or x-api-key header.
import { createClient } from "npm:@supabase/supabase-js@2";

const ALLOWED_ORIGINS = new Set([
  "https://mrcap1.com",
  "https://www.mrcap1.com",
  "https://theartofism.com",
  "https://www.theartofism.com",
  "https://themilkmoney.com",
  "https://www.themilkmoney.com",
  "https://dabsheets.com",
  "https://www.dabsheets.com",
  "https://713mixhouse.com",
  "https://www.713mixhouse.com",
  "https://themaasaproject.com",
  "https://www.themaasaproject.com",
  "https://absoulutelycaptivating.com",
  "https://www.absoulutelycaptivating.com",
]);

function corsFor(origin: string | null): Record<string, string> {
  const allow =
    origin && (ALLOWED_ORIGINS.has(origin) || origin.endsWith(".lovable.app") || origin.startsWith("http://localhost"))
      ? origin
      : "*";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "authorization, x-api-key, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function json(body: unknown, status: number, cors: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

function scopeMatches(keyScopes: string[], required: string): boolean {
  if (keyScopes.includes(required)) return true;
  const [group] = required.split(":");
  if (keyScopes.includes(`${group}:*`)) return true;
  if (keyScopes.includes("*")) return true;
  return false;
}

interface ApiKey {
  id: string;
  scopes: string[];
  rate_limit_per_min: number;
  revoked_at: string | null;
  expires_at: string | null;
}

async function authenticate(req: Request): Promise<{ key: ApiKey | null; error?: string }> {
  const auth = req.headers.get("authorization") || "";
  const rawKey = req.headers.get("x-api-key") || (auth.startsWith("Bearer ") ? auth.slice(7) : "");
  if (!rawKey) return { key: null, error: "Missing API key" };

  const hash = await sha256(rawKey);
  const { data, error } = await supabase
    .from("api_keys")
    .select("id, scopes, rate_limit_per_min, revoked_at, expires_at")
    .eq("key_hash", hash)
    .maybeSingle();

  if (error || !data) return { key: null, error: "Invalid API key" };
  if (data.revoked_at) return { key: null, error: "Key revoked" };
  if (data.expires_at && new Date(data.expires_at) < new Date()) return { key: null, error: "Key expired" };
  return { key: data as ApiKey };
}

async function checkRateLimit(keyId: string, limit: number): Promise<boolean> {
  const since = new Date(Date.now() - 60_000).toISOString();
  const { count } = await supabase
    .from("api_key_usage")
    .select("id", { count: "exact", head: true })
    .eq("key_id", keyId)
    .gte("ts", since);
  return (count ?? 0) < limit;
}

async function logUsage(
  keyId: string,
  endpoint: string,
  method: string,
  status: number,
  ip: string | null,
  ua: string | null,
  durationMs: number,
) {
  await supabase.from("api_key_usage").insert({
    key_id: keyId,
    endpoint,
    method,
    status,
    ip,
    user_agent: ua,
    duration_ms: durationMs,
  });
  await supabase.from("api_keys").update({ last_used_at: new Date().toISOString() }).eq("id", keyId);
}

// ── Route handlers ────────────────────────────────────────────

async function handleAlbums(url: URL) {
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 50), 100);
  const { data, error } = await supabase
    .from("albums")
    .select("*")
    .eq("is_public", true)
    .order("release_year", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return { data, meta: { count: data?.length ?? 0 } };
}

async function handleAlbumBySlug(slug: string) {
  const { data: album, error } = await supabase
    .from("albums")
    .select("*")
    .eq("slug", slug)
    .eq("is_public", true)
    .maybeSingle();
  if (error) throw error;
  if (!album) return { data: null };
  const { data: tracks } = await supabase
    .from("tracks")
    .select("*")
    .eq("album_id", album.id)
    .eq("is_public", true)
    .order("track_number", { ascending: true });
  return { data: { ...album, tracks: tracks ?? [] } };
}

async function handleTracks(url: URL) {
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 50), 100);
  const year = url.searchParams.get("year");
  let q = supabase.from("tracks").select("*").eq("is_public", true);
  if (year) q = q.eq("release_year", Number(year));
  const { data, error } = await q.order("release_year", { ascending: false }).limit(limit);
  if (error) throw error;
  return { data, meta: { count: data?.length ?? 0 } };
}

async function handleTrackBySlug(slug: string) {
  const { data, error } = await supabase
    .from("tracks")
    .select("*")
    .eq("slug", slug)
    .eq("is_public", true)
    .maybeSingle();
  if (error) throw error;
  return { data };
}

async function handleEvents() {
  // No events table yet — return empty envelope so consumers can code against it.
  return { data: [], meta: { count: 0, note: "events feed not yet populated" } };
}

async function handleFanSignup(body: Record<string, unknown>) {
  const email = String(body.email ?? "").trim().toLowerCase();
  if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    return { error: "valid email required", status: 400 };
  }
  const { error } = await supabase.from("fan_signups").insert({
    email,
    name: body.name ?? null,
    source_page: body.source_page ?? "api",
    favorite_song: body.favorite_song ?? null,
  });
  if (error && !error.message.includes("duplicate")) throw error;
  return { data: { ok: true } };
}

async function handleAnalyticsEvent(body: Record<string, unknown>) {
  const { error } = await supabase.from("analytics_events").insert({
    event_type: String(body.event_type ?? "custom"),
    path: body.path ?? null,
    referrer: body.referrer ?? null,
    properties: body.properties ?? {},
  });
  if (error) throw error;
  return { data: { ok: true } };
}

// ── Router ────────────────────────────────────────────────────

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const cors = corsFor(origin);
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const start = Date.now();
  const url = new URL(req.url);
  // Strip function prefix: /api-v1/... or /functions/v1/api-v1/...
  let path = url.pathname.replace(/^\/functions\/v1/, "").replace(/^\/api-v1/, "") || "/";
  if (!path.startsWith("/")) path = "/" + path;

  // Public docs endpoint (no auth) — advertises the API.
  if (path === "/" || path === "/docs") {
    return json(
      {
        name: "Mr. CAP Unified API",
        version: "v1",
        docs: "https://mrcap1.com/api/docs",
        auth: "Bearer <api key> or x-api-key header",
        endpoints: [
          "GET /music/albums",
          "GET /music/albums/:slug",
          "GET /music/tracks",
          "GET /music/tracks/:slug",
          "GET /events",
          "POST /fans",
          "POST /analytics/event",
        ],
      },
      200,
      cors,
    );
  }

  // Authenticate
  const { key, error: authError } = await authenticate(req);
  if (!key) return json({ error: authError ?? "Unauthorized" }, 401, cors);

  // Rate limit
  const ok = await checkRateLimit(key.id, key.rate_limit_per_min);
  if (!ok) {
    await logUsage(key.id, path, req.method, 429, req.headers.get("x-forwarded-for"), req.headers.get("user-agent"), Date.now() - start);
    return json({ error: "Rate limit exceeded" }, 429, cors);
  }

  try {
    let body: Record<string, unknown> = {};
    if (req.method === "POST") {
      try { body = await req.json(); } catch { body = {}; }
    }

    let result: { data?: unknown; meta?: unknown; error?: string; status?: number } | null = null;

    // Routing
    if (path === "/music/albums" && req.method === "GET") {
      if (!scopeMatches(key.scopes, "read:music")) return json({ error: "insufficient scope" }, 403, cors);
      result = await handleAlbums(url);
    } else if (path.startsWith("/music/albums/") && req.method === "GET") {
      if (!scopeMatches(key.scopes, "read:music")) return json({ error: "insufficient scope" }, 403, cors);
      result = await handleAlbumBySlug(path.split("/").pop()!);
    } else if (path === "/music/tracks" && req.method === "GET") {
      if (!scopeMatches(key.scopes, "read:music")) return json({ error: "insufficient scope" }, 403, cors);
      result = await handleTracks(url);
    } else if (path.startsWith("/music/tracks/") && req.method === "GET") {
      if (!scopeMatches(key.scopes, "read:music")) return json({ error: "insufficient scope" }, 403, cors);
      result = await handleTrackBySlug(path.split("/").pop()!);
    } else if (path === "/events" && req.method === "GET") {
      if (!scopeMatches(key.scopes, "read:events")) return json({ error: "insufficient scope" }, 403, cors);
      result = await handleEvents();
    } else if (path === "/fans" && req.method === "POST") {
      if (!scopeMatches(key.scopes, "admin:fans")) return json({ error: "insufficient scope" }, 403, cors);
      result = await handleFanSignup(body);
    } else if (path === "/analytics/event" && req.method === "POST") {
      if (!scopeMatches(key.scopes, "admin:analytics")) return json({ error: "insufficient scope" }, 403, cors);
      result = await handleAnalyticsEvent(body);
    } else {
      await logUsage(key.id, path, req.method, 404, req.headers.get("x-forwarded-for"), req.headers.get("user-agent"), Date.now() - start);
      return json({ error: "Not found", path }, 404, cors);
    }

    const status = result?.status ?? (result?.error ? 400 : 200);
    await logUsage(key.id, path, req.method, status, req.headers.get("x-forwarded-for"), req.headers.get("user-agent"), Date.now() - start);
    return json(result?.error ? { error: result.error } : { data: result.data, meta: result.meta }, status, cors);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("api-v1 error", msg);
    await logUsage(key.id, path, req.method, 500, req.headers.get("x-forwarded-for"), req.headers.get("user-agent"), Date.now() - start);
    return json({ error: msg }, 500, cors);
  }
});
