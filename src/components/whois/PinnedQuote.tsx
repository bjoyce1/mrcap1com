import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ScrubText } from "./motion";
import { useMotionOk } from "./motionUtils";
import { Gold } from "./parts";

/**
 * The pull quote pins to the screen while its words light up one by one with the scroll,
 * then releases. With motion off it is just the finished quote on the page.
 */
const PinnedQuote = () => {
  const ok = useMotionOk();
  const runway = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: runway, offset: ["start start", "end end"] });

  const markY = useTransform(scrollYProgress, [0, 1], ok ? ["8%", "-22%"] : ["0%", "0%"]);
  const ruleScale = useTransform(scrollYProgress, [0.04, 0.9], ok ? [0, 1] : [1, 1]);
  const creditOpacity = useTransform(scrollYProgress, [0.84, 0.97], ok ? [0, 1] : [1, 1]);
  const creditY = useTransform(scrollYProgress, [0.84, 0.97], ok ? [14, 0] : [0, 0]);

  return (
    <div ref={runway} className={ok ? "relative h-[190svh] md:h-[205svh]" : "relative py-20"}>
      <div className={ok ? "sticky top-0 flex h-[100svh] items-center" : ""}>
        <blockquote className="relative max-w-5xl">
          {/* oversized quote mark, drifting behind the words */}
          <motion.span
            aria-hidden="true"
            style={{ y: markY, WebkitTextStroke: "1.5px hsl(var(--accent-gold) / 0.3)" }}
            className="pointer-events-none absolute -left-4 -top-24 select-none font-display text-[clamp(14rem,30vw,28rem)] leading-none text-transparent md:-left-16 md:-top-40"
          >
            “
          </motion.span>

          <ScrubText
            as="p"
            progress={scrollYProgress}
            className="relative font-display text-[clamp(2rem,4.8vw,4rem)] leading-[1.06] text-foreground"
          >
            <Gold>“</Gold>The technology changed. The principle didn't: <Gold>own the work.</Gold>
            <Gold>”</Gold>
          </ScrubText>

          <motion.div
            aria-hidden="true"
            style={{ scaleX: ruleScale }}
            className="mt-10 h-px w-full origin-left bg-gradient-to-r from-[hsl(var(--accent-gold))] to-transparent"
          />
          <motion.footer
            style={{ opacity: creditOpacity, y: creditY }}
            className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground"
          >
            — Mr. CAP · Est. Houston TX
          </motion.footer>
        </blockquote>
      </div>
    </div>
  );
};

export default PinnedQuote;
