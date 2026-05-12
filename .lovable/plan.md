# Mr. CAP Legacy — Ground-Up Rebuild Plan

Inspired by michaeljackson.com: full-bleed cinematic imagery, horizontal rails, slow refined motion, premium hover interactions on cover art and CTAs. Built design-system-first so every page that follows snaps into place.

## Direction at a glance

- **Palette:** True black `#000` background, bone white `#F5F1E8` text, single accent. Recommend **oxblood red** (already on-brand, reads close to MJ red). Gold retired except as a rare metallic detail (icon, divider).
- **Typography:** Display serif for headlines (e.g. Fraunces or Cormorant Garamond) + Inter for UI/body. Big, tight leading, generous tracking on small caps eyebrows.
- **Layout language:** Edge-to-edge media, asymmetric editorial grids, deep vertical rhythm (160–240px section gaps), no card borders — separation by contrast and shadow.
- **Motion:** Slow (600–1200ms) ease-out reveals on scroll, subtle parallax on hero media, no bouncy springs. Image-ken-burns on hero stills.
- **Signature interactions:**
  - Cover art: grayscale → color on hover, 3D tilt, soft glow, "Now Playing" pill slides up.
  - CTAs: magnetic cursor pull, underline sweep, accent fill on hover.
  - Cursor: custom blended cursor over media zones (optional toggle).
  - Rails: drag-to-scroll with momentum, scroll-snap, edge fade masks.

## Phase 1 — Design System (build first, no page work yet)

Deliverables live alongside current site so nothing breaks:

1. **Tokens** — rewrite `index.css` + `tailwind.config.ts`
   - New HSL tokens: `--bg`, `--ink`, `--ink-muted`, `--accent`, `--accent-ink`, `--surface-1/2/3`, `--hairline`.
   - Type scale: `display-xl/lg/md`, `eyebrow`, `body`, `caption`.
   - Spacing scale extended (sections 24/32/40 = 96/128/160px).
   - Easing tokens: `--ease-editorial: cubic-bezier(.2,.8,.2,1)`.
2. **Primitives** in `src/components/v2/`
   - `CinematicHero` (full-bleed image/video, parallax, headline overlay, scroll cue)
   - `Rail` (horizontal scroller, snap, edge fade, drag, arrow controls)
   - `CoverCard` (grayscale→color, tilt, hover meta)
   - `EditorialBlock` (asymmetric text+image, eyebrow + display + body)
   - `MagneticButton` / `LinkSweep`
   - `SectionHeader` (eyebrow, display, optional view-all)
   - `Reveal` wrapper (Framer Motion, in-view fade/slide)
   - `Marquee` (slow infinite for accolades)
3. **Showcase route** `/v2/styleguide` (not linked) with tokens + every primitive in light/dark states for review and screenshot QA.

Approval gate: you review `/v2/styleguide` before any page rebuild.

## Phase 2 — Information Architecture

Proposed simplified top nav (desktop, 5 items max — MJ pattern):

```
MUSIC   ·   FILM/VIDEO   ·   STORE   ·   LEGACY   ·   NEWS
                   [LOGO centered]                     [☰ more]
```

Consolidations:
- `/music`, `/discography`, `/new-releases`, `/cap-stream` → **/music** with sub-rails (Latest, Albums, Singles, NFT-gated).
- `/videos`, `/visualizers` → **/film**.
- `/legacy`, `/biography`, `/houston-history`, `/spc` → **/legacy** hub with chapter pages.
- Keep release/track/blog/landing pages at current URLs (SEO + 51 city pages preserved). Add 301s for any merged routes.

## Phase 3 — Page Rebuild Order

After styleguide approval, rebuild in this order, one PR per page:
1. `/` (Index) — cinematic hero, latest release rail, editorial bio block, video reel, news rail, store teaser, newsletter.
2. `/music` — hero of newest release, era rails, NFT-gated rail.
3. Dynamic release/track template — uses new `CinematicHero` + `EditorialBlock` + DSP rail.
4. `/film` and `/legacy` hubs.
5. `/store`, `/press`, blog, landing pages.

Each page keeps existing data fetching, schema/JSON-LD, prerender script entries, and analytics events — only the presentation layer changes.

## Phase 4 — Cleanup

- Retire old components (`HeroSection`, mascot remnants already gone, old `PageHero` variants) once all pages migrated.
- Delete `/v2/styleguide` route or keep behind admin.
- Update memory: new palette, new animation tokens, IA changes.

## Technical Notes

- Stack unchanged: React + Vite + Tailwind + Framer Motion + GSAP (parallax). No SSR.
- New components live under `src/components/v2/` so old pages keep working during migration.
- Fonts: self-host via `@fontsource/fraunces` + `@fontsource-variable/inter` to avoid CLS and keep LCP fast.
- Motion respects `prefers-reduced-motion` (disable parallax, tilt, marquee).
- Performance budget per page: LCP < 2.0s on 4G, hero image WebP/AVIF preloaded, rails virtualized only if >20 items.
- Custom cursor and tilt only on `(hover: hover) and (pointer: fine)` — mobile gets tap states + native momentum scroll.
- All current schemas, GA4 events, OG image edge function, RLS policies, Printful/PayPal flows, and CMS proxy stay intact.

## What I need from you before building

1. Confirm **oxblood red** as accent (or pick a different single accent).
2. Confirm display serif preference: **Fraunces** (modern, slightly playful) vs **Cormorant Garamond** (classic, MJ-leaning) vs **Playfair Display** (safe).
3. Confirm the simplified 5-item nav and the route consolidations above.
4. Confirm Phase 1 (design system + `/v2/styleguide`) is the right starting point — no page rebuild work begins until you approve the styleguide.
