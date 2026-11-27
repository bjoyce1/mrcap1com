# Operation 713 technical baseline

Audit before application changes, November 27, 2026.

## Verified source and scanner evidence

- Current foundations scan reports nine passing checks: reachable home, crawler-readable content, rendering, robots, sitemap, language/viewport, favicon, search metadata and social metadata. No failing foundation findings. These checks do not prove rankings or Google indexing.
- React + Vite SPA with route splitting, shared SEO entries, Helmet and existing build-time route HTML/sitemap plugin. Retain this mechanism, not an SSR migration.
- Game route metadata is stale: eleven artists and 50 welcome spins. Configuration has twelve artists, 1000 welcome spins, twenty Houston-day spins, five guest tries and 26 paylines.
- The game has a visual logo and h2 but no primary semantic H1.
- Existing robots allows public crawling and references https://mrcap1.com/sitemap.xml. Existing sitemap generator omits lastmod, so no invented generation timestamps exist.
- Artist directory, editorial drafts and marketing admin module are absent. Existing /south-park-coalition, /houston-hip-hop-history, /who-is-mr-cap, /blog, /press and /videos should be linked, not duplicated.
- Artist configuration includes promotional lore. Do not reuse it as verified biography or invent discography. Keep new profiles as private drafts until reviewed.
- Existing Google Analytics ID is G-PBL8BBQMK4. Existing helper sends raw query strings and has no explicit consent gate. New marketing measurement must be opt-in, strip personal data, and never track staff or Great Day pages.
- AuthProvider validates admin roles on the server. Preserve it and enforce content permissions with the same has_role helper and RLS.
- New analytics reports must say Data Unavailable when there is no reporting API. Tag presence is not a reporting connection.
- Live Search Console/Bing verification and real-user Core Web Vitals not yet established by this audit. No ranking, traffic, accessibility certification or performance guarantee.

## Research evidence and limitations

US Semrush reports South Park Coalition at 6600 monthly searches, difficulty 33/100; related terms members (90) and website (40). Houston hip hop history SERP returned no data: demand and competition unknown. Use these as discovery signals, not historical facts or rank promises. Saved research and growth plan exist in Project Files and must be read before outreach recommendations. No paid ads or external posts authorized.

## Protection baseline

Do not change the game interface, banner, artwork, reels, weights, paylines, XP, Unity, guardians, balances, authentication, payments or commercial records. New content surrounds the game. No publish, social posts, advertising, email campaigns or unverified historical claims.
