import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const WALLET_ADDRESS = "0xf69120023756f1d1f539c23ade135efb66e3f494";
const CHAIN = "ethereum";

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

    let nextCursor = "";
    try {
      const body = await req.json();
      if (typeof body.next === 'string' && body.next.length <= 500) {
        nextCursor = body.next;
      }
    } catch {
      // No body, use defaults
    }

    let url = `https://api.opensea.io/api/v2/chain/${CHAIN}/account/${WALLET_ADDRESS}/nfts?limit=24`;
    
    if (nextCursor) {
      url += `&next=${encodeURIComponent(nextCursor)}`;
    }
    
    console.log(`Fetching NFTs for wallet: ${WALLET_ADDRESS}`);

    const res = await fetch(url, {
      headers: {
        "x-api-key": OPENSEA_API_KEY,
        "Accept": "application/json",
      },
    });

    if (!res.ok) {
      console.error("OpenSea Error:", res.status);
      return new Response(
        JSON.stringify({ error: "Failed to fetch NFTs" }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await res.json();
    console.log(`Successfully fetched ${data.nfts?.length || 0} NFTs`);
    
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
