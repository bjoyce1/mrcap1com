# Fix: `insertBefore` crash on `/music`

## Root cause

`src/components/music/Catalog.tsx` combines two things that don't mix:

- The same `cards` array is rendered twice — a desktop rail and a mobile rail — via `hidden`/`block` utility classes. Both are always in the DOM.
- On desktop, GSAP `ScrollTrigger` with `pin: true` wraps the section in a pin-spacer and re-parents the track element. When React later commits an update (or the route unmounts), the DOM parent GSAP produced no longer matches the parent React expects, and `insertBefore` throws `NotFoundError`.

`HorizontalShelf.tsx` had the same shape and was partially fixed last turn (conditional desktop/mobile render), but the GSAP cleanup timing there is also fragile in the same way.

## Changes

### 1. `src/components/music/Catalog.tsx`

- Track viewport with `useState` + `matchMedia` (same pattern already added to `HorizontalShelf`) and render **only one** of the desktop rail or mobile rail at a time. This removes the duplicate child trees that confuse reconciliation.
- Move the GSAP setup from `useEffect` to `useLayoutEffect` and wrap it in `gsap.context(() => { ... }, sectionRef)` so cleanup runs synchronously before React's next commit and kills every ScrollTrigger scoped to that section.
- Gate the effect on `isDesktop` so the pin only initializes when the desktop rail is actually mounted, and tears down cleanly when switching to mobile.
- Call `ScrollTrigger.refresh()` once after layout settles (`requestAnimationFrame`) instead of `setTimeout`, and cancel it in the cleanup.

### 2. `src/components/music/HorizontalShelf.tsx`

- Same hardening: switch the GSAP setup to `useLayoutEffect` + `gsap.context(..., sectionRef)`, and gate on the existing `isDesktop` state so pin creation and teardown are symmetric with mount/unmount.
- Keep the already-added `isDesktop` conditional render (one branch at a time).

### 3. No changes elsewhere

Verified only `Catalog` and `HorizontalShelf` use `pin: true` on this route; other GSAP usages are parallax/scrub without pinning and are not implicated.

## Verification

- Reload `/music` and confirm the page renders (no blank screen, no console `NotFoundError`).
- Scroll through the Most Played / Latest / Albums / Singles / Archive shelves and through the "The Catalog" section — horizontal scrub should still work on desktop, native swipe on mobile.
- Navigate away from `/music` and back — no unmount errors.
- Resize the window across the 900 px breakpoint — the correct rail mounts and GSAP pin is created/destroyed without warnings.

## Technical notes

- `gsap.context(fn, scope)` is the officially recommended cleanup pattern for React: it records every animation and ScrollTrigger created inside `fn` and reverts them atomically on `ctx.revert()`, which is exactly what's needed when React is about to unmount or replace a pinned subtree.
- `useLayoutEffect` (not `useEffect`) ensures the revert runs before the browser paints the next frame, so React never attempts an `insertBefore` against a DOM tree GSAP still owns.
- Conditional rendering (rather than `hidden`/`block` toggling) is what removes the duplicate-children hazard — with a single subtree in play, GSAP and React operate on the same nodes.
