import type { RefObject } from "react";

/** Small helpers for the scroll stages on /music. `t` is a beat's local progress (0 = beat starts, 1 = beat ends). */
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const ramp = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
export const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
export const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const lerp = (a: number, b: number, x: number) => a + (b - a) * x;

/**
 * Scroll the window so beat `i` of `n` sits in the middle of its window on a
 * sticky runway. `instant` skips the html element's smooth scrolling.
 */
export function scrollToBeat(runway: RefObject<HTMLElement>, i: number, n: number, smooth: boolean) {
  const el = runway.current;
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY;
  const travel = el.offsetHeight - window.innerHeight;
  window.scrollTo({ top: top + travel * ((i + 0.45) / n), behavior: smooth ? "smooth" : ("instant" as ScrollBehavior) });
}
