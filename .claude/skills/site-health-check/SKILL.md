---
name: site-health-check
description: Audit mrcap1.com for build, test, lint, SEO and broken-link problems and prepare safe fixes on a branch. Use for the weekly site check or when asked "is the site OK?".
---

# Site health check

1. Fetch the latest `main` and create `claude/health-YYYY-MM-DD` from it.
2. `npm ci`, then run and record the result of each:
   - `npm run build`
   - `npm run seo:verify`
   - `npm test`
   - `npm run lint` (report the count; do not mass-fix lint unless trivial)
3. Live checks (fetch https://mrcap1.com):
   - Home, `/music`, `/booking`, `/merch`, `/nft`, `/press`, `/blog`, `/links` return 200 and render a title.
   - Collect internal links from the built `dist/` HTML and report any that 404.
   - Check `robots.txt` and `sitemap.xml` exist and list the main pages.
4. Fix only clear, low-risk problems (broken links, missing meta, failing test caused by a typo).
   Commit each fix separately with a plain message. Do not touch payments, auth, email or database code.
5. Push the branch (never `main`) and report:
   - Status line: ✅ healthy / ⚠️ issues / ❌ broken
   - What failed, what was fixed on the branch, what needs the owner
   - Link to the branch
