
-- Restrict admin has_role() policies to authenticated role to avoid
-- "permission denied for function has_role" errors for anon visitors.

-- public.fan_signups
DROP POLICY IF EXISTS "Admins can manage fan signups" ON public.fan_signups;
CREATE POLICY "Admins can manage fan signups" ON public.fan_signups
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can view fan signups" ON public.fan_signups;
CREATE POLICY "Admins can view fan signups" ON public.fan_signups
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- public.merch_orders
DROP POLICY IF EXISTS "Admins can view merch orders" ON public.merch_orders;
CREATE POLICY "Admins can view merch orders" ON public.merch_orders
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- public.purchases
DROP POLICY IF EXISTS "Admins can manage purchases" ON public.purchases;
CREATE POLICY "Admins can manage purchases" ON public.purchases
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- public.share_events
DROP POLICY IF EXISTS "Admins can view share events" ON public.share_events;
CREATE POLICY "Admins can view share events" ON public.share_events
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- public.tracks
DROP POLICY IF EXISTS "Admins can manage tracks" ON public.tracks;
CREATE POLICY "Admins can manage tracks" ON public.tracks
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- storage.objects admin policies
DROP POLICY IF EXISTS "Admins can manage audio files" ON storage.objects;
CREATE POLICY "Admins can manage audio files" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'audio' AND public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (bucket_id = 'audio' AND public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete cover art" ON storage.objects;
CREATE POLICY "Admins can delete cover art" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'cover-art' AND public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update cover art" ON storage.objects;
CREATE POLICY "Admins can update cover art" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'cover-art' AND public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can upload cover art" ON storage.objects;
CREATE POLICY "Admins can upload cover art" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'cover-art' AND public.has_role(auth.uid(), 'admin'::app_role));
