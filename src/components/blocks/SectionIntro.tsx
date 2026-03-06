import { motion } from "framer-motion";

interface SectionIntroProps {
  title?: string;
  body: string;
}

const SectionIntro = ({ title, body }: SectionIntroProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5 }}
    className="py-12 md:py-16"
  >
    <div className="container mx-auto px-4 max-w-3xl">
      {title && (
        <h2 className="text-2xl font-display font-bold text-foreground mb-4">{title}</h2>
      )}
      <p className="text-muted-foreground text-lg leading-relaxed">{body}</p>
    </div>
  </motion.div>
);

export default SectionIntro;
