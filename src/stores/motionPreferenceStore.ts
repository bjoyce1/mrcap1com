import { create } from "zustand";

const STORAGE_KEY = "mrcap.motionEnabled";

const readSystemReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
};

const readInitial = (): boolean => {
  if (typeof window === "undefined") return true;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "true") return true;
    if (stored === "false") return false;
  } catch {
    /* ignore — private mode etc. */
  }
  // No stored preference → default ON unless the OS asks to reduce motion.
  return !readSystemReducedMotion();
};

interface MotionPreferenceState {
  /** True when background motion (videos, parallax loops) is allowed. */
  motionEnabled: boolean;
  /** True when the user has explicitly set a preference (overrides OS hint). */
  userOverridden: boolean;
  setMotionEnabled: (enabled: boolean) => void;
  toggleMotion: () => void;
}

export const useMotionPreference = create<MotionPreferenceState>((set, get) => ({
  motionEnabled: readInitial(),
  userOverridden:
    typeof window !== "undefined" &&
    !!(() => {
      try {
        return window.localStorage.getItem(STORAGE_KEY) !== null;
      } catch {
        return false;
      }
    })(),
  setMotionEnabled: (enabled) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(enabled));
    } catch {
      /* ignore */
    }
    set({ motionEnabled: enabled, userOverridden: true });
  },
  toggleMotion: () => get().setMotionEnabled(!get().motionEnabled),
}));
