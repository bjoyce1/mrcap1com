import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_OUT, useMotionOk } from "./motionUtils";

/**
 * The Emmy Award badge supplied by Mr. CAP's team, traced to vector
 * (public/images/emmy-award-badge.svg). It lands with a stamp-down entrance when it
 * scrolls into view; with motion off it is simply there.
 */
const EmmyBadge = ({ className }: { className?: string }) => {
  const ok = useMotionOk();

  const badge = (
    <img
      src="/images/emmy-award-badge.svg"
      alt="Emmy Award"
      width={245}
      height={245}
      loading="lazy"
      decoding="async"
      className={cn("block h-auto w-full drop-shadow-[0_18px_28px_hsl(0_0%_0%/0.55)]", className)}
    />
  );

  if (!ok) return badge;

  return (
    <motion.div
      initial={{ scale: 1.55, rotate: -26, opacity: 0 }}
      whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ type: "spring", stiffness: 150, damping: 13, mass: 0.9 }}
      className="relative"
    >
      {/* a single ring of light as the badge lands */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full border border-[hsl(var(--accent-gold))]"
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1.7, opacity: [0, 0.7, 0] }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 1.3, delay: 0.25, ease: EASE_OUT }}
      />
      {badge}
    </motion.div>
  );
};

export default EmmyBadge;
