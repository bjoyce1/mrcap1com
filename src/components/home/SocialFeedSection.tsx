import { motion } from "framer-motion";
import { Instagram, Youtube, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import albumArtOfIsm from "@/assets/album-art-of-ism.png";
import albumGrave from "@/assets/album-grave.jpg";
import albumTies from "@/assets/album-ties.jpg";
import limitlessCover from "@/assets/limitless-cover.png";

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
            <div className="aspect-video bg-black">
              <video
                src="/video/limitless-music-video.mp4"
                poster="/images/covers/limitless.webp"
                controls
                preload="none"
                className="w-full h-full object-cover"
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
            <div className="grid grid-cols-2 gap-1 p-1">
              {[albumArtOfIsm, albumGrave, albumTies, limitlessCover].map((src, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-lg group">
                  <img
                    src={src}
                    alt={`Instagram preview ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
            <div className="px-5 py-4">
              <Button variant="flux" size="sm" className="rounded-full gap-2 w-full" asChild>
                <a href="https://www.instagram.com/mrcapism/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-3.5 h-3.5" />
                  Follow on Instagram
                  <ExternalLink className="w-3 h-3" />
                </a>
              </Button>
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
