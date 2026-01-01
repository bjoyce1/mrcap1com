import { motion } from "framer-motion";
import { ImagePlus } from "lucide-react";

interface PlaceholderItem {
  id: number;
  title: string;
  price: string;
}

const placeholderItems: PlaceholderItem[] = [
  { id: 1, title: "Trap University Tee #1", price: "TBD" },
  { id: 2, title: "Trap University Tee #2", price: "TBD" },
  { id: 3, title: "Trap University Hoodie #1", price: "TBD" },
  { id: 4, title: "Trap University Hoodie #2", price: "TBD" },
  { id: 5, title: "Trap University Cap", price: "TBD" },
  { id: 6, title: "Trap University Jacket", price: "TBD" },
  { id: 7, title: "Trap University Shorts", price: "TBD" },
  { id: 8, title: "Trap University Sweatpants", price: "TBD" },
  { id: 9, title: "Trap University Tank Top", price: "TBD" },
  { id: 10, title: "Trap University Beanie", price: "TBD" },
];

export const TrapUniversityCollection = () => {
  return (
    <section className="py-16 bg-secondary/20">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full font-mono text-sm mb-4">
            Coming Soon
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Trap University Collection
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Exclusive streetwear dropping soon. Stay tuned for the full collection.
          </p>
        </div>

        {/* Placeholder Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
        >
          {placeholderItems.map((item) => (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.4 }}
              className="group"
            >
              <div className="bg-secondary/30 border border-border/50 rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
                {/* Image Placeholder */}
                <div className="aspect-square relative bg-muted/50 flex items-center justify-center">
                  <div className="text-center">
                    <ImagePlus className="w-10 h-10 text-muted-foreground/40 mx-auto mb-2" />
                    <span className="text-xs text-muted-foreground/50 font-mono">#{item.id}</span>
                  </div>
                  
                  {/* Overlay hint */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                    <span className="text-xs text-muted-foreground font-mono">Image pending</span>
                  </div>
                </div>
                
                {/* Item Details */}
                <div className="p-4">
                  <h3 className="font-medium text-sm text-foreground/80 line-clamp-1 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm font-mono">
                    {item.price}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground text-sm">
            Want to be notified when this collection drops?{" "}
            <a href="#newsletter" className="text-primary hover:underline">
              Join the newsletter
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
