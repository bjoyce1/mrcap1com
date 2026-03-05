import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  yOffset?: number;
  duration?: number;
  delay?: number;
}

export default function ScrollReveal({
  children,
  width = "fit-content",
  yOffset = 50,
  duration = 0.5,
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  return (
    <div ref={ref} style={{ position: "relative", width }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: yOffset },
          visible: { opacity: 1, y: 0 },
        }}
        initial="visible"
        animate={mainControls}
        transition={{ duration, delay, ease: "easeOut" }}
        style={!isInView ? { opacity: 0, transform: `translateY(${yOffset}px)` } : undefined}
      >
        {children}
      </motion.div>
    </div>
  );
}
