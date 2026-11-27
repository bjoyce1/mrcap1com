import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import SectionShell from "@/components/home/SectionShell";
import { ARTISTS, GAME_CONFIG } from "@/features/legends/config";
import { BOARD, LEGENDS_LINKS, LEGENDS_STATS, cardFor } from "./legends-showcase.data";
import "./legends-showcase.css";

const CROWN = "/games/spc-legends/marquee/crown.webp";
const WORDMARK = "/games/spc-legends/marquee/title-letters.webp";

const reduce =
  typeof window !== "undefined" &&
  Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);

const LegendsShowcase = () => {
  return (
    <SectionShell
      eyebrow="SPC Legends · Spin The Mix"
      title={
        <>
          Six reels. Twelve legends.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cap-gold to-primary">
            One mixhouse.
          </span>
        </>
      }
      description="SPC Legends is a six reel arcade board starring the South Park Coalition. Spin to build your Legends collection, chase the Supreme Legendary award, and hear cuts from The Ties That Bind Us on the big hits."
      className="overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background pointer-events-none" />

      <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center relative z-10">
        {/* Brand, figures and calls to action */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-start gap-6"
        >
          <div className="relative">
            <div
              className="absolute -inset-6 bg-cap-gold/10 blur-3xl pointer-events-none"
              aria-hidden="true"
            />
            <img
              src={CROWN}
              alt=""
              width={442}
              height={372}
              loading="lazy"
              decoding="async"
              className="relative w-14 md:w-16 h-auto drop-shadow-[0_10px_24px_hsl(0_0%_0%/0.55)]"
            />
          </div>

          <img
            src={WORDMARK}
            alt="SPC Legends"
            width={1536}
            height={290}
            loading="lazy"
            decoding="async"
            className="w-full max-w-[340px] h-auto"
          />

          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-xl">
            New accounts start with{" "}
            <span className="text-foreground font-medium">
              {GAME_CONFIG.welcomeSpins.toLocaleString("en-US")} free spins
            </span>
            , plus {GAME_CONFIG.dailySpins} more every Houston day. Play free, earn Supreme XP, and
            keep every Legend you collect.
          </p>

          <dl className="flex flex-wrap gap-3">
            {LEGENDS_STATS.map((stat) => (
              <div
                key={stat.label}
                className="px-4 py-3 rounded-xl bg-card/70 shadow-[0_4px_24px_hsl(0_0%_0%/0.3)] min-w-[92px]"
              >
                <dt className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  {stat.label}
                </dt>
                <dd className="font-display text-xl md:text-2xl text-cap-gold leading-tight">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap gap-3">
            <Button variant="gold" size="lg" className="rounded-full" asChild>
              <Link to={LEGENDS_LINKS.play}>
                Play SPC Legends <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="fluxOutline" size="lg" className="rounded-full" asChild>
              <Link to={LEGENDS_LINKS.rewards}>See the Rewards</Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground/80">
            Free to play. Supreme XP is virtual and has no cash value.
          </p>
        </motion.div>

        {/* Board preview */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative justify-self-center"
        >
          <div className="absolute -inset-10 bg-primary/10 blur-3xl pointer-events-none" aria-hidden="true" />
          <div className="relative lgx-board rounded-3xl bg-card/70 p-5 md:p-7 shadow-[0_24px_70px_-24px_hsl(0_0%_0%/0.85)] overflow-hidden">
            <span
              className="lgx-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-cap-gold/15 to-transparent"
              aria-hidden="true"
            />
            <div className="relative flex items-center justify-between mb-4">
              <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-cap-gold/70">
                713 Mixhouse
              </span>
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="w-1.5 h-1.5 rounded-full bg-cap-gold/60" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                <span className="w-1.5 h-1.5 rounded-full bg-foreground/25" />
              </span>
            </div>

            <div className="relative flex flex-col lgx-row" aria-hidden="true">
              {BOARD.map((row, r) => (
                <div key={r} className="relative flex lgx-row justify-center">
                  {row.map((id, c) => (
                    <img
                      key={`${r}-${c}`}
                      src={cardFor(id)}
                      alt=""
                      width={512}
                      height={512}
                      loading="lazy"
                      decoding="async"
                      className="lgx-tile rounded-xl object-cover shadow-[0_4px_24px_hsl(0_0%_0%/0.3)]"
                    />
                  ))}
                  {r === 1 && (
                    <span className="pointer-events-none absolute inset-0" aria-hidden="true">
                      <span className="lgx-line absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 blur-[6px] bg-gradient-to-r from-transparent via-cap-gold to-transparent" />
                      <span className="lgx-line absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[3px] bg-gradient-to-r from-transparent via-cap-gold to-transparent" />
                    </span>
                  )}
                </div>
              ))}
            </div>

            <p className="relative mt-4 text-[11px] uppercase tracking-[0.22em] text-muted-foreground/70 text-center">
              Board preview
            </p>
          </div>
        </motion.div>
      </div>

      {/* Every Legend in the roster */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
        whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mt-12 md:mt-16"
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.32em] text-muted-foreground">
          The Roster
        </span>
        <ul className="mt-4 flex gap-3 overflow-x-auto pb-2 snap-x lg:grid lg:grid-cols-6 xl:grid-cols-12 lg:overflow-visible lg:pb-0">
          {ARTISTS.map((artist) => (
            <li key={artist.id} className="snap-start shrink-0 w-[92px] lg:w-auto group">
              <Link
                to={LEGENDS_LINKS.play}
                className="block rounded-xl overflow-hidden shadow-[0_4px_24px_hsl(0_0%_0%/0.3)] transition-transform duration-300 group-hover:-translate-y-1"
              >
                <img
                  src={cardFor(artist.id)}
                  alt={artist.name}
                  width={512}
                  height={512}
                  loading="lazy"
                  decoding="async"
                  className="w-full aspect-square object-cover"
                />
              </Link>
              <span className="mt-2 block text-[11px] text-muted-foreground group-hover:text-foreground transition-colors truncate">
                {artist.name}
              </span>
            </li>
          ))}
        </ul>
      </motion.div>
    </SectionShell>
  );
};

export default LegendsShowcase;
