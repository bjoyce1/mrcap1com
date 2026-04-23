import { useEffect, useRef } from "react";

const ScrollProgressBar = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = barRef.current;
      if (!el) return;
      const scrollTop = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = height > 0 ? Math.min(1, Math.max(0, scrollTop / height)) : 0;
      el.style.transform = `scaleX(${progress})`;
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[100] pointer-events-none">
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-to-r from-primary via-cap-gold to-primary shadow-[0_0_8px_hsl(var(--primary)/0.6)]"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
};

export default ScrollProgressBar;
