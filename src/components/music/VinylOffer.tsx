import { ArrowRight, Disc3 } from "lucide-react";
import { trackEvent } from "@/components/GoogleAnalytics";
import { cn } from "@/lib/utils";

/** Albums that also come on vinyl. This used to be the separate /vinyl page. */
const VINYL: Record<string, { url: string; price: string; details: string }> = {
  "the-art-of-ism": {
    url: "https://elasticstage.com/mrcap/releases/the-art-of-ism-album",
    price: "31.90",
    details: "12-inch record, 11 tracks on two sides. Pressed to order and shipped worldwide by Elastic Stage.",
  },
};

export function VinylOffer({ albumSlug, albumTitle, className }: { albumSlug: string; albumTitle: string; className?: string }) {
  const vinyl = VINYL[albumSlug];
  if (!vinyl) return null;
  return (
    <aside aria-labelledby="vinyl-title" className={cn("rounded-2xl border border-border/60 bg-card/60 p-6 md:p-8", className)}>
      <span className="catalog-stamp mb-3 block">On vinyl</span>
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <Disc3 className="mt-1 h-8 w-8 shrink-0 text-primary" aria-hidden />
          <div>
            <h3 id="vinyl-title" className="font-display text-2xl leading-none text-foreground md:text-3xl">
              Own the record
            </h3>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">{vinyl.details}</p>
            <p className="mt-3 text-sm text-foreground">
              <span className="font-display text-xl text-primary">US${vinyl.price}</span> + shipping
            </p>
          </div>
        </div>
        <a
          href={vinyl.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("begin_checkout", { item_name: `${albumTitle} Vinyl`, value: Number(vinyl.price), currency: "USD" })}
          className="candy-sheen inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full px-6 py-3 font-medium text-primary-foreground shadow-lg md:self-auto"
        >
          Order the vinyl <ArrowRight className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </aside>
  );
}
