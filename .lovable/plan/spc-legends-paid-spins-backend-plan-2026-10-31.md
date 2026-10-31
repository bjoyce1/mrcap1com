# SPC Legends paid spins: backend plan

Backend only. No changes to src/features/legends, purchases, merch, music store, Fam points, PAYPAL_MODE or PayPal credentials. Nothing published. No dashes in copy or comments.

## Changes I recommend vs the brief

1. **Commit the spin and its result in one database call.** The brief takes the spin first, then writes results. If the function dies in between, the player loses a spin with no result. Instead the edge function generates and scores the board first, then calls one function that locks the row, takes the spin, writes XP and collection, and inserts the spin record together. It either all happens or none of it does.
2. **user_id is a plain uuid, not a foreign key to auth.users.** Project rule: only profiles and user_roles reference auth.users. Ownership is still enforced by RLS and the server.
3. **Idempotency works under races.** The unique (user_id, idempotency_key) index decides. Two parallel calls with the same key: one commits, the other gets the stored result. No spin is spent twice.
4. **Capture checks custom_id too.** The order's custom_id must equal `legends:<userId>`, plus amount 1.00 USD, plus status COMPLETED.
5. **Repeat capture.** If PayPal answers ORDER_ALREADY_CAPTURED, the function fetches the order, checks it, and runs the same atomic credit. That credit is a no-op if the row is already 'paid'.

## Tables (one migration)

```sql
CREATE TABLE public.legends_players (
  user_id uuid PRIMARY KEY,
  welcome_left int NOT NULL DEFAULT 25 CHECK (welcome_left BETWEEN 0 AND 25),
  paid_spins int NOT NULL DEFAULT 0 CHECK (paid_spins >= 0),
  spins_today int NOT NULL DEFAULT 0 CHECK (spins_today BETWEEN 0 AND 3),
  day date NOT NULL DEFAULT (now() AT TIME ZONE 'America/Chicago')::date,
  xp bigint NOT NULL DEFAULT 0, best int NOT NULL DEFAULT 0,
  total_spins int NOT NULL DEFAULT 0,
  collection text[] NOT NULL DEFAULT '{}', badges text[] NOT NULL DEFAULT '{}',
  last_board jsonb, last_spin_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.legends_spins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL, created_at timestamptz NOT NULL DEFAULT now(),
  idempotency_key text NOT NULL CHECK (length(idempotency_key) BETWEEN 8 AND 100),
  source text NOT NULL CHECK (source IN ('welcome','daily','paid')),
  board jsonb NOT NULL, wins jsonb NOT NULL, xp int NOT NULL,
  result jsonb NOT NULL,            -- full stored response for replays
  UNIQUE (user_id, idempotency_key)
);
CREATE INDEX ON public.legends_spins (user_id, created_at DESC);
CREATE TABLE public.legends_spin_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL, paypal_order_id text NOT NULL UNIQUE, paypal_capture_id text,
  amount_cents int NOT NULL DEFAULT 100 CHECK (amount_cents = 100),
  spins int NOT NULL DEFAULT 25 CHECK (spins = 25),
  status text NOT NULL DEFAULT 'created' CHECK (status IN ('created','paid','failed','refunded')),
  created_at timestamptz NOT NULL DEFAULT now(), paid_at timestamptz
);
-- For each table: GRANT SELECT TO authenticated; GRANT ALL TO service_role;
-- ENABLE RLS; one SELECT policy USING (user_id = auth.uid()). No insert/update/delete policies.
```

## Database functions (SECURITY DEFINER, search_path pinned, EXECUTE revoked from public/anon/authenticated, granted to service_role)

- `legends_commit_spin(_user uuid, _key text, _board jsonb, _wins jsonb, _xp int, _found text[], _unity boolean) returns jsonb`
  Creates the player row if missing (ON CONFLICT DO NOTHING), then SELECT ... FOR UPDATE. Returns the stored result if the key already exists. Resets spins_today when the Houston date changed. Refuses with `cooldown` if last_spin_at is under 1.2 seconds ago, or `no_spins` if nothing is left. Source order: welcome, then daily (spins_today < 3), then paid. Applies XP, best, total_spins, merged collection, badges ('six-legends' at 6 characters, 'spc-unity' on a unity win), last_board and last_spin_at, and inserts the legends_spins row. Returns `{ source, newCharacters, balance }`.
