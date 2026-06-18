CREATE TABLE public.analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  site_id TEXT NOT NULL DEFAULT 'mrcap1.com',
  ts TIMESTAMPTZ NOT NULL DEFAULT now(),
  received_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  visitor_id TEXT,
  session_id TEXT,
  url TEXT,
  path TEXT,
  title TEXT,
  referrer TEXT,
  source TEXT,
  medium TEXT,
  campaign TEXT,
  term TEXT,
  content TEXT,
  device JSONB NOT NULL DEFAULT '{}'::jsonb,
  geo JSONB NOT NULL DEFAULT '{}'::jsonb,
  metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
  props JSONB NOT NULL DEFAULT '{}'::jsonb,
  user_agent_hash TEXT
);

CREATE INDEX analytics_events_ts_idx ON public.analytics_events (ts DESC);
CREATE INDEX analytics_events_session_idx ON public.analytics_events (session_id);
CREATE INDEX analytics_events_visitor_idx ON public.analytics_events (visitor_id);
CREATE INDEX analytics_events_type_idx ON public.analytics_events (event_type);

-- Locked down: only the service role (used by analytics-collect and
-- analytics-summary edge functions) may read or write. No anon/authenticated access.
GRANT ALL ON public.analytics_events TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.analytics_events_id_seq TO service_role;

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- No policies defined — table is unreadable/unwritable via the public API.
-- All access goes through service-role edge functions.