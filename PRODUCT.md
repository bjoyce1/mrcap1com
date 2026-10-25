# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Fans of Mr. CAP and Houston hip-hop.** They find the site through search, social posts and the link in his bios. They come to stream, buy, join the early access list, or learn the South Park Coalition story.
- **Promoters, venues and media.** They come to book shows or features, and to get the press kit.
- **Release reviewers (Today Was A Great Day remix, pre-launch).** These are Mr. CAP and his team, the featured artists (Paul Wall, Lil Keke, Lisa Dinero) and their teams, and partners or press, all getting an early private look at the release world before it goes public.

## Product Purpose

mrcap1.com is the official home of Mr. CAP (Cornelius A. Pratt), a Houston rapper and Original Member of the South Park Coalition. Run with CAP Distributions, it is a direct-to-fan platform. Fans stream the catalog, buy music and merch, join the early access list, book him and read the history, without depending on streaming services or middlemen.

Success means real engagement: visits from real people, qualified streams, early access signups, bookings and sales. Likes and bot traffic don't count.

**Today Was A Great Day (Remix)** (Mr. CAP featuring Paul Wall, Lil Keke and Lisa Dinero, presented by CAP Distributions) is the proof of concept for an artist-owned release system that every later release can reuse. Its theme line is "A Great Day Is a State of Mind." The release world is planned for greatday.mrcap1.com. It is meant to be a destination, not a promo landing page:
- an immersive listening experience with lyrics and visuals
- the artists
- a Great Day Wall where fans share positive stories
- exclusive digital editions
- the #TodayWasAGreatDay campaign

## Positioning

"Stream Direct. No Middleman." Three decades of Houston hip-hop, owned and distributed by the artist himself. The Great Day remix is released as a world built around the song, not just a single on streaming services.

## Operating Context

- **Code and hosting:** a React and Vite single-page app on Lovable. It syncs from the GitHub main branch, and the owner publishes from Lovable. The backend is Supabase: catalog, early access list, booking requests, email alerts.
- **Analytics:** GA4 (G-PBL8BBQMK4) plus a first-party tracker, both filtered for bots. Search Console is verified under mrcap11@gmail.com.
- **Growth:** free and organic only, with no paid ads. The Great Day campaign begins with a seven-day organic test on Instagram, TikTok, X and Facebook, measured by visits, signups, listening and purchase interest.
- **Great Day pages:**
  - /greatday-preview is the private review of the world, kept out of search with noindex.
  - /admin/greatday is the Release Studio: publication gates, campaign link preflight and the event dictionary.
  - The spec is docs/greatday/SPEC.md.

## Capabilities and Constraints

- **Store and music sales.** The merch store runs on PayPal. Music sales use the site's existing buy flow. Non-owners hear 30-second previews of catalog tracks.
- **Great Day publication gates.** These stay closed until each one is documented and approved:
  - recording and featured-performer rights
  - approved master WAV
  - ISRC
  - composition and publisher clearance
  - final artwork and credits
  - consent and real signup implementation
  - secure checkout and private downloads
  - legal and copy review
  - owner approval to publish
- **Not active yet:** remix audio, sales, real signups and wall submissions.
- **Proposed editions, not for sale:** Single $2.99, Deluxe $9.99, Supporter $24.99. No release date is set.
- **Assets the owner has approved for the preview:**
  - the remix lyrics (to be supplied)
  - cleared photos of all four artists (to be supplied)
  - video clips (to be supplied)
  - the original "Today Was a Great Day" single (2024, already in the catalog with audio), which the preview player may use until the remix master is cleared
- **Labels on the preview.** One quiet "private preview" strip, plus small tags only where content is a placeholder (sample wall stories, proposed prices). The world should otherwise look like the finished release.

## Brand Commitments

- Mr. CAP is an "Original Member of the South Park Coalition". Never write co-founder or founding member.
- No em dashes or en dashes anywhere in copy, code comments or commits.
- The public booking and contact email is music@mrcap1.com.
- The Great Day artist roster is exactly: Mr. CAP featuring Paul Wall, Lil Keke and Lisa Dinero. Other credits stay pending until verified.

## Evidence on Hand

- **Catalog:** 63 tracks and 5 albums in Supabase, cover art in public/images/covers.
- **Press and live history:** the press archive (src/content/press.ts) and live-history flyers (src/content/liveHistory.ts).
- **Great Day artwork:** the temporary cover (public/images/covers/opt/today-great-day-cover-480.webp and /images/today-great-day-cover.png) shows all four artists. It is not final art.
- **Great Day concept image:** a generated Houston sunrise with a car (src/assets/greatday/houston-sunrise-concept.jpg). It is concept imagery only, not documentary.
- **Do not fabricate:** there are no real fan stories, testimonials, release date, sales numbers, credits beyond the roster, or artist quotes. Never invent them.

## Product Principles

1. **Artist-owned and direct.** Every feature strengthens the direct relationship between Mr. CAP and his fans: data, revenue and the release itself.
2. **Truthful by default.** Show only real facts, credits and stories. Placeholders are labeled quietly, never passed off as real.
3. **Houston legacy is the root.** The South Park Coalition history and the city give the work its authority.
4. **Build systems, not one-offs.** Great Day is the template every later release will reuse.
5. **Measure real engagement.** Visits, listens, signups and sales from people, not vanity metrics.
