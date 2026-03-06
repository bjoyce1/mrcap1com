import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface CTA {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
}

const variantMap = {
  primary: "default" as const,
  secondary: "fluxOutline" as const,
  ghost: "fluxGhost" as const,
};

const CTAButtonRow = ({ items }: { items: CTA[] }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.4 }}
    className="py-12"
  >
    <div className="container mx-auto px-4 flex flex-wrap gap-3 justify-center">
      {items.map((cta, i) => {
        const isExternal = cta.href.startsWith("http");
        const variant = variantMap[cta.variant || "primary"];
        return isExternal ? (
          <a key={i} href={cta.href} target="_blank" rel="noopener noreferrer">
            <Button variant={variant} size="lg" className="rounded-2xl">{cta.label}</Button>
          </a>
        ) : (
          <Link key={i} to={cta.href}>
            <Button variant={variant} size="lg" className="rounded-2xl">{cta.label}</Button>
          </Link>
        );
      })}
    </div>
  </motion.div>
);

export default CTAButtonRow;
