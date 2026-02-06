
-- Drop the overly permissive INSERT policy
DROP POLICY IF EXISTS "Anyone can submit booking request" ON public.booking_requests;

-- Create a tighter INSERT policy that ensures:
-- 1. Only expected fields are populated (status/admin_notes stay default)
-- 2. status must be 'pending' (default) - prevent someone setting 'confirmed'
-- 3. admin_notes must be null - prevent injection of admin-visible content
CREATE POLICY "Anyone can submit booking request"
ON public.booking_requests FOR INSERT
WITH CHECK (
  status = 'pending'::booking_status
  AND admin_notes IS NULL
  AND char_length(name) <= 100
  AND char_length(email) <= 255
  AND (phone IS NULL OR char_length(phone) <= 20)
  AND (city IS NULL OR char_length(city) <= 100)
  AND (venue IS NULL OR char_length(venue) <= 200)
  AND (message IS NULL OR char_length(message) <= 1000)
);
