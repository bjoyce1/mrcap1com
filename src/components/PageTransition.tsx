import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Cinematic route transition — content rises in while a candy-gradient
 * curtain wipes off the screen; on exit the curtain sweeps back over.
 * Falls back to a simple fade when reduced motion is preferred.
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
    <>
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.995 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.995 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>

      {/* Curtain wipe — covers on exit, reveals on enter */}
      <motion.div
        aria-hidden="true"
        className="fixed inset-0 z-[90] pointer-events-none origin-top"
        style={{
          background:
            "linear-gradient(120deg, hsl(264 61% 20%) 0%, hsl(265 37% 9%) 45%, hsl(333 64% 22%) 100%)",
        }}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0, transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] } }}
        exit={{
          scaleY: 1,
          transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] },
          transformOrigin: "bottom",
        }}
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
        animate={{
          y: "100vh",
          opacity: 0,
          transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] },
        }}
        exit={{ opacity: 0 }}
      />
    </>
  );
};

export default PageTransition;
