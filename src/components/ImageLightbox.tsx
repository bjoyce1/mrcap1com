import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  srcSet?: string;
  sizes?: string;
}

interface ImageLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Single-image mode (kept for backward compatibility) */
  image?: LightboxImage | null;
  /** Gallery mode: pass the full list and the active index */
  images?: LightboxImage[];
  index?: number;
  onIndexChange?: (nextIndex: number) => void;
  /**
   * Called when the dialog is closing so the caller can restore focus
   * to the trigger corresponding to the currently viewed image
   * (Radix would otherwise restore focus to the originally-clicked
   * trigger, which may not match after Prev/Next navigation).
   */
  onRequestRestoreFocus?: (index: number) => void;
}

export const ImageLightbox = ({
  open,
  onOpenChange,
  image,
  images,
  index = 0,
  onIndexChange,
  onRequestRestoreFocus,
}: ImageLightboxProps) => {
  const gallery = images && images.length > 0;
  const active: LightboxImage | null = gallery
    ? images![Math.max(0, Math.min(index, images!.length - 1))]
    : image ?? null;

  const canNavigate = gallery && images!.length > 1 && !!onIndexChange;

  const goPrev = () => {
    if (!canNavigate) return;
    onIndexChange!((index - 1 + images!.length) % images!.length);
  };
  const goNext = () => {
    if (!canNavigate) return;
    onIndexChange!((index + 1) % images!.length);
  };

  useEffect(() => {
    if (!open || !canNavigate) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, canNavigate, index, images?.length]);

  if (!active) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 overflow-hidden border border-[hsl(var(--foreground)/0.12)] bg-[hsl(var(--background)/0.96)] shadow-[0_30px_80px_hsl(0_0%_0%/0.7)]"
        aria-describedby="lightbox-description"
      >
        <DialogTitle className="sr-only">{active.alt} — enlarged view</DialogTitle>
        <DialogDescription id="lightbox-description" className="sr-only">
          {canNavigate
            ? "Use the left and right arrow keys, or the on-screen buttons, to browse images. Press Escape to close."
            : "Press Escape to close the lightbox. Use Tab to move focus to the close button."}
        </DialogDescription>

        <div className="relative flex flex-col items-center">
          <img
            key={active.src}
            src={active.src}
            srcSet={active.srcSet}
            sizes={active.sizes}
            alt={active.alt}
            className="max-w-[90vw] max-h-[80vh] w-auto h-auto object-contain"
            loading="eager"
          />

          {canNavigate && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous image"
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 h-11 w-11 md:h-12 md:w-12 flex items-center justify-center bg-[hsl(var(--background)/0.7)] hover:bg-[hsl(var(--background)/0.9)] text-[hsl(var(--accent-gold))] border border-[hsl(var(--accent-gold))]/30 backdrop-blur-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-gold))]"
              >
                <ChevronLeft className="w-6 h-6" aria-hidden />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next image"
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 h-11 w-11 md:h-12 md:w-12 flex items-center justify-center bg-[hsl(var(--background)/0.7)] hover:bg-[hsl(var(--background)/0.9)] text-[hsl(var(--accent-gold))] border border-[hsl(var(--accent-gold))]/30 backdrop-blur-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-gold))]"
              >
                <ChevronRight className="w-6 h-6" aria-hidden />
              </button>
            </>
          )}

          {(active.caption || active.credit || canNavigate) && (
            <div className="w-full px-6 py-4 bg-[hsl(var(--card)/0.6)] border-t border-[hsl(var(--foreground)/0.1)]">
              {active.caption && (
                <p className="text-center font-mono text-xs tracking-[0.2em] uppercase text-[hsl(var(--accent-gold))]">
                  {active.caption}
                </p>
              )}
              {active.credit && (
                <p className="mt-1 text-center text-xs text-muted-foreground">
                  {active.credit}
                </p>
              )}
              {canNavigate && (
                <p className="mt-2 text-center font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                  {index + 1} / {images!.length}
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageLightbox;
