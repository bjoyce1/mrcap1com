
-- Add NFT gating support to tracks
ALTER TABLE public.tracks ADD COLUMN requires_nft BOOLEAN NOT NULL DEFAULT false;
