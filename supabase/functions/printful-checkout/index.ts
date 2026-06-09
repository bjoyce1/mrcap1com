import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PRINTFUL_API_URL = 'https://api.printful.com';
const MAX_ITEMS = 50;
const MAX_QUANTITY = 100;
const MAX_FIELD_LENGTH = 200;

const PAYPAL_API_URL = Deno.env.get('PAYPAL_MODE') === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function validateString(val: unknown, maxLen: number): string | null {
  if (typeof val !== 'string') return null;
  return val.trim().slice(0, maxLen) || null;
}

interface ValidatedItem { sync_variant_id: number; quantity: number }
interface Recipient {
  name: string; address1: string; address2: string; city: string;
  state_code: string; country_code: string; zip: string; phone: string; email: string;
}

function validateItems(items: unknown): ValidatedItem[] | string {
  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_ITEMS) return 'Invalid items';
  const out: ValidatedItem[] = [];
  for (const item of items) {
    if (!item || typeof item !== 'object') return 'Invalid item format';
    const { sync_variant_id, quantity } = item as Record<string, unknown>;
    if (typeof sync_variant_id !== 'number' || !Number.isInteger(sync_variant_id) || sync_variant_id <= 0) return 'Invalid variant ID';
    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) return 'Invalid quantity';
    out.push({ sync_variant_id, quantity });
  }
  return out;
}

function validateShipping(shipping: unknown): Recipient | string {
  if (!shipping || typeof shipping !== 'object') return 'Missing shipping information';
  const s = shipping as Record<string, unknown>;
  const name = validateString(s.name, MAX_FIELD_LENGTH);
  const address1 = validateString(s.address1, MAX_FIELD_LENGTH);
  const city = validateString(s.city, MAX_FIELD_LENGTH);
  const zip = validateString(s.zip, 20);
  const country_code = validateString(s.country_code, 3);
  const email = validateString(s.email, 255);
  if (!name || !address1 || !city || !zip || !country_code || !email) return 'Incomplete shipping information';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email address';
  return {
    name, address1, city, zip, country_code, email,
    address2: validateString(s.address2, MAX_FIELD_LENGTH) || '',
    state_code: validateString(s.state_code, 10) || '',
    phone: validateString(s.phone, 20) || '',
  };
}

