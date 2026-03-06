import { motion } from "framer-motion";
import { Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnlockCard {
  title: string;
  description: string;
}

const UnlockGrid = ({ cards, unlocked }: { cards: UnlockCard[]; unlocked: boolean }) => (
  <section className="py-12">
    <div className="container mx-auto px-4 max-w-3xl">
      <span className="text-xs font-medium tracking-widest uppercase text-primary mb-6 block">
        {unlocked ? "Collector Access — Unlocked" : "Collector Access — Locked"}
      </span>
      <div className="grid sm:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
            className={`bg-card/30 border border-border/20 rounded-2xl p-5 text-center transition-all ${
              !unlocked ? "opacity-60 blur-[1px]" : "hover:border-primary/30 hover:shadow-[var(--shadow-glow)]"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
              {unlocked ? (
                <Unlock className="w-5 h-5 text-primary" />
              ) : (
                <Lock className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <h3 className="font-display font-bold text-foreground text-sm mb-1">{card.title}</h3>
            <p className="text-xs text-muted-foreground mb-3">{card.description}</p>
            {unlocked && (
              <Button variant="default" size="sm" className="rounded-2xl text-xs">
                Access
              </Button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default UnlockGrid;
