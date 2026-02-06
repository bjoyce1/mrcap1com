import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SLUG_RE = /^[a-zA-Z0-9_-]{1,100}$/;
const MAX_LIMIT = 200;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENSEA_API_KEY = Deno.env.get('OPENSEA_API_KEY');
    
    if (!OPENSEA_API_KEY) {
      console.error("Missing OPENSEA_API_KEY");
      return new Response(
        JSON.stringify({ error: "Service not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let collectionSlug = "artofism";
    let limit = 50;
    
    try {
      const body = await req.json();
      if (typeof body.collection === 'string' && SLUG_RE.test(body.collection)) {
        collectionSlug = body.collection;
      }
      if (typeof body.limit === 'number' && Number.isInteger(body.limit) && body.limit > 0 && body.limit <= MAX_LIMIT) {
        limit = body.limit;
      }
    } catch {
      // Use defaults
    }

    const url = `https://api.opensea.io/api/v2/collection/${encodeURIComponent(collectionSlug)}/nfts?limit=${limit}`;
    console.log(`Fetching NFTs from collection: ${collectionSlug}`);

    const res = await fetch(url, {
      headers: {
        "x-api-key": OPENSEA_API_KEY,
        "Accept": "application/json",
      },
    });

    if (!res.ok) {
      console.error("OpenSea Error:", res.status);
      return new Response(
        JSON.stringify({ error: "Failed to fetch collection NFTs" }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await res.json();
    console.log(`Successfully fetched ${data.nfts?.length || 0} NFTs from ${collectionSlug}`);
    
    return new Response(JSON.stringify({
      nfts: data.nfts || [],
      next: data.next || null
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error("API Route Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to load NFTs" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
