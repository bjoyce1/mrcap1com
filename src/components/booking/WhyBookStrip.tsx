import { motion } from "framer-motion";
import { Star } from "lucide-react";

const WhyBookStrip = ({ body }: { body: string }) => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.4 }}
    className="py-10"
  >
    <div className="container mx-auto px-4">
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 md:p-8 flex gap-4 items-start max-w-3xl mx-auto">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Star className="w-5 h-5 text-primary" />
        </div>
        <div>
          <span className="text-xs font-medium tracking-widest uppercase text-primary mb-2 block">
            Why Book Mr. CAP
          </span>
          <p className="text-muted-foreground leading-relaxed">{body}</p>
        </div>
      </div>
    </div>
  </motion.section>
);

export default WhyBookStrip;
