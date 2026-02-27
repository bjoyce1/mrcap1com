import { toast } from "sonner";

interface ShareOptions {
  title: string;
  artist: string;
  slug: string;
  type?: "track" | "album";
}

/**
 * Share a track or album via Web Share API (mobile) or clipboard fallback.
 * Shows a toast on success.
 */
export function shareMusic({ title, artist, slug, type = "track" }: ShareOptions) {
  const url = `https://mrcap1.com/${type}/${slug}`;
  const text = `${title} — ${artist}`;

  if (navigator.share) {
    navigator.share({ title: text, url }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).catch(() => {});
  }

  toast.success("Link copied!", { description: `${text} — share it everywhere.` });
}
