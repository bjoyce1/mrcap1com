ALTER TABLE public.legends_players
  ADD COLUMN IF NOT EXISTS coins_spent bigint NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS unlocks text[] NOT NULL DEFAULT '{}';

CREATE TABLE public.legends_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  item_id text NOT NULL,
  cost integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_id)
);
GRANT SELECT ON public.legends_redemptions TO authenticated;
GRANT ALL ON public.legends_redemptions TO service_role;
ALTER TABLE public.legends_redemptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Players read own redemptions" ON public.legends_redemptions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Coins are earned XP minus coins spent. Spending never lowers XP.
CREATE OR REPLACE FUNCTION public.legends_redeem(_user uuid, _item text, _cost integer, _artist text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE p public.legends_players;
BEGIN
  IF _cost <= 0 THEN RETURN jsonb_build_object('error','bad_item'); END IF;
  SELECT * INTO p FROM public.legends_players WHERE user_id = _user FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('error','not_enough', 'coins', 0); END IF;
  IF _item = ANY(p.unlocks) OR (_artist IS NOT NULL AND _artist = ANY(p.collection)) THEN
    RETURN jsonb_build_object('error','owned');
  END IF;
  IF p.xp - p.coins_spent < _cost THEN
    RETURN jsonb_build_object('error','not_enough','coins', p.xp - p.coins_spent);
  END IF;
  UPDATE public.legends_players SET
    coins_spent = coins_spent + _cost,
    unlocks = array_append(unlocks, _item),
    collection = CASE WHEN _artist IS NULL THEN collection ELSE array_append(collection, _artist) END,
    updated_at = now()
  WHERE user_id = _user RETURNING * INTO p;
  INSERT INTO public.legends_redemptions(user_id, item_id, cost) VALUES (_user, _item, _cost);
  RETURN jsonb_build_object('coins', p.xp - p.coins_spent, 'unlocks', to_jsonb(p.unlocks), 'collection', to_jsonb(p.collection));
END $$;
REVOKE ALL ON FUNCTION public.legends_redeem(uuid, text, integer, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.legends_redeem(uuid, text, integer, text) TO service_role;