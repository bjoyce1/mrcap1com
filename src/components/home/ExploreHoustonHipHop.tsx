import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, Newspaper } from "lucide-react";
import { motion } from "framer-motion";

const cards = [
  {
    title: "Houston Hip Hop History",
    description: "The independent blueprint that changed the music industry — told from the inside.",
    href: "/houston-hip-hop-history",
    icon: BookOpen,
  },
  {
    title: "South Park Coalition Legacy",
    description: "Meet the collective that proved ownership beats clout — 30+ years strong.",
    href: "/south-park-coalition-houston",
    icon: Users,
  },
  {
    title: "Mr. CAP Press Coverage",
    description: "Houston Chronicle, Houston Press, and more — the documented record.",
    href: "/press",
    icon: Newspaper,
  },
];

const ExploreHoustonHipHop = () => (
  <section className="py-16 md:py-20">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-center mb-10"
      >
        <span className="text-xs font-medium tracking-widest uppercase text-primary mb-3 block">
          Deep Dives
        </span>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
          Explore Houston Hip Hop
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {cards.map((card, i) => (
          <motion.div
            key={card.href}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Link
              to={card.href}
              className="group block bg-card/40 border border-border/30 rounded-2xl p-6 h-full hover:border-primary/30 transition-all hover:-translate-y-1"
            >
              <card.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-display font-bold text-foreground mb-2">{card.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{card.description}</p>
              <span className="inline-flex items-center gap-1 text-xs text-primary group-hover:underline">
                Read More <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ExploreHoustonHipHop;
