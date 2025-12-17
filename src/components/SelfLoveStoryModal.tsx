import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { selfLove2024 } from "@/data/selfLove2024";
import { X } from "lucide-react";

export default function SelfLoveStoryModal() {
  const nav = useNavigate();
  const { slug } = useParams();

  const story = useMemo(() => selfLove2024.find((s) => s.slug === slug), [slug]);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") nav(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nav]);

  if (!story) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <button
        aria-label="Close"
        onClick={() => nav(-1)}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      />

      {/* Modal shell */}
      <div className="relative mx-auto flex h-full max-w-4xl items-center px-4 py-8">
        <div className="relative w-full overflow-hidden rounded-2xl border border-border/20 bg-card shadow-2xl">
          {/* Top bar */}
          <div className="flex items-center justify-between gap-3 border-b border-border/20 bg-muted/30 px-4 py-3">
            <div className="min-w-0">
              <p className="text-xs tracking-[0.22em] uppercase text-muted-foreground">
                {story.character}
              </p>
              <p className="truncate text-sm font-medium text-foreground">
                {story.storyTitle}
              </p>
            </div>

            <button
              onClick={() => nav(-1)}
              className="rounded-xl border border-border/20 bg-muted/30 px-3 py-2 text-sm text-foreground hover:bg-muted/50 transition flex items-center gap-2"
            >
              Close <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[80vh] overflow-y-auto">
            {story.bgImage && (
              <div className="max-h-[420px] overflow-hidden bg-muted/20">
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

          {/* Bottom action bar */}
          <div className="border-t border-border/20 bg-muted/30 px-4 py-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Press Esc to close
            </span>
            <button
              onClick={() => nav(-1)}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
            >
              Return to Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
