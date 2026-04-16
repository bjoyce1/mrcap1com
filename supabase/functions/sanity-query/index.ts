import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SANITY_PROJECT_ID = Deno.env.get("SANITY_PROJECT_ID");
    if (!SANITY_PROJECT_ID) throw new Error("SANITY_PROJECT_ID is not configured");

    const SANITY_API_TOKEN = Deno.env.get("SANITY_API_TOKEN");
    if (!SANITY_API_TOKEN) throw new Error("SANITY_API_TOKEN is not configured");

    const { query, params } = await req.json();
    if (!query) {
      return new Response(JSON.stringify({ error: "Missing 'query' field" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const dataset = "production";
    const apiVersion = "2024-01-01";

    // Build GROQ query URL
    const url = new URL(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v${apiVersion}/data/query/${dataset}`
    );
    url.searchParams.set("query", query);

    // Add any parameters as $key=value
    if (params && typeof params === "object") {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(`$${key}`, JSON.stringify(value));
      }
    }

    const sanityRes = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${SANITY_API_TOKEN}`,
      },
    });

    if (!sanityRes.ok) {
      const body = await sanityRes.text();
      console.error(`Sanity API error [${sanityRes.status}]:`, body);
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
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
