import { useEffect, useState, type CSSProperties, type RefObject } from "react";
import { useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useMotionPreference } from "@/stores/motionPreferenceStore";

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/**
 * True when decorative motion is allowed. The site's motion store already
 * defaults to "off" when the OS asks for reduced motion; an explicit choice on
 * the floating pill wins over that default.
 */
export const useMotionOk = (): boolean => {
  const prefersReduced = useReducedMotion();
  const motionEnabled = useMotionPreference((s) => s.motionEnabled);
  const userOverridden = useMotionPreference((s) => s.userOverridden);
  return motionEnabled && (!prefersReduced || userOverridden);
};

/** Fine pointer with hover (a mouse or trackpad), the only place pointer parallax makes sense. */
const hasFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;

/** Tracks a media query, e.g. "(max-height: 659px)". */
export function useMediaMatch(query: string): boolean {
  const [match, setMatch] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setMatch(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [query]);
  return match;
}

/** A mask needs room for descenders and slab serifs, then hands the space back with negative margins. */
export const MASK_STYLE: CSSProperties = {
  paddingTop: "0.08em",
  marginTop: "-0.08em",
  paddingBottom: "0.18em",
  marginBottom: "-0.18em",
  paddingInline: "0.04em",
  marginInline: "-0.04em",
};

/** Springy -1..1 pointer position over `ref`. Stays at 0 on touch screens and whenever motion is off. */
export function usePointerParallax(ref: RefObject<HTMLElement>) {
  const ok = useMotionOk();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 80, damping: 18, mass: 0.7 });
  const y = useSpring(rawY, { stiffness: 80, damping: 18, mass: 0.7 });

  useEffect(() => {
    const el = ref.current;
    if (!ok || !el || !hasFinePointer()) {
      rawX.set(0);
      rawY.set(0);
      return;
    }
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      rawX.set(((e.clientX - r.left) / r.width - 0.5) * 2);
      rawY.set(((e.clientY - r.top) / r.height - 0.5) * 2);
    };
    const leave = () => {
      rawX.set(0);
      rawY.set(0);
    };
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [ok, ref, rawX, rawY]);

  return { x, y };
}
