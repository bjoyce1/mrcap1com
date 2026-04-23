import { motion } from "framer-motion";
import { Film, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionShell from "./SectionShell";

const POSTER_1 =
  "https://qisamkiggoibjkkdtkxq.supabase.co/storage/v1/object/public/milk-money/The%20Milk%20Money%20Movie%20Poster.png";
const POSTER_2 =
  "https://qisamkiggoibjkkdtkxq.supabase.co/storage/v1/object/public/milk-money/The%20Milk%20Money%20Movie%20Poster%201.png";

const reduce =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const MilkMoneyFeature = () => {
  return (
    <SectionShell
      index="04"
      eyebrow="Coming Soon — Feature Film"
      title={
        <>
          <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            The Milk Money
          </span>
        </>
      }
      description="A new feature film starring and produced by Mr. CAP. Streets, family, and the price of legacy — captured on screen."
      align="center"
      className="relative overflow-hidden"
    >
      {/* Cinematic glow backdrop */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
        {[POSTER_1, POSTER_2].map((src, i) => (
          <motion.div
            key={src}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
            whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.9,
              delay: i * 0.15,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="group relative"
          >
            {/* Outer glow */}
            <div className="absolute -inset-1 bg-gradient-to-br from-primary/30 via-primary/0 to-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_hsl(0_0%_0%/0.8)] ring-1 ring-primary/10 group-hover:ring-primary/40 transition-all duration-500">
              <img
                src={src}
                alt={`The Milk Money — official movie poster ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
              />
              {/* Gloss sweep */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              {/* Bottom fade */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/80 to-transparent" />
              {/* Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/70 backdrop-blur-md ring-1 ring-primary/30">
                <Film className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-primary">
                  Coming Soon
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 md:mt-16"
      >
        <Button variant="hero" size="lg" asChild>
          <a href="#fan-capture">
            Get Notified at Release
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </Button>
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
          A Mr. CAP Production
        </p>
      </motion.div>
    </SectionShell>
  );
};

export default MilkMoneyFeature;
