import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { toast } from "sonner";
import { trackEvent, trackSocialShare } from "@/components/GoogleAnalytics";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  url: string;
  title: string;
  description: string;
  className?: string;
}

const XIcon = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
  </svg>
);

const FacebookIcon = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073Z" />
  </svg>
);

const LinkedInIcon = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
  </svg>
);

export default function BiographyShareRow({ url, title, description, className = "" }: Props) {
  const [copied, setCopied] = useState(false);
  const shareText = `${title} — ${description}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const logShare = (platform: string) => {
    trackSocialShare(platform, "biography");
    trackEvent("social_share_click", { platform, content_title: title, content_type: "biography", slug: "who-is-mr-cap" });
    supabase.from("share_events").insert({
      platform,
      content_type: "biography",
      content_title: title,
      slug: "who-is-mr-cap",
    }).then();
  };

  const markCopied = () => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied", { description: url });
      markCopied();
    } catch {
      toast.error("Couldn't copy — long-press the link to copy manually.");
    }
    logShare("copy_link");
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: description, url });
        logShare("native_share");
        markCopied();
        return;
      } catch {
        /* user cancelled — fall through to copy */
      }
    }
    handleCopy();
  };

  const btn =
    "inline-flex items-center gap-2 rounded-none border border-[hsl(var(--foreground)/0.15)] px-4 py-2.5 font-mono text-[10px] tracking-[0.28em] uppercase text-muted-foreground hover:text-[hsl(var(--accent-gold))] hover:border-[hsl(var(--accent-gold)/0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent-gold))] focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors";
  const iconSize = "w-3.5 h-3.5";

  return (
    <div
      role="group"
      aria-label="Share this biography"
      className={`flex flex-wrap items-center gap-3 ${className}`}
    >
      <span className="font-mono text-[10px] tracking-[0.32em] uppercase text-[hsl(var(--accent-gold))]">
        Share · File No. 001
      </span>
      <button type="button" onClick={handleNativeShare} className={btn} aria-label="Share biography">
        {copied ? <Check className={`${iconSize} text-[hsl(var(--accent-gold))]`} /> : <Share2 className={iconSize} />}
        {copied ? "Shared" : "Share"}
      </button>
      <button type="button" onClick={handleCopy} className={btn} aria-label="Copy link to biography">
        <Link2 className={iconSize} />
        Copy Link
      </button>
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
        aria-label="Share on X (opens in a new tab)"
        onClick={() => logShare("twitter")}
      >
        <XIcon className={iconSize} />
        Post on X
      </a>
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
        aria-label="Share on Facebook (opens in a new tab)"
        onClick={() => logShare("facebook")}
      >
        <FacebookIcon className={iconSize} />
        Facebook
      </a>
      <a
        href={linkedInUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
        aria-label="Share on LinkedIn (opens in a new tab)"
        onClick={() => logShare("linkedin")}
      >
        <LinkedInIcon className={iconSize} />
        LinkedIn
      </a>
    </div>
  );
}
