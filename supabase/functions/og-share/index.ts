import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SITE = "https://mrcap1.com";
const DEFAULT_IMAGE = "https://mrcap1.com/images/opk-og-image.jpg";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const type = url.searchParams.get("type") || "track";
  const slug = url.searchParams.get("slug");

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return new Response("Missing or invalid slug", { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  let title = "Mr. CAP";
  let description = "Listen now on mrcap1.com";
  let image = DEFAULT_IMAGE;
  let redirectPath = "/";

  if (type === "track") {
    const { data } = await supabase
      .from("tracks")
      .select("title, artist, cover_art_url, featured_artists")
      .eq("slug", slug)
      .eq("is_public", true)
      .single();

    if (data) {
      title = `${data.title} — ${data.artist}`;
      description = data.featured_artists
        ? `ft. ${data.featured_artists} • Listen now`
        : "Listen now on mrcap1.com";
      image = data.cover_art_url || DEFAULT_IMAGE;
      redirectPath = `/track/${slug}`;
    }
  } else if (type === "album") {
    const { data } = await supabase
      .from("albums")
      .select("title, artist, cover_art_url, description, track_count")
      .eq("slug", slug)
      .eq("is_public", true)
      .single();

    if (data) {
      title = `${data.title} — ${data.artist}`;
      description = data.description || `${data.track_count} tracks • Listen now`;
      image = data.cover_art_url || DEFAULT_IMAGE;
      redirectPath = `/album/${slug}`;
    }
  }

  const canonical = `${SITE}${redirectPath}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${esc(title)}</title>
<meta property="og:title" content="${esc(title)}"/>
<meta property="og:description" content="${esc(description)}"/>
<meta property="og:image" content="${esc(image)}"/>
<meta property="og:url" content="${esc(canonical)}"/>
<meta property="og:type" content="music.song"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${esc(title)}"/>
<meta name="twitter:description" content="${esc(description)}"/>
<meta name="twitter:image" content="${esc(image)}"/>
<meta http-equiv="refresh" content="0;url=${esc(canonical)}"/>
</head>
<body>
<script>window.location.replace("${canonical}");</script>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8", ...corsHeaders },
  });
});

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
