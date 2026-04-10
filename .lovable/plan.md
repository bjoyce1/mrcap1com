

## SEO Fixes for mrcap1.com — Implementation Plan

Eight changes, executed sequentially. No visual/design changes — only meta tags, structured data, sitemap, and internal linking.

---

### 1. Add Missing Routes to Prerender Script (index.html)

Add 11 new route entries to the `routes` object in the inline `<script>` (lines 49-119): `/new-releases`, `/mr-cap-discography`, `/legacy`, `/innovation`, `/merch`, `/opk`, `/art-of-ism`, `/texas-underground-hip-hop`, `/houston-rapper-mr-cap`, `/privacy`, `/links`.

Also add `<link rel="alternate" hreflang="en" href="https://mrcap1.com" />` to `<head>` (task 8 — bundled here since it's the same file).

---

### 2. Expand Noscript Fallback (index.html)

Insert an "Explore" section with 13 internal links before the closing `</main>` inside the `<noscript>` block (before line 246's copyright paragraph).

---

### 3. Fix Sitemap (public/sitemap.xml)

- **3a.** Change `south-park-coalition-houston` → `south-park-coalition` (line 115).
- **3b.** Add 6 missing `<url>` entries: `/bet-on-her`, `/art-of-ism`, `/for-media`, `/houston-hip-hop-history`, `/south-park-coalition`, `/music/my-world`.
- **3c.** Update all `<lastmod>` values to `2026-04-10`.

---

### 4. Fix Canonical URLs on Page Components

Most pages already have correct canonicals. One fix needed:

- **Merch.tsx** (line 23): Change `https://mrcap.com/merch` → `https://mrcap1.com/merch`

All other listed pages (NewReleases, Videos, Legacy, Innovation, ArtOfIsm, BetOnHer, Links) already have correct `https://mrcap1.com/...` canonicals.

---

### 5. Add Internal Cross-Links

- **5a. Footer.tsx**: Add `"Houston Hip-Hop History"` and `"South Park Coalition"` to the `siteLinks` array.
- **5b. About.tsx**: Add visible text links to `/south-park-coalition` and `/houston-hip-hop-history` in the page content (near the SPC/history references around lines 140-170).
- **5c. Biography.tsx**: Add visible text links to `/mr-cap-discography` and `/who-is-mr-cap` within relevant bio sections (e.g., the Music Career section around line 147, and the Vision section around line 186).

---

### 6. Add Article Structured Data to BlogPost.tsx

BlogPost.tsx already has comprehensive `BlogPosting` JSON-LD (lines 65-105) with headline, description, author, publisher, datePublished, dateModified, image, keywords, and mainEntityOfPage. This task is already done — no changes needed.

---

### 7. Add MusicRecording Schema to TrackPage.tsx

TrackPage.tsx already has `MusicRecording` JSON-LD (lines 94-105) with name, byArtist, duration, url, image, and inAlbum. This task is already done — no changes needed.

---

### 8. Add hreflang Tag to index.html

Bundled with task 1 (same file). Add `<link rel="alternate" hreflang="en" href="https://mrcap1.com" />` in `<head>`.

---

### Summary of Actual Work

| Task | File(s) | Status |
|------|---------|--------|
| 1. Prerender routes | index.html | New work |
| 2. Noscript links | index.html | New work |
| 3. Sitemap fixes | public/sitemap.xml | New work |
| 4. Canonical fix | src/pages/Merch.tsx | One-line fix |
| 5. Cross-links | Footer.tsx, About.tsx, Biography.tsx | New work |
| 6. Blog JSON-LD | BlogPost.tsx | Already implemented |
| 7. Track JSON-LD | TrackPage.tsx | Already implemented |
| 8. hreflang | index.html | New work (bundled with task 1) |

Tasks 6 and 7 require no changes — the structured data is already in place.

