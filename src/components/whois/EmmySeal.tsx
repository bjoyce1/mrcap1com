import { useId, useMemo } from "react";
import { motion, useMotionValue, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_OUT, useMotionOk } from "./motionUtils";

/**
 * Gold award seal for the Lone Star Emmy® win.
 *
 * This is an original piece of artwork that states the award in words. It is NOT the
 * official Emmy / NATAS artwork, which is a registered trademark. If the Lone Star Chapter
 * supplied a logo file with the winner's usage guidelines, pass it as `logoSrc` and it is
 * shown in the middle of the seal in place of the "EMMY" wordmark.
 */
type EmmySealProps = {
  className?: string;
  /** Rotation of the lettering ring in degrees. Pass a scroll-linked value for a ring that turns as you scroll. */
  spin?: MotionValue<number>;
  /** Optional official logo (SVG / PNG with transparency). */
  logoSrc?: string | null;
  /** Play the "stamped down" entrance when scrolled into view. */
  landing?: boolean;
};

const RING_TEXT = "LONE STAR EMMY® AWARD · WINNER · 2024 · PUBLIC AFFAIRS PROGRAMMING · ";
const R_TEXT = 91.5;
const CIRCUMFERENCE = 2 * Math.PI * R_TEXT;

// Two laurel branches climbing the inside of the face from the bottom.
const buildLeaves = () => {
  const leaves: { x: number; y: number; rot: number; key: string }[] = [];
  const steps = 9;
  for (const side of [-1, 1] as const) {
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1);
      // degrees clockwise from 3 o'clock; 90 is the bottom of the wreath
      const a = 90 + side * (14 + t * 132);
      const r = 58 + (i % 2 ? 3 : -3);
      const rad = (a * Math.PI) / 180;
      leaves.push({
        key: `${side}-${i}`,
        x: 120 + Math.cos(rad) * r,
        y: 120 + Math.sin(rad) * r,
        // long axis along the branch, tipped a little outward
        rot: a + 90 + side * -28,
      });
    }
  }
  return leaves;
};

const EmmySeal = ({ className, spin, logoSrc, landing = true }: EmmySealProps) => {
  const ok = useMotionOk();
  const uid = useId().replace(/:/g, "");
  const leaves = useMemo(buildLeaves, []);
  const idle = useMotionValue(0);
  const rotate = spin ?? idle;

  const seal = (
    <div
      role="img"
      aria-label="Lone Star Emmy Award winner, 2024"
      className={cn("relative aspect-square w-full drop-shadow-[0_18px_28px_hsl(0_0%_0%/0.55)]", className)}
    >
      {/* lettering ring */}
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 240 240"
        className="absolute inset-0 h-full w-full"
        style={spin && ok ? { rotate } : undefined}
      >
        <defs>
          <radialGradient id={`${uid}-rim`} cx="35%" cy="28%" r="90%">
            <stop offset="0" stopColor="#FBE9B4" />
            <stop offset="0.45" stopColor="#D9A441" />
            <stop offset="1" stopColor="#7A4E0E" />
          </radialGradient>
          <path
            id={`${uid}-ring`}
            d={`M 120 120 m -${R_TEXT} 0 a ${R_TEXT} ${R_TEXT} 0 1 1 ${R_TEXT * 2} 0 a ${R_TEXT} ${R_TEXT} 0 1 1 -${R_TEXT * 2} 0`}
          />
        </defs>
        {/* outer gold rim */}
        <circle cx="120" cy="120" r="117" fill={`url(#${uid}-rim)`} />
        {/* dark lacquer band the lettering sits on */}
        <circle cx="120" cy="120" r="110" fill="#150E1F" />
        <circle cx="120" cy="120" r="110" fill="none" stroke="#F3D58A" strokeOpacity="0.55" strokeWidth="0.8" />
        <circle cx="120" cy="120" r="78" fill="none" stroke="#F3D58A" strokeOpacity="0.55" strokeWidth="0.8" />
        <text
          fill="#F3D58A"
          fontFamily="Archivo, system-ui, sans-serif"
          fontWeight={800}
          fontSize="13.5"
          letterSpacing="1.6"
        >
          <textPath href={`#${uid}-ring`} textLength={CIRCUMFERENCE - 3} lengthAdjust="spacing">
            {RING_TEXT}
          </textPath>
        </text>
      </motion.svg>

      {/* face */}
      <svg aria-hidden="true" viewBox="0 0 240 240" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id={`${uid}-face`} cx="34%" cy="26%" r="95%">
            <stop offset="0" stopColor="#FFF1C8" />
            <stop offset="0.38" stopColor="#E5B554" />
            <stop offset="0.8" stopColor="#B57C1C" />
            <stop offset="1" stopColor="#8A5A12" />
          </radialGradient>
          <linearGradient id={`${uid}-sheen`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <clipPath id={`${uid}-clip`}>
            <circle cx="120" cy="120" r="74" />
          </clipPath>
        </defs>
        <circle cx="120" cy="120" r="74" fill={`url(#${uid}-face)`} />
        <circle cx="120" cy="120" r="69" fill="none" stroke="#5B3A08" strokeOpacity="0.5" strokeWidth="0.9" />

        {/* laurel */}
        <g fill="#7A4E0E" fillOpacity="0.9">
          {leaves.map((l) => (
            <ellipse
              key={l.key}
              cx={l.x}
              cy={l.y}
              rx="2.9"
              ry="7.4"
              transform={`rotate(${l.rot} ${l.x} ${l.y})`}
            />
          ))}
        </g>

        {logoSrc ? (
          <image href={logoSrc} x="82" y="82" width="76" height="76" preserveAspectRatio="xMidYMid meet" />
        ) : (
          <g textAnchor="middle" fill="#24160A">
            <text x="120" y="101" fontFamily="Archivo, system-ui, sans-serif" fontWeight={800} fontSize="8.5" letterSpacing="3.2">
              WINNER
            </text>
            <text x="118" y="133" fontFamily="'Alfa Slab One', serif" fontSize="23" letterSpacing="0.4">
              EMMY
            </text>
            <text x="160" y="117" fontFamily="Archivo, system-ui, sans-serif" fontWeight={800} fontSize="8">
              ®
            </text>
            <text x="120" y="153" fontFamily="Archivo, system-ui, sans-serif" fontWeight={800} fontSize="10.5" letterSpacing="3.5">
              2024
            </text>
          </g>
        )}

        {/* a slow glint across the gold */}
        <g clipPath={`url(#${uid}-clip)`}>
          <g transform="rotate(18 120 120)">
            <rect
              x="-70"
              y="20"
              width="46"
              height="200"
              fill={`url(#${uid}-sheen)`}
              className={ok ? "animate-seal-sheen" : undefined}
              opacity={ok ? undefined : 0}
            />
          </g>
        </g>
      </svg>
    </div>
  );

  if (!landing || !ok) return seal;

  return (
    <motion.div
      initial={{ scale: 1.55, rotate: -26, opacity: 0 }}
      whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ type: "spring", stiffness: 150, damping: 13, mass: 0.9 }}
      className="relative"
    >
      {/* a single ring of light as the seal lands */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full border border-[hsl(var(--accent-gold))]"
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1.7, opacity: [0, 0.7, 0] }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 1.3, delay: 0.25, ease: EASE_OUT }}
      />
      {seal}
    </motion.div>
  );
};

export default EmmySeal;
