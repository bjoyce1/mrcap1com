interface Props {
  credits?: string | null;
  producer?: string | null;
  featuredArtists?: string | null;
  writers?: string | null;
  className?: string;
}

function parseCredits(credits: string): { role: string; name: string }[] {
  return credits.split("\n").filter(Boolean).map((line) => {
    const [role, ...rest] = line.split(":");
    return rest.length > 0
      ? { role: role.trim(), name: rest.join(":").trim() }
      : { role: "Credit", name: role.trim() };
  });
}

export default function CreditsGrid({ credits, producer, featuredArtists, writers, className = "" }: Props) {
  const entries: { role: string; name: string }[] = [];

  if (producer) entries.push({ role: "Producer", name: producer });
  if (writers) entries.push({ role: "Writers", name: writers });
  if (featuredArtists) entries.push({ role: "Featuring", name: featuredArtists });
  if (credits) entries.push(...parseCredits(credits));

  if (entries.length === 0) return null;

  return (
    <div className={`border-t border-border/20 pt-6 ${className}`}>
      <h3 className="text-foreground font-medium text-sm mb-3">Credits</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
        {entries.map((e, i) => (
          <div key={i} className="flex items-baseline gap-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wider min-w-[80px]">{e.role}</span>
            <span className="text-sm text-foreground">{e.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
