import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PRINTFUL_API_URL = 'https://api.printful.com';
const MAX_ITEMS = 50;
const MAX_QUANTITY = 100;
const MAX_FIELD_LENGTH = 200;

function validateString(val: unknown, maxLen: number): string | null {
  if (typeof val !== 'string') return null;
  return val.trim().slice(0, maxLen) || null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('PRINTFUL_API_KEY');
    
    if (!apiKey) {
      console.error('PRINTFUL_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Fulfillment service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { items, shipping } = body as Record<string, unknown>;

    // Validate items
    if (!Array.isArray(items) || items.length === 0 || items.length > MAX_ITEMS) {
      return new Response(
        JSON.stringify({ error: 'Invalid items' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    for (const item of items) {
      if (!item || typeof item !== 'object') {
        return new Response(
          JSON.stringify({ error: 'Invalid item format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const { sync_variant_id, quantity } = item as Record<string, unknown>;
      if (typeof sync_variant_id !== 'number' || !Number.isInteger(sync_variant_id) || sync_variant_id <= 0) {
        return new Response(
          JSON.stringify({ error: 'Invalid variant ID' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
        return new Response(
          JSON.stringify({ error: 'Invalid quantity' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Validate shipping
    if (!shipping || typeof shipping !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Missing shipping information' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const s = shipping as Record<string, unknown>;
    const name = validateString(s.name, MAX_FIELD_LENGTH);
    const address1 = validateString(s.address1, MAX_FIELD_LENGTH);
    const city = validateString(s.city, MAX_FIELD_LENGTH);
    const zip = validateString(s.zip, 20);
    const country_code = validateString(s.country_code, 3);
    const email = validateString(s.email, 255);

    if (!name || !address1 || !city || !zip || !country_code || !email) {
      return new Response(
        JSON.stringify({ error: 'Incomplete shipping information' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const address2 = validateString(s.address2, MAX_FIELD_LENGTH) || '';
    const state_code = validateString(s.state_code, 10) || '';
    const phone = validateString(s.phone, 20) || '';

    const validatedItems = items.map((item: any) => ({
      sync_variant_id: item.sync_variant_id,
      quantity: item.quantity,
    }));

    console.log('Creating Printful order with', validatedItems.length, 'items');

    // Get shipping rates
    const shippingRatePayload = {
      recipient: { name, address1, address2, city, state_code, country_code, zip },
      items: validatedItems,
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
      if (shippingData.result && shippingData.result.length > 0) {
        shippingRate = shippingData.result.reduce((min: any, rate: any) => 
          parseFloat(rate.rate) < parseFloat(min.rate) ? rate : min
        );
      }
    } else {
      console.error('Shipping rate fetch failed:', shippingResponse.status);
    }

    // Create order
    const orderPayload = {
      recipient: { name, address1, address2, city, state_code, country_code, zip, phone, email },
      items: validatedItems,
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
        JSON.stringify({ error: 'Failed to create order. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in printful-checkout function:', error);
    return new Response(
      JSON.stringify({ error: 'Order processing failed. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
