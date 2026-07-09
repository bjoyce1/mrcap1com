import mrCapCoin from "@/assets/mr-cap-coin.webp";

const ITEMS = [
  "Houston, Texas",
  "South Park Coalition",
  "30+ Years Deep",
  "First Houston Hip-Hop NFT",
  "The Art of ISM",
  "Wreckless Entertainment",
];

/**
 * Infinite scrolling marquee — the legacy ticker.
 * Two copies of the track animate side by side; CSS handles the loop.
 */
const MarqueeStrip = ({ reverse = false }: { reverse?: boolean }) => {
  const Track = ({ ariaHidden = false }: { ariaHidden?: boolean }) => (
    <div
      aria-hidden={ariaHidden || undefined}
      className={`marquee-track flex shrink-0 items-center ${reverse ? "marquee-reverse" : ""}`}
    >
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="font-display text-2xl md:text-4xl uppercase tracking-tight text-foreground/90 whitespace-nowrap px-6 md:px-10">
            {item}
          </span>
          <img
            src={mrCapCoin}
            alt=""
            className="w-6 h-6 md:w-8 md:h-8 rounded-full opacity-80 marquee-coin"
            loading="lazy"
          />
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative overflow-hidden border-y border-primary/15 bg-card/40 py-5 md:py-7 select-none">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-background to-transparent" />
      <div className="flex w-max">
        <Track />
        <Track ariaHidden />
      </div>
    </div>
  );
};

export default MarqueeStrip;
