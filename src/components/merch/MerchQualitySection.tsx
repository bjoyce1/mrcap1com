import { motion } from "framer-motion";
import { Leaf, Truck, RotateCcw, Sparkles } from "lucide-react";
import ChromaGrid, { ChromaGridItem } from "@/components/ui/ChromaGrid";

const features = [
  { icon: Leaf, title: "Premium Cotton", description: "100% organic cotton, ethically sourced and sustainably produced.", borderColor: "#3B82F6", gradient: "linear-gradient(145deg, rgba(59,130,246,0.1), #0A0A0A)" },
  { icon: Sparkles, title: "Custom Embroidery", description: "Detailed stitching", borderColor: "#F59E0B", gradient: "linear-gradient(165deg, rgba(245,158,11,0.1), #0A0A0A)" },
  { icon: Leaf, title: "Sustainable", description: "Eco-friendly packaging", borderColor: "#10B981", gradient: "linear-gradient(195deg, rgba(16,185,129,0.1), #0A0A0A)" },
  { icon: Truck, title: "Fast Shipping", description: "Worldwide delivery", borderColor: "#8B5CF6", gradient: "linear-gradient(210deg, rgba(139,92,246,0.1), #0A0A0A)" },
  { icon: RotateCcw, title: "Easy Returns", description: "30-day guarantee", borderColor: "#06B6D4", gradient: "linear-gradient(225deg, rgba(6,182,212,0.1), #0A0A0A)" },
];

export const MerchQualitySection = () => {
  const chromaItems: ChromaGridItem[] = features.map((f) => ({
    title: f.title,
    subtitle: f.description,
    borderColor: f.borderColor,
    gradient: f.gradient,
    _icon: f.icon,
  }));

  return (
    <section className="py-20 px-6 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
            Quality & Craftsmanship
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Every piece is designed with intention and made to last.
          </p>
        </motion.div>

        <div style={{ height: '380px', position: 'relative' }}>
          <ChromaGrid
            items={chromaItems}
            columns={3}
            radius={250}
            renderCard={(item) => {
              const Icon = item._icon as React.ComponentType<{ className?: string }>;
              return (
                <div className="flex flex-col p-6 h-full">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                </div>
              );
            }}
          />
        </div>
      </div>
    </section>
  );
};
