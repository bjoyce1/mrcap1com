import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import mascotImage from "@/assets/mr-cap-mascot.png";
import albumCover from "@/assets/album-art-of-ism.png";

const TIPS = [
  { text: "Check out the latest drops 🎵", href: "/music" },
  { text: "Scroll down to explore more!", href: null },
  { text: "Hit up the merch store 🔥", href: "/merch" },
  { text: "Book a show — let's connect!", href: "/booking" },
  { text: "Stream the new album now 🎧", href: "/music" },
  { text: "Peep the NFT collection 🖼️", href: "/nft-gallery" },
  { text: "Read what the press says 📰", href: "/press" },
  { text: "Get to know the real CAP 💯", href: "/about" },
  { text: "Watch the latest visuals 🎬", href: "/music" },
  { text: "See where CAP's performing 🎤", href: "/live" },
];

const FloatingMascot = () => {
  const [showBubble, setShowBubble] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [idlePhase, setIdlePhase] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [isSupersized, setIsSupersized] = useState(false);
  const [isAlbumMode, setIsAlbumMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgControls = useAnimation();

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateY = useTransform(tiltX, [-1, 1], [-18, 18]);
  const rotateX = useTransform(tiltY, [-1, 1], [12, -12]);

  // Idle "breathing" cycle — subtle weight-shifting every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIdlePhase((p) => (p + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxDist = 500;
    tiltX.set(Math.max(-1, Math.min(1, (e.clientX - centerX) / maxDist)));
    tiltY.set(Math.max(-1, Math.min(1, (e.clientY - centerY) / maxDist)));
  }, [tiltX, tiltY]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const resetMascot = useCallback(() => {
    setIsAlbumMode(false);
    setIsSupersized(false);
    setClickCount(0);
    setShowBubble(false);
  }, []);

  // Auto-reset 10 seconds after album mode triggers
  useEffect(() => {
    if (!isAlbumMode) return;
    const timer = setTimeout(resetMascot, 10000);
    return () => clearTimeout(timer);
  }, [isAlbumMode, resetMascot]);

  const handleClick = async () => {
    if (isDragging) return;
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 19 && !isAlbumMode) {
      setIsAlbumMode(true);
      setIsSupersized(true);
      setShowBubble(true);
    } else if (newCount >= 9 && !isSupersized) {
      setIsSupersized(true);
      setShowBubble(true);
    } else {
      setShowBubble((prev) => !prev);
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }

    await imgControls.start({
      scaleX: [1, 1.2, 0.85, 1.08, 1],
      scaleY: [1, 0.8, 1.18, 0.95, 1],
      rotate: [0, -8, 8, -3, 0],
      transition: { duration: 0.55, ease: "easeOut" },
    });
  };

  // Idle body language variants
  const idleVariants: Record<number, object> = {
    0: { rotate: 0, x: 0 },
    1: { rotate: -1.5, x: -2 },
    2: { rotate: 0.8, x: 1 },
    3: { rotate: -0.5, x: -1 },
  };

  return (
    <motion.div
      ref={containerRef}
      drag
      dragMomentum={false}
      dragElastic={0.15}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setTimeout(() => setIsDragging(false), 100)}
      className="fixed bottom-20 right-4 z-50 md:bottom-8 md:right-8 flex flex-col items-end gap-3 select-none"
      style={{ touchAction: "none" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Speech Bubble */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.85, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 14, scale: 0.85, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 500, damping: 28 }}
            className="relative max-w-[200px] rounded-2xl bg-card/95 backdrop-blur-2xl border border-primary/20 px-4 py-3 text-sm text-foreground shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          >
            {isAlbumMode ? (
              <div className="flex flex-col gap-2">
                <a
                  href="https://qisamkiggoibjkkdtkxq.supabase.co/storage/v1/object/public/audio/Download.zip"
                  download="The-Art-Of-ISM.zip"
                  className="leading-snug block font-bold hover:text-primary transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  Download My Album for free 🎶
                </a>
                <button
                  onClick={(e) => { e.stopPropagation(); resetMascot(); }}
                  className="text-[10px] text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
                >
                  ✕ Reset
                </button>
              </div>
            ) : isSupersized ? (
              <p className="leading-snug font-bold">Damn! clicky 😤</p>
            ) : TIPS[tipIndex].href ? (
              <Link to={TIPS[tipIndex].href!} className="leading-snug block hover:text-primary transition-colors">
                {TIPS[tipIndex].text}
              </Link>
            ) : (
              <p className="leading-snug">{TIPS[tipIndex].text}</p>
            )}
            {/* Bubble tail */}
            <div className="absolute -bottom-[6px] right-7 w-3 h-3 bg-card/95 border-b border-r border-primary/20 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character container — no box, free-standing */}
      <motion.button
        onClick={handleClick}
        className="relative cursor-grab active:cursor-grabbing outline-none"
        aria-label="Mr. CAP mascot guide — click for tips, drag to move"
        style={{ perspective: 800 }}
      >
        {/* Ambient glow — organic, large */}
        <motion.div
          className="absolute -inset-6 rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, transparent 70%)" }}
          animate={{
            opacity: isHovered ? 0.9 : 0.3,
            scale: isHovered ? 1.4 : 1,
          }}
          transition={{ duration: 0.5 }}
        />

        {/* Sparkle particles — more organic spread */}
        <AnimatePresence>
          {isHovered && (
            <>
              {[...Array(5)].map((_, i) => {
                const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
                const radius = 30 + Math.random() * 20;
                return (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full bg-primary pointer-events-none"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: [0, Math.cos(angle) * radius],
                      y: [0, Math.sin(angle) * radius],
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 1,
                      delay: i * 0.12,
                      repeat: Infinity,
                      repeatDelay: 0.8,
                    }}
                    style={{ left: "50%", top: "40%" }}
                  />
                );
              })}
            </>
          )}
        </AnimatePresence>

        {/* Idle body-language wrapper */}
        <motion.div
          animate={{
            y: [0, -8, 0],
            ...idleVariants[idlePhase],
          }}
          transition={{
            y: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 1.2, ease: "easeInOut" },
            x: { duration: 1.2, ease: "easeInOut" },
          }}
        >
          {/* 3D tilt wrapper — driven by cursor */}
          <motion.div
            style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
          >
            {/* Ground shadow — reacts to hover + tilt */}
            <motion.div
              className="absolute -bottom-2 left-1/2 rounded-[50%] bg-black/50 blur-lg pointer-events-none"
              animate={{
                width: isHovered ? 80 : 68,
                height: isHovered ? 8 : 14,
                x: "-50%",
                opacity: isHovered ? 0.6 : 0.3,
                scaleX: isHovered ? 1.1 : 1,
              }}
              transition={{ duration: 0.35 }}
            />

            {/* The character — clean, no container */}
            <motion.img
              src={isAlbumMode ? albumCover : mascotImage}
              alt={isAlbumMode ? "The Art of ISM Album" : "Mr. CAP"}
              className={`pointer-events-none transition-all duration-500 ${isAlbumMode ? "w-48 md:w-56 rounded-xl shadow-2xl shadow-primary/30" : isSupersized ? "w-48 md:w-56" : "w-24 md:w-28"} h-auto`}
              animate={imgControls}
              whileHover={{
                scale: 1.12,
                transition: { duration: 0.3, ease: "easeOut" },
              }}
              style={{
                filter: isAlbumMode
                  ? `drop-shadow(0 12px 40px rgba(249,115,22,0.4)) drop-shadow(0 2px 8px rgba(0,0,0,0.5))`
                  : `drop-shadow(0 12px 28px rgba(0,0,0,0.7)) drop-shadow(0 2px 6px rgba(0,0,0,0.5))`,
                transformStyle: "preserve-3d",
              }}
              draggable={false}
            />
          </motion.div>
        </motion.div>
      </motion.button>
    </motion.div>
  );
};

export default FloatingMascot;
