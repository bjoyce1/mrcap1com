
-- Replace overly permissive stream_logs SELECT policy with admin-only
DROP POLICY IF EXISTS "Anyone can read stream logs" ON public.stream_logs;

CREATE POLICY "Only admins can view stream logs"
  ON public.stream_logs FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
