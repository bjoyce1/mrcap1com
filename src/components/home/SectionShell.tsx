import { ReactNode } from "react";
import { motion } from "framer-motion";

interface SectionShellProps {
  children: ReactNode;
  index?: string;
  eyebrow?: string;
  title?: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
  containerClassName?: string;
  id?: string;
  /** Render no header even if eyebrow/title are passed (for fully custom layouts) */
  hideHeader?: boolean;
}

const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const SectionShell = ({
  children,
  index,
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
  containerClassName = "",
  id,
  hideHeader = false,
}: SectionShellProps) => {
  const showHeader = !hideHeader && (eyebrow || title || description);
  const alignClass = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <section
      id={id}
      className={`relative py-20 md:py-28 lg:py-32 ${className}`}
    >
      {/* Section index badge */}
      {index && (
        <motion.span
          initial={{ opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden lg:block absolute top-10 right-10 font-mono text-[10px] tracking-[0.4em] uppercase text-primary/40 select-none pointer-events-none"
          aria-hidden="true"
        >
          — {index}
        </motion.span>
      )}

      <div className={`max-w-6xl mx-auto px-6 relative z-10 ${containerClassName}`}>
        {showHeader && (
          <motion.header
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className={`flex flex-col gap-3 mb-12 md:mb-16 ${alignClass}`}
          >
            {eyebrow && (
              <div className={`flex items-center gap-3 ${align === "center" ? "justify-center" : ""}`}>
                <span className="w-10 h-[1px] bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
                <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-primary">
                  {eyebrow}
                </span>
                <span className="w-10 h-[1px] bg-gradient-to-r from-primary via-primary/0 to-primary/0 hidden md:block" />
              </div>
            )}
            {title && (
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance max-w-3xl">
                {title}
              </h2>
            )}
            {description && (
              <p className={`text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed ${align === "center" ? "mx-auto" : ""}`}>
                {description}
              </p>
            )}
          </motion.header>
        )}
        {children}
      </div>
    </section>
  );
};

export default SectionShell;
