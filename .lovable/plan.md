# The Catalog — Scroll-Pinned Album Section

A horizontal, scroll-scrubbed album catalog on `/music` with peek-out vinyl records on hover. Pulls live from the backend `albums` table and replaces the current Spotify-driven discography grid.

## What you'll see

- New section eyebrow: **THE CATALOG**, headline "Twenty-plus years *on wax*".
- Desktop: section pins while the row of album cards scrolls horizontally as you scroll the page (GSAP ScrollTrigger). Each card shows the album cover (sleeve) and on hover the sleeve tilts left while a vinyl record peeks out to the right — center label of the record is the album's own cover art.
- Mobile / reduced-motion: native horizontal scroll with snap, no pinning.
- Behind each sleeve sits a giant outlined year (e.g. **2024**) as a poster element.
- Each card is a link to that album's existing page (`/album/[slug]`).
- Data is pulled from the `albums` table (public, ordered newest → oldest), so future releases appear automatically with no code change.

## Where it goes

Replaces the `SpotifyAlbumGrid` block at the bottom of `/music` (the current "discography" surface). Everything above it on the page — Listening Room hero, Latest Releases shelf, Most Played, etc. — stays untouched.

## Technical details

**Dependencies**
- `bun add gsap` (ScrollTrigger ships with GSAP).
- Fonts: add `@fontsource/anton` and `@fontsource/instrument-serif` via bun, imported in `src/main.tsx`. Tailwind `fontFamily` gets `display: ['Anton', …]` and `serif-italic: ['"Instrument Serif"', …]`. (No `<link>` tags in `index.html` — per project rules.)

**New files**
- `src/components/music/Catalog.tsx` — section component. Uses `useAlbums()` (already exists in `src/hooks/useStreamingData.ts`). Maps each album to a card: `year = release_year`, `title = title`, `meta = album_type` (or a short derived label), `img = cover_url`, `href = /album/${slug}`. Sets up `gsap.matchMedia` for `(min-width: 901px) and (prefers-reduced-motion: no-preference)` to pin the section and translate the inner track on X. Mobile fallback uses `overflow-x-auto` + scroll-snap.
- `src/components/music/Vinyl.tsx` — pure-CSS vinyl disc. Cover passed via `--label` CSS variable.
- Tokens/utilities (`.vinyl`, `.disco-card`, `.eyebrow`, `.text-outline`, `.hairline-b`, `.no-scrollbar`) added to `src/index.css` scoped under a `.catalog-section` wrapper so they don't leak into the rest of the site. Existing Candy Archive color tokens (`--bone`, `--gold`, `--ink`) are reused — no new global colors introduced.

**Edits**
- `src/pages/Listen.tsx`: swap the `<SpotifyAlbumGrid />` block (lines 172–175) for `<Catalog />`.
- `tailwind.config.ts`: register the two new font families.
- `src/main.tsx`: import the two `@fontsource` packages.

**Behavior & accessibility**
- Each card is a real `<Link>` (keyboard-focusable, screen-reader friendly).
- `prefers-reduced-motion: reduce` → no pin, no hover animation, plain horizontal scroll.
- Hover effect uses `@media (hover: hover)` so it won't trigger on touch.
- ScrollTrigger uses `invalidateOnRefresh` so resizes recompute the scroll distance.

**Out of scope (ask if you want them next)**
- Filtering by era inside the catalog (era filter already exists for singles above).
- Replacing covers with custom artwork — current covers come from `albums.cover_url`.
- Playback on click (currently opens the album page).

## Files touched

```text
src/components/music/Catalog.tsx        (new)
src/components/music/Vinyl.tsx          (new)
src/pages/Listen.tsx                    (swap SpotifyAlbumGrid → Catalog)
src/index.css                           (scoped catalog styles)
tailwind.config.ts                      (font families)
src/main.tsx                            (font imports)
package.json                            (gsap, @fontsource/anton, @fontsource/instrument-serif)
```
