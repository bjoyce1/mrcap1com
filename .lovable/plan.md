

## Plan: Animate mascot to dance when music is playing

### Approach
Subscribe to `usePlayerStore`'s `isPlaying` state inside `FloatingMascot`. When `isPlaying` is true, replace the slow idle breathing animation with a faster, bouncier dance loop — rhythmic bobbing, side-to-side sway, and slight rotation.

### Changes

**File: `src/components/FloatingMascot.tsx`**

1. Import `usePlayerStore` from `@/stores/playerStore`
2. Destructure `isPlaying` from the store
3. Replace the idle body-language `<motion.div>` animation (lines 214-223) with conditional logic:
   - **When playing**: Fast bounce (`y: [0, -14, 0]` at ~0.5s), side sway (`x: [0, 6, -6, 0]` at ~0.8s), and rotation wiggle (`rotate: [0, -6, 6, 0]` at ~0.6s) — a tight rhythmic dance loop
   - **When idle**: Keep the existing slow breathing animation unchanged
4. Add a subtle pulsing glow behind the mascot when dancing (amplify the existing ambient glow)

No new files. No database changes. Single file edit.

