import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/integrations/supabase/client";
import { useIntroStore } from "@/stores/introStore";
import { usePlayerStore } from "@/stores/playerStore";
import type { IntroHandle } from "@/intro";
import IntroShell from "./IntroShell";

interface IntroExperienceProps {
  /** Called with "/" for ENTER SITE, or the internal path the visitor clicked. */
  onFinish: (path: string) => void;
}

/**
 * Mounts the "Step inside the ISM" WebGL scroll journey.
 * Rendered through a portal on <body> so route transitions (which animate a
 * transform on their wrapper) can't trap the intro's fixed layers.
 */
const IntroExperience = ({ onFinish }: IntroExperienceProps) => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const finishRef = useRef(onFinish);
  finishRef.current = onFinish;
  const setActive = useIntroStore((s) => s.setActive);
  const [mounted, setMounted] = useState(false);

  // hide the site chrome before first paint, and hush the site's own player
  useLayoutEffect(() => {
    setActive(true);
    usePlayerStore.getState().pause();
    return () => setActive(false);
  }, [setActive]);

  useEffect(() => {
    const boot = new AbortController();
    let handle: IntroHandle | null = null;

    import("@/intro")
      .then(({ mountIntro }) => {
        if (boot.signal.aborted || !hostRef.current) return null;
        setMounted(true);
        return mountIntro(hostRef.current, {
          signal: boot.signal,
          onEnter: () => finishRef.current("/"),
          onNavigate: (path) => finishRef.current(path),
          insert: async (table, row) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error } = await supabase.from(table as any).insert(row as any);
            return !error || error.code === "23505"; // already on the list counts as success
          },
        });
      })
      .then((h) => {
        if (!h) return;
        if (boot.signal.aborted) h.destroy();
        else handle = h;
      })
      .catch((err) => {
        if (boot.signal.aborted) return;
        console.error("[intro] failed to load — continuing to the site", err);
        finishRef.current("/");
      });

    return () => {
      boot.abort();
      handle?.destroy();
    };
  }, []);

  return createPortal(
    <>
      {!mounted && <IntroShell />}
      <div ref={hostRef} />
    </>,
    document.body,
  );
};

export default IntroExperience;
