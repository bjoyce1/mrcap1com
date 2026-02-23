
# Merch Page Premium Overhaul

Elevate the merch shopping experience with 3D hover effects, smooth layout animations on filtering, a sticky glassmorphism category bar, and a red accent color scheme matching the Trap University brand.

## What Changes

### 1. Sticky Glassmorphism Category Bar
- Restyle `MerchCategoryTabs` with `sticky top-0 z-40`, `backdrop-blur-xl`, and a frosted-glass dark background
- Replace the blue active-tab highlight with a red pill using Framer Motion's `layoutId` for a smooth sliding indicator
- Remove emoji icons, use uppercase text-only labels for a cleaner streetwear aesthetic

### 2. Layout Animations on Filtering
- Add `layout` prop to the product grid and each card wrapper in `PrintfulProductGrid`
- Wrap products in `AnimatePresence mode="popLayout"` so filtered-out items animate away and remaining items smoothly reposition
- Cards scale/fade in when entering and scale/fade out when leaving

### 3. Premium Product Cards with 3D Hover
- Taller `aspect-[4/5]` image ratio for a fashion-forward look
- Image zooms to `scale-110` on hover with a 700ms ease
- Hover overlay with backdrop blur reveals a red "Quick Add" button that slides up, plus a "Quick View" link
- Variant badge restyled with dark glassmorphism pill (`bg-black/80 backdrop-blur-md border border-white/10`)
- Card border transitions from `white/5` to `red-500/30` on hover
- Red accent on product name hover state

### 4. Color Scheme Alignment
- Switch all blue accents to red (`red-600`, `red-500`, `red-400`) across `PrintfulProductGrid`, `MerchCategoryTabs`, and `PrintfulProductCard`
- Remove non-functional ChevronLeft/ChevronRight navigation arrows from the grid

---

## Technical Details

### Files Modified

**`src/components/merch/MerchCategoryTabs.tsx`**
- Add sticky positioning with glassmorphism: `sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl`
- Framer Motion `layoutId="activeCategoryTab"` animated red pill behind active button
- Uppercase text-only labels, no emojis

**`src/components/merch/PrintfulProductCard.tsx`**
- `aspect-[4/5]` image container, `whileHover={{ y: -8 }}` lift
- Red overlay button (`bg-red-600 hover:bg-red-500`) slides up on group hover
- "Quick View" text link below button
- Glassmorphism variant badge, red hover text accent

**`src/components/merch/PrintfulProductGrid.tsx`**
- `layout` prop on grid and card wrappers
- `AnimatePresence mode="popLayout"` with enter/exit transitions
- Red loading spinner and section accents
- Remove non-functional navigation arrows

### Performance
- All animations use `transform` and `opacity` (GPU-accelerated)
- Layout animations use Framer Motion's FLIP technique
- Image `loading="lazy"` preserved
