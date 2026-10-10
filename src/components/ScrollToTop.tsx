import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * New page: start at the top. A link with an anchor (/press#press-kit,
 * /videos#tiktok) scrolls to that section instead; pages load lazily, so the
 * anchor gets a couple of seconds to appear.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    const timer = window.setInterval(() => {
      const el = document.getElementById(id);
      if (el || ++tries > 40) {
        window.clearInterval(timer);
        if (el) el.scrollIntoView({ block: "start" });
        else window.scrollTo(0, 0);
      }
    }, 50);
    return () => window.clearInterval(timer);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
