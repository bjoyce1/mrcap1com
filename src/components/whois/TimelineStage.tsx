import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { ArrowUpRight, Check, Link2 } from "lucide-react";
import { toast } from "sonner";
import { Reveal, Scramble, SplitText } from "./motion";
import { EASE_OUT, useMotionOk } from "./motionUtils";
import { Gold, Stamp } from "./parts";

export type TimelineArt = string | { src: string; srcSet: string; sizes: string; fallback: string };

export type TimelineEntry = {
  slug: string;
  year: string;
  tag: string;
  title: string;
  body: string;
  art: TimelineArt;
  alt: string;
  caption?: string;
  credit?: string;
};

type Props = {
  entries: TimelineEntry[];
  /** position of this entry's image in the page's lightbox list (-1 if it has none) */
  lightboxIndex: (slug: string) => number;
  onOpen: (lightboxIdx: number) => void;
};

const srcOf = (a: TimelineArt) => (typeof a === "string" ? a : a.src);
const srcSetOf = (a: TimelineArt) => (typeof a === "string" ? undefined : a.srcSet);

const TimelineStage = ({ entries, lightboxIndex, onOpen }: Props) => {
  const ok = useMotionOk();
  const listRef = useRef<HTMLOListElement>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.55", "end 0.55"] });

  /* which entry is in the middle of the screen */
  useEffect(() => {
    const items = Array.from(listRef.current?.querySelectorAll<HTMLLIElement>('li[id^="t-"]') ?? []);
    if (items.length === 0) return;
    const visibility = new Map<string, number>();
    const observer = new IntersectionObserver(
      (records) => {
        records.forEach((r) => visibility.set(r.target.id, r.intersectionRatio));
        let bestId: string | null = null;
        let bestRatio = 0;
        visibility.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });
        if (bestId && bestRatio > 0) setActiveSlug(bestId.replace(/^t-/, ""));
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* deep links: #t-<slug> */
  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#t-")) setActiveSlug(hash.slice(3));
    };
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (!hash.startsWith("#t-")) return;
      const el = document.getElementById(hash.slice(1));
      if (el) requestAnimationFrame(() => el.scrollIntoView({ behavior: ok ? "smooth" : "auto", block: "start" }));
    };
    syncFromHash();
    const t = window.setTimeout(scrollToHash, 350);
    const onHash = () => {
      syncFromHash();
      scrollToHash();
    };
    window.addEventListener("hashchange", onHash);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("hashchange", onHash);
    };
  }, [ok]);

  const copyEntryLink = async (slug: string, title: string) => {
    const url = `${window.location.origin}/who-is-mr-cap#t-${slug}`;
    try {
      window.history?.replaceState?.(null, "", `#t-${slug}`);
      await navigator.clipboard.writeText(url);
      setCopiedSlug(slug);
      window.setTimeout(() => setCopiedSlug((s) => (s === slug ? null : s)), 1800);
      toast.success("Link copied", { description: `${title} — ${url}` });
    } catch {
      toast.error("Couldn't copy — long-press the link to copy manually.");
    }
  };

  const jumpTo = (slug: string) => {
    window.history?.replaceState?.(null, "", `#t-${slug}`);
    document.getElementById(`t-${slug}`)?.scrollIntoView({ behavior: ok ? "smooth" : "auto", block: "start" });
  };

  const current = activeSlug ?? entries[0].slug;
  const currentIndex = Math.max(0, entries.findIndex((e) => e.slug === current));
  const cur = entries[currentIndex];
  const openCurrent = () => onOpen(Math.max(0, lightboxIndex(cur.slug)));

  return (
    <section
      id="ch-timeline"
      className="relative scroll-mt-24 bg-gradient-to-b from-transparent via-[hsl(var(--card)/0.35)] to-transparent py-32 md:py-40"
    >
      <div className="container mx-auto px-6">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6 md:mb-24">
          <div>
            <Reveal>
              <Stamp>Chapter 04 · Catalog Timeline</Stamp>
            </Reveal>
            <SplitText as="h2" className="mt-6 font-display text-[clamp(2.5rem,5.5vw,4.75rem)] leading-[0.92]">
              30+ years, <Gold>on record.</Gold>
            </SplitText>
          </div>
          <Reveal delay={0.2}>
            <Link
              to="/mr-cap-discography"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[hsl(var(--accent-gold))] transition-colors hover:text-foreground"
            >
              Full Discography <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Reveal>
        </div>

        <div className="grid gap-x-10 lg:grid-cols-12">
          {/* ── sticky viewer (desktop) ─────────────────────────────── */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-28 h-[calc(100svh-8rem)] max-h-[720px] min-h-[500px]">
              {/* the year, behind everything: a soft solid copy under an outline */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={cur.slug}
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-1 top-0 z-0 select-none font-display text-[clamp(5.5rem,11vw,10.5rem)] leading-[0.9]"
                  initial={ok ? { y: 46, opacity: 0 } : { opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={ok ? { y: -46, opacity: 0 } : { opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE_OUT }}
                >
                  <span className="absolute left-2 top-2 text-[hsl(var(--accent-gold)/0.12)]">{cur.year}</span>
                  <span className="relative text-transparent" style={{ WebkitTextStroke: "2px hsl(var(--accent-gold))" }}>
                    {cur.year}
                  </span>
                </motion.div>
              </AnimatePresence>

              {/* the art, in front */}
              <div className="absolute bottom-10 right-0 z-10 aspect-square w-[min(84%,430px)]">
                <div className="absolute inset-0 translate-x-4 translate-y-4 border border-[hsl(var(--accent-gold)/0.45)]" aria-hidden="true" />
                <div className="absolute inset-0 -translate-x-3 -translate-y-3 border border-[hsl(var(--foreground)/0.12)]" aria-hidden="true" />
                <button
                  type="button"
                  data-lightbox-idx={lightboxIndex(cur.slug)}
                  onClick={openCurrent}
                  aria-label={`Open enlarged view of ${cur.alt}`}
                  className="group absolute inset-0 overflow-hidden bg-card shadow-[0_40px_80px_hsl(0_0%_0%/0.65)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-gold))] focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                >
                  {entries.map((e, i) =>
                    Math.abs(i - currentIndex) <= 1 ? (
                      <img
                        key={e.slug}
                        src={srcOf(e.art)}
                        srcSet={srcSetOf(e.art)}
                        sizes="(min-width: 1024px) 430px, 80vw"
                        alt={i === currentIndex ? e.alt : ""}
                        aria-hidden={i === currentIndex ? undefined : true}
                        decoding="async"
                        className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out ${
                          i === currentIndex ? "scale-100 opacity-100" : "scale-[1.06] opacity-0"
                        } ${ok ? "" : "!scale-100"}`}
                      />
                    ) : null,
                  )}
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
                  <span className="pointer-events-none absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/85 opacity-0 transition-opacity group-hover:opacity-100">
                    Enlarge
                  </span>
                </button>
                {/* corner ticks */}
                {["-left-2 -top-2", "-right-2 -top-2 rotate-90", "-bottom-2 -left-2 -rotate-90", "-bottom-2 -right-2 rotate-180"].map((p) => (
                  <span key={p} aria-hidden="true" className={`absolute h-5 w-5 border-l border-t border-[hsl(var(--accent-gold))] ${p}`} />
                ))}
              </div>

              {/* jump dots */}
              <nav aria-label="Timeline entries" className="absolute bottom-10 left-0 z-20 flex flex-col gap-3">
                {entries.map((e, i) => (
                  <button
                    key={e.slug}
                    type="button"
                    onClick={() => jumpTo(e.slug)}
                    aria-label={`Go to ${e.year}: ${e.title}`}
                    aria-current={i === currentIndex ? "true" : undefined}
                    className="group flex items-center gap-3 focus:outline-none"
                  >
                    <span
                      className={`block rounded-full transition-all duration-300 group-focus-visible:ring-2 group-focus-visible:ring-[hsl(var(--accent-gold))] ${
                        i === currentIndex ? "h-2 w-7 bg-[hsl(var(--accent-gold))]" : "h-2 w-2 bg-[hsl(var(--foreground)/0.3)] group-hover:bg-[hsl(var(--foreground)/0.7)]"
                      }`}
                    />
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                      {e.year}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* ── the entries ─────────────────────────────────────────── */}
          <div className="relative lg:col-span-7">
            <div aria-hidden="true" className="absolute bottom-0 left-[13px] top-0 w-px bg-[hsl(var(--foreground)/0.12)] lg:left-[17px]" />
            <motion.div
              aria-hidden="true"
              style={{ scaleY: ok ? scrollYProgress : 1 }}
              className="absolute bottom-0 left-[13px] top-0 w-px origin-top bg-[hsl(var(--accent-gold))] lg:left-[17px]"
            />

            <ol ref={listRef} className="relative">
              {entries.map((m) => {
                const isActive = current === m.slug;
                const idx = lightboxIndex(m.slug);
                return (
                  <li
                    key={m.slug}
                    id={`t-${m.slug}`}
                    aria-current={isActive ? "true" : undefined}
                    className="relative flex min-h-[54svh] scroll-mt-28 items-center py-10 pl-12 lg:min-h-[60svh] lg:pl-20"
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute left-[7px] top-1/2 -translate-y-1/2 rounded-full bg-[hsl(var(--accent-gold))] shadow-[0_0_0_4px_hsl(var(--background))] transition-all duration-500 lg:left-[11px] ${
                        isActive ? "h-[13px] w-[13px] shadow-[0_0_0_4px_hsl(var(--background)),0_0_22px_hsl(var(--accent-gold)/0.85)]" : "h-[13px] w-[13px] scale-[0.6] opacity-60"
                      }`}
                    />

                    <div className={`min-w-0 transition-opacity duration-500 focus-within:opacity-100 ${isActive ? "opacity-100" : "opacity-60"}`}>
                      {/* phones and tablets show the art inline */}
                      <div className="mb-6 lg:hidden">
                        <button
                          type="button"
                          data-lightbox-idx={idx}
                          onClick={() => onOpen(Math.max(0, idx))}
                          aria-label={`Open enlarged view of ${m.alt}`}
                          className="group relative block aspect-square w-52 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-gold))] focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:w-60"
                        >
                          <img
                            src={srcOf(m.art)}
                            srcSet={srcSetOf(m.art)}
                            sizes="240px"
                            alt={m.alt}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full border border-[hsl(var(--foreground)/0.1)] object-cover shadow-[0_30px_60px_hsl(0_0%_0%/0.6)]"
                          />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-[hsl(var(--accent-gold))]">
                          <Scramble text={m.tag} />
                        </div>
                        <button
                          type="button"
                          onClick={() => copyEntryLink(m.slug, m.title)}
                          aria-label={`Copy shareable link to ${m.title}`}
                          title="Copy link to this entry"
                          className="inline-flex items-center gap-1.5 border border-[hsl(var(--foreground)/0.1)] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:border-[hsl(var(--accent-gold)/0.6)] hover:text-[hsl(var(--accent-gold))] focus:outline-none focus-visible:text-[hsl(var(--accent-gold))] focus-visible:ring-1 focus-visible:ring-[hsl(var(--accent-gold))]"
                        >
                          {copiedSlug === m.slug ? (
                            <>
                              <Check className="h-3 w-3" aria-hidden />
                              Copied
                            </>
                          ) : (
                            <>
                              <Link2 className="h-3 w-3" aria-hidden />
                              Link
                            </>
                          )}
                        </button>
                      </div>

                      <Reveal y={22}>
                        <div className="mt-3 font-display text-5xl leading-none md:text-6xl">{m.year}</div>
                        <h3 className="mt-4 font-display text-2xl text-foreground [text-wrap:balance] md:text-4xl">{m.title}</h3>
                        <p className="mt-4 max-w-md text-base text-muted-foreground md:text-lg">{m.body}</p>
                      </Reveal>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineStage;
