import { type Track } from "@/stores/playerStore";

/**
 * Decade pills derived from the catalog's real release years.
 * Archive-index navigation: 30 years of music, browsable by era.
 */

export function getEras(tracks: Track[]): string[] {
  const decades = new Set<number>();
  for (const t of tracks) {
    if (t.release_year) decades.add(Math.floor(t.release_year / 10) * 10);
  }
  return Array.from(decades)
    .sort((a, b) => b - a)
    .map((d) => `${d}s`);
}

export function filterByEra(tracks: Track[], era: string | null): Track[] {
  if (!era) return tracks;
  const decade = parseInt(era, 10);
  return tracks.filter(
    (t) => t.release_year && Math.floor(t.release_year / 10) * 10 === decade
  );
}

interface EraFilterProps {
  eras: string[];
  active: string | null;
  onChange: (era: string | null) => void;
}

const EraFilter = ({ eras, active, onChange }: EraFilterProps) => {
  if (eras.length < 2) return null;

  const pill = (label: string, value: string | null) => {
    const isActive = active === value;
    return (
      <button
        key={label}
        onClick={() => onChange(value)}
        className={
          "px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-widest transition-colors border " +
          (isActive
            ? "border-[hsl(var(--accent-gold))] text-[hsl(var(--accent-gold))] bg-[hsl(var(--accent-gold)/0.08)]"
            : "border-border/40 text-muted-foreground hover:text-foreground hover:border-[hsl(var(--accent-gold)/0.4)]")
        }
      >
        {label}
      </button>
    );
  };

  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {pill("All Years", null)}
      {eras.map((era) => pill(era, era))}
    </div>
  );
};

export default EraFilter;
