## Goal
Make sure mrcap1.com serves the same build you see in the Lovable builder.

## What I observed
I navigated my own browser to both `https://7f352d5d-...lovableproject.com/` (preview) and `https://mrcap1.com` (published). The two screenshots were pixel-identical: same yellow hero, same "MR. CAP" headline, same MUSIC / SHOWS / STORE / ABOUT / BOOKING / MORE / CONTACT nav, same Stream / Watch / Book CTAs.

So from my browser, the published site is **already** in sync. The most likely reason yours looks different is a stale **PWA service worker** caching the old build on your device (this project has PWA precaching per `mem://features/pwa-capabilities`).

## Steps

1. **Republish** the project so the latest commit (including all recent route + booking + security edits) is on production.
2. **Verify** the live HTML — fetch `https://mrcap1.com/` and confirm the asset hashes in `<script src="/assets/index-*.js">` match the preview build.
3. **If they match (most likely)** — the problem is your browser cache:
   - Hard-refresh mrcap1.com (Cmd/Ctrl + Shift + R)
   - Or open mrcap1.com in an incognito window
   - Or DevTools → Application → Service Workers → **Unregister** → reload
4. **If they don't match** — escalate: the publish didn't take. I'll re-run publish and inspect logs.

## Optional follow-up (only if stale-SW reports keep coming)
Add a "kill switch" so visitors auto-update:
- In the service-worker registration, call `registration.update()` on every load and trigger `skipWaiting` + `clients.claim` when a new SW is detected, with a one-time reload prompt.
- This is a small change in the PWA registration code (already in the project) — I'll only do it if step 3 doesn't resolve it for end users.

## What I will NOT change
- Homepage layout, nav, hero — they're identical on preview and prod, so there's no design bug to fix.
- Routes — `/music` restoration and security fixes from earlier are already in the codebase awaiting publish.
