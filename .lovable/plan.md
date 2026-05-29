# Mr. CAP — Full Site Rebuild (Cinematic Immersive)

## The problem
The site grew page-by-page over time. Every route has its own typography scale, its own hero pattern, its own spacing rhythm, its own animation language. The result reads as a collection of micro-sites stitched under one nav — not a single artist platform. A legacy artist site needs **one voice everywhere**.

## The vision
A cinematic, event-grade artist platform in the lineage of Travis Scott's release sites, Kanye's DONDA portal, and The Weeknd's `theweeknd.com`. Full-bleed media, monumental typography, scroll-driven scenes, deep blacks with a single restrained accent. Every page should feel like the same film.

Three jobs, ranked:
1. **Legacy gravitas** — make a 30-year career look monumental.
2. **Bookings funnel** — every page has one path to inquiry.
3. **Catalog as centerpiece** — music is never more than one click away (persistent player + Music as anchor route).

---

## Phase 1 — Design System Reset (Foundation)

A new system built from scratch under `src/design-system/`. Old `v2/` primitives and ad-hoc components get retired as pages migrate.

**Tokens (rewrite `index.css` + `tailwind.config.ts`)**
- Background: true black `#050505` / surface `#0B0B0B` / elevated `#111111`
- Foreground: bone `#F4F1EA` (warmer than pure white — feels filmic)
- Accent: single oxblood `#7A1F1F` for CTAs + key moments; gold `#C9A24C` reserved for legacy/award contexts only
- No mid-grays in UI chrome — only black, bone, accent. Hierarchy comes from scale + spacing, not color.
- Removes all `border-*` utilities from primitives; depth via shadow only.

**Typography (1 display + 1 body, no exceptions)**
- Display: **Fraunces** (variable, optical sizing) for monumental headlines — italic at large sizes for cinematic feel
- Body/UI: **Inter** tight tracking, single weight family
- Scale: clamp-based fluid type, hero headlines clamp(64px, 12vw, 220px). Drop Montserrat uppercase entirely.

**Motion language**
- Single timing function project-wide: `cubic-bezier(0.22, 1, 0.36, 1)`, base 600ms
- Hero: GSAP scroll-pinned scenes (parallax video, image reveals via clip-path)
- Section reveals: Framer Motion `whileInView` with 80px y-offset, no scale
- Removes: glitch, float, glow-pulse, ChromaGrid spotlight, custom cursor, mascot remnants

**Layout primitives** (one set, used everywhere)
- `<Scene>` — full-viewport-height pinnable section with optional video/image bg layer
- `<Stage>` — content wrapper with consistent 12-col grid, max-w-[1600px], generous gutters
- `<Eyebrow>` / `<Display>` / `<Body>` — locked typography components
- `<MarqueeRow>` — horizontal scrolling label strip used between sections as the universal divider
- `<CTA>` — single button system, three variants (primary oxblood, ghost bone, link arrow)
- `<MediaFrame>` — handles every image/video with consistent loading + reveal

**Deliverable:** `/styleguide` route showing every token + primitive in one place. Lock this before touching pages.

---

## Phase 2 — Information Architecture

Collapse the current ~30+ routes into a tight hub-and-spoke model. Nothing gets deleted — secondary content nests under hubs.

