# mrcap1.com — Site Improvement Guide
## Full Audit & Fix List (April 2026)

---

## 🔴 CRITICAL FIXES (Do First)

### Fix 1: Code Splitting (App.tsx)
**Problem:** All 40+ page components load synchronously — visitors download JS for every page even if they only visit the homepage.
**File:** `src/App.lazy.tsx` (rename to `App.tsx`)
**Impact:** ~50-60% reduction in initial JS bundle size

To apply:
```bash
cp src/App.tsx src/App.original.tsx   # backup
cp src/App.lazy.tsx src/App.tsx       # apply
```

### Fix 2: Broken Hero Image Preload
**Problem:** Line 22 of `index.html` preloads `/src/assets/mrcap-hero-bg.jpg` — this path doesn't exist after Vite builds (it gets hashed).
**Fix:** Move the hero image to `public/` and reference it from there:

```bash
cp src/assets/mrcap-hero-bg.jpg public/images/mrcap-hero-bg.jpg
```

Then in `index.html`, change line 22:
```html
<!-- BEFORE (broken in prod) -->
<link rel="preload" as="image" href="/src/assets/mrcap-hero-bg.jpg" fetchpriority="high" />

<!-- AFTER (works in prod) -->
<link rel="preload" as="image" href="/images/mrcap-hero-bg.jpg" fetchpriority="high" />
```

And update `HeroSection.tsx` to use the public path:
```tsx
// BEFORE
import heroImage from "@/assets/mrcap-hero-bg.jpg";

// AFTER
const heroImage = "/images/mrcap-hero-bg.jpg";
```

### Fix 3: Pre-rendering for SEO
**Problem:** Googlebot sees an empty `<div id="root">` shell. Your inline prerender script in `index.html` sets meta tags (good), but the actual page CONTENT is invisible to crawlers.
**Solution:** Use the provided `vite-plugin-prerender.ts` to generate static HTML at build time.

```bash
npm install puppeteer serve-handler --save-dev
```

Then uncomment the prerender plugin in `vite.config.updated.ts` and rename it to `vite.config.ts`.

