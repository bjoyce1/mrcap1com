interface Fact {
  label: string;
  value: string;
}

interface Props {
  artist?: string;
  releaseType?: string;
  releaseYear?: number | null;
  trackCount?: number;
  totalDuration?: string;
  producer?: string | null;
  writers?: string | null;
  featuredArtists?: string | null;
  credits?: string | null;
  isrc?: string | null;
  className?: string;
}

export default function ReleaseFactsGrid({
  artist,
  releaseType,
  releaseYear,
  trackCount,
  totalDuration,
  producer,
  writers,
  featuredArtists,
  credits,
  isrc,
  className = "",
}: Props) {
  const facts: Fact[] = [
    artist && { label: "Artist", value: artist },
    releaseType && { label: "Format", value: releaseType },
    releaseYear && { label: "Released", value: String(releaseYear) },
    trackCount && { label: "Tracks", value: String(trackCount) },
    totalDuration && { label: "Duration", value: totalDuration },
    producer && { label: "Producer", value: producer },
    writers && { label: "Writers", value: writers },
    featuredArtists && { label: "Featuring", value: featuredArtists },
    isrc && { label: "ISRC", value: isrc },
  ].filter(Boolean) as Fact[];

  // Parse freeform credits into additional facts
  if (credits) {
    credits.split("\n").filter(Boolean).forEach((line) => {
      const [role, ...rest] = line.split(":");
      if (rest.length > 0 && !facts.some((f) => f.label.toLowerCase() === role.trim().toLowerCase())) {
        facts.push({ label: role.trim(), value: rest.join(":").trim() });
      }
    });
  }

  if (facts.length === 0) return null;

  return (
    <div className={`border-t border-border/20 pt-6 ${className}`}>
      <h3 className="text-foreground font-medium text-sm mb-4 uppercase tracking-wider">Release Facts</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {facts.map((f, i) => (
          <div key={i} className="bg-card/30 border border-border/10 rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{f.label}</p>
            <p className="text-sm text-foreground font-medium truncate">{f.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
