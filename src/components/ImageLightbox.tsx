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
}

interface ImageLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image: LightboxImage | null;
}

export const ImageLightbox = ({ open, onOpenChange, image }: ImageLightboxProps) => {
  if (!image) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 overflow-hidden border border-[hsl(var(--foreground)/0.12)] bg-[hsl(var(--background)/0.96)] shadow-[0_30px_80px_hsl(0_0%_0%/0.7)]"
        aria-describedby="lightbox-description"
      >
        <DialogTitle className="sr-only">{image.alt} — enlarged view</DialogTitle>
        <DialogDescription id="lightbox-description" className="sr-only">
          Press Escape to close the lightbox. Use Tab to move focus to the close button.
        </DialogDescription>

        <div className="relative flex flex-col items-center">
          <img
            src={image.src}
            alt={image.alt}
            className="max-w-[90vw] max-h-[80vh] w-auto h-auto object-contain"
            loading="eager"
          />
          {(image.caption || image.credit) && (
            <div className="w-full px-6 py-4 bg-[hsl(var(--card)/0.6)] border-t border-[hsl(var(--foreground)/0.1)]">
              <p className="text-center font-mono text-xs tracking-[0.2em] uppercase text-[hsl(var(--accent-gold))]">
                {image.caption}
              </p>
              {image.credit && (
                <p className="mt-1 text-center text-xs text-muted-foreground">
                  {image.credit}
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
