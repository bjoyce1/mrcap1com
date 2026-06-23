import { motion } from "framer-motion";
import { Youtube, ExternalLink, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MagneticWrapper } from "@/hooks/useMagneticHover";
import { useState } from "react";
import SectionShell from "@/components/home/SectionShell";
import { useTikTokFeed } from "@/hooks/useTikTokFeed";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.5 },
};

const TikTokIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

const SocialFeedSection = () => {
  const [videoStarted, setVideoStarted] = useState(false);
  const { data } = useTikTokFeed();
  const tiktokPreview = (data?.videos ?? []).slice(0, 3);

  return (
    <SectionShell
      index="09"
      eyebrow="Stay Connected"
      title="Follow the Movement"
      description="Watch the latest visuals, behind-the-scenes content, and live updates."
      align="center"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* YouTube Embed */}
        <motion.div {...fadeUp} className="bg-card/40 rounded-2xl overflow-hidden shadow-[0_4px_24px_hsl(0_0%_0%/0.3)]">
          <div className="flex items-center gap-2 px-5 py-3">
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

        {/* TikTok Live Tile */}
        <motion.div {...fadeUp} className="bg-card/40 rounded-2xl overflow-hidden shadow-[0_4px_24px_hsl(0_0%_0%/0.3)]">
          <div className="flex items-center gap-2 px-5 py-3">
            <TikTokIcon className="w-4 h-4 text-foreground" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              TikTok · @mrcapism
            </span>
            <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Live
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 p-3">
            {(tiktokPreview.length ? tiktokPreview : [null, null, null]).map((v, i) => (
              <a
                key={v?.id ?? i}
                href={v?.share_url ?? "/tiktok"}
                target={v ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group relative aspect-[9/16] overflow-hidden rounded-lg bg-muted/40"
              >
                {v ? (
                  <>
                    <img
                      src={v.cover_image_url}
                      alt={v.title || "TikTok"}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full animate-pulse" />
                )}
              </a>
            ))}
          </div>
          <div className="px-5 py-3">
            <Button variant="flux" size="sm" className="rounded-full gap-2 w-full" asChild>
              <Link to="/tiktok">
                <TikTokIcon className="w-3.5 h-3.5" />
                See the full TikTok feed
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Magnetic social pills */}
      <motion.div {...fadeUp} className="mt-8 flex flex-wrap justify-center gap-3">
        {[
          { label: "Spotify", href: "https://open.spotify.com/artist/69pjfQNXA1xjusnI2wfgug", external: true },
          { label: "Instagram", href: "https://www.instagram.com/mrcapism/", external: true },
          { label: "Facebook", href: "https://www.facebook.com/mrcap11", external: true },
          { label: "X / Twitter", href: "https://x.com/mrcap1", external: true },
        ].map((social) => (
          <MagneticWrapper key={social.label} strength={0.25}>
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground transition-colors shadow-[0_2px_12px_hsl(0_0%_0%/0.3)]"
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
