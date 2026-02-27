

# Dynamic OG Images for Shared Tracks

## Problem
Social media platforms (Twitter, Facebook, iMessage, etc.) don't execute JavaScript. When a track link is shared, crawlers see only the static `index.html` OG tags — showing a generic Mr. CAP image instead of the track's cover art.

## Solution
Create a backend function that serves a lightweight HTML page with the correct OG meta tags (cover art, title, artist) for each track. This page includes a JavaScript redirect so real users land on the actual track page, while crawlers get the rich preview they need.

## What Changes

### 1. New Edge Function: `og-share`
- Accepts query params: `type` (track/album) and `slug`
- Queries the database for the track/album record
- Returns a minimal HTML page with:
  - `og:image` set to the track's `cover_art_url`
  - `og:title` set to track title + artist
  - `og:description` with track details
  - `twitter:card`, `twitter:image` tags
  - A `<meta http-equiv="refresh">` and JS `window.location` redirect to `https://mrcap1.com/track/{slug}`

### 2. Update `shareTrack.ts`
- Change the shared URL from `https://mrcap1.com/track/{slug}` to the edge function URL: `https://qisamkiggoibjkkdtkxq.supabase.co/functions/v1/og-share?type=track&slug={slug}`
- Real users who click the link get redirected to the actual page instantly
- Crawlers see the correct OG tags with the cover art image

### 3. Files Modified
- **New:** `supabase/functions/og-share/index.ts` — edge function serving dynamic OG HTML
- **Modified:** `src/lib/shareTrack.ts` — update share URL to point to the OG proxy

### Technical Notes
- The edge function uses the Supabase service client to query `tracks` or `albums` tables by slug
- Falls back to default OG image if track has no cover art
- No database migrations needed — reads existing tables only

