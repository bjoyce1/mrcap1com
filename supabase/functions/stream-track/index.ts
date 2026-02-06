import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_SECONDS = 86400; // 24 hours cap
const MAX_PATH_LENGTH = 500;

Deno.serve(async (req) => {
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
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }

    const { trackId, sessionId, secondsListened, pagePath } = body as Record<string, unknown>;

    // Validate trackId is a UUID
    if (typeof trackId !== "string" || !UUID_RE.test(trackId)) {
      return new Response(JSON.stringify({ error: "Invalid trackId" }), {
        status: 400,
        headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }

    // Validate sessionId is a UUID
    if (typeof sessionId !== "string" || !UUID_RE.test(sessionId)) {
      return new Response(JSON.stringify({ error: "Invalid sessionId" }), {
        status: 400,
        headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }

    // Validate secondsListened is a finite number >= 30 and within bounds
    if (typeof secondsListened !== "number" || !Number.isFinite(secondsListened) || secondsListened < 30 || secondsListened > MAX_SECONDS) {
      return new Response(JSON.stringify({ error: "Invalid secondsListened" }), {
        status: 400,
        headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }

    // Validate pagePath if provided
    const sanitizedPagePath = typeof pagePath === "string" && pagePath.length <= MAX_PATH_LENGTH
      ? pagePath.slice(0, MAX_PATH_LENGTH)
      : null;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: insertError } = await supabase.from("stream_logs").insert({
      track_id: trackId,
      session_id: sessionId,
      seconds_listened: Math.floor(secondsListened),
      page_path: sanitizedPagePath,
    });

    if (insertError) {
      if (insertError.code === "23505") {
        return new Response(JSON.stringify({ ok: true, deduped: true }), {
          status: 200,
          headers: { ...corsHeaders, "content-type": "application/json" },
        });
      }
      console.error("Insert error", insertError);
      return new Response(JSON.stringify({ error: "Failed to record stream" }), {
        status: 500,
        headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }

    const { data: track } = await supabase
      .from("tracks")
      .select("play_count")
      .eq("id", trackId)
      .maybeSingle();

    if (track) {
      await supabase
        .from("tracks")
        .update({ play_count: (track.play_count || 0) + 1 })
        .eq("id", trackId);
    }

    console.log("Qualified stream recorded", { trackId, sessionId, secondsListened });

    return new Response(
      JSON.stringify({ ok: true, deduped: false }),
      { status: 200, headers: { ...corsHeaders, "content-type": "application/json" } }
    );
  } catch (err) {
    console.error("stream-track error", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  }
});
