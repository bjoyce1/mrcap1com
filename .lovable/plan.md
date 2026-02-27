

# Fix Share Link Redirect and OG Previews

## Root Cause
The backend gateway overrides `Content-Type` to `text/plain` and adds `Content-Security-Policy: default-src 'none'; sandbox` to edge function responses. This prevents browsers from rendering the HTML or executing the JavaScript redirect.

## Solution
Use **User-Agent detection** to serve different responses:
- **Social crawlers** (Twitterbot, facebookexternalhit, etc.) → Return OG HTML (crawlers parse tags regardless of Content-Type)
- **Real browsers** → Return a **302 redirect** with `Location` header (HTTP-level redirect, no HTML parsing needed)

## Changes

### 1. `supabase/functions/og-share/index.ts`
- Add a crawler User-Agent detection list (Twitterbot, facebookexternalhit, LinkedInBot, Slackbot, Discordbot, WhatsApp, TelegramBot, etc.)
- If crawler: return current OG HTML response (status 200)
- If browser: return `Response.redirect(canonical, 302)` with `Location` header pointing to the track/album page
- This completely bypasses both the Content-Type and CSP gateway restrictions for real users

### 2. No other file changes needed
The `shareTrack.ts` and all share button integrations remain the same.

