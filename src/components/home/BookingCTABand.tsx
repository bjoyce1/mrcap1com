import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import ObfuscatedMailto from "@/components/ObfuscatedMailto";
import { motion } from "framer-motion";

const BookingCTABand = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-primary/4 to-primary/8" />
      <div className="relative border-y border-primary/15">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-6xl mx-auto px-6 py-14 md:py-20 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Now Booking 2025 — 08
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Book Mr. CAP for Your Event
            </h2>
            <p className="text-muted-foreground text-sm max-w-md">
              Live shows, festivals, speaking panels, media interviews — available across Texas and beyond.
            </p>
          </div>

          <div className="flex gap-3 shrink-0">
            <Button variant="flux" size="lg" className="rounded-full" asChild>
              <Link to="/booking">
                Book Now <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="fluxOutline" size="lg" className="rounded-full" asChild>
              <ObfuscatedMailto user="wrecklessent" domain="gmail.com" subject="Booking Inquiry">
                Email Direct
              </ObfuscatedMailto>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BookingCTABand;
