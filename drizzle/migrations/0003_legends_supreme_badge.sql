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
  ELSIF p.spins_today < 3 THEN src := 'daily'; p.spins_today := p.spins_today + 1;
  ELSIF p.paid_spins > 0 THEN src := 'paid'; p.paid_spins := p.paid_spins - 1;
  ELSE
    UPDATE public.legends_players SET day = p.day, spins_today = p.spins_today, updated_at = now() WHERE user_id = _user;
    RETURN jsonb_build_object('error', 'no_spins', 'balance', jsonb_build_object('welcomeLeft', p.welcome_left, 'dailyLeft', 3 - p.spins_today, 'paidSpins', p.paid_spins));
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
    'balance', jsonb_build_object('welcomeLeft', p.welcome_left, 'dailyLeft', 3 - p.spins_today, 'paidSpins', p.paid_spins));

  INSERT INTO public.legends_spins (user_id, idempotency_key, source, board, wins, xp, result)
  VALUES (_user, _key, src, _board, COALESCE(_outcome->'wins', '[]'::jsonb), gained, result);

  RETURN result;
END;
$$;
REVOKE ALL ON FUNCTION public.legends_commit_spin(uuid, text, jsonb, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.legends_commit_spin(uuid, text, jsonb, jsonb) TO service_role;