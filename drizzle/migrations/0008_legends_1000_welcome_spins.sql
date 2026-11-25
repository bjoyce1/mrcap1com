ALTER TABLE public.legends_players DROP CONSTRAINT legends_players_welcome_left_check;
ALTER TABLE public.legends_players ADD CONSTRAINT legends_players_welcome_left_check CHECK (welcome_left >= 0 AND welcome_left <= 100000);
ALTER TABLE public.legends_players ALTER COLUMN welcome_left SET DEFAULT 1000;
UPDATE public.legends_players SET welcome_left = welcome_left + 1000, updated_at = now();
CREATE OR REPLACE FUNCTION public.legends_balance(_user uuid) RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(
    (SELECT jsonb_build_object(
      'welcomeLeft', p.welcome_left,
      'dailyLeft', CASE WHEN p.day = (now() AT TIME ZONE 'America/Chicago')::date THEN 20 - p.spins_today ELSE 20 END,
      'paidSpins', p.paid_spins)
     FROM public.legends_players p WHERE p.user_id = _user),
    jsonb_build_object('welcomeLeft', 1000, 'dailyLeft', 20, 'paidSpins', 0));
$$;