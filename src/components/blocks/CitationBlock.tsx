import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface CTA {
  label: string;
  href: string;
}

interface CitationBlockProps {
  canonicalUrl: string;
  lastUpdated?: string;
  description: string;
  links?: CTA[];
  variant?: "card" | "compact";
}

const CitationBlock = ({
  canonicalUrl,
  description,
  lastUpdated,
  links,
  variant = "card",
}: CitationBlockProps) => {
  if (variant === "compact") {
    return (
      <section className="py-8 border-t border-border/30 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">{description}</p>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="py-12"
    >
      <div className="container mx-auto px-4">
        <div className="bg-card/40 border border-border/30 rounded-2xl p-6 md:p-8 max-w-3xl mx-auto">
          <span className="text-xs font-medium tracking-widest uppercase text-primary mb-3 block">
            Citation & Attribution
          </span>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">{description}</p>
          <div className="flex items-center gap-2 text-sm mb-4">
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            <a
              href={canonicalUrl}
              className="text-primary hover:underline break-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              {canonicalUrl}
            </a>
          </div>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground/60 mb-4">Last updated: {lastUpdated}</p>
          )}
          {links && links.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {links.map((link, i) => {
                const isExternal = link.href.startsWith("http");
                return isExternal ? (
                  <a
                    key={i}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 rounded-full bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={i}
                    to={link.href}
                    className="text-xs px-3 py-1.5 rounded-full bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default CitationBlock;
