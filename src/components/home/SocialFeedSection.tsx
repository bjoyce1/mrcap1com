import { motion } from "framer-motion";
import { Instagram, Youtube, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticWrapper } from "@/hooks/useMagneticHover";
import { useState } from "react";
import albumArtOfIsm from "@/assets/album-art-of-ism.webp";
import albumGrave from "@/assets/album-grave.webp";
import albumTies from "@/assets/album-ties.webp";
import limitlessCover from "@/assets/limitless-cover.webp";
import SectionShell from "@/components/home/SectionShell";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5 },
};

const marqueeImages = [albumArtOfIsm, albumGrave, albumTies, limitlessCover];

const SocialFeedSection = () => {
  const [videoStarted, setVideoStarted] = useState(false);

  return (
    <SectionShell
      index="09"
      eyebrow="Stay Connected"
      title="Follow the Movement"
      description="Watch the latest visuals, behind-the-scenes content, and live updates."
      align="center"
    >
      <style>{`
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track:hover { animation-play-state: paused; }
      `}</style>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* YouTube Embed */}
        <motion.div {...fadeUp} className="bg-card/40 border border-border/20 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-border/10">
            <Youtube className="w-4 h-4 text-red-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Latest Video
            </span>
            {videoStarted && (
              <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-500">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Live
              </span>
            )}
          </div>
          <div className="aspect-video bg-black">
            <iframe
              src="https://www.youtube.com/embed/nojd0u9jBr0"
              title="Latest Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              loading="lazy"
              onLoad={() => setVideoStarted(true)}
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

        {/* Instagram Marquee */}
        <motion.div {...fadeUp} className="bg-card/40 border border-border/20 rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-border/10">
            <Instagram className="w-4 h-4 text-pink-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Instagram
            </span>
          </div>
          <div className="relative overflow-hidden p-3">
            <div
              className="marquee-track flex gap-3"
              style={{
                animation: "marquee-scroll 22s linear infinite",
                width: "max-content",
              }}
            >
              {[...marqueeImages, ...marqueeImages, ...marqueeImages].map((src, i) => (
                <div key={i} className="aspect-square w-32 shrink-0 overflow-hidden rounded-lg group">
                  <img
                    src={src}
                    alt={`Instagram preview ${(i % 4) + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
            {/* Edge fade */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-card/80 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-card/80 to-transparent" />
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

      {/* Magnetic social pills */}
      <motion.div {...fadeUp} className="mt-8 flex flex-wrap justify-center gap-3">
        {[
          { label: "Spotify", href: "https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug" },
          { label: "TikTok", href: "https://www.tiktok.com/@mrcapism" },
          { label: "Facebook", href: "https://www.facebook.com/mrcap11" },
          { label: "X / Twitter", href: "https://x.com/mrcap1" },
        ].map((social) => (
          <MagneticWrapper key={social.label} strength={0.25}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border/20 hover:border-primary/40 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {social.label}
              <ExternalLink className="w-3 h-3" />
            </a>
          </MagneticWrapper>
        ))}
      </motion.div>
    </SectionShell>
  );
};

export default SocialFeedSection;
