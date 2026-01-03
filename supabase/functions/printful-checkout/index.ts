import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PRINTFUL_API_URL = 'https://api.printful.com';

interface OrderItem {
  sync_variant_id: number;
  quantity: number;
}

interface ShippingAddress {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state_code: string;
  country_code: string;
  zip: string;
  phone?: string;
  email: string;
}

interface CreateOrderRequest {
  items: OrderItem[];
  shipping: ShippingAddress;
}

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

    const { items, shipping }: CreateOrderRequest = await req.json();

    // Validate input
    if (!items || items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No items provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!shipping || !shipping.name || !shipping.address1 || !shipping.city || !shipping.zip || !shipping.country_code || !shipping.email) {
      return new Response(
        JSON.stringify({ error: 'Incomplete shipping information' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating Printful order with items:', items);

    // First, get shipping rates
    const shippingRatePayload = {
      recipient: {
        name: shipping.name,
        address1: shipping.address1,
        address2: shipping.address2 || '',
        city: shipping.city,
        state_code: shipping.state_code || '',
        country_code: shipping.country_code,
        zip: shipping.zip,
      },
      items: items.map(item => ({
        sync_variant_id: item.sync_variant_id,
        quantity: item.quantity,
      })),
    };

    const shippingResponse = await fetch(`${PRINTFUL_API_URL}/shipping/rates`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shippingRatePayload),
    });

    let shippingRate = null;
    if (shippingResponse.ok) {
      const shippingData = await shippingResponse.json();
      // Get the cheapest shipping option
      if (shippingData.result && shippingData.result.length > 0) {
        shippingRate = shippingData.result.reduce((min: any, rate: any) => 
          parseFloat(rate.rate) < parseFloat(min.rate) ? rate : min
        );
      }
    }

    // Create the order
    const orderPayload = {
      recipient: {
        name: shipping.name,
        address1: shipping.address1,
        address2: shipping.address2 || '',
        city: shipping.city,
        state_code: shipping.state_code || '',
        country_code: shipping.country_code,
        zip: shipping.zip,
        phone: shipping.phone || '',
        email: shipping.email,
      },
      items: items.map(item => ({
        sync_variant_id: item.sync_variant_id,
        quantity: item.quantity,
      })),
    };

    const orderResponse = await fetch(`${PRINTFUL_API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload),
    });

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error('Printful order creation error:', orderResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: `Failed to create order: ${errorText}` }),
        { status: orderResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const orderData = await orderResponse.json();
    console.log('Order created successfully:', orderData.result.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        order: orderData.result,
        shipping_rate: shippingRate,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in printful-checkout function:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
