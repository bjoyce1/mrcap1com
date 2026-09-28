import { useMotionPreference } from "@/stores/motionPreferenceStore";

const SEEN_KEY = "cap_intro_seen";
const BOT_UA = /\b(bot|crawl|spider|slurp|lighthouse|prerender|headless|facebookexternalhit|embedly|whatsapp|telegram|discord)\b|preview/i;

// Evaluated once at app boot: the intro only opens a visit that *starts* on the home page.
const ENTRY_IS_HOME =
  typeof window !== "undefined" && window.location.pathname === "/" && !window.location.hash;

let seenThisLoad = false;

export function isBot(): boolean {
  if (typeof navigator === "undefined") return true;
  return BOT_UA.test(navigator.userAgent) || !!(navigator as Navigator & { webdriver?: boolean }).webdriver;
}

/** New visits that land on "/" open with the intro; crawlers, deep links, repeat views and motion-off visitors go straight in. */
export function shouldPlayIntro(): boolean {
  if (typeof window === "undefined") return false;
  const q = new URLSearchParams(window.location.search);
  if (q.has("intro")) return true;
  if (q.has("nointro") || seenThisLoad || !ENTRY_IS_HOME || isBot()) return false;
  // honours the site's motion toggle *and* the OS reduced-motion default
  if (!useMotionPreference.getState().motionEnabled) return false;
  try {
    return sessionStorage.getItem(SEEN_KEY) !== "1";
  } catch {
    return !seenThisLoad;
  }
}

export function markIntroSeen() {
  seenThisLoad = true;
  try { sessionStorage.setItem(SEEN_KEY, "1"); } catch { /* storage blocked — the in-memory flag covers this load */ }
}
