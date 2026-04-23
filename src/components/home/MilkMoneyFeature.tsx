import { motion } from "framer-motion";
import { ArrowRight, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionShell from "./SectionShell";
import SectionBackground from "./SectionBackground";

const BG_IMAGE =
  "https://qisamkiggoibjkkdtkxq.supabase.co/storage/v1/object/public/milk-money/The%20Milk%20Money%20Movie%20Poster%202.png";
const POSTER_IMAGE =
  "https://qisamkiggoibjkkdtkxq.supabase.co/storage/v1/object/public/milk-money/The%20Milk%20Money%20Movie%20Poster.png";

const MOVIE_URL = "https://themilkmoney.lovable.app";

const MilkMoneyFeature = () => {
  return (
    <SectionBackground image={BG_IMAGE} opacity={0.5} gradient="left">
      <SectionShell index="04" eyebrow="Now in Development" hideHeader>

      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* LEFT — Copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-6"
        >
          <div className="flex items-center gap-3">
            <span className="w-10 h-[1px] bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
            <span className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.3em] uppercase text-primary">
              <Film className="w-3.5 h-3.5" />
              A Film Experience
            </span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
            The Milk <span className="text-primary">Money</span>
          </h2>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl">
            A short film inspired by the album{" "}
            <span className="text-foreground font-medium">The Art of ISM</span>.
            In a city where fake robberies are sold as entertainment for the rich,
            a real crew attempts to hijack the illusion — only to discover the
            smartest hustler in the room has already rewritten the rules.
          </p>

          <p className="font-display italic text-lg text-primary/90 max-w-xl">
            "The real crime is believing the illusion."
          </p>

          <div className="flex flex-wrap gap-2 text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
            <span className="px-3 py-1 rounded-full bg-foreground/5">Crime</span>
            <span className="px-3 py-1 rounded-full bg-foreground/5">Psychological</span>
            <span className="px-3 py-1 rounded-full bg-foreground/5">Social Commentary</span>
            <span className="px-3 py-1 rounded-full bg-foreground/5">Hustle Culture</span>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="hero" size="lg" asChild>
              <a href={MOVIE_URL} target="_blank" rel="noopener noreferrer">
                Explore the Film
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href={`${MOVIE_URL}/#trailer`} target="_blank" rel="noopener noreferrer">
                Watch Trailer
              </a>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground/70 pt-1">
            Written by Leah Taylor • Inspired by The Art of ISM
          </p>
        </motion.div>

        {/* RIGHT — Featured poster */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="relative mx-auto w-full max-w-md lg:max-w-lg"
        >
          {/* Glow halo */}
          <div className="absolute -inset-6 bg-primary/20 blur-3xl rounded-full opacity-60 pointer-events-none" />

          <a
            href={MOVIE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block rounded-2xl overflow-hidden shadow-[0_20px_60px_hsl(0_0%_0%/0.6)] ring-1 ring-primary/10 transition-transform duration-500 hover:scale-[1.02]"
          >
            <img
              src={POSTER_IMAGE}
              alt="The Milk Money — official movie poster"
              className="w-full h-auto block"
              loading="lazy"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center p-6">
              <span className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                Visit the official site
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </a>
        </motion.div>
      </div>
      </SectionShell>
    </div>
  );
};

export default MilkMoneyFeature;
