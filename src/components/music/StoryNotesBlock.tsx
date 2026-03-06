import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

const StoryNotesBlock = ({ body }: { body: string }) => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.4 }}
    className="py-12"
  >
    <div className="container mx-auto px-4 max-w-3xl">
      <div className="bg-card/40 border border-border/30 rounded-2xl p-6 md:p-8 flex gap-4 items-start">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        <div>
          <span className="text-xs font-medium tracking-widest uppercase text-primary mb-2 block">
            Story Notes
          </span>
          <p className="text-muted-foreground leading-relaxed">{body}</p>
        </div>
      </div>
    </div>
  </motion.section>
);

export default StoryNotesBlock;
