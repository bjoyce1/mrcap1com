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

    if (!trackId || typeof duration !== "number" || duration <= 0) {
      return new Response(
        JSON.stringify({ error: "trackId and a positive duration are required" }),
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
    return new Response(
      JSON.stringify({ error: e.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
