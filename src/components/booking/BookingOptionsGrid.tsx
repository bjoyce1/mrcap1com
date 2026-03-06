import { motion } from "framer-motion";
import { Mic, Music, Radio, MessageSquare } from "lucide-react";

interface OptionCard {
  title: string;
  description: string;
}

const ICONS = [Mic, Music, Radio, MessageSquare];

const BookingOptionsGrid = ({ items }: { items: OptionCard[] }) => (
  <section className="py-12">
    <div className="container mx-auto px-4">
      <span className="text-xs font-medium tracking-widest uppercase text-primary mb-6 block">
        Booking Types
      </span>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="bg-card/30 border border-border/20 rounded-2xl p-5 hover:border-primary/20 transition-all hover:shadow-[var(--shadow-glow)]"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-bold text-foreground text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export default BookingOptionsGrid;
