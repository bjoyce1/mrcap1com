
# TikTok Integration Plan

Build a full TikTok integration powered by the Lovable TikTok connector (gateway-backed OAuth, auto token refresh).

## 1. Connect TikTok
Link the workspace TikTok connector (`standard_connectors--connect` with `connector_id: tiktok`). This injects `TIKTOK_API_KEY` into edge functions and gives the gateway live access to your account (`@mrcapism`).

## 2. New standalone hub page: `/tiktok`
A dedicated TikTok page added to the router, mobile nav, and Links page.

Sections:
- **Hero** — Luxury Dark style, TikTok wordmark, follower count + handle, "Follow on TikTok" CTA.
- **Live Video Feed** — grid of the 12 latest videos pulled from your account (cover, title, views, like count). Click opens TikTok in a new tab. Auto-refresh via React Query (10 min stale).
- **Share to TikTok strip** — explains how fans can remix/duet, with a "Share this page" button.
- **FAQ + JSON-LD** — `VideoObject` schema for the latest 6 videos so Google indexes them.

## 3. Live video feed (backend)
New Supabase Edge Function: `tiktok-videos`
- Calls `POST {gateway}/tiktok/video/list/` with fields: `id, title, cover_image_url, share_url, view_count, like_count, comment_count, create_time, duration, video_description`.
- Caches in-memory for 10 minutes to stay under TikTok rate limits.
- Public (`verify_jwt = false`), CORS enabled, returns `{ videos: [...] }`.

Frontend hook `useTikTokVideos()` consumed by the hub page and a new homepage block.

## 4. Homepage integration
Replace the static Instagram marquee tile in `SocialFeedSection.tsx` with a live TikTok preview tile (3 latest video thumbnails + "See all on /tiktok"). YouTube tile stays. TikTok pill in the social row links to `/tiktok` instead of the external profile.

## 5. Share to TikTok
TikTok has no web share-URL like Twitter, so we follow the platform convention:
- Add a **TikTok button** to the existing `ShareButtons` component (`src/components/music/ShareButtons.tsx`) and `unified sharing` flow.
- Behavior: copies the page URL + suggested caption to clipboard, opens `https://www.tiktok.com/upload` (desktop) or the `tiktok://` deep link (mobile) so the user can paste into a new post.
- Logs a `share_events` row with `platform = 'tiktok'` so it shows up in the analytics dashboard.

## 6. Analytics: TikTok traffic
- **GA4** — extend the existing GA4 event helper to fire `tiktok_share`, `tiktok_video_click`, `tiktok_follow_click`.
- **Internal analytics** — the existing `analytics-collect` edge function already records `referrer` + `utm_source`. Add a TikTok-aware classifier in `analytics-summary` so the dashboard surfaces:
  - "TikTok" as a first-class traffic source (matches `tiktok.com`, `t.tiktok.com`, `vm.tiktok.com`, `utm_source=tiktok`).
  - New KPI card on the Overview view: TikTok sessions (24h / 7d / 30d) + sparkline.
  - New row in the Campaigns view: top landing pages from TikTok.
- Generate canonical UTM links for cross-posting: `?utm_source=tiktok&utm_medium=social&utm_campaign={slug}` — surfaced in the admin OPK/links area for copy/paste.

## 7. Cross-posting automatically
Auto-post to TikTok when a new release/press post goes live.

- New edge function: `tiktok-publish`
  - Admin-only (`has_role(auth.uid(),'admin')`, verifies JWT).
  - Accepts `{ video_url, title, caption, privacy_level }`.
  - Uses TikTok Content Posting API `POST /post/publish/video/init/` (PULL_FROM_URL) via the gateway.
  - Polls `POST /post/publish/status/fetch/` and writes status to a new `tiktok_posts` table.
- New table `public.tiktok_posts` (RLS + GRANTs per project rules):
  - `id, source_type ('release'|'press'|'manual'), source_id, video_url, caption, publish_id, status, error, posted_at, created_at`.
  - Policies: SELECT admin; INSERT/UPDATE service_role (edge function bypasses RLS).
- Admin UI (`/admin` → new "TikTok" card):
  - Form to manually trigger a cross-post (pick from existing videos in storage or paste a URL).
  - Auto-trigger toggle per release: when an album/track row is marked `published`, an edge invocation kicks off `tiktok-publish` if a `tiktok_video_url` is set.
  - History table showing recent posts + status pulled from `tiktok_posts`.

## 8. Routing, nav, SEO
- `/tiktok` route added to `App.tsx` (lazy), `MobileBottomNav`, footer, sitemap, and prerender script.
- SEO meta + canonical via `react-helmet-async`.
- `OfficialLinksBlock` already has TikTok — no change.

## Technical Notes
- All TikTok API calls go through `https://connector-gateway.lovable.dev/tiktok/...` with `Authorization: Bearer ${LOVABLE_API_KEY}` and `X-Connection-Api-Key: ${TIKTOK_API_KEY}`. Never call TikTok directly.
- Video feed endpoint requires the `video.list` scope; cross-posting requires `video.publish` and the account being approved for the Content Posting API. If either scope is missing the gateway returns a scope error and we surface a reconnect prompt.
- Caching layer prevents hitting TikTok's per-app rate limits.
- All new tables follow the mandatory `CREATE TABLE → GRANT → ENABLE RLS → CREATE POLICY` order.

## Files to be created
- `src/pages/TikTok.tsx`
- `src/hooks/useTikTokVideos.ts`
- `src/components/tiktok/TikTokVideoGrid.tsx`
- `src/components/tiktok/TikTokHero.tsx`
- `supabase/functions/tiktok-videos/index.ts`
- `supabase/functions/tiktok-publish/index.ts`
- migration: `tiktok_posts` table + RLS
- Admin: `src/components/admin/TikTokCrossPost.tsx`

## Files to be edited
- `src/App.tsx` (route)
- `src/components/MobileBottomNav.tsx`, `src/components/Footer.tsx`, `public/sitemap.xml`, prerender script
- `src/components/home/SocialFeedSection.tsx` (live TikTok tile)
- `src/components/music/ShareButtons.tsx` + unified share util (TikTok action)
- `src/components/GoogleAnalytics.tsx` helper (new event names)
- `public/analytics/app.js` + `supabase/functions/analytics-summary/index.ts` (TikTok source breakdown)
- `src/pages/Admin.tsx` (TikTok card)
- `src/pages/Links.tsx` (link to `/tiktok`)

## Open question before building
Do you want auto cross-posting to run **fully automatically** the moment a release goes live, or default to **draft-only** posts to TikTok (you confirm + publish from the TikTok app)? Draft mode is safer while the Content Posting API is in audit; live publishing requires TikTok to approve your developer app for unaudited publishing.
