import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import mascotImage from "@/assets/mr-cap-mascot.png";

const TIPS = [
  "Check out the latest drops 🎵",
  "Scroll down to explore more!",
  "Hit up the merch store 🔥",
  "Book a show — let's connect!",
  "Stream the new album now 🎧",
];

const FloatingMascot = () => {
  const [showBubble, setShowBubble] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxDistance = 400;

    const dx = (e.clientX - centerX) / maxDistance;
    const dy = (e.clientY - centerY) / maxDistance;

    setTilt({
      x: Math.max(-1, Math.min(1, dx)) * 15,
      y: Math.max(-1, Math.min(1, -dy)) * 10,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const handleClick = () => {
    setShowBubble((prev) => !prev);
    setTipIndex((prev) => (prev + 1) % TIPS.length);
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-20 right-4 z-50 md:bottom-8 md:right-8 flex flex-col items-end gap-2"
    >
      {/* Speech Bubble */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="max-w-[200px] rounded-xl bg-card/90 backdrop-blur-xl border border-border/40 px-4 py-3 text-sm text-foreground shadow-xl"
          >
            <p>{TIPS[tipIndex]}</p>
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-card/90 border-b border-r border-border/40 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot */}
      <motion.button
        onClick={handleClick}
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        }}
        className="relative cursor-pointer outline-none group"
        aria-label="Mr. CAP mascot guide"
      >
        {/* Glow shadow */}
        <div className="absolute -inset-2 rounded-full bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Ground shadow */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-3 rounded-full bg-black/40 blur-md" />

        <motion.img
          src={mascotImage}
          alt="Mr. CAP mascot"
          className="w-20 h-auto md:w-24 drop-shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
          style={{
            transform: `perspective(600px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
            transition: "transform 0.15s ease-out",
          }}
          draggable={false}
        />
      </motion.button>
    </div>
  );
};

export default FloatingMascot;
