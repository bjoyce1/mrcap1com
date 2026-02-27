INSERT INTO storage.buckets (id, name, public) VALUES ('cover-art', 'cover-art', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view cover art" ON storage.objects FOR SELECT USING (bucket_id = 'cover-art');
CREATE POLICY "Admins can upload cover art" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cover-art' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update cover art" ON storage.objects FOR UPDATE USING (bucket_id = 'cover-art' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete cover art" ON storage.objects FOR DELETE USING (bucket_id = 'cover-art' AND public.has_role(auth.uid(), 'admin'));