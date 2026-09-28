import { lazy, ReactNode, Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";

const IntroExperience = lazy(() => import("./IntroExperience"));

const SEEN_KEY = "cap_intro_seen";
const BOT_UA = /bot|crawl|spider|slurp|lighthouse|prerender|headless|facebookexternalhit|embedly|whatsapp|telegram|discord|preview/i;

/** Every new visit opens with the intro; crawlers, repeat views and motion-off visitors go straight in. */
export function shouldPlayIntro(): boolean {
  if (typeof window === "undefined") return false;
  const q = new URLSearchParams(window.location.search);
  if (q.has("intro")) return true;
  if (q.has("nointro")) return false;
  if (BOT_UA.test(navigator.userAgent) || (navigator as Navigator & { webdriver?: boolean }).webdriver) return false;
  try {
    if (localStorage.getItem("mrcap.motionEnabled") === "false") return false;
    return sessionStorage.getItem(SEEN_KEY) !== "1";
  } catch {
    return true;
  }
}

export function markIntroSeen() {
  try { sessionStorage.setItem(SEEN_KEY, "1"); } catch { /* private mode */ }
}

/** Wraps the home route: plays the intro first, then reveals the page underneath. */
const IntroGate = ({ children }: { children: ReactNode }) => {
  const [playing, setPlaying] = useState(shouldPlayIntro);
  const navigate = useNavigate();

  if (!playing) return <>{children}</>;

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <IntroExperience
        onFinish={(path) => {
          markIntroSeen();
          window.scrollTo(0, 0);
          if (window.location.search) window.history.replaceState(null, "", window.location.pathname);
          if (path && path !== "/") navigate(path);
          setPlaying(false);
        }}
      />
    </Suspense>
  );
};

export default IntroGate;
