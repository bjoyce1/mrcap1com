
-- 1. Pricing columns
ALTER TABLE public.albums ADD COLUMN IF NOT EXISTS price_cents INTEGER NOT NULL DEFAULT 999;
ALTER TABLE public.tracks ADD COLUMN IF NOT EXISTS price_cents INTEGER NOT NULL DEFAULT 99;

-- 2. Purchases table
CREATE TYPE public.purchase_item_type AS ENUM ('track', 'album');
CREATE TYPE public.purchase_status AS ENUM ('created', 'paid', 'failed', 'refunded');

CREATE TABLE public.purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  item_type public.purchase_item_type NOT NULL,
  item_id UUID NOT NULL,
  paypal_order_id TEXT UNIQUE,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status public.purchase_status NOT NULL DEFAULT 'created',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  paid_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX idx_purchases_item ON public.purchases(item_type, item_id);
CREATE INDEX idx_purchases_status ON public.purchases(status);

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases"
  ON public.purchases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage purchases"
  ON public.purchases FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Service role bypasses RLS automatically; no explicit policy needed for inserts/updates from edge functions.

-- 3. Make audio bucket private
UPDATE storage.buckets SET public = false WHERE id = 'audio';

-- 4. Storage policies on audio bucket: only service role can read directly (default), 
-- public reads will go through edge functions (preview / signed download).
-- Drop any pre-existing public policies for the audio bucket if present.
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT polname FROM pg_policy
    WHERE polrelid = 'storage.objects'::regclass
      AND polname ILIKE '%audio%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', r.polname);
  END LOOP;
END $$;

-- Admins can manage audio files
CREATE POLICY "Admins can manage audio files"
  ON storage.objects FOR ALL
  USING (bucket_id = 'audio' AND public.has_role(auth.uid(), 'admin'));
