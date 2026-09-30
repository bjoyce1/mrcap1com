import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Fixed, server-defined GROQ query templates. Clients pick a template by name
// and may only pass parameters used by that template. Arbitrary GROQ from the
// client is not accepted, which prevents access to drafts or unintended fields.
const TEMPLATES: Record<string, { query: string; paramKeys: readonly string[] }> = {
  "blog-posts": {
    query: `*[_type == "blogPost" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
      _id, title, slug, excerpt, publishedAt, category,
      "coverImage": coverImage.asset->url,
      author, tags, readTime
    }`,
    paramKeys: [],
  },
  "blog-post-by-slug": {
    query: `*[_type == "blogPost" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
      _id, title, slug, excerpt, publishedAt, category,
      "coverImage": coverImage.asset->url,
      author, tags, readTime, body
    }`,
    paramKeys: ["slug"],
  },
  "events-upcoming": {
    query: `*[_type == "event" && date >= now() && !(_id in path("drafts.**"))] | order(date asc) {
      _id, title, date, venue, city, state, ticketUrl, description,
      "flyer": flyer.asset->url
    }`,
    paramKeys: [],
  },
  "releases": {
    query: `*[_type == "release" && !(_id in path("drafts.**"))] | order(releaseDate desc) {
      _id, title, slug, releaseDate, type, description,
      "coverArt": coverArt.asset->url,
      spotifyUrl, appleMusicUrl, youtubeMusicUrl
    }`,
    paramKeys: [],
  },
  "press-entries": {
    query: `*[_type == "pressEntry" && !(_id in path("drafts.**"))] | order(date desc) {
      _id, outlet, title, author, date, summary, url
    }`,
    paramKeys: [],
  },
};

function isSafeParamValue(v: unknown): boolean {
  if (v == null) return true;
  const t = typeof v;
  if (t === "string") return (v as string).length <= 200;
  if (t === "number" || t === "boolean") return true;
  return false;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SANITY_PROJECT_ID = Deno.env.get("SANITY_PROJECT_ID");
    if (!SANITY_PROJECT_ID) throw new Error("SANITY_PROJECT_ID is not configured");

    const SANITY_API_TOKEN = Deno.env.get("SANITY_API_TOKEN");
    if (!SANITY_API_TOKEN) throw new Error("SANITY_API_TOKEN is not configured");

    const body = await req.json().catch(() => ({}));
    const template = typeof body?.template === "string" ? body.template : null;
    const params = (body?.params && typeof body.params === "object" && !Array.isArray(body.params))
      ? body.params as Record<string, unknown>
      : {};

    if (!template || !(template in TEMPLATES)) {
      return new Response(JSON.stringify({ error: "Unknown or missing template" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const tpl = TEMPLATES[template];

    // Reject any param key not declared by the template, and any unsafe value type.
    for (const key of Object.keys(params)) {
      if (!tpl.paramKeys.includes(key)) {
        return new Response(JSON.stringify({ error: "Invalid parameter" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (!isSafeParamValue(params[key])) {
        return new Response(JSON.stringify({ error: "Invalid parameter value" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const dataset = "production";
    const apiVersion = "2024-01-01";

    const url = new URL(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v${apiVersion}/data/query/${dataset}`
    );
    url.searchParams.set("query", tpl.query);
    for (const key of tpl.paramKeys) {
      if (key in params) {
        url.searchParams.set(`$${key}`, JSON.stringify(params[key]));
      }
    }

    const sanityRes = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${SANITY_API_TOKEN}`,
      },
    });

    if (!sanityRes.ok) {
      const upstream = await sanityRes.text();
      console.error(`Sanity API error [${sanityRes.status}]:`, upstream);
      return new Response(JSON.stringify({ error: "CMS query failed" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await sanityRes.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Sanity query error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
