import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

/** Content-only entrance. Never obscure or transform the persistent header. */
const PageTransition = ({ children }: PageTransitionProps) => {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 1, y: reduced ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