**Alternative (simpler):** Sign up for [Prerender.io](https://prerender.io) — they have a free tier for up to 250 pages/month. You just add middleware to your hosting provider.

### Fix 4: Remove Duplicate Google Fonts Loading
**Problem:** You're loading fonts TWO ways — via `@fontsource` packages (bundled in JS) AND via Google Fonts CDN (`<link>` tags in index.html). This means double downloads.
**Fix:** Remove lines 25-27 from `index.html`:

```html
<!-- DELETE THESE THREE LINES -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

You already have `@fontsource/bebas-neue`, `@fontsource/outfit`, and `@fontsource/playfair-display` in your `package.json` — those are bundled and faster.

### Fix 5: Dead Footer Links
**Problem:** Privacy Policy and Terms of Service links in `Footer.tsx` both point to `href="#"`.
**Fix in `src/components/Footer.tsx`:**

```tsx
// BEFORE
<a href="#" className="...">Privacy Policy</a>
<a href="#" className="...">Terms of Service</a>

// AFTER
<Link to="/privacy" className="...">Privacy Policy</Link>
<a href="mailto:wrecklessent@gmail.com" className="...">Terms of Service</a>
```

### Fix 6: Duplicate JSON-LD Structured Data
**Problem:** You have overlapping JSON-LD in both `index.html` (static, lines 186-292) and `Index.tsx` (React-injected via Helmet). Googlebot sees conflicting schemas.
**Fix:** Remove the entire `<script type="application/ld+json">` block from `index.html` (lines 186-292). Keep only the React-injected versions per page — they're more complete and page-specific.

---

## 🟡 PERFORMANCE IMPROVEMENTS (Do This Week)

### Fix 7: Image Optimization
**Problem:** `src/assets/` is 102MB — most images are 2-3MB unoptimized PNGs. These get bundled by Vite and increase your JS chunks dramatically.
**Fix:** Run the provided optimization script:

```bash
chmod +x scripts/optimize-images.sh
./scripts/optimize-images.sh
```

Then update imports across the codebase:
```bash
find src -name "*.tsx" -o -name "*.ts" | xargs sed -i "" \
  "s/\.png\"/.webp\"/g; s/\.jpg\"/.webp\"/g; s/\.jpeg\"/.webp\"/g"
```

**Expected savings:** ~70-80MB total, ~80% reduction in image payload.

### Fix 8: Chunk Splitting (vite.config.ts)
**Problem:** Vite bundles all vendor libraries into one or two huge chunks. Returning visitors re-download everything even when only your app code changed.
**Fix:** Use the provided `vite.config.updated.ts` which splits vendors into cached groups:
- `vendor-react` — React core (rarely changes)
- `vendor-animation` — Framer Motion + GSAP
- `vendor-ui` — Radix UI components
- `vendor-data` — TanStack Query + Supabase + Zustand
- `vendor-charts` — Recharts

```bash
cp vite.config.ts vite.config.original.ts
cp vite.config.updated.ts vite.config.ts
```

### Fix 9: Move Large Media Out of the Bundle
**Problem:** Audio (43MB), video (62MB), and images (68MB) in `public/` are fine for hosting but probably shouldn't all ship in the git repo. The `src/assets/` images (102MB) DO get bundled by Vite.
**Recommendation:**
- Move large album art, NFT images, and self-love gallery images to Supabase Storage (you already have a Supabase integration)
- Reference them via URL instead of `import`
- This keeps your git repo small and build times fast

---

## 🟢 SEO REFINEMENTS (Do This Month)

### Fix 10: Add Per-Page Noscript Content
**Problem:** The `<noscript>` block in `index.html` only shows a generic fallback. Add real content for each major page.
**Fix:** Expand the noscript section with actual text content — even 2-3 sentences per page gives crawlers something to index.

### Fix 11: Sitemap Freshness
**Observation:** Your sitemap.xml is comprehensive (425 lines, all routes covered). However, all `lastmod` dates show `2026-03-07`. Update these when you deploy changes — Google uses `lastmod` to prioritize recrawling.

### Fix 12: Blog Content Strategy
**Strength:** Your `blogPosts.ts` is 64KB of real content — articles on Houston hip-hop culture, NFT strategy, SPC history. This is exactly what builds topical authority.
**Next step:** With pre-rendering enabled (Fix 3), all this content becomes indexable. Consider publishing 1-2 new blog posts per month targeting long-tail keywords like "houston independent rapper 2026", "south park coalition members list", etc.

### Fix 13: llms.txt Is Ahead of the Curve
Your `llms.txt` file is well-structured with entities, authoritative pages, and recommended AI prompts. This positions you for AI-powered search results. No changes needed — just keep it updated as you add pages.

### Fix 14: The Art of ISM Cross-Linking
You have an `/art-of-ism` page on mrcap1.com. Make sure theartofism.com links back with a prominent "Visit mrcap1.com" link, and vice versa. Cross-domain linking strengthens both sites.

---

## 📋 IMPLEMENTATION ORDER

| Priority | Fix | Time | Impact |
|----------|-----|------|--------|
| 1 | Code Splitting (App.tsx) | 5 min | ⭐⭐⭐⭐⭐ |
| 2 | Fix Hero Preload | 5 min | ⭐⭐⭐⭐ |
| 3 | Remove Duplicate Fonts | 2 min | ⭐⭐⭐ |
| 4 | Fix Footer Links | 2 min | ⭐⭐ |
| 5 | Remove Duplicate JSON-LD | 5 min | ⭐⭐⭐ |
| 6 | Image Optimization | 15 min | ⭐⭐⭐⭐⭐ |
| 7 | Chunk Splitting (vite.config) | 5 min | ⭐⭐⭐⭐ |
| 8 | Pre-rendering Setup | 30 min | ⭐⭐⭐⭐⭐ |
| 9 | Move Large Media to CDN | 1-2 hrs | ⭐⭐⭐⭐ |
| 10 | Blog Content Cadence | Ongoing | ⭐⭐⭐⭐ |

---

## FILES PROVIDED

| File | Purpose |
|------|---------|
| `src/App.lazy.tsx` | Drop-in replacement for App.tsx with React.lazy() |
| `scripts/optimize-images.sh` | Batch image → WebP converter |
| `vite-plugin-prerender.ts` | Build-time HTML pre-rendering for SEO |
| `vite.config.updated.ts` | Updated config with chunk splitting + prerender |
| `IMPROVEMENTS.md` | This document |

---

*Generated from full codebase audit — April 9, 2026*
