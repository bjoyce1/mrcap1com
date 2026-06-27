import { Play } from "lucide-react";
import type { ArchiveSingle } from "@/content/discography";
import { LIMITLESS_NFT_URL } from "@/content/discography";

interface Props {
  year: string;
  tracks: ArchiveSingle[];
}

export default function ArchiveSinglesYearCard({ year, tracks }: Props) {
  return (
    <div className="disco-card relative w-[300px] md:w-[360px] shrink-0 snap-start rounded-xl border border-white/5 bg-background/40 backdrop-blur-sm p-6 shadow-[0_4px_24px_hsl(0_0%_0%/0.3)]">
      <div className="flex items-baseline justify-between mb-4">
        <span className="font-display text-4xl md:text-5xl font-bold text-primary/80 tabular-nums">
          {year}
        </span>
        <span className="font-mono text-[0.6rem] tracking-[0.2em] text-muted-foreground uppercase">
          {tracks.length} {tracks.length === 1 ? "Drop" : "Drops"}
        </span>
      </div>
      <div className="archive-rule mb-4 w-16" />

      <ul className="space-y-3 max-h-[280px] overflow-y-auto pr-1 no-scrollbar">
        {tracks.map((track, i) => (
          <li key={`${year}-${i}`} className="group flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
              <Play className="w-3 h-3 text-primary" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-medium text-foreground text-sm leading-tight">{track.title}</h4>
                {track.nft && (
                  <a
                    href={LIMITLESS_NFT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[9px] uppercase tracking-[0.2em] text-primary border border-primary/40 px-1.5 py-0.5 rounded-full hover:bg-primary/10 transition-colors"
                  >
                    NFT
                  </a>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{track.artist}</p>
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-muted-foreground/60 mt-0.5">
                {track.label}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
