import { ExternalLink } from "lucide-react";

type PressItem = {
  outlet: string;
  title: string;
  url?: string;
  dateISO: string;
  author?: string;
  summary: string;
  prominent?: boolean;
};

const pressItems: PressItem[] = [
  {
    outlet: "Houston Chronicle",
    title: "Mr. CAP Returns to His Musical Roots",
    url: "https://www.houstonchronicle.com/entertainment/music/article/mr-cap-returns-to-his-musical-roots-5383713.php",
    dateISO: "2014-04-08",
    author: "Andrew Dansby",
    summary:
      "A Houston Chronicle profile on Mr. CAP's return to Houston, musical lineage, and SPC connection—framed as long-term artistry and independence.",
    prominent: true,
  },
  {
    outlet: "Houston Press",
    title: "Point Blank at Numbers, 11/22/2014",
    url: "https://www.houstonpress.com/music/point-blank-at-numbers-11-22-2014-6760363/",
    dateISO: "2014-11-22",
    author: "Nathan Smith",
    summary:
      "Houston Press coverage documenting SPC ecosystem activity through Point Blank's live show at one of Houston's iconic venues (Numbers).",
    prominent: true,
  },
  {
    outlet: "Houston Press",
    title: "Somebody Tell Wiz Khalifa There's Only One Mr. CAP",
    url: "https://www.houstonpress.com/music/somebody-tell-wiz-khalifa-theres-only-one-mr-cap-7373143/",
    dateISO: "2015-04-20",
    author: "Nathan Smith",
    summary:
      "A Houston Press piece clarifying identity confusion online while highlighting Mr. CAP's longevity and recognition in Houston hip-hop culture.",
    prominent: true,
  },
  {
    outlet: "Houston Press",
    title: "K-Rino, Point Blank & the SPC Might Still Be Rapping at Warehouse Live Right Now",
    url: "https://www.houstonpress.com/music/k-rino-point-blank-and-the-spc-might-still-be-rapping-at-warehouse-live-right-now-7756589/",
    dateISO: "2016-10-17",
    author: "Nathan Smith",
    summary:
      "A Houston Press snapshot of SPC's continuing presence on Houston stages—evidence of sustained relevance and live-performance credibility.",
    prominent: true,
  },
];

function formatDate(dateISO: string) {
  const d = new Date(dateISO + "T00:00:00");
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function yearOf(dateISO: string) {
  return dateISO.slice(0, 4);
}

export default function PressTimeline() {
  const sorted = [...pressItems].sort((a, b) => a.dateISO.localeCompare(b.dateISO));
  const grouped = sorted.reduce<Record<string, PressItem[]>>((acc, item) => {
    const y = yearOf(item.dateISO);
    acc[y] = acc[y] || [];
    acc[y].push(item);
    return acc;
  }, {});

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <header className="mb-10">
        <h2 className="text-3xl font-display font-bold tracking-tight">Press & Notable Mentions</h2>
        <p className="mt-3 text-muted-foreground">
          A curated archive of third-party coverage and documentation tied to Mr. CAP and the SPC legacy.
        </p>
      </header>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-3 top-0 h-full w-px bg-border" />

        <div className="space-y-12">
          {Object.keys(grouped)
            .sort()
            .map((y) => (
              <div key={y}>
                <h3 className="mb-5 pl-10 text-lg font-semibold text-foreground">{y}</h3>

                <div className="space-y-5">
                  {grouped[y].map((item, idx) => (
                    <div key={`${item.title}-${idx}`} className="relative pl-10">
                      {/* Dot */}
                      <div className="absolute left-[9px] top-4 h-2.5 w-2.5 rounded-full bg-primary" />

                      <div
                        className={`rounded-2xl border border-border bg-card/50 p-6 transition-colors hover:border-primary/50 ${
                          item.prominent ? "shadow-lg" : ""
                        }`}
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="text-xs uppercase tracking-wide text-muted-foreground">
                              {item.outlet}
                              {item.author ? ` • ${item.author}` : ""}
                            </div>

                            {item.url ? (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-1 block text-lg font-semibold text-foreground hover:text-primary transition-colors"
                                title={item.title}
                              >
                                {item.title}
                              </a>
                            ) : (
                              <div className="mt-1 text-lg font-semibold text-foreground">
                                {item.title}
                              </div>
                            )}
                          </div>

                          <div className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDate(item.dateISO)}
                          </div>
                        </div>

                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {item.summary}
                        </p>

                        {item.url && (
                          <div className="mt-4">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
                            >
                              Read
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
