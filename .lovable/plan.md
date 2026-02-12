

# Premium Artist UI/UX Elevation

A comprehensive visual and interactive upgrade across typography, components, interactivity, and conversion sections.

---

## 1. Typography and Color Palette Refinement

**Font Hierarchy Update**
- Replace Montserrat with **Oswald** (bold, cinematic) for all headings via Google Fonts import in `index.html`
- Update `tailwind.config.ts` font-display to `["Oswald", "sans-serif"]`
- Update `index.css` heading rules to use Oswald with weight 700
- Inter remains for body/UI text (already in place)

**"Luxury Dark" Color Palette**
- Update CSS custom properties in `index.css`:
  - `--background`: shift to Deep Charcoal `#1A1A1A` (0 0% 10%)
  - `--card`: slightly lighter charcoal
  - `--foreground`: Pure White for max readability
  - Keep existing Gold accent (`--accent-gold`) for CTAs

**Metallic Glow on Gold Coin / OPK Graphics**
- Add a CSS utility class `.metallic-glow` with a gold-tinted drop-shadow and subtle shimmer animation
- Apply to the Mr. CAP coin image in `Footer.tsx` and OPK cover in `TrafficMagnetSection.tsx`

---

## 2. Component Enhancements

**Music Cards (Album Covers)**
- In `MusicSection.tsx`, add `hover:scale-105` and a gold-accented `drop-shadow-2xl` on hover to each `.album-card`
- Use Tailwind classes: `hover:scale-105 hover:shadow-[0_20px_60px_hsl(43,91%,61%,0.3)] transition-all duration-300`

**Press Quotes Carousel**
- Transform the static blockquotes in `PressSection.tsx` into a horizontally auto-scrolling carousel using `embla-carousel-react` (already installed)
- Style quotes with a serif font (add `"Playfair Display"` to Google Fonts and tailwind config as `font-serif`)
- Large, italicized text with the gold left-border accent

**Sticky "Listen Now" FAB**
- Create a new `ListenFAB.tsx` component: a fixed bottom-right floating action button with glassmorphism styling (`.glass` utility)
- On click, expands a small popover menu with Spotify and Apple Music links
- Render it in `Index.tsx` (and optionally App-level)
- Hidden on mobile (bottom nav already exists)

---

## 3. Advanced Interactivity

**Scroll Reveal on All Sections**
- Create a reusable `ScrollReveal.tsx` wrapper using framer-motion `whileInView` with staggered `fade-in-up`
- Wrap each homepage section in `Index.tsx` with `<ScrollReveal>` for consistent entrance animations
- Configurable delay/stagger props

**Video Gallery Cinema Frame**
- In `VideoSection.tsx`, wrap each video card with the `.glass` utility class, add a subtle inner border glow, and rounded-2xl corners to create a "cinema frame" aesthetic
- Style the video player modal with a glass backdrop

**Nav Bar Enhancement**
- Navigation already uses `bg-black/20 backdrop-blur-lg` and is `fixed` -- upgrade to `backdrop-blur-md` with a more refined `bg-black/40` when scrolled (use the existing `isScrolled` state)
- Add a subtle bottom border glow on scroll: `border-b border-white/5`

---

## 4. Social and Conversion

**Newsletter "Join the Legacy" Redesign**
- Create a new full-width `NewsletterBanner.tsx` section with:
  - High-contrast background (gradient from charcoal to near-black with gold accent glow)
  - Large "Join the Legacy" heading in Oswald
  - Subtext + email input + gold CTA button
- Replace or supplement the current `NewsletterSignup` usage in `ContactSection.tsx` or add as a standalone section in `Index.tsx` before the Footer

**Magnetic Social Icons in Footer**
- Wrap each social icon in `Footer.tsx` with the existing `MagneticWrapper` component from `src/hooks/useMagneticHover.tsx`
- Use subtle strength (0.2) so icons "pull" toward cursor on hover

---

## Technical Summary

| File | Changes |
|------|---------|
| `index.html` | Add Oswald + Playfair Display fonts |
| `src/index.css` | Update color vars, add `.metallic-glow` utility |
| `tailwind.config.ts` | Add `font-serif`, update `font-display` to Oswald |
| `src/components/MusicSection.tsx` | Gold hover shadow on album cards |
| `src/components/PressSection.tsx` | Embla carousel for press quotes, serif font |
| `src/components/VideoSection.tsx` | Glass cinema frame on video cards + modal |
| `src/components/Navigation.tsx` | Enhanced scroll state styling |
| `src/components/Footer.tsx` | MagneticWrapper on social icons, metallic glow on coin |
| `src/components/TrafficMagnetSection.tsx` | Metallic glow on OPK image |
| `src/components/ListenFAB.tsx` | **New** -- glassmorphism floating action button |
| `src/components/ScrollReveal.tsx` | **New** -- reusable framer-motion scroll reveal wrapper |
| `src/components/NewsletterBanner.tsx` | **New** -- full-width "Join the Legacy" section |
| `src/pages/Index.tsx` | Add ScrollReveal wrappers, ListenFAB, NewsletterBanner |

