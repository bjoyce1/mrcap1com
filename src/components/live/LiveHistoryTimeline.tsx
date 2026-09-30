import { useState } from "react";
import { CalendarDays, MapPin, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageLightbox from "@/components/ImageLightbox";
import { liveHistory, type LiveHistoryEvent } from "@/content/liveHistory";

type Props = { events?: LiveHistoryEvent[] };

export default function LiveHistoryTimeline({ events = liveHistory }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dated = events.filter((event) => event.date).sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  const unconfirmed = events.filter((event) => !event.date);
  const ordered = [...dated, ...unconfirmed];
  const images = ordered.map((event) => ({
    src: event.flyer,
    alt: `${event.title} flyer — ${event.dateLabel}, ${event.city}, ${event.state}`,
    caption: `${event.title} · ${event.dateLabel} · ${event.city}, ${event.state}`,
    credit: "Flyer from the Point Blank / Wreckless Entertainment event archive",
  }));

  const entry = (event: LiveHistoryEvent, index: number) => (
    <li key={`${event.title}-${event.dateLabel}-${index}`} className="relative pl-8 md:pl-0 md:grid md:grid-cols-[minmax(0,1fr)_5rem_minmax(0,1fr)] md:items-start md:gap-0 mb-14 last:mb-0">
      <span aria-hidden="true" className="absolute left-[3px] md:left-1/2 top-5 -translate-x-1/2 w-3 h-3 rounded-full bg-cap-gold ring-4 ring-background shadow-md z-10" />
      <article className={`min-w-0 border border-cap-gold/25 bg-card/50 hover:border-cap-gold/60 transition-colors duration-300 rounded-md overflow-hidden ${index % 2 === 0 ? "md:col-start-1" : "md:col-start-3"}`}>
        <Button
          type="button" variant="ghost"
          data-live-flyer={index}
          onClick={() => setActiveIndex(index)}
          aria-label={`Enlarge ${event.title} flyer, ${event.dateLabel}`}
          className="group relative block h-auto w-full p-0 rounded-none overflow-hidden bg-background/70 hover:bg-background/70 focus-visible:ring-2 focus-visible:ring-cap-gold"
        >
          <img src={event.flyer} alt={images[index]?.alt ?? event.title} loading="lazy" decoding="async" className="block w-full h-auto max-h-[640px] object-contain transition-transform duration-300 motion-safe:group-hover:scale-[1.015]" />
          <span aria-hidden="true" className="absolute bottom-3 right-3 p-2 bg-background/80 border border-cap-gold/40 text-cap-gold rounded-sm"><ZoomIn className="w-4 h-4" /></span>
        </Button>
        <div className="p-5 md:p-6 border-t border-cap-gold/20">
          <p className="font-mono text-xs text-cap-gold flex items-center gap-2"><CalendarDays className="w-4 h-4" aria-hidden="true" />{event.dateLabel}</p>
          <h3 className="font-display text-xl md:text-2xl mt-3 text-foreground leading-snug">{event.title}</h3>
          <p className="flex items-start gap-2 mt-3 text-sm text-foreground/80"><MapPin className="w-4 h-4 shrink-0 mt-0.5 text-cap-gold" aria-hidden="true" />{event.venue ? `${event.venue} · ` : ""}{event.city}, {event.state}</p>
          <p className="text-sm leading-relaxed text-muted-foreground mt-3">{event.context}</p>
          <a href={event.source} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 font-mono text-xs text-cap-gold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-cap-gold">View archive record ↗</a>
        </div>
      </article>
    </li>
  );

  return (
    <section aria-labelledby="live-history-heading" className="border-t border-border/50 py-20 md:py-28 overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        <p className="font-mono text-xs uppercase text-cap-gold mb-3">On the Road / The Archive</p>
        <h2 id="live-history-heading" className="font-display text-3xl md:text-5xl text-foreground mb-12 md:mb-20">Live Performance History</h2>
        <div className="relative">
          <div aria-hidden="true" className="absolute top-0 bottom-0 left-[3px] md:left-1/2 w-px bg-gradient-to-b from-cap-gold via-cap-gold/40 to-transparent" />
          <ol className="relative">{dated.map((event, index) => entry(event, index))}</ol>
          {unconfirmed.length > 0 && (
            <div className="relative">
              <h3 className="relative z-10 mt-16 mb-12 ml-8 md:ml-0 md:text-center font-mono text-sm uppercase text-cap-gold">Date unconfirmed</h3>
              <ol start={dated.length + 1}>{unconfirmed.map((event, index) => entry(event, dated.length + index))}</ol>
            </div>
          )}
        </div>
      </div>
      <ImageLightbox
        open={activeIndex !== null}
        onOpenChange={(open) => { if (!open) setActiveIndex(null); }}
        images={images}
        index={activeIndex ?? 0}
        onIndexChange={setActiveIndex}
        onRequestRestoreFocus={(index) => document.querySelector<HTMLElement>(`[data-live-flyer="${index}"]`)?.focus()}
      />
    </section>
  );
}