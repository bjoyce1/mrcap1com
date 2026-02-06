import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PAYPAL_API_URL = Deno.env.get('PAYPAL_MODE') === 'live' 
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

const ALLOWED_CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
const AMOUNT_RE = /^\d+(\.\d{1,2})?$/;
const MAX_DESCRIPTION_LENGTH = 200;
const PAYPAL_ORDER_ID_RE = /^[A-Z0-9]{10,20}$/;

async function getPayPalAccessToken(): Promise<string> {
  const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
  const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured');
  }

  const auth = btoa(`${clientId}:${clientSecret}`);

  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('PayPal auth error:', errorText);
    throw new Error('Payment service unavailable');
  }

  const data = await response.json();
  return data.access_token;
}

async function createPayPalOrder(amount: string, currency: string, description: string) {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount,
        },
        description: description,
      }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('PayPal create order error:', errorText);
    throw new Error('Failed to create payment order');
  }

  return await response.json();
}

async function capturePayPalOrder(orderId: string) {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('PayPal capture error:', errorText);
    throw new Error('Failed to capture payment');
  }

  return await response.json();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    if (action === 'create') {
      let body: unknown;
      try {
        body = await req.json();
      } catch {
        return new Response(
          JSON.stringify({ error: 'Invalid request body' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { amount, currency, description } = body as Record<string, unknown>;

      // Validate amount format
      if (typeof amount !== 'string' || !AMOUNT_RE.test(amount) || parseFloat(amount) <= 0 || parseFloat(amount) > 99999) {
        return new Response(
          JSON.stringify({ error: 'Invalid amount' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Validate currency
      const curr = typeof currency === 'string' ? currency.toUpperCase() : '';
      if (!ALLOWED_CURRENCIES.includes(curr)) {
        return new Response(
          JSON.stringify({ error: 'Unsupported currency' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Sanitize description
      const desc = typeof description === 'string'
        ? description.slice(0, MAX_DESCRIPTION_LENGTH)
        : 'Merchandise order';

      console.log('Creating PayPal order:', { amount, currency: curr });
      const order = await createPayPalOrder(amount, curr, desc);
      console.log('PayPal order created:', order.id);

      return new Response(
        JSON.stringify({ 
          success: true,
          orderId: order.id,
          status: order.status,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'capture') {
      let body: unknown;
      try {
        body = await req.json();
      } catch {
        return new Response(
          JSON.stringify({ error: 'Invalid request body' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { orderId } = body as Record<string, unknown>;

      // Validate orderId format
      if (typeof orderId !== 'string' || !PAYPAL_ORDER_ID_RE.test(orderId)) {
        return new Response(
          JSON.stringify({ error: 'Invalid order ID' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Capturing PayPal order:', orderId);
      const captureResult = await capturePayPalOrder(orderId);
      console.log('PayPal order captured:', captureResult.id, captureResult.status);

      return new Response(
        JSON.stringify({ 
          success: true,
          orderId: captureResult.id,
          status: captureResult.status,
          payer: captureResult.payer,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'client-id') {
      const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
      if (!clientId) {
        return new Response(
          JSON.stringify({ error: 'Payment service not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ clientId }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in paypal-checkout function:', error);
    return new Response(
      JSON.stringify({ error: 'Payment processing failed. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
