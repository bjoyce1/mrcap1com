import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENSEA_API_KEY = Deno.env.get('OPENSEA_API_KEY');
    
    if (!OPENSEA_API_KEY) {
      console.error("Missing OPENSEA_API_KEY in environment variables");
      return new Response(
        JSON.stringify({ error: "Missing OPENSEA_API_KEY" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let collectionSlug = "artofism";
    let limit = 50;
    
    try {
      const body = await req.json();
      collectionSlug = body.collection || collectionSlug;
      limit = body.limit || limit;
    } catch {
      // Use defaults
    }

    const url = `https://api.opensea.io/api/v2/collection/${collectionSlug}/nfts?limit=${limit}`;
    console.log(`Fetching NFTs from collection: ${collectionSlug}`);

    const res = await fetch(url, {
      headers: {
        "x-api-key": OPENSEA_API_KEY,
        "Accept": "application/json",
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("OpenSea Error:", errText);
      return new Response(
        JSON.stringify({ error: "Failed to fetch collection NFTs", details: errText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: "Server error", details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
