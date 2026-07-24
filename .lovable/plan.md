# Stale Old Site — Structural Cleanup

## Current state (verified)
- `public/sw.js` is a kill-switch worker: it deletes only Workbox-named caches, then calls `self.registration.unregister()` and forces `client.navigate(client.url)`. Good baseline.
- No code in `src/` calls `navigator.serviceWorker.register` (verified via ripgrep). `main.tsx` is clean, no `virtual:pwa-register`.
- `vite-plugin-pwa` is removed from `vite.config.ts` (still in `package-lock.json` as a transitive/leftover, harmless at runtime).
- `index.html` still references `/manifest.json`; manifest still declares `display: "standalone"` and `start_url: "/"` — installability preserved.
- No alternate SW path (e.g. `/service-worker.js`) is served. `public/_redirects` exists (SPA fallback only).

## Root cause of "editor keeps opening the old site"
The kill-switch works only when the browser (a) revalidates `sw.js` and (b) the caches it deletes actually match Workbox naming (`precache-v#-*`, `runtime-*`, `googleAnalytics-*`). Two gaps let the old shell survive:

1. **Old cache names slip through.** If the previous PWA build wrote caches that don't match those exact prefixes (custom `cacheName`, or older Workbox layouts), the filter skips them and stale HTML/JS stays cached at the HTTP layer via the SW's precache manifest. Once we've unregistered, though, the SW is gone — so the real remaining offender is the **HTTP cache** of `index.html` and old hashed chunks that the SW previously seeded.
2. **`sw.js` itself can be HTTP-cached.** If a browser has a max-age copy of the *old* `sw.js` (the real Workbox one), it will not fetch the kill-switch until that copy expires. Browsers cap SW script caching at 24h by default, but a `Cache-Control: max-age` on `sw.js` from prior hosting config could extend that.

## Plan

### 1. Broaden the kill-switch cache sweep
Update `public/sw.js` `isWorkboxCacheForThisRegistration` to also match any cache whose name is scoped to this registration (ends with `self.registration.scope`) OR starts with common legacy prefixes we shipped (`workbox-`, `mrcap-`, `app-shell-`). Still exclude non-scoped caches so Firebase Messaging / OneSignal caches stay intact.

### 2. Add a same-path replacement at `/service-worker.js`
Ship an identical kill-switch at `public/service-worker.js`. Cheap insurance for any historic registration that used that path.

### 3. Force revalidation of `sw.js`
Add an explicit no-cache directive for the worker file. Options in order of preference:
- Add a `<meta http-equiv>` note is not enough — SW scripts bypass document meta.
- Preferred: add a project-level `public/_headers` (Netlify-style) that Lovable hosting also honors, setting `Cache-Control: no-cache` on `/sw.js`, `/service-worker.js`, `/index.html`, and `/manifest.json`. If Lovable hosting ignores `_headers`, this is a no-op and safe.

### 4. Belt-and-suspenders unregister on load
Add a tiny inline script in `index.html` (runs before React) that, in production only, calls `navigator.serviceWorker.getRegistrations()` and `unregister()`s any registration whose script URL matches `/sw.js` or `/service-worker.js` on this origin, then `caches.keys()` and deletes any cache whose name matches the legacy prefixes above. This runs even if the SW itself never activates. Guarded to skip Lovable preview hostnames per the PWA skill's rules, so it doesn't fight the editor iframe.

### 5. Verify
- Load the site in a fresh incognito, confirm no SW registers.
- Load in a browser that has the old SW: DevTools → Application → Service Workers shows the kill-switch activate once, then "redundant/unregistered"; caches list is empty of legacy entries.
- Editor preview: reload once, confirm current build renders (not old shell).

## Files touched
- `public/sw.js` — widen cache sweep.
- `public/service-worker.js` — new, mirrors `sw.js`.
- `public/_headers` — new, no-cache for SW/manifest/index.
- `index.html` — inline production-only cleanup script (guarded against Lovable preview hostnames).

## Not doing
- Not re-adding `vite-plugin-pwa`.
- Not changing the manifest (`start_url`, `display`) — iOS/Android cache these at install time; changing them would strand already-installed users.
- Not touching Firebase Messaging / OneSignal / any messaging worker (none present, but the sweep filter still protects them if added later).
