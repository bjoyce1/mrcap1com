// Returns a 60-second signed download URL for tracks the caller has purchased.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Sign in required" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) return json({ error: "Invalid session" }, 401);
    const userId = userData.user.id;

    const body = await req.json().catch(() => null) as { track_id?: string } | null;
    const trackId = body?.track_id;
    if (!trackId) return json({ error: "Missing track_id" }, 400);

    const admin = createClient(supabaseUrl, serviceKey);

    const { data: track, error: trackErr } = await admin
      .from("tracks")
      .select("id, title, audio_url, album_id, is_public")
      .eq("id", trackId)
      .maybeSingle();
    if (trackErr || !track || !track.is_public || !track.audio_url) {
      return json({ error: "Track not available" }, 404);
    }

    // Ownership: user bought this track OR the album it belongs to
    const orFilter = track.album_id
      ? `and(item_type.eq.track,item_id.eq.${trackId}),and(item_type.eq.album,item_id.eq.${track.album_id})`
      : `and(item_type.eq.track,item_id.eq.${trackId})`;

    const { data: purchases, error: pErr } = await admin
      .from("purchases")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "paid")
      .or(orFilter)
      .limit(1);
    if (pErr) {
      console.error(pErr);
      return json({ error: "Lookup failed" }, 500);
    }
    if (!purchases || purchases.length === 0) {
      return json({ error: "Purchase required" }, 403);
    }

    const storagePath = resolveStoragePath(track.audio_url, supabaseUrl);
    if (!storagePath) return json({ error: "Bad audio path" }, 500);

    const { data: signed, error: signErr } = await admin.storage
      .from("audio")
      .createSignedUrl(storagePath, 60, {
        download: `${track.title}.mp3`,
      });
    if (signErr || !signed?.signedUrl) {
      console.error(signErr);
      return json({ error: "Could not generate download" }, 500);
    }

    return json({ url: signed.signedUrl });
  } catch (e) {
    console.error("audio-download error:", e);
    return json({ error: "An internal error occurred" }, 500);
  }
});

function resolveStoragePath(audioUrl: string, _supabaseUrl: string): string | null {
  if (!audioUrl) return null;
  if (!audioUrl.startsWith("http")) return audioUrl.replace(/^\/+/, "");
  const marker = "/storage/v1/object/public/audio/";
  const idx = audioUrl.indexOf(marker);
  if (idx >= 0) return audioUrl.slice(idx + marker.length);
  const marker2 = "/storage/v1/object/audio/";
  const idx2 = audioUrl.indexOf(marker2);
  if (idx2 >= 0) return audioUrl.slice(idx2 + marker2.length);
  return null;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
