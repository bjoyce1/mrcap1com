import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  eyebrow?: string;
  align?: "left" | "center";
}

const SectionHeader = ({ title, eyebrow, align = "left" }: SectionHeaderProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className={`mb-8 ${align === "center" ? "text-center" : ""}`}
  >
    {eyebrow && (
      <span className="catalog-stamp mb-3 block">
        {eyebrow}
      </span>
    )}
    <h2 className="text-3xl md:text-4xl font-display text-foreground">{title}</h2>
    <div className={`archive-rule mt-4 ${align === "center" ? "mx-auto w-24" : "w-24"}`} />
  </motion.div>
);

export default SectionHeader;
