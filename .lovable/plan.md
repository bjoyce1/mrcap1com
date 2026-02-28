

## Plan: Site-Wide ChromaGrid Integration

### Overview
Create a reusable `ChromaGrid` component with TypeScript support and CSS, then systematically replace grids across the entire site. The ChromaGrid uses GSAP mouse-tracking to create a spotlight/grayscale-to-color reveal effect on card grids.

### Phase 1 — Create the ChromaGrid Component
1. **Create `src/components/ui/ChromaGrid.tsx`** — TypeScript version of the provided component with typed props (`items`, `radius`, `columns`, `damping`, `fadeOut`, `ease`). Each item supports `image`, `title`, `subtitle`, `handle`, `borderColor`, `gradient`, `url`, and an optional `onClick` callback. Also support a `renderCard` prop for custom card content (since many grids have unique layouts beyond image+title+subtitle).
2. **Create `src/components/ui/ChromaGrid.css`** — The CSS file with all the chroma-grid, chroma-card, chroma-overlay, and chroma-fade styles.

### Phase 2 — Homepage Section Grids (Index page components)
3. **`VenturesSection.tsx`** — Convert the 3-column ventures grid to ChromaGrid. Map venture icons/names/descriptions into ChromaGrid items.
4. **`MusicSection.tsx`** — Convert the album cards grid (4-col) and singles grid (3-col) to ChromaGrid.
5. **`LiveSection.tsx`** — Convert the 2-column performance/rider grid to ChromaGrid.
6. **`BookingCard.tsx`** — Convert the 3-column booking types grid to ChromaGrid.
7. **`ContactSection.tsx`** — Convert layout grids to ChromaGrid where applicable.
8. **`NftPreviewSection.tsx`** — Convert the stats row to ChromaGrid.
9. **`NftMilestoneSection.tsx`** — Convert milestone items to ChromaGrid.
10. **`SpotifySection.tsx`** — Convert any card grids.

### Phase 3 — Gallery Grids
11. **`NFTGallery.tsx`** / **`ArtOfIsmCollection.tsx`** / **`OtherNftsGallery.tsx`** — Replace NFT card grids with ChromaGrid, mapping NFT data to ChromaGrid items. Preserve existing filter toolbar and modal behavior via `onClick`.
12. **`ArtGallery.tsx`** — Replace artwork grids (2025, 2026 collections) with ChromaGrid.
13. **`SelfLoveInstallation.tsx`** / **`SelfLoveRoom2024.tsx`** — Convert room/story card grids.

### Phase 4 — Content/Card Grids on Other Pages
14. **`Press.tsx`** — Convert featured media grid, quick facts grid, story angles grid, quotes grid, official links grid.
15. **`Blog.tsx`** — Convert blog post card grid to ChromaGrid.
16. **`Discography.tsx`** — Convert album and singles grids.
17. **`WhoIsMrCap.tsx`** — Convert feature card grids (SPC legacy, business/innovation).
18. **`SouthParkCoalition.tsx`** — Convert stats and content grids.
19. **`TexasUndergroundHipHop.tsx`** — Convert characteristic cards and FAQ grids.
20. **`CityLanding.tsx`** — Convert city cards and content grids.
21. **`Cities.tsx`** — Convert city listing grid.

### Phase 5 — OPK Pages
22. **`OPKHub.tsx`** — Convert the OPK page cards grid.
23. **`OPKMusic.tsx`** — Convert artist snapshot grid and music highlights grid.
24. **`OPKBrands.tsx`** — Convert partnership opportunities grid and "why it works" list.
25. **`OPKMedia.tsx`** — Convert speaking topics grid.
26. **`OPKPress.tsx`** — Convert media assets grid.

### Phase 6 — Merch & Remaining
27. **`PrintfulProductGrid.tsx`** — Convert product grid to ChromaGrid.
28. **`MerchHero.tsx`** — Convert categories grid.
29. **`MerchQualitySection.tsx`** — Convert bento quality grid.
30. **`MerchFooter.tsx`** — Convert footer columns grid.
31. **`PressSection.tsx`** — Convert featured media and bottom cards grids.
32. **`MobileBottomNav.tsx`** — Convert nav grid.
33. **`NFTHeroSection.tsx`** — Convert stats mini-grid.
34. **`NftDetailModal.tsx`** — Convert modal layout grid.
35. **Admin pages** (`Admin.tsx`, `AdminLibrary.tsx`, `AdminRoadmap.tsx`) — Convert admin grids.

### Technical Notes
- The `renderCard` prop pattern will be essential — most grids have custom card content (icons, play buttons, links, badges) that don't fit the default image+title+subtitle ChromaGrid card.
- Grids used purely for layout (2-column text layouts, footer columns) will use ChromaGrid but may need `fadeOut: 0` or simplified overlay behavior.
- Existing scroll-reveal animations (ScrollReveal, Framer Motion staggering) will be replaced by ChromaGrid's built-in GSAP mouse-tracking effect.
- Mobile responsiveness: ChromaGrid CSS already handles responsive breakpoints, but column counts will need per-instance tuning.
- All existing `onClick`, `Link`, and `<a>` behaviors will be preserved through the `url` or `onClick` item props.

