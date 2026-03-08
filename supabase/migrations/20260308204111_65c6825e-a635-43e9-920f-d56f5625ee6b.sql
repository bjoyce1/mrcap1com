
CREATE TABLE public.share_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  content_type text NOT NULL DEFAULT 'track',
  content_title text,
  slug text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.share_events ENABLE ROW LEVEL SECURITY;

-- Anyone can insert share events (anonymous tracking)
CREATE POLICY "Anyone can insert share events"
  ON public.share_events FOR INSERT
  WITH CHECK (
    char_length(platform) <= 50
    AND char_length(content_type) <= 50
    AND (content_title IS NULL OR char_length(content_title) <= 255)
    AND (slug IS NULL OR char_length(slug) <= 255)
  );

-- Only admins can view share events
CREATE POLICY "Admins can view share events"
  ON public.share_events FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));
