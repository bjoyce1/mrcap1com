

## Merge Music + Discography into One "Discography" Page

### What changes

1. **Navigation update** (`src/components/Navigation.tsx`)
   - Change the "Music" entry in `primaryLinks` from `{ to: "/listen", label: "Music" }` to `{ to: "/discography", label: "Discography" }`
   - Remove the "Discography" entry from `moreLinks`

2. **Mobile bottom nav** (`src/components/MobileBottomNav.tsx`)
   - Update the "Music" primary tab to point to `/discography` with label "Discography"
   - Remove the separate "Catalog" and "Discography" entries from `moreLinks`

3. **Merge content into Discography page** (`src/pages/Discography.tsx`)
   - Keep the existing Discography design (ChromaGrid albums, singles by year, stream CTA) as the primary layout
   - Pull in the useful Music-page extras: FAQ accordion, "Start Here" cards, citation block, and story notes — appended below the existing sections
   - Import the reusable block components (`FAQAccordion`, `StartHereCards`, `CitationBlock`, `StoryNotesBlock`) and the `musicPageData` content
   - Update SEO metadata and canonical URL to `/discography`

4. **Routing** (`src/App.tsx`)
   - Change the Discography route from `/mr-cap-discography` to `/discography`
   - Add redirects: `/music` → `/discography`, `/mr-cap-discography` → `/discography`, `/listen` → `/discography`
   - Keep `/music/:trackSlug` route unchanged (individual track pages still work)
   - Remove the `Music` lazy import (page no longer used)

5. **Update all internal links** across ~15 files
   - Replace `/music` links with `/discography` (Footer, FloatingMascot, MerchHero, Legacy, PressPost, ForMedia, content files, AlbumPage back-link, etc.)
   - Replace `/mr-cap-discography` links with `/discography`

6. **Sitemap + prerender** (`public/sitemap.xml`, `index.html`)
   - Replace `/music` and `/mr-cap-discography` entries with `/discography`

### Technical notes
- The old `Music.tsx` page file can be deleted since all traffic redirects to `/discography`
- Individual track pages (`/music/:trackSlug`) and album pages (`/albums/:albumSlug`) remain unchanged
- The merged page keeps the Discography visual structure (breadcrumb, ChromaGrid albums, year-grouped singles) and appends the Music page's Start Here cards, FAQ, citation block, and story notes below the stream CTA

