## Problem

Customer paid via PayPal, but no Printful order was created and no row exists in `merch_orders` (confirmed: table is empty). The `printful-checkout` Edge Function returned **400** on the fulfill call, meaning a validation check rejected the request *after* PayPal already captured the money — and because the order is only recorded after that validation passes, the paid order vanished.

Edge logs show only the HTTP status (400), not which field failed, so we are blind to the actual cause (most likely a `state_code`/`country_code`/`sync_variant_id` validation mismatch, or a stale `variantId` stored as string in the persisted Zustand cart).

## Fix

### 1. `supabase/functions/printful-checkout/index.ts`
- **Always record the paid order first.** If `paypal_order_id` is supplied and verifies as COMPLETED, insert a `merch_orders` row with `status='paid'` BEFORE any items/shipping/Printful validation. The paid order is never lost again.
- **Never return 400 after payment is captured.** After successful PayPal verification, any subsequent failure (item/shipping validation, Printful API error, shipping rate lookup) updates the row to `status='fulfillment_failed'` with `error_detail`, and returns `200 { success:false, paid:true, error: "<reason>" }` so the existing frontend fallback shows the "Payment received, order on file" message.
- **Log specifics:** `console.error` the exact validation failure (which field, what value-type was received) and log the raw `paypal_order_id` and item count on every fulfill request.
- Keep the existing 400 behavior **only** for the pre-payment `action=quote` path.

### 2. `src/components/merch/CheckoutPanel.tsx`
- Coerce cart fields defensively before sending: `sync_variant_id: Number(item.variantId)`, `quantity: Number(item.quantity)`. Guards against the persisted-cart edge case where a value came in as a string.
- Trim `state_code` to uppercase and send `undefined` (not empty string) for blank optional fields, matching server expectations.

### 3. `src/stores/cartStore.ts`
- Bump the `persist` `name` to `printful-cart-v2` (or add a migration) so any previously-persisted carts with bad types are discarded on next load.

## Out of scope
No UI/visual changes, no PayPal flow changes, no schema migration (the `merch_orders` table and columns already exist).

## How to verify
1. Place a test order with a valid US address — confirm a row appears in `merch_orders` with `status='fulfillment_created'` and a `printful_order_id`.
2. Temporarily send a bad `country_code` — confirm payment captures, row inserted with `status='fulfillment_failed'`, frontend shows the fallback toast, and `error_detail` contains the specific reason.
3. Check Edge Function logs — every failure now has a descriptive `console.error` line.
