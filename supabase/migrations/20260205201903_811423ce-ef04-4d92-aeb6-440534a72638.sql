
-- Create albums table
CREATE TABLE public.albums (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  artist TEXT NOT NULL DEFAULT 'Mr. CAP',
  release_year INTEGER NOT NULL,
  cover_art_url TEXT,
  description TEXT,
  credits TEXT,
  track_count INTEGER NOT NULL DEFAULT 0,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tracks table
CREATE TABLE public.tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  artist TEXT NOT NULL DEFAULT 'Mr. CAP',
  album_id UUID REFERENCES public.albums(id) ON DELETE SET NULL,
  track_number INTEGER,
  duration INTEGER NOT NULL DEFAULT 0,
  audio_url TEXT,
  cover_art_url TEXT,
  explicit BOOLEAN NOT NULL DEFAULT false,
  release_year INTEGER,
  credits TEXT,
  featured_artists TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  play_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;

-- Public read access for albums
CREATE POLICY "Anyone can view public albums"
  ON public.albums FOR SELECT
  USING (is_public = true);

-- Admin full access for albums
CREATE POLICY "Admins can manage albums"
  ON public.albums FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Public read access for tracks
CREATE POLICY "Anyone can view public tracks"
  ON public.tracks FOR SELECT
  USING (is_public = true);

-- Admin full access for tracks
CREATE POLICY "Admins can manage tracks"
  ON public.tracks FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Indexes
CREATE INDEX idx_tracks_album_id ON public.tracks(album_id);
CREATE INDEX idx_tracks_slug ON public.tracks(slug);
CREATE INDEX idx_albums_slug ON public.albums(slug);

-- Updated_at triggers
CREATE TRIGGER update_albums_updated_at
  BEFORE UPDATE ON public.albums
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tracks_updated_at
  BEFORE UPDATE ON public.tracks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for audio files
INSERT INTO storage.buckets (id, name, public) VALUES ('audio', 'audio', true);

-- Public read access for audio bucket
CREATE POLICY "Audio files are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'audio');

-- Admin upload access
CREATE POLICY "Admins can upload audio"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'audio' AND auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role));

-- Admin delete access
CREATE POLICY "Admins can delete audio"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'audio' AND auth.uid() IS NOT NULL AND has_role(auth.uid(), 'admin'::app_role));
