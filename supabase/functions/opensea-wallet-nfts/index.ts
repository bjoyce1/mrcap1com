import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const WALLET_ADDRESS = "0xf69120023756f1d1f539c23ade135efb66e3f494";
const CHAIN = "ethereum";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENSEA_API_KEY = Deno.env.get('OPENSEA_API_KEY');
    
    if (!OPENSEA_API_KEY) {
      console.error("Missing OPENSEA_API_KEY in environment variables");
      return new Response(
        JSON.stringify({ error: "Missing OPENSEA_API_KEY in environment variables" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = `https://api.opensea.io/api/v2/chain/${CHAIN}/account/${WALLET_ADDRESS}/nfts?limit=24`;
    
    console.log(`Fetching NFTs for wallet: ${WALLET_ADDRESS}`);

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
        JSON.stringify({ error: "Failed to fetch NFTs from OpenSea", details: errText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await res.json();
    console.log(`Successfully fetched ${data.nfts?.length || 0} NFTs`);
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error("API Route Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: "Server error contacting OpenSea", details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
