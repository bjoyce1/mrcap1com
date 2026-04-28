// Public 30-second preview streamer for audio tracks.
// Uses HTTP range requests against a short-lived signed URL on the private bucket.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, range",
  "Access-Control-Expose-Headers": "content-length, content-range, accept-ranges",
};

const PREVIEW_SECONDS = 30;
// Conservative bitrate cap so we never accidentally serve full songs:
// ~320 kbps = 40 KB/s -> 30s ≈ 1.2 MB. We cap at 2 MB to give a safety margin.
const MAX_PREVIEW_BYTES = 2 * 1024 * 1024;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const trackId = url.searchParams.get("track_id");
    if (!trackId) return text("Missing track_id", 400);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey);

    const { data: track, error } = await admin
      .from("tracks")
      .select("audio_url, is_public, requires_nft")
      .eq("id", trackId)
      .maybeSingle();
    if (error || !track || !track.is_public || track.requires_nft || !track.audio_url) {
      return text("Not found", 404);
    }

    // Resolve storage path from audio_url. Supports both full Supabase public URLs
    // and bare paths like "albums/foo.mp3".
    const storagePath = resolveStoragePath(track.audio_url, supabaseUrl);
    if (!storagePath) return text("Bad audio path", 500);

    const { data: signed, error: signErr } = await admin.storage
      .from("audio")
      .createSignedUrl(storagePath, 60);
    if (signErr || !signed?.signedUrl) {
      console.error("Sign error:", signErr);
      return text("Cannot fetch audio", 500);
    }

    // Honour client Range; otherwise request bytes 0..MAX_PREVIEW_BYTES-1.
    const rangeHeader = req.headers.get("range") || `bytes=0-${MAX_PREVIEW_BYTES - 1}`;
    const clamped = clampRange(rangeHeader, MAX_PREVIEW_BYTES);

    const upstream = await fetch(signed.signedUrl, {
      headers: { Range: clamped },
    });

    const headers = new Headers(corsHeaders);
    const ct = upstream.headers.get("content-type") || "audio/mpeg";
    headers.set("Content-Type", ct);
    headers.set("Accept-Ranges", "bytes");
    headers.set("Cache-Control", "public, max-age=3600");
    headers.set("X-Preview-Seconds", String(PREVIEW_SECONDS));
    const cl = upstream.headers.get("content-length");
    if (cl) headers.set("Content-Length", cl);
    const cr = upstream.headers.get("content-range");
    if (cr) headers.set("Content-Range", cr);

    return new Response(upstream.body, { status: upstream.status, headers });
  } catch (e) {
    console.error("audio-preview error:", e);
    return text("Server error", 500);
  }
});

function resolveStoragePath(audioUrl: string, supabaseUrl: string): string | null {
  if (!audioUrl) return null;
  // If it's already a relative path inside the bucket
  if (!audioUrl.startsWith("http")) return audioUrl.replace(/^\/+/, "");
  // Strip Supabase prefix
  const marker = "/storage/v1/object/public/audio/";
  const idx = audioUrl.indexOf(marker);
  if (idx >= 0) return audioUrl.slice(idx + marker.length);
  const marker2 = "/storage/v1/object/audio/";
  const idx2 = audioUrl.indexOf(marker2);
  if (idx2 >= 0) return audioUrl.slice(idx2 + marker2.length);
  return null;
}

function clampRange(rangeHeader: string, maxBytes: number): string {
  const m = /bytes=(\d+)-(\d*)/.exec(rangeHeader);
  if (!m) return `bytes=0-${maxBytes - 1}`;
  const start = Math.min(parseInt(m[1], 10), maxBytes - 1);
  const end = m[2] ? Math.min(parseInt(m[2], 10), maxBytes - 1) : maxBytes - 1;
  return `bytes=${start}-${end}`;
}

function text(msg: string, status = 200) {
  return new Response(msg, {
    status,
    headers: { ...corsHeaders, "Content-Type": "text/plain" },
  });
}
