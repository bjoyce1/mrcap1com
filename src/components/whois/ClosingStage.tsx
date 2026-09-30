import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { Calendar, ExternalLink, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import BiographyShareRow from "@/components/BiographyShareRow";
import portrait from "@/assets/cap-hero-portrait.webp";
import { GhostWord, Reveal, SplitText } from "./motion";
import { useMotionOk, usePointerParallax } from "./motionUtils";
import { Gold, Stamp } from "./parts";

/** Last screen. The portrait rises into place behind the closing line, and a light follows the pointer. */
const ClosingStage = ({ onOpenPressKit }: { onOpenPressKit: () => void }) => {
  const ok = useMotionOk();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const { x: px, y: py } = usePointerParallax(ref);

  const rise = useTransform(scrollYProgress, [0, 1], ok ? [170, 0] : [0, 0]);
  const riseScale = useTransform(scrollYProgress, [0, 1], ok ? [0.94, 1] : [1, 1]);
  const lightX = useTransform(px, (v) => 50 + v * 22);
  const lightY = useTransform(py, (v) => 34 + v * 18);
  const light = useMotionTemplate`radial-gradient(520px circle at ${lightX}% ${lightY}%, hsl(var(--accent-gold) / 0.14), transparent 70%)`;

  return (
    <section ref={ref} className="relative isolate overflow-hidden pb-48 pt-40 md:pb-56">
      {/* backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,hsl(var(--candy-magenta)/0.2),transparent_60%)]" />
        <GhostWord progress={scrollYProgress} from="20%" to="-24%" className="left-0 top-[22%] text-[clamp(9rem,26vw,24rem)]" stroke="hsl(var(--accent-gold) / 0.2)">
          SOUTH PARK
        </GhostWord>
        <motion.div style={{ backgroundImage: light }} className="absolute inset-0" />
        <motion.div
          style={{ y: rise, scale: riseScale }}
          className="absolute bottom-0 left-1/2 w-[min(120vw,860px)] -translate-x-1/2 origin-bottom"
        >
          <img
            src={portrait}
            alt=""
            loading="lazy"
            decoding="async"
            className="block w-full opacity-40"
            style={{
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 30%, #000 70%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, transparent 0%, #000 30%, #000 70%, transparent 100%)",
            }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
      </div>

      <div className="container mx-auto px-6 text-center">
        <Reveal>
          <Stamp>Closing Statement</Stamp>
        </Reveal>
        <SplitText
          as="h2"
          className="mx-auto mt-8 max-w-5xl font-display text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.88] tracking-tight"
        >
          Built in <Gold>South Park.</Gold>
          <br />
          Designed to outlast the industry.
        </SplitText>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-[hsl(var(--foreground)/0.78)]">
            Available for concerts, festivals, features, speaking engagements, interviews, and creative or technology conversations.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button variant="flux" size="lg" asChild className="rounded-none">
              <Link to="/booking">
                <Calendar className="mr-2 h-4 w-4" /> Book Mr. CAP
              </Link>
            </Button>
            <Button variant="fluxOutline" size="lg" asChild className="rounded-none">
              <Link to="/music">
                <Play className="mr-2 h-4 w-4" /> Listen to Music
              </Link>
            </Button>
            <Button variant="fluxOutline" size="lg" className="rounded-none" onClick={onOpenPressKit}>
              <ExternalLink className="mr-2 h-4 w-4" /> Press Kit
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="mt-10 flex justify-center">
            <BiographyShareRow
              url="https://mrcap1.com/who-is-mr-cap"
              title="Who Is Mr. CAP — The Legacy"
              description="Houston-born rapper, South Park Coalition original, and cultural architect. Read the full biography."
            />
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-3 font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
            <span>© Mr. CAP Legacy</span>
            <span>Est. Houston TX</span>
            <span>Independent by design</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default ClosingStage;
