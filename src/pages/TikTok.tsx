import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ExternalLink, Play, Heart, MessageCircle, Eye, Share2, Music2, Copy, Check, Wand2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useTikTokFeed, type TikTokVideo } from "@/hooks/useTikTokFeed";
import { trackEvent } from "@/components/GoogleAnalytics";
import { generateTikTokCaption } from "@/lib/tiktokCaption";

const TikTokIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

const PROFILE_URL = "https://www.tiktok.com/@mrcapism";

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function VideoCard({ video, onClick }: { video: TikTokVideo; onClick: () => void }) {
  return (
    <motion.a
      href={video.share_url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
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

export default function TikTok() {
  const { data, isLoading, error } = useTikTokFeed();
  const [copied, setCopied] = useState(false);

  const profile = data?.profile;
  const videos = data?.videos ?? [];

  const shareUrl = "https://mrcap1.com/tiktok?utm_source=tiktok&utm_medium=social&utm_campaign=hub";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("TikTok hub link copied");
    trackEvent("tiktok_share", { source: "hub_copy" });
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleFollow = () => {
    trackEvent("tiktok_follow_click", { source: "hub_hero" });
  };

  const handleVideoClick = (video: TikTokVideo) => {
    trackEvent("tiktok_video_click", { video_id: video.id, source: "hub_grid" });
  };

  const [caption, setCaption] = useState(() => generateTikTokCaption({ type: "hub" }).caption);
  const [captionCopied, setCaptionCopied] = useState(false);

  const regenerateCaption = () => {
    setCaption(generateTikTokCaption({ type: "hub" }).caption);
    trackEvent("tiktok_caption_generate", { source: "hub" });
  };

  const copyCaption = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCaptionCopied(true);
      toast.success("Caption copied", { description: "Paste it into TikTok — link is UTM-tracked." });
      trackEvent("tiktok_caption_copy", { source: "hub" });
      window.setTimeout(() => setCaptionCopied(false), 2000);
    } catch {
      toast.error("Could not copy — long-press the box to copy manually.");
    }
  };

  const openTikTokWithCaption = async () => {
    await copyCaption();
    const isMobile = typeof navigator !== "undefined" && /android|iphone|ipad|ipod/i.test(navigator.userAgent);
    const dest = isMobile ? "snssdk1233://" : "https://www.tiktok.com/upload";
    trackEvent("tiktok_caption_open_app", { source: "hub", mobile: isMobile });
    window.open(dest, "_blank", "noopener,noreferrer");
  };

  // JSON-LD for top 6 videos
  const videoSchema = videos.slice(0, 6).map((v) => ({
    "@type": "VideoObject",
    name: v.title || "Mr. CAP TikTok",
    description: v.video_description || v.title || "Mr. CAP on TikTok",
    thumbnailUrl: v.cover_image_url,
    uploadDate: new Date(v.create_time * 1000).toISOString(),
    duration: `PT${Math.max(1, Math.round(v.duration))}S`,
    contentUrl: v.share_url,
    embedUrl: v.embed_link,
    interactionStatistic: {
      "@type": "InteractionCounter",
      interactionType: { "@type": "WatchAction" },
      userInteractionCount: v.view_count,
    },
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Mr. CAP on TikTok — Latest Videos, Live Feed & Updates</title>
        <meta
          name="description"
          content="Watch Mr. CAP's latest TikTok videos in a live feed pulled straight from @mrcapism. Follow, share, and remix the movement."
        />
        <link rel="canonical" href="https://mrcap1.com/tiktok" />
        <meta property="og:title" content="Mr. CAP on TikTok" />
        <meta property="og:description" content="Live TikTok feed from @mrcapism." />
        <meta property="og:url" content="https://mrcap1.com/tiktok" />
        {videoSchema.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({ "@context": "https://schema.org", "@graph": videoSchema })}
          </script>
        )}
      </Helmet>

      <Navigation />

      <main className="pt-24 pb-20">
        {/* Hero */}
        <section className="container mx-auto px-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card/40 rounded-3xl p-8 md:p-12 shadow-[0_4px_32px_hsl(0_0%_0%/0.4)]"
          >
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="relative">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.display_name}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-[0_4px_24px_hsl(0_0%_0%/0.5)]"
                  />
                ) : (
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted/30 animate-pulse" />
                )}
                <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-black flex items-center justify-center shadow-lg">
                  <TikTokIcon className="w-4 h-4 text-white" />
                </div>
              </div>

              <div className="flex-1">
                <span className="text-xs font-medium tracking-widest uppercase text-primary mb-1 block">
                  Live from TikTok
                </span>
                <h1 className="text-3xl md:text-5xl font-bold mb-1">
                  {profile?.display_name ?? "Mr. CAP"}
                </h1>
                <p className="text-sm text-muted-foreground mb-4">@mrcapism</p>
                {profile?.bio_description && (
                  <p className="text-sm text-muted-foreground/90 mb-4 max-w-xl">{profile.bio_description}</p>
                )}
                <div className="flex flex-wrap gap-6 text-sm">
                  <div>
                    <span className="block text-xl font-bold text-foreground">{profile ? formatCount(profile.follower_count) : "—"}</span>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">Followers</span>
                  </div>
                  <div>
                    <span className="block text-xl font-bold text-foreground">{profile ? formatCount(profile.likes_count) : "—"}</span>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">Likes</span>
                  </div>
                  <div>
                    <span className="block text-xl font-bold text-foreground">{profile ? formatCount(profile.video_count) : "—"}</span>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">Videos</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 md:items-end">
                <Button asChild size="lg" className="rounded-full gap-2 bg-white text-black hover:bg-white/90">
                  <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer" onClick={handleFollow}>
                    <TikTokIcon className="w-4 h-4" />
                    Follow on TikTok
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={handleCopy}>
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Share this hub"}
                </Button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Video grid */}
        <section className="container mx-auto px-4 mb-16">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-xs font-medium tracking-widest uppercase text-primary block mb-1">
                The Feed
              </span>
              <h2 className="text-2xl md:text-3xl font-bold">Latest Videos</h2>
            </div>
            {data?.fetched_at && (
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Live · refreshed {new Date(data.fetched_at).toLocaleTimeString()}
              </span>
            )}
          </div>

          {isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[9/16] rounded-2xl bg-card/40 animate-pulse" />
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-2xl bg-card/40 p-8 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                The TikTok feed is temporarily unavailable.
              </p>
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer">
                  View on TikTok <ExternalLink className="w-3 h-3 ml-1.5" />
                </a>
              </Button>
            </div>
          )}

          {!isLoading && videos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {videos.map((v) => (
                <VideoCard key={v.id} video={v} onClick={() => handleVideoClick(v)} />
              ))}
            </div>
          )}
        </section>

        {/* Caption generator */}
        <section className="container mx-auto px-4 mb-16">
          <div className="bg-card/40 rounded-3xl p-8 md:p-10 shadow-[0_4px_24px_hsl(0_0%_0%/0.3)]">
            <div className="grid md:grid-cols-5 gap-6 items-start">
              <div className="md:col-span-2">
                <span className="text-xs font-medium tracking-widest uppercase text-primary mb-2 block">
                  One-Tap Caption
                </span>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">Caption Generator</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Auto-builds a TikTok caption with hashtags and a UTM-tracked hub link, so every
                  share shows up in analytics. Tap shuffle for a new angle.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" className="rounded-full gap-2" onClick={copyCaption}>
                    {captionCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {captionCopied ? "Copied" : "Copy caption"}
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={regenerateCaption}>
                    <RefreshCw className="w-3.5 h-3.5" />
                    Shuffle
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={openTikTokWithCaption}>
                    <Wand2 className="w-3.5 h-3.5" />
                    Copy & open TikTok
                  </Button>
                </div>
              </div>
              <div className="md:col-span-3">
                <Textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={7}
                  className="bg-background/60 text-sm leading-relaxed font-mono resize-none"
                  aria-label="Generated TikTok caption"
                />
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-2">
                  Edit freely — link UTM stays attributed to tiktok / caption_generator.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Remix / share strip */}
        <section className="container mx-auto px-4 mb-16">
          <div className="bg-card/40 rounded-3xl p-8 md:p-10 shadow-[0_4px_24px_hsl(0_0%_0%/0.3)]">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <span className="text-xs font-medium tracking-widest uppercase text-primary mb-2 block">
                  Remix the Movement
                </span>
                <h3 className="text-2xl md:text-3xl font-bold mb-3">Stitch, Duet, Tag.</h3>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  Use any Mr. CAP track or visual in your TikTok. Tag <span className="text-foreground font-medium">@mrcapism</span> and use{" "}
                  <span className="text-foreground font-medium">#MrCAPLegacy</span> — the best stitches get reposted.
                </p>
              </div>
              <div className="flex flex-wrap md:flex-col gap-2 md:items-end">
                <Button asChild size="sm" className="rounded-full gap-2">
                  <a href="/music">
                    <Music2 className="w-3.5 h-3.5" />
                    Grab a track
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={handleCopy}>
                  <Share2 className="w-3.5 h-3.5" />
                  Share hub link
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
