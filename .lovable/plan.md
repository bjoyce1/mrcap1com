

# Fix Share Functionality

## Problems Found

1. **OG image URLs are relative paths** -- The edge function outputs `og:image` as `/images/big-navi-remix-cover.png` (relative). Social media crawlers require **absolute URLs**. The function must prepend `https://mrcap1.com` to any relative `cover_art_url`.

2. **Some cover art paths use `/src/assets/...`** -- These paths (e.g. `/src/assets/betn-on-me.png`) only work in the Vite dev server, not as publicly accessible URLs. The edge function needs to handle this by falling back to the default image for `/src/assets/` paths.

3. **Toast always says "Link copied" even on mobile** -- On mobile, `navigator.share` opens the native share sheet (which may be cancelled), but the toast fires unconditionally. Should only show "Link copied" for the clipboard fallback.

4. **Exposed project URL in share link** -- The shared URL contains the raw backend function URL (`qisamkiggoibjkkdtkxq.supabase.co/functions/v1/...`), which looks unprofessional. Should use the project ID from env var instead of hardcoding.

## Changes

### 1. Fix `supabase/functions/og-share/index.ts`
- When `image` starts with `/` (relative path), prepend `SITE` (`https://mrcap1.com`) to make it absolute
- When `image` starts with `/src/assets/`, fall back to `DEFAULT_IMAGE` since those aren't publicly accessible

### 2. Fix `src/lib/shareTrack.ts`
- Only show "Link copied" toast on clipboard fallback, not when Web Share API is used
- On mobile share, show toast only if share completes successfully (or show nothing on cancel)