/** Compute the authoritative order total from Printful retail prices + cheapest shipping rate. */
async function computeQuote(apiKey: string, items: ValidatedItem[], recipient: Recipient) {
  let subtotalCents = 0;
  let currency = 'USD';

  for (const item of items) {
    const res = await fetch(`${PRINTFUL_API_URL}/store/variants/${item.sync_variant_id}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });
    if (!res.ok) throw new Error(`Variant ${item.sync_variant_id} lookup failed (${res.status})`);
    const data = await res.json();
    const v = data.result?.sync_variant ?? data.result;
    const retail = parseFloat(v?.retail_price);
    if (!Number.isFinite(retail) || retail <= 0) throw new Error(`Variant ${item.sync_variant_id} has no retail price`);
    if (v?.currency) currency = v.currency;
    subtotalCents += Math.round(retail * 100) * item.quantity;
  }

  const ratesRes = await fetch(`${PRINTFUL_API_URL}/shipping/rates`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient: {
        name: recipient.name, address1: recipient.address1, address2: recipient.address2,
        city: recipient.city, state_code: recipient.state_code,
        country_code: recipient.country_code, zip: recipient.zip,
      },
      items,
    }),
  });
  if (!ratesRes.ok) throw new Error(`Shipping rate lookup failed (${ratesRes.status})`);
  const ratesData = await ratesRes.json();
  const rates = ratesData.result || [];
  if (rates.length === 0) throw new Error('No shipping options available for this address');
  const cheapest = rates.reduce((min: any, r: any) => parseFloat(r.rate) < parseFloat(min.rate) ? r : min);
  const shippingCents = Math.round(parseFloat(cheapest.rate) * 100);

  return {
    subtotal_cents: subtotalCents,
    shipping_cents: shippingCents,
    total_cents: subtotalCents + shippingCents,
    currency,
    shipping_name: cheapest.name || 'Standard shipping',
  };
}

/** Verify a PayPal order is captured and return the captured amount in cents. */
async function verifyPayPalCapture(paypalOrderId: string) {
  const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
  const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET');
  if (!clientId || !clientSecret) throw new Error('PayPal not configured');

  const tokenRes = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  if (!tokenRes.ok) throw new Error('PayPal auth failed');
  const { access_token } = await tokenRes.json();

  const orderRes = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}`, {
    headers: { 'Authorization': `Bearer ${access_token}` },
  });
  if (!orderRes.ok) throw new Error('PayPal order lookup failed');
  const order = await orderRes.json();

  if (order.status !== 'COMPLETED') throw new Error('Payment not completed');
  const capture = order.purchase_units?.[0]?.payments?.captures?.[0];
  if (!capture || capture.status !== 'COMPLETED') throw new Error('Payment capture not found');

  return {
    captureId: capture.id as string,
    paidCents: Math.round(parseFloat(capture.amount.value) * 100),
    currency: capture.amount.currency_code as string,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('PRINTFUL_API_KEY');
    if (!apiKey) {
      console.error('PRINTFUL_API_KEY not configured');
      return json({ error: 'Fulfillment service not configured' }, 500);
    }

    let body: unknown;
    try { body = await req.json(); } catch { return json({ error: 'Invalid request body' }, 400); }

    const { items: rawItems, shipping: rawShipping, paypal_order_id } = body as Record<string, unknown>;

    const items = validateItems(rawItems);
    if (typeof items === 'string') return json({ error: items }, 400);

    const recipient = validateShipping(rawShipping);
    if (typeof recipient === 'string') return json({ error: recipient }, 400);

    const action = new URL(req.url).searchParams.get('action');

    // ── QUOTE: server-priced subtotal + shipping, called before payment ──
    if (action === 'quote') {
      const quote = await computeQuote(apiKey, items, recipient);
      console.log('Quote:', quote);
      return json({ success: true, quote });
    }

    // ── FULFILL: verify payment, record order, create Printful order ──
    const paypalOrderId = validateString(paypal_order_id, 64);
    if (!paypalOrderId) return json({ error: 'Missing payment reference' }, 400);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Idempotency: if this PayPal order was already fulfilled, return the existing record
    const { data: existing } = await supabase
      .from('merch_orders')
      .select('id, printful_order_id, status')
      .eq('paypal_order_id', paypalOrderId)
      .maybeSingle();
    if (existing?.printful_order_id) {
      console.log('Duplicate fulfillment call for', paypalOrderId);
      return json({ success: true, order: { id: existing.printful_order_id }, duplicate: true });
    }

    // Recompute the authoritative total and verify the payment covers it
    const quote = await computeQuote(apiKey, items, recipient);
    const payment = await verifyPayPalCapture(paypalOrderId);

    if (payment.currency !== 'USD' || payment.paidCents + 1 < quote.total_cents) {
      console.error('Payment mismatch:', { paid: payment.paidCents, required: quote.total_cents, currency: payment.currency });
      return json({ error: 'Payment amount does not match order total' }, 402);
    }

    // Record the paid order BEFORE attempting fulfillment
    const { data: orderRow, error: insertError } = await supabase
      .from('merch_orders')
      .insert({
        customer_name: recipient.name,
        email: recipient.email,
        items: items,
        shipping_address: recipient,
        subtotal_cents: quote.subtotal_cents,
        shipping_cents: quote.shipping_cents,
        total_cents: quote.total_cents,
        currency: quote.currency,
        paypal_order_id: paypalOrderId,
        paypal_capture_id: payment.captureId,
        status: 'paid',
      })
      .select('id')
      .single();
    if (insertError) console.error('Order record insert failed:', insertError);

    // Create the Printful order. Auto-confirm only if explicitly enabled.
    const autoConfirm = Deno.env.get('PRINTFUL_AUTO_CONFIRM') === 'true';
    const orderResponse = await fetch(`${PRINTFUL_API_URL}/orders${autoConfirm ? '?confirm=true' : ''}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        external_id: orderRow?.id ?? paypalOrderId,
        recipient,
        items,
        retail_costs: {
          subtotal: (quote.subtotal_cents / 100).toFixed(2),
          shipping: (quote.shipping_cents / 100).toFixed(2),
        },
      }),
    });

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error('Printful order creation error:', orderResponse.status, errorText);
      if (orderRow) {
        await supabase.from('merch_orders')
          .update({ status: 'fulfillment_failed', error_detail: `Printful ${orderResponse.status}: ${errorText.slice(0, 500)}` })
          .eq('id', orderRow.id);
      }
      // Payment WAS captured; tell the client so the customer gets the right message
      return json({ error: 'Payment received but fulfillment could not be created. We have your order on file and will process it manually.', paid: true }, 500);
    }

    const orderData = await orderResponse.json();
    console.log('Printful order created:', orderData.result.id, autoConfirm ? '(auto-confirmed)' : '(draft, awaiting confirmation)');

    if (orderRow) {
      await supabase.from('merch_orders')
        .update({
          status: 'fulfillment_created',
          printful_order_id: String(orderData.result.id),
          printful_status: orderData.result.status ?? null,
        })
        .eq('id', orderRow.id);
    }

    return json({
      success: true,
      order: orderData.result,
      totals: quote,
    });
  } catch (error) {
    console.error('Error in printful-checkout function:', error);
    const message = error instanceof Error ? error.message : 'Order processing failed';
    return json({ error: message }, 500);
  }
});
