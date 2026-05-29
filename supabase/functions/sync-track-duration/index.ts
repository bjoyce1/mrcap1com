import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { trackId, duration } = await req.json();

    // Validate inputs — trackId must look like a UUID; duration must be sane (1s..2h).
    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (
      !trackId ||
      typeof trackId !== "string" ||
      !uuidRe.test(trackId) ||
      typeof duration !== "number" ||
      !Number.isFinite(duration) ||
      duration <= 0 ||
      duration > 7200
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid trackId or duration" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const roundedDuration = Math.round(duration);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Only update if current duration is 0 (don't overwrite manual entries)
    const { data, error } = await supabase
      .from("tracks")
      .update({ duration: roundedDuration })
      .eq("id", trackId)
      .eq("duration", 0)
      .select("id, title, duration")
      .maybeSingle();

    if (error) throw error;

    return new Response(
      JSON.stringify({ updated: !!data, track: data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("sync-track-duration error:", e);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
