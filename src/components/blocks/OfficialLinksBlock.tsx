import { Globe, Instagram, Facebook, Youtube, Music } from "lucide-react";
import { motion } from "framer-motion";

const LINKS = [
  { label: "Website", url: "https://mrcap1.com", icon: Globe },
  { label: "Instagram", url: "https://www.instagram.com/mrcapism/", icon: Instagram },
  { label: "X / Twitter", url: "https://x.com/mrcap1", icon: Globe },
  { label: "Facebook", url: "https://www.facebook.com/mrcap11", icon: Facebook },
  { label: "YouTube", url: "https://www.youtube.com/@mrcap1", icon: Youtube },
  { label: "Spotify", url: "https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug", icon: Music },
  { label: "TikTok", url: "https://www.tiktok.com/@mrcapism", icon: Globe },
];

const OfficialLinksBlock = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.4 }}
    className="py-12"
  >
    <div className="container mx-auto px-4">
      <div className="bg-card/40 border border-border/30 rounded-2xl p-6 md:p-8 max-w-3xl mx-auto">
        <span className="text-xs font-medium tracking-widest uppercase text-primary mb-4 block">
          Official Links
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted/40 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{link.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  </motion.section>
);

export default OfficialLinksBlock;
