CREATE TABLE public.fan_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text NOT NULL,
  city text,
  favorite_song text,
  source_page text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.fan_signups ENABLE ROW LEVEL SECURITY;

-- Anyone can sign up
CREATE POLICY "Anyone can submit fan signup"
  ON public.fan_signups FOR INSERT
  WITH CHECK (
    char_length(email) <= 255
    AND (name IS NULL OR char_length(name) <= 100)
    AND (city IS NULL OR char_length(city) <= 100)
    AND (favorite_song IS NULL OR char_length(favorite_song) <= 200)
    AND (source_page IS NULL OR char_length(source_page) <= 200)
  );

-- Only admins can view signups
CREATE POLICY "Admins can view fan signups"
  ON public.fan_signups FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage fan signups"
  ON public.fan_signups FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));