---
name: Great Day Release World
description: Today Was A Great Day (Remix), presented like a custom piece on a Houston jeweler's counter.
colors:
  case-velvet: "#203079"
  case-velvet-deep: "#0F163E"
  case-light: "#2A4DC0"
  counter-night: "#080C26"
  glass-white: "#F3F5FC"
  frost-blue: "#C1CBEB"
  gold-leaf-text: "#F0CD72"
  engraving-umber: "#392609"
  tag-cotton: "#F7F4ED"
  tag-ink: "#0B185B"
  box-leatherette: "#121A58"
  dogtag-ink: "#222A3B"
typography:
  display:
    fontFamily: "'GD Lily' (Lily Script One), cursive"
    fontSize: "clamp(3.1rem, 6.4vw, 6rem)"
    fontWeight: 400
    lineHeight: 1.04
  headline:
    fontFamily: "'GD Lily' (Lily Script One), cursive"
    fontSize: "clamp(2.6rem, 5.2vw, 4.5rem)"
    fontWeight: 400
    lineHeight: 1.06
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.05rem, 1.6vw, 1.25rem)"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  lede:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.05rem, 1.4vw, 1.2rem)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'GD Michroma' (Michroma), sans-serif"
    fontSize: "0.7rem"
    fontWeight: 400
    letterSpacing: "0.2em"
  tag:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    letterSpacing: "0.06em"
rounded:
  tag: "2px"
  field: "10px"
  plate: "14px"
  window: "22px"
  pill: "999px"
spacing:
  gutter: "clamp(16px, 6vw, 96px)"
  section: "clamp(5rem, 10vw, 8rem)"
  stack-sm: "0.75rem"
  stack-md: "1.25rem"
  stack-lg: "2.25rem"
components:
  button-gold:
    textColor: "{colors.engraving-umber}"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: "0.8rem 1.4rem"
    height: "48px"
  button-gold-disabled:
    backgroundColor: "{colors.counter-night}"
    textColor: "{colors.frost-blue}"
    rounded: "{rounded.pill}"
  button-play:
    backgroundColor: "{colors.case-velvet-deep}"
    textColor: "{colors.gold-leaf-text}"
    rounded: "{rounded.pill}"
    size: "78px"
  field:
    backgroundColor: "{colors.counter-night}"
    textColor: "{colors.glass-white}"
    rounded: "{rounded.field}"
    padding: "0.85rem 1rem"
    height: "52px"
  tag:
    backgroundColor: "{colors.tag-cotton}"
    textColor: "{colors.tag-ink}"
    typography: "{typography.tag}"
    rounded: "{rounded.tag}"
    padding: "0.42rem 0.8rem 0.42rem 1.45rem"
  theme-bar:
    textColor: "{colors.engraving-umber}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.5rem"
---

# Design System: Great Day Release World

Scope: the Great Day release surfaces in `src/features/greatday/` (today `/greatday-preview`, later `greatday.mrcap1.com`). The rest of mrcap1.com keeps its own theme; nothing here applies outside this folder.

## Overview

**Creative North Star: "The Jeweler's Counter"**

The release is shown the way a Houston jeweler shows a custom piece: lit from above, under a glass lip, laid on royal-blue case velvet. Every object on the page is something you could find on that counter. The cover hangs as a photo pendant on a rope chain. The artists hang as lockets from one gold rail. The fan stories are engraved silver tags on ball chain. The editions sit in presentation boxes that grow with the edition. The seek bar is a rope chain closed by a lobster clasp.

The metal is rendered, not drawn. The pendant and locket frames, the bail, the rope chain and the brushed gold and silver bars are three.js renders made in a dark light tent with strip softboxes (see Elevation & Depth). CSS only places, clips and shades them. Velvet is the one material still drawn in CSS.

Density is low and object-led: one object per idea, generous velvet around it, and type that reads as engraving or gold lettering rather than interface chrome.

**Key Characteristics:**
- Committed color: royal-blue velvet owns most of every viewport; gold carries the light.
- Real rendered metal: rope edges, channel-set brilliants, polished round wire.
- Gold script nameplates for display type, engraved wide caps for labels, Archivo for reading.
- Cotton string tags appear only on placeholders. Their presence means "not final".
- One authored motion moment (the case light sweep and nameplate glint) plus physical motion on the hanging pendant.

