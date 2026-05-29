// Streams a ZIP archive containing every track of a purchased album.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { BlobWriter, ZipWriter } from "https://deno.land/x/zipjs@v2.7.45/index.js";

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

    const body = await req.json().catch(() => null) as { album_id?: string } | null;
    const albumId = body?.album_id;
    if (!albumId) return json({ error: "Missing album_id" }, 400);

    const admin = createClient(supabaseUrl, serviceKey);

    // Verify ownership: album purchase OR all tracks individually purchased
    const { data: album, error: albumErr } = await admin
      .from("albums")
      .select("id, title, slug, is_public")
      .eq("id", albumId)
      .maybeSingle();
    if (albumErr || !album || !album.is_public) {
      return json({ error: "Album not available" }, 404);
    }

    const { data: albumPurchase } = await admin
      .from("purchases")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "paid")
      .eq("item_type", "album")
      .eq("item_id", albumId)
      .limit(1);

    const hasAlbum = !!(albumPurchase && albumPurchase.length > 0);

    const { data: tracks, error: tracksErr } = await admin
      .from("tracks")
      .select("id, title, audio_url, track_number")
      .eq("album_id", albumId)
      .eq("is_public", true)
      .order("track_number", { ascending: true });
    if (tracksErr || !tracks || tracks.length === 0) {
      return json({ error: "No tracks found" }, 404);
    }

    if (!hasAlbum) {
      const trackIds = tracks.map((t: { id: string }) => t.id);
      const { data: trackPurchases } = await admin
        .from("purchases")
        .select("item_id")
        .eq("user_id", userId)
        .eq("status", "paid")
        .eq("item_type", "track")
        .in("item_id", trackIds);
      const ownedIds = new Set((trackPurchases || []).map((p: { item_id: string }) => p.item_id));
      const allOwned = trackIds.every((id: string) => ownedIds.has(id));
      if (!allOwned) return json({ error: "Purchase required" }, 403);
    }

    // Build ZIP in-memory
    const zipBlobWriter = new BlobWriter("application/zip");
    const zipWriter = new ZipWriter(zipBlobWriter);

    for (let i = 0; i < tracks.length; i++) {
      const t = tracks[i] as { id: string; title: string; audio_url: string | null; track_number: number | null };
      if (!t.audio_url) continue;
      const storagePath = resolveStoragePath(t.audio_url);
      if (!storagePath) continue;

      const { data: fileBlob, error: dlErr } = await admin.storage
        .from("audio")
        .download(storagePath);
      if (dlErr || !fileBlob) {
        console.error("download failed", t.id, dlErr);
        continue;
      }
      const num = String(t.track_number ?? i + 1).padStart(2, "0");
      const safeTitle = t.title.replace(/[\\/:*?"<>|]/g, "_");
      const ext = storagePath.split(".").pop() || "mp3";
      const filename = `${num} - ${safeTitle}.${ext}`;
      // @ts-ignore – zipjs accepts Blob via BlobReader; we pass a stream
      const { BlobReader } = await import("https://deno.land/x/zipjs@v2.7.45/index.js");
      await zipWriter.add(filename, new BlobReader(fileBlob));
    }

    await zipWriter.close();
    const zipBlob = await zipBlobWriter.getData();

    const safeAlbum = album.title.replace(/[\\/:*?"<>|]/g, "_");
    return new Response(zipBlob, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${safeAlbum}.zip"`,
      },
    });
  } catch (e) {
    console.error("album-download error:", e);
    return json({ error: "An internal error occurred" }, 500);
  }
});

function resolveStoragePath(audioUrl: string): string | null {
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
