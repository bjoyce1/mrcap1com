import { useEffect, useState } from "react";

export type Chapter = { id: string; num: string; label: string };

interface ChapterNavProps {
  chapters: Chapter[];
}

const ChapterNav = ({ chapters }: ChapterNavProps) => {
  const [activeId, setActiveId] = useState<string>(chapters[0]?.id ?? "");
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const elements = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => !!el);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the viewport that is intersecting
        const visibleEntries = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visibleEntries[0]) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        // Trigger when a section crosses ~30% down from viewport top
        rootMargin: "-30% 0px -60% 0px",
        threshold: 0,
      }
    );

    elements.forEach((el) => observer.observe(el));

    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
      setProgress(p);
      setVisible(window.scrollY > window.innerHeight * 0.4);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [chapters]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <>
      {/* Top progress bar (all viewports) */}
      <div
        className="fixed left-0 right-0 top-0 z-[55] h-[2px] bg-transparent pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full bg-[hsl(var(--accent-gold))] transition-[width] duration-150"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Desktop rail */}
      <nav
        aria-label="Chapter navigation"
        className={`hidden lg:block fixed right-6 top-1/2 -translate-y-1/2 z-40 transition-all duration-500 ${
          visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
        }`}
      >
        <ol className="flex flex-col gap-4">
          {chapters.map((c) => {
            const isActive = activeId === c.id;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => scrollTo(c.id)}
                  className="group flex items-center gap-3"
                  aria-current={isActive ? "true" : undefined}
                  aria-label={`Jump to ${c.label}`}
                >
                  <span
                    className={`font-mono text-[10px] tracking-[0.3em] uppercase text-right transition-all duration-300 ${
                      isActive
                        ? "opacity-100 text-[hsl(var(--accent-gold))]"
                        : "opacity-0 group-hover:opacity-80 text-[hsl(var(--foreground)/0.7)]"
                    }`}
                  >
                    {c.label}
                  </span>
                  <span
                    className={`relative block h-px transition-all duration-300 ${
                      isActive
                        ? "w-10 bg-[hsl(var(--accent-gold))]"
                        : "w-5 bg-[hsl(var(--foreground)/0.35)] group-hover:w-8 group-hover:bg-[hsl(var(--foreground)/0.7)]"
                    }`}
                  />
                  <span
                    className={`font-mono text-[10px] tracking-[0.2em] tabular-nums transition-colors ${
                      isActive ? "text-[hsl(var(--accent-gold))]" : "text-[hsl(var(--foreground)/0.5)]"
                    }`}
                  >
                    {c.num}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default ChapterNav;
