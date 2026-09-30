/**
 * Motion primitives for the Who Is Mr. CAP page.
 *
 * Everything here is transform / opacity only, and every effect goes quiet when
 * motion is off: either the visitor's OS asks for reduced motion, or they turned
 * background motion off with the site's floating "Motion" pill.
 */
import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_OUT, MASK_STYLE, useMotionOk } from "./motionUtils";

/* -------------------------------------------------------------------------- */
/* Reveal: the quiet default                                                  */
/* -------------------------------------------------------------------------- */

export const Reveal = ({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) => {
  const ok = useMotionOk();
  return (
    <motion.div
      className={className}
      initial={ok ? { opacity: 0, y } : false}
      whileInView={ok ? { opacity: 1, y: 0 } : undefined}
      // if the visitor switches motion off mid-page, anything still waiting to appear appears now
      animate={ok ? undefined : { opacity: 1, y: 0, transition: { duration: 0 } }}
      transition={{ duration: 0.7, delay, ease: EASE_OUT }}
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */
/* text helpers                                                               */
/* -------------------------------------------------------------------------- */

const plainText = (node: ReactNode): string => {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(plainText).join("");
  if (isValidElement(node)) {
    if (node.type === "br") return " ";
    return plainText((node.props as { children?: ReactNode }).children);
  }
  return "";
};


/** Walks a React tree and hands every word to `wrap`, keeping the surrounding markup (gold spans, <br />, …). */
function mapWords(
  node: ReactNode,
  wrap: (word: string, key: string) => ReactNode,
  keyBase = "w",
): ReactNode {
  if (node == null || typeof node === "boolean") return null;
  if (Array.isArray(node)) return node.map((n, k) => mapWords(n, wrap, `${keyBase}.${k}`));
  if (typeof node === "number") node = String(node);
  if (typeof node === "string") {
    return node.split(/(\s+)/).map((tok, k) => {
      if (tok === "") return null;
      if (/^\s+$/.test(tok)) return " "; // a real space, so lines can still wrap between words
      return wrap(tok, `${keyBase}.${k}`);
    });
  }
  if (isValidElement(node)) {
    if (node.type === "br") return <br key={keyBase} />;
    const el = node as ReactElement<{ children?: ReactNode }>;
    return cloneElement(el, { key: keyBase }, mapWords(el.props.children, wrap, `${keyBase}.c`));
  }
  return node;
}

/* -------------------------------------------------------------------------- */
/* SplitText: masked word / letter reveal                                     */
/* -------------------------------------------------------------------------- */

const MOTION_TAGS = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  div: motion.div,
  span: motion.span,
} as const;

const UNIT_VARIANTS: Variants = {
  hidden: { y: "120%", opacity: 0 },
  show: (delay: number) => ({
    y: "0%",
    opacity: 1,
    transition: { duration: 0.85, delay, ease: EASE_OUT },
  }),
};

type SplitTextProps = {
  as?: keyof typeof MOTION_TAGS;
  children: ReactNode;
  className?: string;
  /** seconds before the first unit moves */
  delay?: number;
  /** seconds between units */
  stagger?: number;
  unit?: "word" | "char";
  /** play on mount instead of when scrolled into view */
  immediate?: boolean;
  /** classes / styles for each moving unit (used for gradient type, which must live on the unit itself) */
  unitClassName?: string;
  unitStyle?: CSSProperties;
};

export const SplitText = ({
  as = "div",
  children,
  className,
  delay = 0,
  stagger,
  unit = "word",
  immediate = false,
  unitClassName,
  unitStyle,
}: SplitTextProps) => {
  const ok = useMotionOk();

  if (!ok) {
    const Static = as as ElementType;
    return <Static className={className}>{children}</Static>;
  }

  const Tag = MOTION_TAGS[as];
  const step = stagger ?? (unit === "char" ? 0.045 : 0.075);
  let n = 0;

  const unitEl = (text: string, key: string) => (
    <span key={key} className="inline-block overflow-hidden align-bottom" style={MASK_STYLE}>
      <motion.span
        className={cn("inline-block will-change-transform", unitClassName)}
        style={unitStyle}
        variants={UNIT_VARIANTS}
        custom={delay + n++ * step}
      >
        {text}
      </motion.span>
    </span>
  );

  const body = mapWords(
    children,
    unit === "char"
      ? (word, key) => (
          <span key={key} className="inline-block whitespace-nowrap align-bottom">
            {Array.from(word).map((ch, i) => unitEl(ch, `${key}.${i}`))}
          </span>
        )
      : unitEl,
  );

  return (
    <Tag
      className={className}
      initial="hidden"
      {...(immediate
        ? { animate: "show" }
        : { whileInView: "show", viewport: { once: true, margin: "0px 0px -12% 0px" } })}
    >
      <span className="sr-only">{plainText(children)}</span>
      <span aria-hidden="true">{body}</span>
    </Tag>
  );
};

/* -------------------------------------------------------------------------- */
/* ScrubText: words light up as the page scrolls                              */
/* -------------------------------------------------------------------------- */

const ScrubWord = ({
  progress,
  index,
  total,
  floor,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  floor: number;
  children: ReactNode;
}) => {
  // the last word is fully lit by ~0.88, which leaves the reader a beat with the finished line
  const start = (index / Math.max(1, total)) * 0.7;
  const opacity = useTransform(progress, [start, start + 0.18], [floor, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
};

type ScrubTextProps = {
  as?: "p" | "div" | "span";
  children: ReactNode;
  className?: string;
  /** scroll progress 0..1 to follow. Omit to follow this element's own pass through the viewport. */
  progress?: MotionValue<number>;
  /** opacity of a word that has not been reached yet */
  floor?: number;
};

export const ScrubText = ({ as = "p", children, className, progress, floor = 0.16 }: ScrubTextProps) => {
  const ok = useMotionOk();
  const ref = useRef<HTMLElement>(null);
  const own = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const source = progress ?? own.scrollYProgress;
  const Tag = as as ElementType;

  if (!ok) {
    return (
      <Tag ref={ref} className={className}>
        {children}
      </Tag>
    );
  }

  let total = 0;
  mapWords(children, () => {
    total++;
    return null;
  });
  let i = 0;
  return (
    <Tag ref={ref} className={className}>
      {mapWords(children, (word, key) => (
        <ScrubWord key={key} progress={source} index={i++} total={total} floor={floor}>
          {word}
        </ScrubWord>
      ))}
    </Tag>
  );
};

/* -------------------------------------------------------------------------- */
/* Scramble: text that decodes into place                                     */
/* -------------------------------------------------------------------------- */

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/<>+";

export const Scramble = ({
  text,
  className,
  delay = 0,
  duration = 900,
}: {
  text: string;
  className?: string;
  delay?: number;
  /** ms for the whole string to settle */
  duration?: number;
}) => {
  const ok = useMotionOk();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const [shown, setShown] = useState(text);

  useEffect(() => {
    if (!ok || !inView) return;
    let raf = 0;
    let last = 0;
    const t0 = performance.now() + delay * 1000;
    const settle = Array.from(text, (_, i) => (i / Math.max(1, text.length)) * duration * 0.8 + Math.random() * duration * 0.2);
    const tick = (now: number) => {
      const t = now - t0;
      if (t < 0) {
        setShown(text.replace(/[^\s·.,:/\-–—]/g, " "));
        raf = requestAnimationFrame(tick);
        return;
      }
      if (now - last > 42) {
        last = now;
        setShown(
          Array.from(text, (ch, i) =>
            /[\s·.,:/\-–—]/.test(ch) || t >= settle[i] ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          ).join(""),
        );
      }
      if (t < duration) raf = requestAnimationFrame(tick);
      else setShown(text);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      setShown(text);
    };
  }, [ok, inView, text, delay, duration]);

  return (
    <span ref={ref} className={cn("relative inline-block", className ?? "whitespace-nowrap")}>
      <span className="sr-only">{text}</span>
      {/* the final string reserves the width so nothing reflows while it decodes */}
      <span aria-hidden="true" className="invisible">
        {text}
      </span>
      <span aria-hidden="true" className="absolute inset-0">
        {shown}
      </span>
    </span>
  );
};

/* -------------------------------------------------------------------------- */
/* layers                                                                     */
/* -------------------------------------------------------------------------- */

/** A layer that drifts against the scroll. `from` / `to` are pixel offsets at the start and end of its pass through the viewport. */
export const Parallax = ({
  children,
  className,
  style,
  from = 50,
  to = -50,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  from?: number;
  to?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const ok = useMotionOk();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ok ? [from, to] : [0, 0]);
  return (
    <motion.div ref={ref} className={className} style={{ ...style, y }}>
      {children}
    </motion.div>
  );
};

/** Giant outlined type that slides sideways behind a section while it scrolls. Decorative, hidden from assistive tech. */
export const GhostWord = ({
  children,
  progress,
  className,
  from = "6%",
  to = "-14%",
  stroke = "hsl(var(--accent-gold) / 0.28)",
}: {
  children: string;
  progress: MotionValue<number>;
  className?: string;
  from?: string;
  to?: string;
  stroke?: string;
}) => {
  const ok = useMotionOk();
  const x = useTransform(progress, [0, 1], ok ? [from, to] : [from, from]);
  return (
    <motion.span
      aria-hidden="true"
      style={{ x, WebkitTextStroke: `1.5px ${stroke}` }}
      className={cn(
        "pointer-events-none absolute select-none whitespace-nowrap font-display uppercase leading-none text-transparent",
        className,
      )}
    >
      {children}
    </motion.span>
  );
};
