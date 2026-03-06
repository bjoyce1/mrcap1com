import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface CTA {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
}

interface PageHeroProps {
  kicker?: string;
  title: string;
  description?: string;
  image?: string;
  ctas?: CTA[];
  align?: "left" | "center";
}

const variantMap = {
  primary: "default" as const,
  secondary: "fluxOutline" as const,
  ghost: "fluxGhost" as const,
};

const PageHero = ({ kicker, title, description, image, ctas, align = "left" }: PageHeroProps) => {
  const isCenter = align === "center";

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className={`container mx-auto px-4 relative z-10 ${isCenter ? "text-center" : ""}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={isCenter ? "max-w-3xl mx-auto" : "max-w-3xl"}
        >
          {kicker && (
            <span className="inline-block text-xs font-medium tracking-widest uppercase text-primary mb-4">
              {kicker}
            </span>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 text-foreground">
            {title}
          </h1>

          {description && (
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              {description}
            </p>
          )}

          {ctas && ctas.length > 0 && (
            <div className={`flex flex-wrap gap-3 mt-8 ${isCenter ? "justify-center" : ""}`}>
              {ctas.map((cta, i) => {
                const isExternal = cta.href.startsWith("http");
                const variant = variantMap[cta.variant || "primary"];
                return isExternal ? (
                  <a key={i} href={cta.href} target="_blank" rel="noopener noreferrer">
                    <Button variant={variant} size="lg" className="rounded-2xl">
                      {cta.label}
                    </Button>
                  </a>
                ) : (
                  <Link key={i} to={cta.href}>
                    <Button variant={variant} size="lg" className="rounded-2xl">
                      {cta.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          )}
        </motion.div>

        {image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12"
          >
            <img
              src={image}
              alt={title}
              className="rounded-2xl w-full max-w-2xl shadow-[var(--shadow-card)]"
              loading="lazy"
            />
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PageHero;
