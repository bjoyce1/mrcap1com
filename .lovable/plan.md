# Unify /music around the Catalog interaction model

Goal: every section on `/music` behaves like **The Catalog** — desktop pins the section and horizontally scrubs cards as you scroll, mobile falls back to snap-scroll. Keep the current Candy Archive styling (catalog-stamp eyebrow, font-display titles, gold archive-rule, Space Mono meta) — only the layout/interaction changes.

## Sections to convert

1. **Most Played** (House Charts) — currently a vertical stacked list of `TrackRow`s.
2. **Latest Releases** (`LatestReleasesShelf`) — already horizontal but not pinned/scrubbed; will be upgraded to the same GSAP pin+scrub behavior.
3. **Albums** (Full Lengths) — currently a 5-col grid; becomes a horizontal pinned rail of album cards (with vinyl peek, same as Catalog).
4. **Singles & Features** — currently a vertical list with EraFilter; becomes a horizontal pinned rail of single cards. EraFilter stays above the rail and re-filters the cards in place.
5. **The Catalog** — already correct; left as-is and used as the visual reference.

## What stays the same

- All copy, headers, eyebrows, archive-rule dividers, fonts.
- Data sources (`useAlbums`, `useLatestTracks`, `useAllTracks`, `useMostPlayedTracks`).
- Playback wiring — clicking a track card still calls `playTrack(track, queue)`; clicking an album card still routes to `/album/[slug]`.
- EraFilter behavior and the existing empty-state message.
- The sticky player, SEO, ListeningRoomHero, and Footer.

## How it will be built

- New shared component `src/components/music/HorizontalShelf.tsx` that encapsulates the Catalog's `gsap.matchMedia` + ScrollTrigger pin/scrub logic (desktop ≥901px, reduced-motion respected) and renders a mobile snap-scroll fallback. It accepts `eyebrow`, `title`, optional icon, and children cards.
- New `TrackCard` component (in `src/components/music/TrackCard.tsx`) styled like the Catalog `Card`: square cover art, vinyl peek on hover for tracks with audio, title in font-display, Space Mono meta (year · duration · album). Click = play; secondary share affordance retained for albums.
- Refactor `src/pages/Listen.tsx` to wrap Most Played, Latest Releases, Albums, and Singles in `<HorizontalShelf>` using the new cards. Replace `LatestReleasesShelf` usage with the unified shelf (component file kept but no longer imported on this page).
- Keep the existing `Catalog.tsx` unchanged so it remains the canonical reference; `HorizontalShelf` is extracted from its logic so all sections share identical feel.

## Edge cases

- Sections with very few items (e.g. 3 Most Played) won't pin — the shelf detects when `scrollWidth <= viewport` and skips the ScrollTrigger so the section behaves like a normal block.
- Mobile (<901px) and `prefers-reduced-motion` users get native horizontal snap-scroll, matching today's Catalog mobile behavior.
- Singles era filter: when the active era changes, `HorizontalShelf` calls `ScrollTrigger.refresh()` so the pinned distance recalculates.

## Files

- Add: `src/components/music/HorizontalShelf.tsx`, `src/components/music/TrackCard.tsx`
- Edit: `src/pages/Listen.tsx`
- Untouched: `Catalog.tsx`, `Vinyl.tsx`, `ListeningRoomHero.tsx`, `EraFilter.tsx`, `LatestReleasesShelf.tsx` (kept for other callers), `index.css` styling tokens
