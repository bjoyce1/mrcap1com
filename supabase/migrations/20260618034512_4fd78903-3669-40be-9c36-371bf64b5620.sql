-- analytics_events is written/read exclusively via edge functions using the
-- service_role key (which bypasses RLS). Client access is intentionally denied.
-- Add an explicit admin SELECT policy so admins can query via the Data API,
-- and document the locked-down posture for the linter.

CREATE POLICY "Admins can view analytics events"
ON public.analytics_events
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

COMMENT ON TABLE public.analytics_events IS
  'Analytics event sink. Writes only via analytics-collect edge function (service_role). Reads only via analytics-summary edge function (service_role) or admins through Data API.';
