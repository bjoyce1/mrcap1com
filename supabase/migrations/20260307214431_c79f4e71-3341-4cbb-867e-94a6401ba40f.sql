ALTER TABLE public.tracks
  ADD COLUMN IF NOT EXISTS lyrics text,
  ADD COLUMN IF NOT EXISTS isrc text,
  ADD COLUMN IF NOT EXISTS writers text,
  ADD COLUMN IF NOT EXISTS producers text,
  ADD COLUMN IF NOT EXISTS story_behind text;