import { useRef } from "react";
import { useScroll } from "framer-motion";
import spcOrigins from "/images/spc-houston-origins.webp";
import spcSkyline from "/images/spc-houston-skyline.webp";
import spcStudio from "/images/spc-mr-cap-studio.jpg";
import spcVinyl from "/images/spc-vinyl-legacy.webp";
import { GhostWord, Parallax, Reveal, SplitText } from "./motion";
import { Gold, Stamp } from "./parts";

/* Four archive frames, layered. Every frame drifts at its own rate, so as the section
 * scrolls the pile rearranges itself. Classes are written out in full for Tailwind. */
const FRAMES = [
  { src: spcOrigins, cap: "SPC · Origins", ratio: "3 / 2", pos: "left-[0%] top-[20px] w-[41%]", z: "z-20", tilt: "-rotate-[1.5deg]", from: 30, to: -40 },
  { src: spcSkyline, cap: "H-Town", ratio: "3 / 2", pos: "left-[43%] top-[0px] w-[31%]", z: "z-10", tilt: "rotate-[1.2deg]", from: -10, to: 34 },
  { src: spcStudio, cap: "Studio · Houston", ratio: "1 / 1", pos: "left-[69%] top-[150px] w-[22%]", z: "z-40", tilt: "rotate-[3deg]", from: 80, to: -120 },
  { src: spcVinyl, cap: "Vinyl · Legacy", ratio: "1 / 1", pos: "left-[19%] top-[350px] w-[30%]", z: "z-30", tilt: "-rotate-[2.5deg]", from: 10, to: -80 },
] as const;

const Photo = ({ f, index, className = "" }: { f: (typeof FRAMES)[number]; index: number; className?: string }) => (
  <figure
    className={`group relative overflow-hidden border border-[hsl(var(--foreground)/0.14)] bg-card shadow-[0_40px_80px_hsl(0_0%_0%/0.55)] transition-transform duration-700 ease-out hover:scale-[1.03] ${className}`}
  >
    <img
      src={f.src}
      alt={f.cap}
      loading="lazy"
      decoding="async"
      className="block w-full object-cover"
      style={{ aspectRatio: f.ratio, filter: "grayscale(0.3) contrast(1.07)" }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
    <figcaption className="absolute bottom-2 left-3 right-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/85">
      <span className="text-[hsl(var(--accent-gold))]">{String(index + 1).padStart(2, "0")}</span>
      <span>{f.cap}</span>
    </figcaption>
  </figure>
);

const OriginCollage = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <section id="ch-origin" ref={ref} className="relative overflow-x-clip py-28 scroll-mt-24 md:py-36">
      {/* wash behind the whole chapter */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(900px 520px at 85% 62%, hsl(var(--candy-magenta)/0.10), transparent 65%), radial-gradient(800px 500px at 8% 20%, hsl(var(--accent-gold)/0.07), transparent 60%)",
        }}
      />
      <GhostWord progress={scrollYProgress} from="28%" to="-34%" className="left-0 top-[55%] text-[clamp(9rem,24vw,22rem)]">
        SOUTH PARK
      </GhostWord>

      <div className="container relative mx-auto px-6">
        <Reveal>
          <Stamp>Chapter 02 · Origin · South Park, Houston</Stamp>
        </Reveal>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-5">
            <SplitText as="h2" className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.95] [text-wrap:balance] break-words">
              Raised <span className="whitespace-nowrap">in <Gold>South Park.</Gold></span>
              <br />
              Shaped by International Experience.
            </SplitText>
          </div>

          <Reveal delay={0.15} className="min-w-0 space-y-6 text-lg leading-relaxed text-[hsl(var(--foreground)/0.78)] lg:col-span-7">
            <p>
              He was performing before most kids picked up an instrument — eight years old at his first show, later graduating from Jack Yates Senior High and moving through the city's earliest independent circuits with The Raise Up Posse.
            </p>
            <p>
              South Park taught the curriculum: <span className="text-foreground">realism, discipline, authenticity, survival.</span> The block wrote the syllabus. Everything after — the coalitions, the labels, the tokens — is the same lesson, translated forward.
            </p>
          </Reveal>
        </div>

        {/* desktop: the pile */}
        <div className="relative mt-20 hidden h-[740px] lg:block">
          {FRAMES.map((f, i) => (
            <Parallax key={f.cap} from={f.from} to={f.to} className={`absolute ${f.pos} ${f.z}`}>
              <Photo f={f} index={i} className={f.tilt} />
            </Parallax>
          ))}
        </div>

        {/* phones and tablets: two columns, alternate frames dropped */}
        <div className="mt-16 grid grid-cols-2 gap-4 md:gap-6 lg:hidden">
          {FRAMES.map((f, i) => (
            <Reveal key={f.cap} delay={i * 0.08}>
              <Photo f={f} index={i} className={i % 2 ? "translate-y-6 md:translate-y-10" : ""} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OriginCollage;
