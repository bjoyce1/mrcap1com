import { motion } from "framer-motion";
import { Disc } from "lucide-react";

interface CatalogItem {
  title: string;
  year: string;
  tag: string;
  summary: string;
}

const CatalogReleaseList = ({ releases }: { releases: CatalogItem[] }) => (
  <section id="catalog" className="py-12">
    <div className="container mx-auto px-4 max-w-3xl">
      <span className="text-xs font-medium tracking-widest uppercase text-primary mb-6 block">
        Full Catalog
      </span>
      <div className="space-y-4">
        {releases.map((r, i) => (
          <motion.div
            key={r.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="flex gap-4 items-start bg-card/30 border border-border/20 rounded-2xl p-5 hover:border-primary/20 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <Disc className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-3 flex-wrap">
                <h3 className="font-display font-bold text-foreground">{r.title}</h3>
                <span className="text-xs text-primary font-medium">{r.year}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground">{r.tag}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1.5">{r.summary}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CatalogReleaseList;
