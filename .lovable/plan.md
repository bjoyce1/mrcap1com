
# Merch Page Premium Overhaul

Elevate the merch shopping experience with 3D hover effects, smooth layout animations on filtering, a sticky glassmorphism category bar, and a red accent color scheme matching the Trap University brand.

## What Changes

### 1. Sticky Glassmorphism Category Bar
- Restyle `MerchCategoryTabs` with `sticky top-0`, `backdrop-blur-xl`, and a frosted-glass dark background
- Replace the blue active-tab highlight with a red pill using Framer Motion's `layoutId` for a smooth sliding indicator
- Add a subtle red glow shadow on the active tab

### 2. Layout Animations on Filtering
- Add `layout` prop to the product grid container and each card wrapper in `PrintfulProductGrid`
- Wrap products in `AnimatePresence mode="popLayout"` so filtered-out items animate away and remaining items smoothly reposition
- Cards will scale/fade in when entering, and scale/fade out when leaving

### 3. Premium Product Cards with 3D Hover
- Redesign `PrintfulProductCard` with:
  - Taller `aspect-[4/5]` image ratio for a fashion-forward look
  - Image zooms to `scale-110` on hover with a 700ms ease
  - Hover overlay with backdrop blur reveals a red "Quick Add" button that slides up, plus a "Quick View" link
  - Variant badge restyled with a dark glassmorphism pill
  - Card border transitions from `white/5` to `red-500/30` on hover
  - Red accent on product name hover state (replacing current blue)
- Update all blue accent references to red (`red-600`, `red-500`, `red-400`) to match the page's visual identity

### 4. Color Scheme Alignment
- Switch loading spinner, error icon, and all interactive accents from blue to red across `PrintfulProductGrid`, `MerchCategoryTabs`, and `PrintfulProductCard`

---

## Technical Details

### Files Modified

**`src/components/merch/MerchCategoryTabs.tsx`**
- Add `sticky top-0 z-40` positioning
- Apply `bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black`
- Replace static `bg-blue-500` active class with a Framer Motion `layoutId="activeCategoryTab"` animated red pill behind the active button
- Remove emoji icons, use uppercase text-only labels for a cleaner streetwear aesthetic

**`src/components/merch/PrintfulProductCard.tsx`**
- Change image container to `aspect-[4/5]` with `rounded-2xl`
- Add `whileHover={{ y: -8 }}` lift effect
- Replace blue overlay button with a red one (`bg-red-600 hover:bg-red-500`) that slides up via CSS `translate-y` on group hover
- Add "Quick View" text link below the button
- Restyle variant badge: `bg-black/80 backdrop-blur-md border border-white/10`
- Change hover text accent from `blue-400` to `red-400`

**`src/components/merch/PrintfulProductGrid.tsx`**
- Add `layout` prop to the grid `motion.div` and each card wrapper
- Wrap mapped products in `AnimatePresence mode="popLayout"`
- Add `initial`, `animate`, `exit` variants on each card for enter/exit transitions
- Change loading spinner and section accents from blue to red
- Remove the non-functional ChevronLeft/ChevronRight navigation arrows (they currently do nothing)

**`src/pages/Merch.tsx`**
- No structural changes needed; the child components handle the visual upgrades

### Performance Considerations
- All animations use `transform` and `opacity` (GPU-accelerated, no layout thrashing)
- `layout` animations are handled by Framer Motion's FLIP technique
- Image `loading="lazy"` is preserved
- `will-change` is managed automatically by Framer Motion
