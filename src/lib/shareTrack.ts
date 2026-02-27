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
export async function shareMusic({ title, artist, slug, type = "track" }: ShareOptions) {
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const url = `https://${projectId}.supabase.co/functions/v1/og-share?type=${type}&slug=${encodeURIComponent(slug)}`;
  const text = `${title} — ${artist}`;

  if (navigator.share) {
    try {
      await navigator.share({ title: text, url });
      toast.success("Shared!", { description: `${text}` });
    } catch {
      // User cancelled share sheet — do nothing
    }
  } else {
    await navigator.clipboard.writeText(url).catch(() => {});
    toast.success("Link copied!", { description: `${text} — share it everywhere.` });
  }
}
