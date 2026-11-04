-- SPC Legends launch (owner decisions 2026-11-04): 50 welcome spins, 20 free spins a day, spin packs from $1 to $100,
-- and at most $100 of spin packs per player per Houston day. Pack prices and sizes also live in
-- supabase/functions/_shared/legends/packs.ts; keep the two in step.

-- Allowances.
ALTER TABLE public.legends_players DROP CONSTRAINT IF EXISTS legends_players_welcome_left_check;
ALTER TABLE public.legends_players DROP CONSTRAINT IF EXISTS legends_players_spins_today_check;
ALTER TABLE public.legends_players ALTER COLUMN welcome_left SET DEFAULT 50;
ALTER TABLE public.legends_players ADD CONSTRAINT legends_players_welcome_left_check CHECK (welcome_left BETWEEN 0 AND 50);
ALTER TABLE public.legends_players ADD CONSTRAINT legends_players_spins_today_check CHECK (spins_today BETWEEN 0 AND 20);
-- Players who started under the old 25 get the other 25, so every account starts with 50.
UPDATE public.legends_players SET welcome_left = LEAST(50, welcome_left + 25), updated_at = now();

-- Spin packs.
ALTER TABLE public.legends_spin_purchases DROP CONSTRAINT IF EXISTS legends_spin_purchases_amount_cents_check;
ALTER TABLE public.legends_spin_purchases DROP CONSTRAINT IF EXISTS legends_spin_purchases_spins_check;
ALTER TABLE public.legends_spin_purchases ADD COLUMN IF NOT EXISTS pack text NOT NULL DEFAULT 'p1';
ALTER TABLE public.legends_spin_purchases ADD CONSTRAINT legends_spin_purchases_pack_check CHECK (
  (pack, amount_cents, spins) IN (('p1', 100, 25), ('p5', 500, 150), ('p10', 1000, 350), ('p25', 2500, 1000), ('p50', 5000, 2250), ('p100', 10000, 5000))
);

-- Cents a player has committed to spin packs today (Houston time): paid today, plus checkouts opened in the last
-- 30 minutes that may still be paid. The checkout function refuses a pack that would pass the daily cap.
CREATE OR REPLACE FUNCTION public.legends_spent_today(_user uuid)
RETURNS int LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(SUM(amount_cents), 0)::int FROM public.legends_spin_purchases
   WHERE user_id = _user AND (
     (status = 'paid' AND (paid_at AT TIME ZONE 'America/Chicago')::date = (now() AT TIME ZONE 'America/Chicago')::date)
     OR (status = 'created' AND created_at > now() - interval '30 minutes'));
$$;
REVOKE ALL ON FUNCTION public.legends_spent_today(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.legends_spent_today(uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.legends_balance(_user uuid)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(
    (SELECT jsonb_build_object(
      'welcomeLeft', p.welcome_left,
      'dailyLeft', CASE WHEN p.day = (now() AT TIME ZONE 'America/Chicago')::date THEN 20 - p.spins_today ELSE 20 END,
      'paidSpins', p.paid_spins)
     FROM public.legends_players p WHERE p.user_id = _user),
    jsonb_build_object('welcomeLeft', 50, 'dailyLeft', 20, 'paidSpins', 0));
$$;

-- Same as 0003, with 20 daily spins.
CREATE OR REPLACE FUNCTION public.legends_commit_spin(_user uuid, _key text, _board jsonb, _outcome jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  p public.legends_players%ROWTYPE;
  existing jsonb;
  today date := (now() AT TIME ZONE 'America/Chicago')::date;
  src text;
  gained int := COALESCE((_outcome->>'xp')::int, 0);
  found text[];
  new_collection text[];
  new_chars text[];
  new_badges text[];
  result jsonb;
BEGIN
  INSERT INTO public.legends_players (user_id) VALUES (_user) ON CONFLICT (user_id) DO NOTHING;
  SELECT * INTO p FROM public.legends_players WHERE user_id = _user FOR UPDATE;

  SELECT s.result INTO existing FROM public.legends_spins s WHERE s.user_id = _user AND s.idempotency_key = _key;
  IF existing IS NOT NULL THEN
    RETURN existing || jsonb_build_object('replayed', true);
  END IF;

  IF p.day <> today THEN p.day := today; p.spins_today := 0; END IF;

  IF p.last_spin_at IS NOT NULL AND now() - p.last_spin_at < interval '1.2 seconds' THEN
    RETURN jsonb_build_object('error', 'cooldown');
  END IF;

  IF p.welcome_left > 0 THEN src := 'welcome'; p.welcome_left := p.welcome_left - 1;
  ELSIF p.spins_today < 20 THEN src := 'daily'; p.spins_today := p.spins_today + 1;
  ELSIF p.paid_spins > 0 THEN src := 'paid'; p.paid_spins := p.paid_spins - 1;
  ELSE
    UPDATE public.legends_players SET day = p.day, spins_today = p.spins_today, updated_at = now() WHERE user_id = _user;
    RETURN jsonb_build_object('error', 'no_spins', 'balance', jsonb_build_object('welcomeLeft', p.welcome_left, 'dailyLeft', 20 - p.spins_today, 'paidSpins', p.paid_spins));
  END IF;

  found := ARRAY(SELECT jsonb_array_elements_text(COALESCE(_outcome->'found', '[]'::jsonb)));
  new_chars := ARRAY(SELECT DISTINCT f FROM unnest(found) f WHERE NOT (f = ANY(p.collection)));
  new_collection := p.collection || new_chars;
  new_badges := p.badges;
  IF cardinality(new_collection) >= 6 AND NOT ('six-legends' = ANY(new_badges)) THEN
    new_badges := array_append(new_badges, 'six-legends'::text);
  END IF;
  IF EXISTS (SELECT 1 FROM jsonb_array_elements(COALESCE(_outcome->'wins', '[]'::jsonb)) w WHERE w->>'type' = 'unity')
     AND NOT ('spc-unity' = ANY(new_badges)) THEN
    new_badges := array_append(new_badges, 'spc-unity'::text);
  END IF;
  IF EXISTS (SELECT 1 FROM jsonb_array_elements(COALESCE(_outcome->'wins', '[]'::jsonb)) w WHERE w->>'type' = 'supreme')
     AND NOT ('supreme-legends' = ANY(new_badges)) THEN
    new_badges := array_append(new_badges, 'supreme-legends'::text);
  END IF;

  UPDATE public.legends_players SET
    welcome_left = p.welcome_left, paid_spins = p.paid_spins, spins_today = p.spins_today, day = p.day,
    xp = p.xp + gained, best = GREATEST(p.best, gained), total_spins = p.total_spins + 1,
    collection = new_collection, badges = new_badges, last_board = _board,
    last_spin_at = now(), updated_at = now()
  WHERE user_id = _user;

  result := jsonb_build_object(
    'board', _board, 'outcome', _outcome, 'newCharacters', to_jsonb(new_chars), 'source', src,
    'balance', jsonb_build_object('welcomeLeft', p.welcome_left, 'dailyLeft', 20 - p.spins_today, 'paidSpins', p.paid_spins));

  INSERT INTO public.legends_spins (user_id, idempotency_key, source, board, wins, xp, result)
  VALUES (_user, _key, src, _board, COALESCE(_outcome->'wins', '[]'::jsonb), gained, result);

  RETURN result;
END;
$$;
REVOKE ALL ON FUNCTION public.legends_balance(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.legends_commit_spin(uuid, text, jsonb, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.legends_balance(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.legends_commit_spin(uuid, text, jsonb, jsonb) TO service_role;
