import { Link } from "react-router-dom";
import { Camera, Download, ExternalLink, FileText, Music, Newspaper, Palette } from "lucide-react";
import {
  SHORT_BIO,
  LONG_BIO,
  PHOTO_ASSETS,
  LOGO_ASSETS,
  DISCOGRAPHY_HIGHLIGHTS,
  PRESS_MENTIONS,
} from "@/content/pressKit";

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
      <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-[hsl(var(--accent-gold))]">{label}</span>
    </div>
    {children}
  </div>
);

/**
 * The press kit itself: bios, photos, logos, discography and press references.
 * Shown inline on /press and in the press kit pop-up on /who-is-mr-cap.
 * `long` adds the long bio (the page has room for it, the pop-up doesn't).
 */
const PressKitContents = ({ long = false, onNavigate }: { long?: boolean; onNavigate?: () => void }) => (
  <div className="space-y-8">
    <Section icon={FileText} label="Short Bio">
      <p className="text-sm leading-relaxed text-[hsl(var(--foreground)/0.82)]">{SHORT_BIO}</p>
    </Section>

    {long && (
      <Section icon={FileText} label="Long Bio">
        <p className="text-sm leading-relaxed text-[hsl(var(--foreground)/0.82)]">{LONG_BIO}</p>
      </Section>
    )}

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
            <img src={p.file} alt={p.label} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-x-0 bottom-0 p-2 flex items-center justify-between font-mono text-[9px] tracking-[0.2em] uppercase text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="truncate">{p.label.replace("Press Photo: ", "")}</span>
              <Download className="w-3 h-3 shrink-0 ml-2 text-[hsl(var(--accent-gold))]" />
            </div>
          </a>
        ))}
      </div>
    </Section>

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

    <Section icon={Music} label="Discography Highlights">
      <ul className="divide-y divide-[hsl(var(--foreground)/0.08)] border-y border-[hsl(var(--foreground)/0.08)]">
        {DISCOGRAPHY_HIGHLIGHTS.map((d) => (
          <li key={d.title} className="py-2.5 flex items-baseline justify-between gap-4">
            <div className="min-w-0">
              <div className="text-sm text-foreground truncate">{d.title}</div>
              <div className="text-xs text-muted-foreground">{d.role}</div>
            </div>
            <div className="font-mono text-[11px] tracking-[0.2em] text-[hsl(var(--accent-gold))] shrink-0">{d.year}</div>
          </li>
        ))}
      </ul>
    </Section>

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

    <div className="pt-2 border-t border-[hsl(var(--foreground)/0.08)] flex items-center justify-between gap-4">
      <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-muted-foreground">Media inquiries</div>
      <Link
        to="/booking"
        onClick={onNavigate}
        className="inline-flex items-center gap-1.5 text-xs text-[hsl(var(--accent-gold))] hover:text-foreground transition-colors"
      >
        Contact for Booking <ExternalLink className="w-3 h-3" />
      </Link>
    </div>
  </div>
);

export default PressKitContents;
