import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PRINTFUL_API_URL = 'https://api.printful.com';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('PRINTFUL_API_KEY');
    
    if (!apiKey) {
      console.error('PRINTFUL_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Printful API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching products from Printful...');

    // Fetch sync products from Printful
    const response = await fetch(`${PRINTFUL_API_URL}/store/products`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Printful API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Printful API error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log(`Fetched ${data.result?.length || 0} products from Printful`);

    // Fetch detailed info for each product
    const detailedProducts = await Promise.all(
      (data.result || []).map(async (product: any) => {
        try {
          const detailResponse = await fetch(`${PRINTFUL_API_URL}/store/products/${product.id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
            },
          });

          if (detailResponse.ok) {
            const detailData = await detailResponse.json();
            return detailData.result;
          }
          return { sync_product: product, sync_variants: [] };
        } catch (err) {
          console.error(`Error fetching product ${product.id}:`, err);
          return { sync_product: product, sync_variants: [] };
        }
      })
    );

    return new Response(
      JSON.stringify({ products: detailedProducts }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in printful-products function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
