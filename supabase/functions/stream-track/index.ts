import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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
    const { trackId, sessionId, secondsListened, pagePath } = await req.json();

    if (!trackId || !sessionId) {
      console.error("Missing trackId or sessionId", { trackId, sessionId });
      return new Response(JSON.stringify({ error: "Missing trackId/sessionId" }), {
        status: 400,
        headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }

    if (!Number.isFinite(secondsListened) || secondsListened < 30) {
      console.warn("Stream not qualified", { trackId, secondsListened });
      return new Response(JSON.stringify({ error: "Not qualified (< 30s)" }), {
        status: 400,
        headers: { ...corsHeaders, "content-type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Insert stream log — unique index handles dedupe (conflict = already counted today)
    const { error: insertError } = await supabase.from("stream_logs").insert({
      track_id: trackId,
      session_id: sessionId,
      seconds_listened: Math.floor(secondsListened),
      page_path: pagePath || null,
    });

    if (insertError) {
      // Unique constraint violation = dedupe
      if (insertError.code === "23505") {
        console.log("Deduped stream", { trackId, sessionId });
        return new Response(JSON.stringify({ ok: true, deduped: true }), {
          status: 200,
          headers: { ...corsHeaders, "content-type": "application/json" },
        });
      }
      console.error("Insert error", insertError);
      throw insertError;
    }

    // Increment play_count on the track
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
      JSON.stringify({ ok: true, deduped: false, trackId }),
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
