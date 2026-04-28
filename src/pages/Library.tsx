import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Download, Music, Disc3 } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { trackEvent } from "@/components/GoogleAnalytics";

interface PurchaseRow {
  id: string;
  item_type: "track" | "album";
  item_id: string;
  amount_cents: number;
  paid_at: string | null;
  title?: string;
  cover_art_url?: string | null;
  slug?: string;
  // for albums, this stays empty; for tracks, used directly
  trackIds?: string[]; // album expansion
}

const Library = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<PurchaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth?redirect=/library");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: purchases, error } = await supabase
        .from("purchases")
        .select("id, item_type, item_id, amount_cents, paid_at")
        .eq("user_id", user.id)
        .eq("status", "paid")
        .order("paid_at", { ascending: false });
      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const trackIds = (purchases || []).filter((p: any) => p.item_type === "track").map((p: any) => p.item_id);
      const albumIds = (purchases || []).filter((p: any) => p.item_type === "album").map((p: any) => p.item_id);

      const [{ data: tracks }, { data: albums }, { data: albumTracks }] = await Promise.all([
        trackIds.length
          ? supabase.from("tracks").select("id, title, slug, cover_art_url").in("id", trackIds)
          : Promise.resolve({ data: [] as any[] }),
        albumIds.length
          ? supabase.from("albums").select("id, title, slug, cover_art_url").in("id", albumIds)
          : Promise.resolve({ data: [] as any[] }),
        albumIds.length
          ? supabase.from("tracks").select("id, title, album_id").in("album_id", albumIds).eq("is_public", true)
          : Promise.resolve({ data: [] as any[] }),
      ]);

      const trackMap = new Map((tracks || []).map((t: any) => [t.id, t]));
      const albumMap = new Map((albums || []).map((a: any) => [a.id, a]));
      const albumTrackMap = new Map<string, string[]>();
      for (const t of albumTracks || []) {
        const arr = albumTrackMap.get(t.album_id) || [];
        arr.push(t.id);
        albumTrackMap.set(t.album_id, arr);
      }

      const enriched: PurchaseRow[] = (purchases || []).map((p: any) => {
        if (p.item_type === "track") {
          const t = trackMap.get(p.item_id);
          return {
            ...p,
            title: t?.title || "Untitled",
            cover_art_url: t?.cover_art_url,
            slug: t?.slug,
          };
        } else {
          const a = albumMap.get(p.item_id);
          return {
            ...p,
            title: a?.title || "Untitled Album",
            cover_art_url: a?.cover_art_url,
            slug: a?.slug,
            trackIds: albumTrackMap.get(p.item_id) || [],
          };
        }
      });

      setItems(enriched);
      setLoading(false);
    })();
  }, [user]);

  const downloadTrack = async (trackId: string, label: string) => {
    setDownloadingId(trackId);
    try {
      const { data, error } = await supabase.functions.invoke("audio-download", {
        body: { track_id: trackId },
      });
      if (error || !data?.url) {
        toast({ title: "Download failed", description: error?.message || "Try again.", variant: "destructive" });
        return;
      }
      trackEvent("track_download", { track_id: trackId });
      window.location.href = data.url;
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Your Library | Mr. CAP</title>
        <meta name="description" content="Download the music you've purchased from Mr. CAP." />
        <meta name="robots" content="noindex" />
      </Helmet>
      <Navigation />

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Your Library</h1>
          <p className="text-muted-foreground mt-2">
            Music you've purchased. Click download to get a high-quality file.
          </p>
        </header>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : items.length === 0 ? (
          <div className="rounded-xl bg-card p-8 shadow-[0_4px_24px_hsl(0_0%_0%/0.3)] text-center">
            <Music className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium">Nothing here yet</p>
            <p className="text-muted-foreground mt-1">Purchased music will appear here.</p>
            <Button asChild className="mt-6">
              <Link to="/discography">Browse Discography</Link>
            </Button>
          </div>
        ) : (
          <ul className="space-y-4">
            {items.map((it) => (
              <li
                key={it.id}
                className="rounded-xl bg-card p-4 md:p-6 shadow-[0_4px_24px_hsl(0_0%_0%/0.3)]"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={it.cover_art_url || "/placeholder.svg"}
                    alt={it.title}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                      {it.item_type === "album" ? <Disc3 className="w-3 h-3" /> : <Music className="w-3 h-3" />}
                      {it.item_type}
                    </div>
                    <h2 className="text-lg font-semibold truncate">{it.title}</h2>
                    <p className="text-xs text-muted-foreground">
                      Purchased {it.paid_at ? new Date(it.paid_at).toLocaleDateString() : "—"} · ${(it.amount_cents / 100).toFixed(2)}
                    </p>
                  </div>
                  {it.item_type === "track" && (
                    <Button
                      onClick={() => downloadTrack(it.item_id, it.title!)}
                      disabled={downloadingId === it.item_id}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {downloadingId === it.item_id ? "Preparing…" : "Download"}
                    </Button>
                  )}
                </div>

                {it.item_type === "album" && it.trackIds && it.trackIds.length > 0 && (
                  <ul className="mt-4 divide-y divide-border/40">
                    {it.trackIds.map((tid) => (
                      <AlbumTrackRow
                        key={tid}
                        trackId={tid}
                        downloading={downloadingId === tid}
                        onDownload={(label) => downloadTrack(tid, label)}
                      />
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>

      <Footer />
    </div>
  );
};

const AlbumTrackRow = ({
  trackId,
  downloading,
  onDownload,
}: {
  trackId: string;
  downloading: boolean;
  onDownload: (label: string) => void;
}) => {
  const [title, setTitle] = useState<string>("");
  useEffect(() => {
    supabase
      .from("tracks")
      .select("title")
      .eq("id", trackId)
      .maybeSingle()
      .then(({ data }) => setTitle(data?.title || "Untitled"));
  }, [trackId]);
  return (
    <li className="flex items-center justify-between py-2">
      <span className="text-sm">{title || "…"}</span>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onDownload(title)}
        disabled={downloading}
      >
        <Download className="w-3.5 h-3.5 mr-1.5" />
        {downloading ? "Preparing…" : "Download"}
      </Button>
    </li>
  );
};

export default Library;
