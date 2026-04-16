-- 1. Fix newsletter_subscribers INSERT policy (replace WITH CHECK (true))
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe to newsletter"
  ON public.newsletter_subscribers
  FOR INSERT
  TO public
  WITH CHECK (
    (is_active = true)
    AND (unsubscribed_at IS NULL)
    AND (char_length(email) <= 255)
    AND ((name IS NULL) OR (char_length(name) <= 100))
    AND ((source IS NULL) OR (char_length(source) <= 100))
  );

-- 2. Fix mutable search_path on update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 3. Fix mutable search_path on email queue functions
CREATE OR REPLACE FUNCTION public.delete_email(queue_name text, message_id bigint)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $$ SELECT pgmq.delete(queue_name, message_id); $$;

CREATE OR REPLACE FUNCTION public.enqueue_email(queue_name text, payload jsonb)
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $$ SELECT pgmq.send(queue_name, payload); $$;

CREATE OR REPLACE FUNCTION public.read_email_batch(queue_name text, batch_size integer, vt integer)
RETURNS TABLE(msg_id bigint, read_ct integer, message jsonb)
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $$ SELECT msg_id, read_ct, message FROM pgmq.read(queue_name, vt, batch_size); $$;

CREATE OR REPLACE FUNCTION public.move_to_dlq(source_queue text, dlq_name text, message_id bigint, payload jsonb)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE new_id BIGINT;
BEGIN
  SELECT pgmq.send(dlq_name, payload) INTO new_id;
  PERFORM pgmq.delete(source_queue, message_id);
  RETURN new_id;
END;
$$;