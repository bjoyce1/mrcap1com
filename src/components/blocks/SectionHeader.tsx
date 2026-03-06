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
    transition={{ duration: 0.4 }}
    className={`mb-8 ${align === "center" ? "text-center" : ""}`}
  >
    {eyebrow && (
      <span className="text-xs font-medium tracking-widest uppercase text-primary mb-2 block">
        {eyebrow}
      </span>
    )}
    <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">{title}</h2>
  </motion.div>
);

export default SectionHeader;
