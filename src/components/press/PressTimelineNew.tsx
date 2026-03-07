import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface TimelineEntry {
  outlet: string;
  title: string;
  author?: string;
  date: string;
  summary: string;
  url?: string;
}

function isInternal(url: string) {
  return url.startsWith("/");
}

const PressTimelineNew = ({ entries }: { entries: TimelineEntry[] }) => (
  <section className="py-12">
    <div className="container mx-auto px-4 max-w-3xl">
      <span className="text-xs font-medium tracking-widest uppercase text-primary mb-6 block">
        Press Archive
      </span>
      <div className="relative pl-6 border-l border-border/30 space-y-8">
        {entries.map((entry, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="relative"
          >
            <div className="absolute -left-[calc(1.5rem+5px)] top-1 w-2.5 h-2.5 rounded-full bg-primary/80" />

            <div className="bg-card/30 border border-border/20 rounded-2xl p-5 hover:border-primary/20 transition-colors">
              <div className="flex items-baseline gap-3 flex-wrap mb-2">
                <span className="text-xs font-medium text-primary">{entry.outlet}</span>
                <span className="text-xs text-muted-foreground">{entry.date}</span>
                {entry.author && (
                  <span className="text-xs text-muted-foreground/60">by {entry.author}</span>
                )}
              </div>
              <h3 className="font-display font-bold text-foreground text-lg leading-snug mb-2">
                {entry.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{entry.summary}</p>
              {entry.url && (
                isInternal(entry.url) ? (
                  <Link
                    to={entry.url}
                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-3"
                  >
                    Read Article <ExternalLink className="w-3 h-3" />
                  </Link>
                ) : (
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-3"
                  >
                    Read Article <ExternalLink className="w-3 h-3" />
                  </a>
                )
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default PressTimelineNew;