- `legends_credit_purchase(_user uuid, _order text, _capture text) returns jsonb`
  Updates the row from 'created' to 'paid' WHERE user_id and order match, and only if it is still 'created'. In the same statement (CTE), it adds 25 to paid_spins, creating the player row if missing. Returns the balance either way.
- `legends_balance(_user uuid) returns jsonb`: helper for daily rollover math.

## Edge functions (all POST, CORS, JWT checked with getClaims, Zod-validated input)

**legends-spin**: body `{ idempotencyKey: string }`.
It builds the board with the copied engine's `createBoard()` (crypto.getRandomValues) and scores it with `evaluateBoard()`, then calls `legends_commit_spin`.
200: `{ board, outcome: { wins, hitCells, xp, found, highest }, newCharacters, source, balance: { welcomeLeft, dailyLeft, paidSpins } }`.
429 `{ error: 'cooldown' }`, 402 `{ error: 'no_spins', balance }`, 401, 400.

**legends-spins-checkout**: no body is read. Returns 503 `{ error: 'Spin packs are not on sale yet' }` unless `LEGENDS_PAYMENTS_ENABLED === 'true'`. Otherwise it creates a PayPal order for 1.00 USD with `_shared/paypal.ts` (intent CAPTURE, description "SPC Legends: 25 spins", custom_id `legends:<userId>`, shipping_preference NO_SHIPPING). It then inserts a 'created' purchase row. 200 `{ orderID }`.

**legends-spins-capture**: body `{ orderID: string }`. Returns 404 if the row is not this user's. It captures with PayPal and checks status COMPLETED, amount 1.00 USD and custom_id. Then it calls `legends_credit_purchase`. On a failed check it marks the row 'failed'. 200 `{ balance }`.
Capture stays open when the flag is off, so an order approved just before the flag was turned off still credits.

**Balance read**: the page reads `legends_players` directly through RLS (select own row). A missing row means a new player: show 25 welcome, 3 daily, 0 paid. dailyLeft is `3 - spins_today` if `day` is today in Houston, otherwise 3. legends-spin also returns the balance after every spin.

## Shared engine copies
`supabase/functions/_shared/legends/config.ts` and `engine.ts` copied verbatim with `// @ts-nocheck` added at the top. Import paths get a `.ts` extension for Deno. The server never calls `applySpin`, `normalizeState` or the localStorage helpers; the SQL function owns state.

## Your PayPal client id question
Yes, `paypal-checkout` with action `client-id` is the right one. It returns the same PAYPAL_CLIENT_ID that `_shared/paypal.ts` uses to create orders, so the SDK and the orders always match the same account and mode. Load the SDK with `client-id=<that>&currency=USD&intent=capture`, never 'sb'.

## Risks
- **PAYPAL_MODE mismatch:** `_shared/paypal.ts` treats any casing of "live" as live, but `paypal-checkout` only matches exact `live`. Live credentials work today, so I would leave it as is (you asked me not to touch it).
- **Refunds:** no webhook in scope. A refund made in PayPal does not change the row or take spins back. Status 'refunded' would be set by hand.
- **Legal:** paid spins with random results can look like gambling to app stores and some regulators. Your rules help: no cash value, wins never add spins, no transfers. Legal review before turning the flag on is still worth it.
- **Abandoned orders** stay 'created' forever. This is harmless.
- The secret LEGENDS_PAYMENTS_ENABLED is left unset.

## Verification after build
Signed-in calls against the live functions: a new player spins (welcome count goes down), a replayed key returns the same board, a fast double spin gets cooldown, and checkout returns 503 with the flag unset. Capture failure paths will be tested with fake order ids. A real paid capture is not tested.
