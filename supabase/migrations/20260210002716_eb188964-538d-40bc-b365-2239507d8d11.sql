
-- Fix newsletter_subscribers: drop restrictive SELECT policy and create permissive one
DROP POLICY IF EXISTS "Admins can view all subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Only admins can view subscribers"
  ON public.newsletter_subscribers FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix booking_requests: drop restrictive SELECT policy and create permissive one
DROP POLICY IF EXISTS "Admins can view all booking requests" ON public.booking_requests;
CREATE POLICY "Only admins can view booking requests"
  ON public.booking_requests FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
