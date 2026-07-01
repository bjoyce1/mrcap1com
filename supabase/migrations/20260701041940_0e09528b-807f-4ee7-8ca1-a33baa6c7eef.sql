
-- API keys table
CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,
  owner_site TEXT,
  scopes TEXT[] NOT NULL DEFAULT ARRAY['read:music']::TEXT[],
  rate_limit_per_min INTEGER NOT NULL DEFAULT 60,
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  last_used_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_api_keys_hash ON public.api_keys(key_hash);
CREATE INDEX idx_api_keys_active ON public.api_keys(revoked_at) WHERE revoked_at IS NULL;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.api_keys TO authenticated;
GRANT ALL ON public.api_keys TO service_role;

ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage api_keys"
ON public.api_keys FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER api_keys_updated_at
BEFORE UPDATE ON public.api_keys
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Usage log
CREATE TABLE public.api_key_usage (
  id BIGSERIAL PRIMARY KEY,
  key_id UUID REFERENCES public.api_keys(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status INTEGER NOT NULL,
  ip TEXT,
  user_agent TEXT,
  duration_ms INTEGER,
  ts TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_api_usage_key_ts ON public.api_key_usage(key_id, ts DESC);
CREATE INDEX idx_api_usage_ts ON public.api_key_usage(ts DESC);

GRANT SELECT ON public.api_key_usage TO authenticated;
GRANT ALL ON public.api_key_usage TO service_role;

ALTER TABLE public.api_key_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read api_key_usage"
ON public.api_key_usage FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Webhooks
CREATE TABLE public.api_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_id UUID REFERENCES public.api_keys(id) ON DELETE CASCADE,
  target_url TEXT NOT NULL,
  events TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  secret TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_api_webhooks_key ON public.api_webhooks(key_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.api_webhooks TO authenticated;
GRANT ALL ON public.api_webhooks TO service_role;

ALTER TABLE public.api_webhooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage api_webhooks"
ON public.api_webhooks FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER api_webhooks_updated_at
BEFORE UPDATE ON public.api_webhooks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