## Colors

A committed palette: one saturated velvet field in two depths, rendered gold for light, and small cotton and silver accents.

### Primary
- **Case Velvet** (#203079): the main field of the hero, film, voices and editions sections, lit by a radial pool of Case Light from the top left.
- **Case Velvet Deep** (#0F163E): recessed trays (the words, the wall, the hold list) and the faces inside lockets and edition inserts.
- **Case Light** (#2A4DC0): only as the lit pool inside velvet gradients and the play button's inner glow.

### Secondary
- **Gold Leaf Text** (#F0CD72): flat gold for small engraved-cap labels (Remix, roles, field labels, the footer mark) where a rendered texture would be illegible.
- **Engraving Umber** (#392609): text cut into gold plates (theme bar, lyrics plate, ID plate, lid plates, gold buttons).

### Neutral
- **Glass White** (#F3F5FC): primary text on velvet.
- **Frost Blue** (#C1CBEB): secondary text, tinted from the velvet hue, never gray.
- **Counter Night** (#080C26): the strip, the footer, fields and disabled buttons.
- **Tag Cotton** (#F7F4ED) with **Tag Ink** (#0B185B): placeholder tags only.
- **Box Leatherette** (#121A58): the outside of edition boxes.
- **Dog Tag Ink** (#222A3B): text engraved on silver tags.

### Named Rules
**The Velvet Owns the Room Rule.** Velvet covers most of every viewport. Gold is the light on it, never a field of its own; the largest gold surfaces are plates and frames.

**The Tinted Secondary Rule.** Secondary text on velvet is Frost Blue. Gray text does not exist in this world.

## Typography

**Display Font:** Lily Script One, self-hosted as 'GD Lily' (cursive fallback)
**Body Font:** Archivo (system-ui fallback), already loaded site-wide
**Label Font:** Michroma, self-hosted as 'GD Michroma'

**Character:** A chunky connected script reads as a cut gold nameplate; Michroma's extended caps read as machine engraving; Archivo carries everything that has to be read.

### Hierarchy
- **Display** (400, clamp(3.1rem, 6.4vw, 6rem), 1.04): the release title only, filled with the rendered gold bar, one band per line.
- **Headline** (400, clamp(2.6rem, 5.2vw, 4.5rem), 1.06): section names (The Words, The Voices, The Great Day Wall, The Editions), the hashtag and the footer line, all in rendered gold.
- **Title** (700, clamp(1.05rem, 1.6vw, 1.25rem)): artist names and edition names on velvet.
- **Body** (400 to 600, 0.9375rem, 1.6, at most 60ch): notes, story text on tags, footer copy.
- **Lede** (400, clamp(1.05rem, 1.4vw, 1.2rem), 1.6, 40ch, balanced): one supporting sentence beside a section name.
- **Label** (Michroma, 0.66 to 0.8rem, 0.14em to 0.34em tracking, uppercase): engraved labels, roles, the theme bar.

### Named Rules
**The Nameplate Rule.** Script is for names: the title, section names and the hashtag. Never set a sentence, a button or a label in it.

**The Engraved Label Rule.** Uppercase Michroma is a label for the control or object directly beneath or around it. It never sits above a heading as an eyebrow.

## Layout

Full-bleed sections, each its own tray, with a fluid gutter (clamp(16px, 6vw, 96px)) and vertical rhythm of clamp(5rem, 10vw, 8rem). Content tops out at 72 to 76rem.

- **Hero:** two columns (5fr pendant, 6fr copy) at a minimum of one viewport tall. The pendant hangs from the top edge on its chain. It stacks to one centered column at 860px, and at 520px the pendant shrinks so the play control stays in the first phone viewport.
- **Voices:** four lockets hanging from one rail, with chain lengths varied (64 to 104px). Two columns from 860px.
- **Wall:** a full-width silver rail with five tags. Below 1100px the tags form a 3, then 2, column grid with no row gap, so each tag hangs from the one above it. The engraver and hashtag sit side by side below.
- **Editions:** three boxes aligned on their bottoms, widening with the edition (about 236, 286 and 336px). They stack below 860px.

Breakpoints: 860px, 720px, 640px, 520px.

## Elevation & Depth

Depth comes from objects lying on velvet under a top light: soft, offset drop shadows that fall down and slightly right, and recessed trays with inset shadows top and bottom. Metal objects use `filter: drop-shadow` so the shadow follows their rendered alpha, not their box.

### Shadow Vocabulary
- **Lift** (`0 22px 44px hsl(232 70% 5% / 0.55), 0 4px 10px hsl(232 70% 5% / 0.4)`): objects resting on velvet (play button, plates, boxes).
- **Metal edge** (`inset 0 2px 1px rgb(255 250 225 / 0.8), inset 0 -3px 5px rgb(92 58 10 / 0.55)`): the thickness of a gold plate rendered with the brushed bar texture.
- **Tray** (`inset 0 22px 34px -18px hsl(232 70% 3% / 0.9), inset 0 -22px 34px -18px hsl(232 70% 3% / 0.9)`): recessed sections.

### Named Rules
**The Rendered Metal Rule.** New metal objects are rendered in the light tent (`scripts/greatday-render/`) and placed as images or textures. Linear gradients do not stand in for gold.

**The Light From Above Rule.** Every shadow falls downward. Highlights sit on top edges. The glass lip lives at the top of the hero.

## Shapes

Jewelry shapes. Rounded-square photo pendant (frame corner about 7% of its width), circular lockets, pill-shaped ID and theme plates, small rectangular plates with screw heads, and rope and ball chains. Placeholder tags have a notched left end with a punched hole and a cotton string. Fields are softly rounded (10px). Buttons and the mini player are pills.

## Components

### Buttons
- **Shape:** pill (999px).
- **Play:** 78px velvet disc inside a 5px rendered-gold ring; 50px in the mini player. It presses to 96% scale and brightens slightly on hover. The icon changes for loading, playing, ended and error.
- **Gold:** brushed-gold bar with Engraving Umber text, 48px minimum height.
- **Disabled:** Counter Night with Frost Blue text and a faint gold hairline ring. It is always labelled with what it is waiting for ("Not for sale yet", "Hold my spot").

### Inputs / Fields
- **Style:** Counter Night fill, 1.5px Case Light border at 75%, 10px radius, 52px tall.
- **Focus:** the border turns Gold Leaf with a 2px gold outline on keyboard focus.
- **Disabled:** 70% opacity, not-allowed cursor, with a note beneath saying why.

### Placeholder Tag
- **Style:** Tag Cotton paper, Tag Ink 11px bold caps, rotated -2deg, hung from a cotton string.
- **Use:** only where content is a placeholder (temporary art, sample stories, proposed prices, supplied-later assets, pre-launch features).

### Pendant and Lockets (signature)
Rendered rope-edged frames with channel-set brilliants. The cover sits in the pendant's window at a 10% inset. Lockets hold an engraved Michroma monogram on velvet until a cleared portrait is supplied. The pendant hangs on a rendered rope chain and bail, settles with a spring (stiffness 70, damping 10, mass 1.1) and leans up to 2.4deg toward a mouse pointer.

### Chain Seek (signature)
A native range input. The track is the rendered horizontal rope chain, dimmed past the playhead; the thumb is a gold lobster clasp. Keyboard steps are 1 second.

### Engraved Plates
Brushed-gold bars with Michroma text cut in Engraving Umber: the theme bar, the lyrics plate (with screw heads), the bracelet ID plate that engraves what a visitor types, and the edition lid plates.

## Do's and Don'ts

### Do:
- **Do** render new metal in the light tent and place it as an image or texture.
- **Do** keep velvet as the field and gold as the light.
- **Do** tag every placeholder with a cotton string tag, and only placeholders.
- **Do** keep one authored motion moment per surface: the case light sweep (1.9s, cubic-bezier(0.16, 1, 0.3, 1)) with the nameplate glint (1.7s). Remove both under reduced motion.
- **Do** give hanging objects physical motion (springs) and keep everything else still.

### Don't:
- **Don't** fill gold with CSS linear gradients or fake metal with stacked bevels.
- **Don't** set sentences, buttons or labels in the script face.
- **Don't** put an eyebrow or kicker above a section name.
- **Don't** add bounce or elastic easing, or hover sway with no state behind it.
- **Don't** use gray secondary text on velvet.
