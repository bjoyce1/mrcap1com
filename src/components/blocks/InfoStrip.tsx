import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CTA {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
}

interface InfoStripProps {
  label: string;
  body: string;
  ctas?: CTA[];
}

const InfoStrip = ({ label, body, ctas }: InfoStripProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.4 }}
    className="py-10"
  >
    <div className="container mx-auto px-4">
      <div className="bg-card/60 border border-border/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
        <div className="flex-1">
          <span className="text-xs font-medium tracking-widest uppercase text-primary mb-1 block">{label}</span>
          <p className="text-muted-foreground">{body}</p>
        </div>
        {ctas && ctas.length > 0 && (
          <div className="flex flex-wrap gap-2 shrink-0">
            {ctas.map((cta, i) => {
              const isExternal = cta.href.startsWith("http");
              return isExternal ? (
                <a key={i} href={cta.href} target="_blank" rel="noopener noreferrer">
                  <Button variant="fluxOutline" size="sm" className="rounded-2xl">{cta.label}</Button>
                </a>
              ) : (
                <Link key={i} to={cta.href}>
                  <Button variant="fluxOutline" size="sm" className="rounded-2xl">{cta.label}</Button>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

export default InfoStrip;
