import { Link } from "react-router-dom";
import { useAlbums, useAllTracks } from "@/hooks/useStreamingData";
import type { Track, Album } from "@/stores/playerStore";

interface Props {
  currentTrackId?: string;
  currentAlbumId?: string;
  className?: string;
  eyebrow?: string;
  title?: string;
}

export default function RelatedReleases({ currentTrackId, currentAlbumId, className = "", eyebrow, title }: Props) {
  const { data: albums } = useAlbums();
  const { data: tracks } = useAllTracks();

  const otherAlbums = albums?.filter((a) => a.id !== currentAlbumId).slice(0, 4) || [];
  const otherTracks = tracks?.filter((t) => t.id !== currentTrackId && !t.album_id).slice(0, 4) || [];

  if (otherAlbums.length === 0 && otherTracks.length === 0) return null;

  return (
    <section className={`border-t border-border/20 pt-8 ${className}`}>
      {eyebrow && <span className="catalog-stamp mb-3 block">{eyebrow}</span>}
      <h3 className="text-foreground font-display text-lg mb-4">{title || "More from Mr. CAP"}</h3>
      {eyebrow && <div className="archive-rule mt-4 mb-4 w-24" />}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {otherAlbums.map((a) => (
          <Link key={a.id} to={`/album/${a.slug}`} className="group">
            <img src={a.cover_art_url || "/placeholder.svg"} alt={a.title} className="w-full aspect-square rounded-lg object-cover border border-border/20 group-hover:border-primary/40 transition-colors" />
            <p className="text-sm text-foreground mt-2 truncate">{a.title}</p>
            <p className="text-xs text-muted-foreground font-mono">{a.release_year}</p>
          </Link>
        ))}
        {otherTracks.map((t) => (
          <Link key={t.id} to={`/track/${t.slug}`} className="group">
            <img src={t.cover_art_url || "/placeholder.svg"} alt={t.title} className="w-full aspect-square rounded-lg object-cover border border-border/20 group-hover:border-primary/40 transition-colors" />
            <p className="text-sm text-foreground mt-2 truncate">{t.title}</p>
            <p className="text-xs text-muted-foreground font-mono">{t.release_year} · Single</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
