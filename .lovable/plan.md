## What's slow

After auditing every image on the homepage, three problems are causing slow loads:

### 1. Milk Money posters (worst offender — 22 MB total)
Hosted in the `milk-money` Supabase bucket as raw PNGs:
- `The Milk Money Movie Poster 2.png` — **19.7 MB** (used as section background)
- `The Milk Money Movie Poster.png` — **2.5 MB** (foreground poster)

The 19.7 MB background alone is roughly the size of the entire rest of the page combined. On mobile/3G this stalls the section for 10+ seconds.

### 2. Cover art in `public/images/covers/` (29 MB folder)
Many covers shipped as 2–3 MB PNG/JPG originals:
- `nft-art-of-ism.png` 3.0 MB, `put-the-dope-down.png` 2.9 MB, `betn-on-me.png` 2.8 MB, `album-cold-ass-pimp.jpg` 2.8 MB, `dippin-metaverse.png` 2.7 MB, `bout-to-blow.png` 2.7 MB, `h-town-represent.png` 2.4 MB, etc.

The homepage's Catalog Preview / Release Spotlight / Art of ISM feature pull from these.

### 3. Blog/feature backgrounds in `public/images/` (42 MB folder)
Same story — `about-bg.png` 3.0 MB, `mrcap-hero-bg.jpg` 1.2 MB, several 2–3 MB blog headers used by Latest Press feature.

## The fix

### Step 1 — Re-encode the two Milk Money posters to WebP
Download from Supabase, convert with `cwebp -q 80` (and resize the 19.7 MB background to max 2000px wide), re-upload to the same `milk-money` bucket as `.webp`, and update the two URLs in `src/components/home/MilkMoneyFeature.tsx`.

Expected: **22 MB → ~600 KB** (a ~37× reduction).

### Step 2 — Convert the heaviest cover art to WebP
Batch-convert every file in `public/images/covers/` over 500 KB using `cwebp -q 82`, then update any `.png`/`.jpg` references in components to `.webp`. Keep filenames matching so refactor is mechanical.

Expected: **29 MB → ~4 MB** for that folder.

### Step 3 — Convert the heaviest hero/blog images
Same treatment for everything in `public/images/` over 1 MB (about-bg, mrcap-hero-bg, blog headers).

Expected: **42 MB → ~6 MB**.

### Step 4 — Add `loading="lazy"` + explicit width/height
Audit homepage components (`MilkMoneyFeature`, `ArtOfIsmFeature`, `CatalogPreview`, `ReleaseSpotlight`, `LatestPressFeature`) — make sure every below-the-fold `<img>` has `loading="lazy"` and `decoding="async"`. The Milk Money poster already has `loading="lazy"` ✓, but the section background `<img>` inside `SectionBackground` should be checked.

### Step 5 — Preload only the LCP image
In `index.html`, ensure only the true above-the-fold hero image is in `<link rel="preload">`. Remove any preloads pointing to images that are no longer above-the-fold.

## Out of scope

- Not changing layout, design, or any copy.
- Not touching the PWA precache rules (already excludes >2 MB media per project memory).
- Not migrating to a CDN image transform service — re-encoding statically is enough and avoids new infra.

## Files to edit

- `src/components/home/MilkMoneyFeature.tsx` — swap the two Supabase URLs to `.webp`
- `src/components/home/SectionBackground.tsx` — verify lazy/decoding attrs
- `public/images/covers/*` — replace heavy originals with WebP versions
- `public/images/*` — replace heavy originals with WebP versions
- Any component referencing the renamed cover/hero files (mechanical `.png`/`.jpg` → `.webp` swap)
- `index.html` — clean up preload tags

## Expected result

Total homepage image weight drops from **~95 MB → ~10 MB** (~90% reduction). LCP and overall feel of the page improve dramatically, especially on mobile.

Approve and I'll execute steps 1–5.