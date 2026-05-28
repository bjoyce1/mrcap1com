Plan to fix the per-route prerender failure:

1. Fix prerender route isolation
   - Update `vite-plugin-prerender.ts` so the preview server always serves the original built SPA shell for route fallbacks instead of the progressively rewritten `dist/index.html`.
   - Collect rendered HTML for every route in memory first, then write all route files after capture. This prevents `/` being written first and then reused as the fallback for `/discography`, `/booking`, etc.
   - Add an explicit verification step per route: after `page.goto`, assert `window.location.pathname` matches the requested route before capture and log the actual route/title/canonical captured.

2. Wait for route-specific Helmet output
   - Increase the prerender `renderDelay` in `vite.config.ts`.
   - Add a targeted wait in the plugin for `react-helmet-async` to finish setting the route canonical before `page.content()` is captured.
   - If a route fails the expected canonical check, fail/log that route instead of silently writing homepage HTML.

3. Make canonical route-specific in prerendered HTML
   - During capture, compute the expected canonical as `https://mrcap1.com` plus the current route path.
   - Remove extra canonical tags from the captured document and keep exactly one canonical with that route’s URL.
   - Ensure the 5 priority routes output:
     - `/` → `https://mrcap1.com`
     - `/discography` → `https://mrcap1.com/discography`
     - `/who-is-mr-cap` → `https://mrcap1.com/who-is-mr-cap`
     - `/booking` → `https://mrcap1.com/booking`
     - `/art-of-ism` → `https://mrcap1.com/art-of-ism`

4. Remove duplicate/competing metadata sources
   - Remove the inline `setMeta(...)` script from `index.html`.
   - Remove the static `id="meta-canonical"`, static route description, and static route-level OG/Twitter tags that compete with Helmet.
   - Leave non-competing global tags like charset, viewport, robots, verification, favicon, manifest, theme color, and geo tags.
   - Keep page components / the shared `SEO` component as the single source of truth for title, description, canonical, OG, Twitter, and JSON-LD.

5. Validate the route output
   - After implementation/build, run the 5-route metadata diff against the generated or deployed output:

```bash
for route in / /discography /who-is-mr-cap /booking /art-of-ism; do
  echo "=== $route ==="
  curl -s -A "Googlebot" "https://mrcap1.com$route" | grep -E "<title>|<link rel=\"canonical\"|<meta name=\"description\""
done
```

Success criteria: all 5 routes have different route-appropriate titles/descriptions and exactly one canonical pointing to that route’s non-www URL.