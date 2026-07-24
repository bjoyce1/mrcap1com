import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileText, Camera, Palette, Music, Newspaper, ExternalLink, ArrowUpRight } from "lucide-react";
import {
  SHORT_BIO,
  PHOTO_ASSETS,
  LOGO_ASSETS,
  DISCOGRAPHY_HIGHLIGHTS,
  PRESS_MENTIONS,
  openPressKitPDF,
} from "@/content/pressKit";

interface PressKitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Section = ({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-3.5 h-3.5 text-[hsl(var(--accent-gold))]" />
      <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[hsl(var(--accent-gold))]">
        {label}
      </span>
    </div>
    {children}
  </div>
);

const PressKitModal = ({ open, onOpenChange }: PressKitModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background border-[hsl(var(--foreground)/0.1)] p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-[hsl(var(--foreground)/0.08)] px-6 pt-6 pb-5">
          <DialogHeader className="space-y-2 text-left">
            <div className="font-mono text-[10px] tracking-[0.32em] uppercase text-[hsl(var(--accent-gold))]">
              Official Press Kit · File No. 001
            </div>
            <DialogTitle className="font-display text-3xl md:text-4xl leading-[0.95] tracking-tight">
              Mr. CAP — <span className="text-[hsl(var(--accent-gold))]">Press Kit</span>
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground max-w-xl">
              Preview what's included, then download the full kit or grab individual assets below.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button variant="flux" className="rounded-none gap-2" onClick={openPressKitPDF}>
              <Download className="w-4 h-4" />
              Download Press Kit (PDF)
            </Button>
            <Button variant="fluxOutline" className="rounded-none gap-2" asChild>
              <Link to="/press-kit" onClick={() => onOpenChange(false)}>
                Full Press Kit Page <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Body — preview of what's inside */}
        <div className="px-6 py-6 space-y-8">
          {/* Short bio */}
          <Section icon={FileText} label="Short Bio · 400 chars">
            <p className="text-sm leading-relaxed text-[hsl(var(--foreground)/0.82)]">{SHORT_BIO}</p>
          </Section>

          {/* Press photos */}
          <Section icon={Camera} label={`Press Photos · ${PHOTO_ASSETS.length} hi-res`}>
            <div className="grid grid-cols-3 gap-3">
              {PHOTO_ASSETS.map((p) => (
                <a
                  key={p.file}
                  href={p.file}
                  download
                  className="group relative block aspect-[4/5] overflow-hidden border border-[hsl(var(--foreground)/0.1)]"
                  aria-label={`Download ${p.label}`}
                >
                  <img
                    src={p.file}
                    alt={p.label}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-x-0 bottom-0 p-2 flex items-center justify-between font-mono text-[9px] tracking-[0.2em] uppercase text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="truncate">{p.label.replace("Press Photo — ", "")}</span>
                    <Download className="w-3 h-3 shrink-0 ml-2 text-[hsl(var(--accent-gold))]" />
                  </div>
                </a>
              ))}
            </div>
          </Section>

          {/* Logos */}
          <Section icon={Palette} label={`Logos & Marks · ${LOGO_ASSETS.length} files`}>
            <div className="grid grid-cols-2 gap-3">
              {LOGO_ASSETS.map((l) => (
                <a
                  key={l.file}
                  href={l.file}
                  download
                  className="group flex items-center gap-3 border border-[hsl(var(--foreground)/0.1)] p-3 hover:border-[hsl(var(--accent-gold))/0.6] transition-colors"
                >
                  <div className="w-12 h-12 shrink-0 bg-[hsl(var(--foreground)/0.04)] flex items-center justify-center overflow-hidden">
                    <img src={l.file} alt={l.label} loading="lazy" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-foreground truncate">{l.label}</div>
                    <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground group-hover:text-[hsl(var(--accent-gold))] inline-flex items-center gap-1 mt-0.5">
                      Download <Download className="w-2.5 h-2.5" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </Section>

          {/* Discography */}
          <Section icon={Music} label="Discography Highlights">
            <ul className="divide-y divide-[hsl(var(--foreground)/0.08)] border-y border-[hsl(var(--foreground)/0.08)]">
              {DISCOGRAPHY_HIGHLIGHTS.map((d) => (
                <li key={d.title} className="py-2.5 flex items-baseline justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm text-foreground truncate">{d.title}</div>
                    <div className="text-xs text-muted-foreground">{d.role}</div>
                  </div>
                  <div className="font-mono text-[11px] tracking-[0.2em] text-[hsl(var(--accent-gold))] shrink-0">
                    {d.year}
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          {/* Press */}
          <Section icon={Newspaper} label="Press References">
            <ul className="space-y-2">
              {PRESS_MENTIONS.map((m) => (
                <li key={m.title} className="flex items-baseline justify-between gap-4 text-sm">
                  <div className="min-w-0">
                    <div className="text-foreground truncate">{m.title}</div>
                    <div className="text-xs text-muted-foreground">{m.outlet}</div>
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground shrink-0">{m.date}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Contact */}
          <div className="pt-2 border-t border-[hsl(var(--foreground)/0.08)] flex items-center justify-between gap-4">
            <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-muted-foreground">
              Media inquiries
            </div>
            <Link
              to="/booking"
              onClick={() => onOpenChange(false)}
              className="inline-flex items-center gap-1.5 text-xs text-[hsl(var(--accent-gold))] hover:text-foreground transition-colors"
            >
              Contact for Booking <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PressKitModal;
