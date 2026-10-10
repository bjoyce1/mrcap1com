import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, ExternalLink, Eye, Heart, MessageCircle, Music2, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useTikTokFeed, type TikTokVideo } from "@/hooks/useTikTokFeed";
import { trackEvent } from "@/components/GoogleAnalytics";
import { generateTikTokCaption } from "@/lib/tiktokCaption";

const PROFILE_URL = "https://www.tiktok.com/@mrcapism";

const TikTokIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

const formatCount = (n: number) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : String(n));

function VideoCard({ video }: { video: TikTokVideo }) {
  return (
    <motion.a
      href={video.share_url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("tiktok_video_click", { video_id: video.id, source: "videos_page" })}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative block aspect-[9/16] overflow-hidden rounded-2xl bg-card/50 shadow-[0_4px_24px_hsl(0_0%_0%/0.3)]"
    >
      <img
        src={video.cover_image_url}
        alt={video.title || "TikTok video"}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/60 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Play className="w-4 h-4 text-white fill-white ml-0.5" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <p className="text-xs line-clamp-2 mb-2 leading-snug opacity-95">{video.title || video.video_description}</p>
        <div className="flex items-center gap-3 text-[11px] text-white/80">
          <span className="inline-flex items-center gap-1"><Eye className="w-3 h-3" />{formatCount(video.view_count)}</span>
          <span className="inline-flex items-center gap-1"><Heart className="w-3 h-3" />{formatCount(video.like_count)}</span>
          <span className="inline-flex items-center gap-1"><MessageCircle className="w-3 h-3" />{formatCount(video.comment_count)}</span>
        </div>
      </div>
    </motion.a>
  );
}

/**
 * Mr. CAP's TikTok on the Videos page: the profile, the live feed, and a one-tap
 * caption for fans who stitch or duet. This used to be its own /tiktok page.
 */
const TikTokSection = () => {
  const { data, isLoading, error } = useTikTokFeed();
  const [copied, setCopied] = useState(false);
  const profile = data?.profile;
  const videos = data?.videos ?? [];

  const copyCaption = async () => {
    try {
      await navigator.clipboard.writeText(generateTikTokCaption({ type: "hub" }).caption);
      setCopied(true);
      toast.success("Caption copied", { description: "Paste it into your TikTok. The link is tracked." });
      trackEvent("tiktok_caption_copy", { source: "videos_page" });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the caption. Try again.");
    }
  };

  return (
    <section id="tiktok" aria-labelledby="tiktok-title" className="max-w-6xl mx-auto px-6 pb-16 scroll-mt-28">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8">
        <div className="flex items-center gap-4">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-muted/30" />
          )}
          <div>
            <span className="text-xs font-medium tracking-widest uppercase text-primary block mb-1">Live from TikTok</span>
            <h2 id="tiktok-title" className="text-2xl md:text-3xl font-bold">@mrcapism</h2>
            {profile && (
              <p className="text-sm text-muted-foreground">
                {formatCount(profile.follower_count)} followers · {formatCount(profile.likes_count)} likes
              </p>
            )}
          </div>
        </div>
        <Button asChild className="rounded-full gap-2 self-start md:self-auto bg-white text-black hover:bg-white/90">
          <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("tiktok_follow_click", { source: "videos_page" })}>
            <TikTokIcon className="w-4 h-4" />
            Follow on TikTok
            <ExternalLink className="w-3 h-3" />
          </a>
        </Button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[9/16] rounded-2xl bg-card/40 animate-pulse" />
          ))}
        </div>
      )}

      {(error || (!isLoading && videos.length === 0)) && (
        <div className="rounded-2xl bg-card/40 p-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">The TikTok feed is taking a break. Watch on TikTok instead.</p>
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer">
              View on TikTok <ExternalLink className="w-3 h-3 ml-1.5" />
            </a>
          </Button>
        </div>
      )}

      {!isLoading && videos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {videos.slice(0, 8).map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      )}

      <div className="mt-8 rounded-3xl bg-card/40 p-6 md:p-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl md:text-2xl font-bold mb-1">Stitch, Duet, Tag.</h3>
          <p className="text-sm text-muted-foreground max-w-xl">
            Use any Mr. CAP track or visual in your TikTok. Tag <span className="text-foreground font-medium">@mrcapism</span> and use{" "}
            <span className="text-foreground font-medium">#MrCAPLegacy</span>; the best ones get reposted.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button asChild size="sm" className="rounded-full gap-2">
            <Link to="/music">
              <Music2 className="w-3.5 h-3.5" />
              Grab a track
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={copyCaption}>
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied" : "Copy a caption"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TikTokSection;
