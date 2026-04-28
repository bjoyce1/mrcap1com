# Paid Music Downloads + 30-Second Previews (PayPal)

Sell albums for **$9.99** and singles for **$0.99** via PayPal, deliver downloadable audio after purchase, and limit unauthenticated visitors to **30-second previews**.

## What you'll get

1. **30-second previews for everyone** — anyone hitting Play in CAP STREAM hears a 30s clip, then is prompted to buy.
2. **Buy buttons** — "Buy Single $0.99" on every track row/page, "Buy Album $9.99" on every album page.
3. **PayPal checkout** using your existing PayPal credentials (same ones the merch flow uses).
4. **Library page** at `/library` — signed-in buyers see everything they've purchased, with a Download button (signed, time-limited URL).
5. **Order confirmation email** with download links (uses existing email infrastructure).

## User flow

```text
Visitor clicks Play
   └─> 30s preview plays, pauses with "Buy to keep listening"
       └─> Click Buy → Sign in → PayPal Checkout → Capture
           └─> Redirect to /library → Download (signed URL, 60s)
```

## Technical plan

### 1. Database (migration)
- Add `price_cents int` to `albums` (default 999) and `tracks` (default 99). Editable per-row in admin if you want exceptions later.
- New `purchases` table:
  - `id, user_id, item_type ('track'|'album'), item_id uuid, paypal_order_id text unique, amount_cents int, currency text default 'USD', status ('created'|'paid'|'failed'), created_at, paid_at`
  - RLS: users SELECT own rows; service role inserts/updates; admins manage all.
- No Stripe, no `products` table — PayPal orders are created on-demand from album/track price.

### 2. Storage / preview strategy
- Flip the existing `audio` bucket from **public → private** (migration).
- New edge function `audio-preview` (public, no JWT): streams bytes for **0–30s** using HTTP range requests against the private file. Used by StickyPlayer for non-buyers.
- New edge function `audio-download` (auth required): verifies the caller has a `paid` row in `purchases` for that track (or for the album that contains it), returns a 60-second **signed** Supabase storage URL.

### 3. PayPal edge functions (mirroring `printful-checkout`)
- `paypal-create-order` — input `{ item_type, item_id }`. Verifies user is signed in, looks up price, calls PayPal `/v2/checkout/orders` (Orders v2 REST API) using `PAYPAL_CLIENT_ID` + `PAYPAL_CLIENT_SECRET` (`PAYPAL_MODE` selects sandbox vs live). Inserts `purchases` row with `status='created'`. Returns PayPal `orderID`.
- `paypal-capture-order` — input `{ orderID }`. Captures the order via PayPal API, on success updates the `purchases` row to `status='paid'`, sets `paid_at`, enqueues confirmation email.
- Frontend uses `@paypal/react-paypal-js` SDK buttons (already a clean, secure integration pattern with the two functions above).

### 4. Frontend changes
- **`StickyPlayer.tsx`**: on track load, check ownership via a lightweight `/me/owned-tracks` query (cached in store). If not owned and not free, set `audio.src` to the preview endpoint, show "Buy $0.99" CTA at 25s, hard-pause at 30s with a buy modal.
- **`playerStore.ts`**: add `isPreview: boolean` and `ownedTrackIds: Set<string>` (hydrated on auth state change).
- **New `<BuyButton />` component**: renders PayPal buttons in a modal; used on TrackRow, AlbumPage, TrackPage.
- **New `/library` route**: lists purchases with Download buttons; calls `audio-download` to get a signed URL.
- **Auth gate**: buying requires sign-in (existing flow). Guest checkout out of scope for v1.

### 5. Email
- New template `purchase-confirmation.tsx` using existing email queue infrastructure. Includes a magic link to `/library` (no raw download URLs in email — keeps them short-lived).

### 6. Currency / tax
- USD only. No tax automation — flat prices, you handle reporting yourself. Easy to revisit later.

## Out of scope (v1)
- Guest checkout (buyer must sign in so we can attach the purchase).
- Bundle discounts, coupons, refunds UI (handle refunds in the PayPal dashboard; admin can manually flip `status` to `refunded` later).
- DRM — downloads are MP3/WAV. Once delivered, files can be copied. Industry standard.

## Order of operations after approval
1. Migration: add `price_cents` columns, create `purchases` table, flip `audio` bucket to private.
2. Build edge functions: `paypal-create-order`, `paypal-capture-order`, `audio-preview`, `audio-download`.
3. Add `@paypal/react-paypal-js` and build `<BuyButton />` modal.
4. Wire StickyPlayer preview logic + ownership hydration.
5. Build `/library` page.
6. Add purchase confirmation email template.
7. Test end-to-end in PayPal sandbox (your `PAYPAL_MODE` controls this), then flip to live.
