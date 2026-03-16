import { motion } from "framer-motion";
import { Instagram, Youtube, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5 },
};

const SocialFeedSection = () => {
  return (
    <section className="py-16 md:py-20 border-t border-border/10">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div {...fadeUp} className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-2 block">
            Stay Connected
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
            Follow the Movement
          </h2>
          <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
            Watch the latest visuals, behind-the-scenes content, and live updates.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* YouTube Embed */}
          <motion.div {...fadeUp} className="bg-card/40 border border-border/20 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border/10">
              <Youtube className="w-4 h-4 text-red-500" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Latest Video
              </span>
            </div>
            <div className="aspect-video">
              <iframe
                src="https://www.youtube.com/embed?listType=user_uploads&list=mrcap1&max-results=1"
                title="Mr. CAP — Latest YouTube Video"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
            <div className="px-5 py-3">
              <Button variant="fluxOutline" size="sm" className="rounded-full w-full gap-2" asChild>
                <a href="https://www.youtube.com/@mrcap1" target="_blank" rel="noopener noreferrer">
                  <Youtube className="w-3.5 h-3.5" />
                  Subscribe on YouTube
                  <ExternalLink className="w-3 h-3" />
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Instagram Embed */}
          <motion.div {...fadeUp} className="bg-card/40 border border-border/20 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-border/10">
              <Instagram className="w-4 h-4 text-pink-500" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Instagram
              </span>
            </div>
            <div className="p-5 flex flex-col items-center justify-center min-h-[300px] text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 flex items-center justify-center mb-4">
                <Instagram className="w-10 h-10 text-white" />
              </div>
              <p className="font-display text-lg font-bold text-foreground">@mrcapism</p>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Music, culture, and behind-the-scenes from Houston's own.
              </p>
              <Button variant="flux" size="sm" className="rounded-full gap-2" asChild>
                <a href="https://www.instagram.com/mrcapism/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-3.5 h-3.5" />
                  Follow on Instagram
                  <ExternalLink className="w-3 h-3" />
                </a>
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-px border-t border-border/10">
              {["Music drops", "Show recaps", "Studio sessions"].map((label) => (
                <div key={label} className="bg-muted/20 py-3 text-center">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Additional social links row */}
        <motion.div {...fadeUp} className="mt-6 flex flex-wrap justify-center gap-3">
          {[
            { label: "Spotify", href: "https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug", color: "text-green-500" },
            { label: "TikTok", href: "https://www.tiktok.com/@mrcapism", color: "text-foreground" },
            { label: "Facebook", href: "https://www.facebook.com/mrcap11", color: "text-blue-500" },
            { label: "X / Twitter", href: "https://x.com/mrcap1", color: "text-foreground" },
          ].map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border/20 hover:border-primary/30 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {social.label}
              <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SocialFeedSection;
