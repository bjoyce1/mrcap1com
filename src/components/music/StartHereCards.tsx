import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StartHereCard {
  title: string;
  meta: string;
  summary: string;
  slug: string;
  image: string;
}

const StartHereCards = ({ cards }: { cards: StartHereCard[] }) => (
  <section className="py-12">
    <div className="container mx-auto px-4">
      <span className="text-xs font-medium tracking-widest uppercase text-primary mb-6 block">
        Start Here
      </span>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Link
              to={`/album/${card.slug}`}
              className="group block bg-card/40 border border-border/30 rounded-2xl overflow-hidden hover:border-primary/30 transition-all hover:shadow-[var(--shadow-glow)]"
            >
              <div className="aspect-square overflow-hidden relative">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                  <Button variant="default" size="sm" className="rounded-2xl gap-2">
                    <Play className="w-4 h-4" /> Play
                  </Button>
                </div>
              </div>
              <div className="p-5">
                <span className="text-xs text-primary font-medium">{card.meta}</span>
                <h3 className="text-lg font-display font-bold text-foreground mt-1">{card.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{card.summary}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StartHereCards;
