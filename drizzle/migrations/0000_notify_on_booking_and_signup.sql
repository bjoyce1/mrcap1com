CREATE OR REPLACE FUNCTION public.notify_new_row()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  BEGIN
    PERFORM net.http_post(
      url := 'https://qisamkiggoibjkkdtkxq.supabase.co/functions/v1/notify-new-row',
      headers := jsonb_build_object('Content-Type', 'application/json'),
      body := jsonb_build_object('table', TG_TABLE_NAME, 'id', NEW.id)
    );
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'notify_new_row failed: %', SQLERRM;
  END;
  RETURN NULL;
END;
$$;

REVOKE ALL ON FUNCTION public.notify_new_row() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER booking_requests_notify
AFTER INSERT ON public.booking_requests
FOR EACH ROW EXECUTE FUNCTION public.notify_new_row();

CREATE TRIGGER newsletter_subscribers_notify
AFTER INSERT ON public.newsletter_subscribers
FOR EACH ROW EXECUTE FUNCTION public.notify_new_row();

CREATE TRIGGER fan_signups_notify
AFTER INSERT ON public.fan_signups
FOR EACH ROW EXECUTE FUNCTION public.notify_new_row();