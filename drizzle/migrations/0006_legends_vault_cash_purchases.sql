CREATE TABLE public.legends_vault_purchases (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL,
 item_id text NOT NULL CHECK(item_id IN ('legend-k-rino','legend-mr-cap','legend-klondike-kat','legend-point-blank','legend-k-water','legend-cl-che','legend-murder-one','legend-rapper-k','legend-komodo-dbx','legend-ganxsta-nip','legend-dope-e','skin-purple-lightning','skin-diamond-ice','skin-houston-chrome','title-third-coast-rider','title-south-park-original','title-coalition-captain','title-houston-royalty')),
 amount_cents integer NOT NULL DEFAULT 99 CHECK(amount_cents = 99),
 currency text NOT NULL DEFAULT 'USD' CHECK(currency = 'USD'),
 paypal_order_id text UNIQUE, paypal_capture_id text UNIQUE,
 status text NOT NULL DEFAULT 'creating' CHECK(status IN ('creating','created','paid','failed')),
 created_at timestamptz NOT NULL DEFAULT now(), paid_at timestamptz
);
GRANT SELECT ON public.legends_vault_purchases TO authenticated;
GRANT ALL ON public.legends_vault_purchases TO service_role;
ALTER TABLE public.legends_vault_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Players read own Vault purchases" ON public.legends_vault_purchases FOR SELECT TO authenticated USING(auth.uid() = user_id);
CREATE UNIQUE INDEX legends_vault_one_purchase ON public.legends_vault_purchases(user_id,item_id) WHERE status IN ('creating','created','paid');
CREATE FUNCTION public.legends_vault_credit(_user uuid, _order text, _capture text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE r public.legends_vault_purchases; p public.legends_players; artist text;
BEGIN
 SELECT * INTO r FROM public.legends_vault_purchases WHERE user_id = _user AND paypal_order_id = _order FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Order not found'; END IF;
 IF r.status NOT IN ('paid','created') THEN RAISE EXCEPTION 'Order not payable'; END IF;
 INSERT INTO public.legends_players(user_id) VALUES(_user) ON CONFLICT(user_id) DO NOTHING;
 SELECT * INTO p FROM public.legends_players WHERE user_id = _user FOR UPDATE;
 IF r.status = 'created' THEN
  IF _capture IS NULL OR length(_capture) < 5 THEN RAISE EXCEPTION 'Capture required'; END IF;
  artist := CASE WHEN r.item_id LIKE 'legend-%' THEN substr(r.item_id,8) ELSE NULL END;
  UPDATE public.legends_players SET
   unlocks = CASE WHEN r.item_id = ANY(unlocks) THEN unlocks ELSE array_append(unlocks,r.item_id) END,
   collection = CASE WHEN artist IS NULL OR artist = ANY(collection) THEN collection ELSE array_append(collection,artist) END,
   updated_at = now() WHERE user_id = _user RETURNING * INTO p;
  UPDATE public.legends_vault_purchases SET status='paid',paypal_capture_id=_capture,paid_at=now() WHERE id=r.id;
 END IF;
 RETURN jsonb_build_object('xp',p.xp,'coins',greatest(0,p.xp-p.coins_spent),'unlocks',to_jsonb(p.unlocks),'collection',to_jsonb(p.collection));
END $$;
REVOKE ALL ON FUNCTION public.legends_vault_credit(uuid,text,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.legends_vault_credit(uuid,text,text) TO service_role;