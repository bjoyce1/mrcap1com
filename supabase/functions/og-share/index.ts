import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SITE = Deno.env.get("SITE_URL") || "https://mrcap1com.lovable.app";
const DEFAULT_IMAGE = "https://mrcap1.com/images/opk-og-image.jpg";

const CRAWLER_UA = /Twitterbot|facebookexternalhit|LinkedInBot|Slackbot|Discordbot|WhatsApp|TelegramBot|Googlebot|bingbot|Embedly|Quora|Pinterest|Applebot/i;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const ua = req.headers.get("user-agent") || "";
  const isCrawler = CRAWLER_UA.test(ua);

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
  let ogType = "music.song";

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
      image = resolveImage(data.cover_art_url);
      redirectPath = `/music/${slug}`;
      ogType = "music.song";
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
      image = resolveImage(data.cover_art_url);
      redirectPath = `/albums/${slug}`;
      ogType = "music.album";
    }
  }

  const canonical = `${SITE}${redirectPath}`;
  const imageMime = inferMime(image);

  // Real browsers get a 302 redirect (bypasses Content-Type/CSP issues)
  if (!isCrawler) {
    return new Response(null, {
      status: 302,
      headers: { Location: canonical, ...corsHeaders },
    });
  }

  // Crawlers get OG meta tags
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${esc(title)}</title>
<meta property="og:site_name" content="Mr. CAP"/>
<meta property="og:title" content="${esc(title)}"/>
<meta property="og:description" content="${esc(description)}"/>
<meta property="og:image" content="${esc(image)}"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:image:type" content="${imageMime}"/>
<meta property="og:image:alt" content="Cover art for ${esc(title)}"/>
<meta property="og:url" content="${esc(canonical)}"/>
<meta property="og:type" content="${ogType}"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${esc(title)}"/>
<meta name="twitter:description" content="${esc(description)}"/>
<meta name="twitter:image" content="${esc(image)}"/>
<meta name="twitter:image:alt" content="Cover art for ${esc(title)}"/>
</head>
<body></body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8", ...corsHeaders },
  });
});

function resolveImage(url: string | null): string {
  if (!url) return DEFAULT_IMAGE;
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return `${SITE}${url}`;
  return DEFAULT_IMAGE;
}

function inferMime(url: string): string {
  const ext = url.split(".").pop()?.toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  return "image/jpeg";
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
