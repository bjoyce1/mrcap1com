# SEO Phase 0: deploy plan

This branch (`seo-phase-0`) makes every route serve its own HTML to anything that
doesn't run JavaScript: link previews (iMessage, WhatsApp, Facebook, X, Slack),
AI crawlers, and SEO tools. Nothing here has been deployed and no DNS has changed.

## What ships

- `src/seo/routes.ts` is the single source of truth for page SEO (title,
  description, canonical, Open Graph, H1, summary, links, JSON-LD). The React
  `<SEO>` component reads it, so the app and the static HTML can't drift.
- `scripts/seo-pages-plugin.ts` runs at the end of `vite build` and writes
  `dist/<route>/index.html` for 272 URLs, plus `dist/seo-pages.json` (the list
  of what each page should say, used by the checks below).
- Lovable's host serves a folder's `index.html` before it falls back to the app
  shell (verified: `/analytics` returns `public/analytics/index.html`), so
  `/music` gets `music/index.html`. Visitors still get the normal app; React
  takes over as soon as it loads.

## Why there is no Cloudflare Worker

The DNS findings rule a Worker out for this setup without real risk:

| Finding | Effect on a Worker |
|---|---|
| Nameservers are GoDaddy (`ns47/ns48.domaincontrol.com`), not Cloudflare | A Worker needs the zone moved to your own Cloudflare account first |
| `mrcap1.com` and `www` are A records to `185.158.133.1`, Lovable's edge | Lovable's docs say these records must stay "DNS only" (gray cloud); proxying them for a Worker can break Lovable's domain verification and SSL |
| `mrcap1com.lovable.app` answers with a 302 to `https://mrcap1.com` | A Worker can't use it as the origin: every request would loop back to the Worker |

The build-time approach changes none of that, so:

- **Redirect loops:** none possible. No proxy sits in front of Lovable, and
  `mrcap1.com` stays the primary domain in Lovable. Don't change the primary
  domain, and don't add a redirect from `mrcap1.com` to `www` or the reverse.
- **SSL renewal:** untouched. Leave the A records (`@` and `www` to
  `185.158.133.1`) and the `_lovable` TXT records exactly as they are, and
  don't put the domain behind any proxy. Lovable keeps issuing and renewing the
  certificate on its own.

Lovable also pre-renders pages on the fly for crawlers it can verify (Google,
Bing, major social and AI bots). These files cover everyone it doesn't verify,
such as previews built on a phone (iMessage, WhatsApp) and agents that fetch
pages directly. Both paths now produce the same tags.

## Before merging

From the repo root, on `seo-phase-0`:

```bash
npm test
```

All tests must pass. They check every route and every data page: titles under
60 characters, descriptions of 140 to 160, no em or en dashes, the South Park
Coalition wording, unique titles, and one of each head tag.

```bash
npm run build
```

The build log must include a line like
`[seo] wrote 272 route pages (live catalog: 63 tracks, 5 albums)`.

```bash
npm run seo:preview
```

Leave that running (it serves `dist/` the way Lovable does), and in a second
terminal:

```bash
node scripts/seo-verify.mjs http://127.0.0.1:4173 --all --bots
```

It must end with `All 272 pages pass.`

## Deploy

1. On GitHub, open a pull request from `seo-phase-0` into `main` and merge it.
   Lovable syncs `main` into the project automatically.
2. In Lovable, open the project and wait for the synced changes to appear.
3. Click **Publish**.
4. Run the post-launch checks below.

## Post-launch checks

Run these from any terminal after publishing.

1. The new build is live and every key page is right (exit code 0 means pass):

   ```bash
   node scripts/seo-verify.mjs https://mrcap1.com --bots
   ```

2. Every page the build wrote, including all tracks, albums and cities:

   ```bash
   node scripts/seo-verify.mjs https://mrcap1.com --all
   ```

3. Spot checks by hand: each line should show a different title.

   ```bash
   for p in / /music /south-park-coalition /who-is-mr-cap /city/houston /music/big-boy-drip; do printf "%-24s " "$p"; curl -s "https://mrcap1.com$p" | grep -o "<title>[^<]*</title>"; done
   ```

4. One page in full detail (title, description, canonical, Open Graph, JSON-LD):

   ```bash
   curl -s https://mrcap1.com/music | grep -E "<title>|name=\"description\"|rel=\"canonical\"|og:(title|site_name|image)\"|application/ld\+json" | cut -c1-200
   ```

5. As a social preview bot sees it:

   ```bash
   curl -s -A "facebookexternalhit/1.1" https://mrcap1.com/south-park-coalition | grep -o "<title>[^<]*</title>"
   ```

6. Real preview tools (they fetch from the services' own servers):
   - Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
     (paste `https://mrcap1.com/music`, click **Scrape Again** to clear its cache)
   - LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
   - Google Rich Results Test for the JSON-LD: https://search.google.com/test/rich-results
   - Paste a page link into an iMessage or Slack message to yourself.

7. In Google Search Console, use URL Inspection on `/music` and
   `/south-park-coalition`, then **Request indexing**, so Google refetches them
   soon instead of on its usual schedule.

Social networks cache previews for days. If an old preview still shows, re-scrape
it in that network's debugger; the page itself is already right if check 1 passes.

## Rollback

One step: on GitHub, revert the merge commit on `main` (the pull request page
has a **Revert** button), then click **Publish** in Lovable. That restores the
previous build exactly; there is no DNS or hosting state to undo.

Lovable's own version history is a second route: restore the version from
before the merge, then publish.

## Keeping it current

- **New tracks, albums, blog or press posts** get their own page on the next
  Lovable publish. The build pulls the live catalog from Supabase; if Lovable's
  builder can't reach it, the build falls back to
  `src/seo/catalog-snapshot.json`. To refresh that snapshot, run
  `npm run seo:snapshot` and commit the file.
- **Until a new item's page is built,** its URL falls back to the app shell,
  which carries the homepage tags. React still sets the right tags for visitors
  and for crawlers that run JavaScript.
- **Adding a page:** add an entry to `src/seo/routes.ts`, render
  `<SEO entry={routeSeo("/your-path")} />` in the page, and run `npm test`.

## Known limits

- Unknown URLs still return HTTP 200 with the app shell (Lovable doesn't serve a
  real 404). Those pages carry `noindex` once React runs.
- Lovable ignores `public/_redirects`, so old addresses such as `/about` return
  200 rather than a 301. Each one now serves the target page's content with the
  target's canonical, which tells search engines which URL to keep.
- The root `index.html` doubles as the fallback for every unknown URL, so it
  carries the homepage tags but no canonical tag on purpose.
