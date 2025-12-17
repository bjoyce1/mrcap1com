import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { selfLove2024, room2024AmbientAudio } from "@/data/selfLove2024";
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";

export default function SelfLoveStoryModal() {
  const nav = useNavigate();
  const location = useLocation();
  const { slug } = useParams();

  // Preserve background route state while navigating inside modal
  const backgroundLocation = (location.state as any)?.backgroundLocation;

  const stories = selfLove2024;

  const activeIndex = useMemo(
    () => stories.findIndex((s) => s.slug === slug),
    [stories, slug]
  );

  const story = activeIndex >= 0 ? stories[activeIndex] : null;

  const prevSlug = activeIndex > 0 ? stories[activeIndex - 1].slug : null;
  const nextSlug =
    activeIndex >= 0 && activeIndex < stories.length - 1
      ? stories[activeIndex + 1].slug
      : null;

  // --------- POLISH: scroll lock + restore ----------
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPaddingRight = body.style.paddingRight;

    // Prevent layout shift when scrollbar disappears
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.paddingRight = prevBodyPaddingRight;
    };
  }, []);

  const goTo = (targetSlug: string) => {
    nav(`/self-love/2024/${targetSlug}`, {
      replace: true,
      state: backgroundLocation ? { backgroundLocation } : undefined,
    });
  };

  // Close on ESC, arrow keys for navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") nav(-1);
      if (e.key === "ArrowLeft" && prevSlug) goTo(prevSlug);
      if (e.key === "ArrowRight" && nextSlug) goTo(nextSlug);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevSlug, nextSlug, slug]);

  // --------- Audio toggle ----------
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioOn, setAudioOn] = useState(false);

  useEffect(() => {
    // If audio isn't configured, keep it off.
    if (!room2024AmbientAudio) return;

    const a = audioRef.current;
    if (!a) return;

    if (audioOn) {
      a.volume = 0.5;
      a.loop = true;
      a.play().catch(() => {
        // autoplay restrictions are normal; user can tap again
        setAudioOn(false);
      });
    } else {
      a.pause();
      a.currentTime = 0;
    }
  }, [audioOn]);

  // Stop audio when modal unmounts
  useEffect(() => {
    return () => {
      const a = audioRef.current;
      if (!a) return;
      a.pause();
      a.currentTime = 0;
    };
  }, []);

  if (!story) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop (click to close) */}
      <button
        aria-label="Close"
        onClick={() => nav(-1)}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      />

      {/* Hidden audio element (only if provided) */}
      {room2024AmbientAudio && (
        <audio ref={audioRef} src={room2024AmbientAudio} preload="none" />
      )}

      {/* Modal shell */}
      <div className="relative mx-auto flex h-full max-w-5xl items-center px-4 py-8">
        <div className="relative w-full overflow-hidden rounded-2xl border border-border/20 bg-card shadow-2xl">
          {/* Top bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/20 bg-muted/30 px-4 py-3">
            <div className="min-w-0">
              <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
                {story.character}
              </p>
              <p className="truncate text-sm font-medium text-foreground">
                {story.storyTitle}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Audio toggle */}
              {room2024AmbientAudio && (
                <button
                  type="button"
                  onClick={() => setAudioOn((v) => !v)}
                  className="rounded-xl border border-border/20 bg-muted/30 px-3 py-2 text-sm text-foreground hover:bg-muted/50 transition flex items-center gap-2"
                  title="Ambient audio"
                >
                  {audioOn ? (
                    <>
                      <Volume2 className="w-4 h-4" /> On
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-4 h-4" /> Off
                    </>
                  )}
                </button>
              )}

              <button
                onClick={() => nav(-1)}
                className="rounded-xl border border-border/20 bg-muted/30 px-3 py-2 text-sm text-foreground hover:bg-muted/50 transition flex items-center gap-2"
              >
                Close <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Story Map strip (thumbnails) */}
          <div className="border-b border-border/20 bg-muted/20 px-3 py-3">
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
                Story Map
              </p>
              <p className="text-xs text-muted-foreground">
                Tip: ← / → to navigate
              </p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {stories.map((s) => {
                const isActive = s.slug === story.slug;
                return (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => goTo(s.slug)}
                    className={`flex items-center gap-2 rounded-xl border px-2 py-2 min-w-[200px] transition ${
                      isActive
                        ? "border-primary/50 bg-primary/10"
                        : "border-border/20 bg-muted/30 hover:bg-muted/50"
                    }`}
                  >
                    <div className="h-10 w-10 overflow-hidden rounded-lg border border-border/20 bg-muted/20 flex-shrink-0">
                      <img
                        src={s.coverImage}
                        alt={`${s.character} thumbnail`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
                        {s.character}
                      </p>
                      <p className="truncate text-sm font-medium text-foreground">
                        {s.storyTitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[55vh] overflow-y-auto">
            {story.bgImage && (
              <div className="max-h-[380px] overflow-hidden bg-muted/20">
                <img
                  src={story.bgImage}
                  alt=""
                  className="w-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            <div className="p-6 sm:p-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-foreground">
                {story.storyTitle}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {story.roomTitle}
              </p>

              <div className="mt-6 space-y-4">
                {story.body.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="text-foreground/90 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom nav bar */}
          <div className="border-t border-border/20 bg-muted/30 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => prevSlug && goTo(prevSlug)}
                disabled={!prevSlug}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition flex items-center gap-1 ${
                  prevSlug
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <button
                onClick={() => nextSlug && goTo(nextSlug)}
                disabled={!nextSlug}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition flex items-center gap-1 ${
                  nextSlug
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => nav(-1)}
              className="rounded-xl border border-border/20 bg-muted/30 px-4 py-2 text-sm text-foreground hover:bg-muted/50 transition"
            >
              Return to Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
