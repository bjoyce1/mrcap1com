CREATE TABLE public.legends_players (
  user_id uuid PRIMARY KEY,
  welcome_left int NOT NULL DEFAULT 25 CHECK (welcome_left BETWEEN 0 AND 25),
  paid_spins int NOT NULL DEFAULT 0 CHECK (paid_spins >= 0),
  spins_today int NOT NULL DEFAULT 0 CHECK (spins_today BETWEEN 0 AND 3),
  day date NOT NULL DEFAULT (now() AT TIME ZONE 'America/Chicago')::date,
  xp bigint NOT NULL DEFAULT 0,
  best int NOT NULL DEFAULT 0,
  total_spins int NOT NULL DEFAULT 0,
  collection text[] NOT NULL DEFAULT '{}',
  badges text[] NOT NULL DEFAULT '{}',
  last_board jsonb,
  last_spin_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.legends_players TO authenticated;
GRANT ALL ON public.legends_players TO service_role;
ALTER TABLE public.legends_players ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Players read own legends row" ON public.legends_players FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.legends_spins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  idempotency_key text NOT NULL CHECK (length(idempotency_key) BETWEEN 8 AND 100),
  source text NOT NULL CHECK (source IN ('welcome','daily','paid')),
  board jsonb NOT NULL,
  wins jsonb NOT NULL,
  xp int NOT NULL,
  result jsonb NOT NULL,
  UNIQUE (user_id, idempotency_key)
);
CREATE INDEX legends_spins_user_created_idx ON public.legends_spins (user_id, created_at DESC);
GRANT SELECT ON public.legends_spins TO authenticated;
GRANT ALL ON public.legends_spins TO service_role;
ALTER TABLE public.legends_spins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Players read own legends spins" ON public.legends_spins FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.legends_spin_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  paypal_order_id text NOT NULL UNIQUE,
  paypal_capture_id text,
  amount_cents int NOT NULL DEFAULT 100 CHECK (amount_cents = 100),
  spins int NOT NULL DEFAULT 25 CHECK (spins = 25),
  status text NOT NULL DEFAULT 'created' CHECK (status IN ('created','paid','failed','refunded')),
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz
);
CREATE INDEX legends_spin_purchases_user_idx ON public.legends_spin_purchases (user_id, created_at DESC);
GRANT SELECT ON public.legends_spin_purchases TO authenticated;
GRANT ALL ON public.legends_spin_purchases TO service_role;
ALTER TABLE public.legends_spin_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Players read own legends purchases" ON public.legends_spin_purchases FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.legends_balance(_user uuid)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(
    (SELECT jsonb_build_object(
      'welcomeLeft', p.welcome_left,
      'dailyLeft', CASE WHEN p.day = (now() AT TIME ZONE 'America/Chicago')::date THEN 3 - p.spins_today ELSE 3 END,
      'paidSpins', p.paid_spins)
     FROM public.legends_players p WHERE p.user_id = _user),
    jsonb_build_object('welcomeLeft', 25, 'dailyLeft', 3, 'paidSpins', 0));
$$;

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
  IF cardinality(new_collection) >= 6 AND NOT ('six-legends' = ANY(new_badges)) THEN new_badges := new_badges || 'six-legends'; END IF;
  IF EXISTS (SELECT 1 FROM jsonb_array_elements(COALESCE(_outcome->'wins', '[]'::jsonb)) w WHERE w->>'type' = 'unity')
     AND NOT ('spc-unity' = ANY(new_badges)) THEN new_badges := new_badges || 'spc-unity'; END IF;

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

CREATE OR REPLACE FUNCTION public.legends_credit_purchase(_user uuid, _order text, _capture text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE credited int;
BEGIN
  INSERT INTO public.legends_players (user_id) VALUES (_user) ON CONFLICT (user_id) DO NOTHING;
  WITH moved AS (
    UPDATE public.legends_spin_purchases
       SET status = 'paid', paid_at = now(), paypal_capture_id = _capture
     WHERE user_id = _user AND paypal_order_id = _order AND status = 'created'
     RETURNING spins
  ), bumped AS (
    UPDATE public.legends_players pl
       SET paid_spins = pl.paid_spins + (SELECT spins FROM moved), updated_at = now()
     WHERE pl.user_id = _user AND EXISTS (SELECT 1 FROM moved)
     RETURNING 1
  )
  SELECT count(*) INTO credited FROM bumped;
  RETURN jsonb_build_object('credited', credited > 0, 'balance', public.legends_balance(_user));
END;
$$;

REVOKE ALL ON FUNCTION public.legends_balance(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.legends_commit_spin(uuid, text, jsonb, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.legends_credit_purchase(uuid, text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.legends_balance(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.legends_commit_spin(uuid, text, jsonb, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.legends_credit_purchase(uuid, text, text) TO service_role;