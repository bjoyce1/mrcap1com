import { ExternalLink } from "lucide-react";

interface DSPLink {
  label: string;
  url: string;
  color: string;
}

interface Props {
  spotifyUrl?: string | null;
  appleMusicUrl?: string | null;
  youtubeMusicUrl?: string | null;
  tidalUrl?: string | null;
  amazonMusicUrl?: string | null;
  soundcloudUrl?: string | null;
  className?: string;
}

export default function DSPLinks({ spotifyUrl, appleMusicUrl, youtubeMusicUrl, tidalUrl, amazonMusicUrl, soundcloudUrl, className = "" }: Props) {
  const links: DSPLink[] = [
    spotifyUrl && { label: "Spotify", url: spotifyUrl, color: "hover:bg-[#1DB954]/10 hover:text-[#1DB954]" },
    appleMusicUrl && { label: "Apple Music", url: appleMusicUrl, color: "hover:bg-[#FA243C]/10 hover:text-[#FA243C]" },
    youtubeMusicUrl && { label: "YouTube Music", url: youtubeMusicUrl, color: "hover:bg-[#FF0000]/10 hover:text-[#FF0000]" },
    tidalUrl && { label: "Tidal", url: tidalUrl, color: "hover:bg-[#000000]/10" },
    amazonMusicUrl && { label: "Amazon Music", url: amazonMusicUrl, color: "hover:bg-[#FF9900]/10 hover:text-[#FF9900]" },
    soundcloudUrl && { label: "SoundCloud", url: soundcloudUrl, color: "hover:bg-[#FF5500]/10 hover:text-[#FF5500]" },
  ].filter(Boolean) as DSPLink[];

  if (links.length === 0) return null;

  return (
    <div className={`border-t border-border/20 pt-6 ${className}`}>
      <h3 className="text-foreground font-medium text-sm mb-3">Listen on</h3>
      <div className="flex flex-wrap gap-2">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 text-sm border border-border/30 rounded-full px-4 py-2 text-muted-foreground transition-colors ${l.color}`}
          >
            {l.label}
            <ExternalLink className="w-3 h-3" />
          </a>
        ))}
      </div>
    </div>
  );
}
