import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/integrations/supabase/client";
import { useIntroStore } from "@/stores/introStore";
import type { IntroHandle } from "@/intro";

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

  useEffect(() => {
    let handle: IntroHandle | null = null;
    let cancelled = false;
    setActive(true);

    import("@/intro").then(async ({ mountIntro }) => {
      if (cancelled || !hostRef.current) return;
      const h = await mountIntro(hostRef.current, {
        onEnter: () => finishRef.current("/"),
        onNavigate: (path) => finishRef.current(path),
        insert: async (table, row) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { error } = await supabase.from(table as any).insert(row as any);
          return !error;
        },
      });
      if (cancelled) h.destroy();
      else handle = h;
    });

    return () => {
      cancelled = true;
      handle?.destroy();
      setActive(false);
    };
  }, [setActive]);

  return createPortal(<div ref={hostRef} />, document.body);
};

export default IntroExperience;
