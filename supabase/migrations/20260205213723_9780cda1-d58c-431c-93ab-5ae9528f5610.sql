
-- Stream logs table for dedupe and analytics
CREATE TABLE public.stream_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  seconds_listened INTEGER NOT NULL,
  page_path TEXT,
  streamed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Dedupe: one qualified stream per track per session per day
CREATE UNIQUE INDEX idx_stream_logs_dedupe 
  ON public.stream_logs (track_id, session_id, streamed_date);

-- Fast lookups by track
CREATE INDEX idx_stream_logs_track ON public.stream_logs (track_id);

-- Enable RLS
ALTER TABLE public.stream_logs ENABLE ROW LEVEL SECURITY;

-- Public read only
CREATE POLICY "Anyone can read stream logs" ON public.stream_logs FOR SELECT USING (true);
