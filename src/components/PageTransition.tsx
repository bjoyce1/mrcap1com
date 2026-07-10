import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Cinematic route transition — content rises in while a candy-gradient
 * curtain wipes up off the screen on entry; exits with a fast fade.
 *
 * IMPORTANT: this must return exactly ONE element. AnimatePresence tracks
 * a single child per route; sibling fragments here cause React
 * insertBefore/NotFoundError crashes during navigation.
 */
const PageTransition = ({ children }: PageTransitionProps) => {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}

      {/* Curtain reveal — plays on mount only, then sits inert at scaleY 0 */}
      <motion.div
        aria-hidden="true"
        className="fixed inset-0 z-[90] pointer-events-none"
        style={{
          background:
            "linear-gradient(120deg, hsl(264 61% 20%) 0%, hsl(265 37% 9%) 45%, hsl(333 64% 22%) 100%)",
          transformOrigin: "top",
        }}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
      />
      {/* Gold hairline chasing the curtain edge */}
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[91] h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, hsl(39 67% 55% / 0.9), transparent)",
          boxShadow: "0 0 18px hsl(39 67% 55% / 0.5)",
        }}
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: "100vh", opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
      />
    </motion.div>
  );
};

export default PageTransition;
