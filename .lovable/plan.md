

# Homepage Revamp — Harmonized Rhythm + Next-Level Interactions

Goal: turn 10 disconnected sections into one cinematic, breathing flow — unified spacing, consistent section headers, smoother scroll choreography, and richer interactions that feel premium without being heavy.

## 1. Unified section system

Create `src/components/home/SectionShell.tsx` — single wrapper used by every homepage block to enforce:
- Consistent vertical rhythm (`py-24 md:py-32`)
- Optional eyebrow/title/description header with a left-accent gold bar
- Subtle scroll-triggered fade + lift on the header (Framer Motion, `viewport once`)
- A shared "section index" badge in the corner (01 / 02 / 03 …) that fades in with the section — gives the page an editorial magazine feel

Refactor every home section to use `<SectionShell>`. Result: identical breathing room, identical typography hierarchy, identical reveal timing.

## 2. Reorder for narrative arc

```text
01  Hero                          — who
02  Latest Release Spotlight      — what's new now (moved up from bottom)
03  Proof Strip (counters)        — credibility beat
04  Art of ISM Feature            — the philosophy/book
05  Catalog Preview               — the legacy
06  Digital Art / NFT             — the innovation
07  Latest Press                  — the validation
08  Booking CTA Band              — the conversion
09  Follow the Movement (social)  — the community
10  Explore Houston Hip Hop       — the deep dives
11  Fan Capture                   — the close
```

Reasoning: Spotlight right after hero converts curious visitors fast. Proof strip then justifies. Then we walk down the legacy → present → future arc, ending in conversion + capture.

## 3. Smooth section-to-section transitions

Add `src/components/home/SectionDivider.tsx` — a thin animated gold gradient line that draws across the screen on scroll (GSAP `scaleX` from 0→1 on enter). Drop between every section. Replaces the inconsistent border-y / no-border / gradient-bg mishmash.

Add a global "scroll progress" bar fixed at the very top of the page (1px, primary color, GSAP-driven from `ScrollTrigger`). Subtle but premium.

## 4. Hero upgrades

- Add a soft animated **noise/grain overlay** (already in `index.css` as `.grain-overlay` — keep) plus a slow-drifting **gold light beam** (CSS gradient + `animate-pulse-slow`) crossing diagonally
- Add a **scroll-down hint** below the CTAs with a bouncing chevron + "Scroll to Explore" label that fades out after 100px scroll
- Make the "Mr. CAP" title respond to mouse with a subtle 3D tilt (using existing `useMagneticHover`-style logic), not just hover-glitch

## 5. Release Spotlight upgrade

- Add a real-time **audio waveform visualizer** above the play button when audio is playing (uses existing `audioAnalyzerStore` singleton — connects the inline `<audio>` to the shared AnalyserNode and renders 32 vertical gold bars reacting to frequency data)
- Cover art gets a slow continuous rotation (very subtle, like a vinyl) only when playing
- Background gets a pulsing radial gold glow synced to playback

## 6. Catalog Preview upgrade

- Convert the 4-album grid into a **horizontal scroll-snap row on mobile** + grid on desktop
- Each card: 3D tilt-on-hover (replaces plain `scale-105`), reflective gloss sweep across cover on hover
- "From the Vault" title gets a **text-shimmer** sweep on enter (gold gradient mask animating left→right)

## 7. Proof Strip upgrade

- Counter animation already exists — add a **gold underline that draws in** under each completed number
- Add subtle vertical separator lines between stats (gradient fade top/bottom)
- On the "1st Houston NFT Rapper" stat, add a tiny pulsing gold dot to draw attention

## 8. Social Feed (Follow the Movement) upgrade

- Replace the static 4-image Instagram grid with a **continuous marquee strip** of recent images (CSS `@keyframes` infinite scroll, pause on hover)
- Add a live "● LIVE" pulsing indicator on the YouTube card when the video starts playing
- Social link pills get magnetic hover (reuse `MagneticWrapper`)

## 9. Fix announcement strip

- Update copy + link to point to `/discography` (currently goes to `/listen`)
- Add a slow horizontal shimmer that travels across the strip every 8s

## 10. Global polish

- Add `prefers-reduced-motion` guards on all GSAP timelines (degrade to fade-only)
- Preload above-the-fold hero + spotlight cover images via `<link rel="preload">` in Index head
- Remove the ScrollReveal wrapper inconsistency — standardize on Framer Motion `whileInView` everywhere via `SectionShell`

## Files touched

**New:**
- `src/components/home/SectionShell.tsx`
- `src/components/home/SectionDivider.tsx`
- `src/components/home/ScrollProgressBar.tsx`
- `src/components/home/AudioWaveform.tsx` (for spotlight)

**Edited:**
- `src/pages/Index.tsx` (reorder, add divider/progress bar, preload tags)
- `src/components/HeroSection.tsx` (light beam, scroll hint, 3D title tilt)
- `src/components/home/AnnouncementStrip.tsx` (link fix + shimmer)
- `src/components/home/ReleaseSpotlight.tsx` (waveform, vinyl rotate, glow pulse)
- `src/components/home/CatalogPreview.tsx` (3D tilt, mobile snap, shimmer title)
- `src/components/home/ProofStrip.tsx` (underline draw, separators)
- `src/components/home/SocialFeedSection.tsx` (marquee, magnetic pills)
- `src/components/home/ArtOfIsmFeature.tsx`, `DigitalArtFeature.tsx`, `LatestPressFeature.tsx`, `BookingCTABand.tsx`, `ExploreHoustonHipHop.tsx` (refactor to use SectionShell)

## Out of scope

- Footer/Navigation — untouched
- Backend — none required
- Mobile bottom nav — untouched

