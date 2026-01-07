import { motion } from "framer-motion";
import { Leaf, Truck, RotateCcw, Sparkles } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "Premium Cotton",
    description: "100% organic cotton, ethically sourced and sustainably produced.",
    highlighted: true,
  },
  {
    icon: Sparkles,
    title: "Custom Embroidery",
    description: "Detailed stitching",
  },
  {
    icon: Leaf,
    title: "Sustainable",
    description: "Eco-friendly packaging",
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    description: "Worldwide delivery",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day guarantee",
  },
];

export const MerchQualitySection = () => {
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

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Large Featured Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="col-span-2 row-span-2 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-8 flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6">
              <Leaf className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Premium Cotton
              </h3>
              <p className="text-muted-foreground">
                100% organic cotton, ethically sourced and sustainably produced.
              </p>
              <button className="mt-4 text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors">
                Learn More →
              </button>
            </div>
          </motion.div>

          {/* Smaller Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-[#111111] border border-white/5 rounded-2xl p-6"
          >
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Custom Embroidery
            </h3>
            <p className="text-xs text-muted-foreground">Detailed stitching</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-[#111111] border border-white/5 rounded-2xl p-6"
          >
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4">
              <Leaf className="w-5 h-5 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Sustainable
            </h3>
            <p className="text-xs text-muted-foreground">Eco-friendly packaging</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-[#111111] border border-white/5 rounded-2xl p-6"
          >
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4">
              <Truck className="w-5 h-5 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Fast Shipping
            </h3>
            <p className="text-xs text-muted-foreground">Worldwide delivery</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="bg-[#111111] border border-white/5 rounded-2xl p-6"
          >
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4">
              <RotateCcw className="w-5 h-5 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Easy Returns
            </h3>
            <p className="text-xs text-muted-foreground">30-day guarantee</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
