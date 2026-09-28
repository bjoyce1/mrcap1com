import { create } from "zustand";

/** True while the immersive intro owns the screen (hides the site's global chrome). */
interface IntroState {
  active: boolean;
  setActive: (active: boolean) => void;
}

export const useIntroStore = create<IntroState>((set) => ({
  active: false,
  setActive: (active) => set({ active }),
}));