**Primary nav (5 items max)**
- `Music` — discography + player + releases + streaming hub (absorbs Listen, NewReleases, Discography, AlbumPage, TrackPage, BetOnHer, PantiesOnMyPiano)
- `Legacy` — biography + timeline + SPC + Houston history (absorbs Biography, About, WhoIsMrCap, Legacy, SouthParkCoalition, HoustonHipHopHistory, TexasUndergroundHipHop)
- `Visual` — NFT/digital art + Self Love installation + videos (absorbs NFTGallery, ArtGallery, ArtOfIsm, SelfLove*, Videos)
- `Press` — press hub + media kit + OPK (absorbs Press, PressPost, PressKit, ForMedia, opk/*)
- `Book` — single conversion-focused page (absorbs Booking, Live, Links)

Merch stays as a utility link in footer (Trap University red theme is intentionally separate). Admin/Auth unchanged. All current URLs preserve via redirects so SEO + city pages survive.

**Persistent global elements**
- Top nav: minimal — wordmark left, 5 links centered, single CTA "Book" right
- Bottom: persistent slim audio player (CAP STREAM) docked across all routes
- Footer: editorial, 3 columns, marquee of social/streaming above it

---

## Phase 3 — Page Rebuilds

Every page follows the same anatomy: **Scene (immersive hero) → Stage sections → Marquee divider → Stage sections → CTA scene**. Variation comes from content + media, not from new component patterns.

**Homepage** (the flagship — built second, after styleguide)
1. Scene 1: Full-bleed hero video, monumental "MR. CAP" Fraunces italic, eyebrow "South Park Coalition · Houston · Est. 1995"
2. Scene 2: Pinned scroll — latest release cover scales as text reveals (Travis-style)
3. Stage: Three-up legacy proof (years, catalog count, milestones — single big numbers, no cards)
4. Marquee: discography titles scrolling
5. Stage: Catalog preview — 3 albums full-bleed alternating left/right
6. Scene 3: "The Art of ISM" — philosophy moment, single quote, dark
7. Stage: Press wall — 4 logos + 1 featured quote
8. Scene 4 (closer): Booking CTA full-bleed, single sentence, one button

**Music hub** — Sticky player anchored, releases as full-bleed scenes scrolling vertically (one release = one Scene). Discography accessible via overlay drawer.

**Legacy** — Long-form scroll, timeline rebuilt as horizontal pinned scrub (GSAP), era badges intact.

**Visual** — Gallery as edge-to-edge masonry with hover reveal, NFT verification panel preserved.

**Press** — Editorial magazine grid, featured quote at top, downloads block.

**Book** — Single-screen conversion: hero statement, 3 booking-type cards, inquiry form below the fold, FAQ.

**Secondary pages** (city landings, blog posts, release pages, etc.) — Inherit primitives automatically; templates rebuilt once, all instances regenerate.

---

## Phase 4 — What's preserved

Pure presentation rebuild. No backend, no schema, no edge function changes.
- All Supabase tables, RLS, edge functions intact
- CAP STREAM player logic, qualified-stream tracking, NFT gating intact
- All JSON-LD, sitemap, prerender script intact
- All current routes return 200 (redirect map handles consolidation)
- Printful/PayPal merch flow untouched
- Sanity CMS integration untouched
- Existing imagery reused; new art direction comes from how it's framed (full-bleed, monumental crop), not new shoots

---

## Phase 5 — Rollout order

1. **Tokens + primitives + `/styleguide`** — get explicit sign-off here before any page work
2. **Homepage** — proves the system end-to-end
3. **Music hub + persistent player** — the highest-traffic surface
4. **Book** — locks the conversion funnel
5. **Legacy + Visual + Press** — parallel
6. **Secondary templates** (release pages, city landings, blog, press posts)
7. **Cleanup pass** — delete old `v2/`, ad-hoc components, dead CSS

---

## Technical notes

- Old components stay in tree during migration; new ones live under `src/design-system/` and `src/routes/v3/`. Routes swap one at a time via `App.tsx`.
- No new dependencies — Fraunces via `@fontsource-variable/fraunces`, Inter already loaded. GSAP, Framer Motion already installed.
- Tailwind config gets a full rewrite, not an extension — old utility classes will break in unmigrated pages, which is intentional (forces full migration, no half-states shipped to prod).
- Estimated scope: ~6 phases, dozens of files. I'll create a task list and work through them in checkpointed batches so you can review at each phase boundary rather than waiting for a single massive drop.

---

## What I need from you to start

1. **Approve this plan** as the direction, OR redirect on any pillar (IA, accent color, typography choice, nav structure).
2. After approval I'll start Phase 1 only and show you the styleguide before touching any real page.