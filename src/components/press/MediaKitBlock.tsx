import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, Link2, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface CTA {
  label: string;
  href: string;
}

const MediaKitBlock = ({ body, ctas }: { body: string; ctas: CTA[] }) => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.4 }}
    className="py-12"
  >
    <div className="container mx-auto px-4 max-w-3xl">
      <div className="bg-card/40 border border-border/30 rounded-2xl p-6 md:p-8">
        <span className="text-xs font-medium tracking-widest uppercase text-primary mb-3 block">
          Media Kit
        </span>
        <p className="text-muted-foreground mb-5">{body}</p>
        <div className="flex flex-wrap gap-3">
          {ctas.map((cta, i) => {
            const isExternal = cta.href.startsWith("http");
            return isExternal ? (
              <a key={i} href={cta.href} target="_blank" rel="noopener noreferrer">
                <Button variant="fluxOutline" size="sm" className="rounded-2xl gap-2">
                  <Download className="w-3.5 h-3.5" />
                  {cta.label}
                </Button>
              </a>
            ) : (
              <Link key={i} to={cta.href}>
                <Button variant="fluxOutline" size="sm" className="rounded-2xl gap-2">
                  {cta.label.includes("Book") ? <Calendar className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
                  {cta.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  </motion.section>
);

export default MediaKitBlock;
