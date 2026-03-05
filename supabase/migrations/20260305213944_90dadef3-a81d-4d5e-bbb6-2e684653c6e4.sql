
-- Drop the existing permissive public tracks policy
DROP POLICY IF EXISTS "Anyone can view public tracks" ON public.tracks;

-- Create new policy that excludes NFT-gated tracks from public view
CREATE POLICY "Anyone can view public non-gated tracks"
ON public.tracks
FOR SELECT
USING (is_public = true AND requires_nft = false);

-- Create a separate view policy for admins to still see all tracks (already exists via ALL policy)
-- No change needed for admin policy
