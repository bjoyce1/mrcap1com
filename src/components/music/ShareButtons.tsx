import { Share2, Copy, Check, Link2 } from "lucide-react";
import { useState } from "react";
import { shareMusic } from "@/lib/shareTrack";
import { trackEvent } from "@/components/GoogleAnalytics";

interface Props {
  title: string;
  artist: string;
  slug: string;
  type?: "track" | "album";
  className?: string;
}

export default function ShareButtons({ title, artist, slug, type = "track", className = "" }: Props) {
  const [copied, setCopied] = useState(false);
  const url = type === "album"
    ? `https://mrcap1.com/albums/${slug}`
    : `https://mrcap1.com/music/${slug}`;

  const handleShare = () => {
    shareMusic({ title, artist, slug });
    trackEvent("share_track", { page_path: url });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`🎵 "${title}" by ${artist}`)}&url=${encodeURIComponent(url)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 text-sm border border-border/30 rounded-full px-4 py-2 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Share2 className="w-3.5 h-3.5" />}
        {copied ? "Shared!" : "Share"}
      </button>
      <button
        onClick={handleCopyLink}
        className="inline-flex items-center gap-1.5 text-sm border border-border/30 rounded-full px-4 py-2 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
      >
        <Link2 className="w-3.5 h-3.5" /> Copy Link
      </button>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm border border-border/30 rounded-full px-4 py-2 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
      >
        𝕏 Post
      </a>
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm border border-border/30 rounded-full px-4 py-2 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
      >
        Facebook
      </a>
    </div>
  );
}
