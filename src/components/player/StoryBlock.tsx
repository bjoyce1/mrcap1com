import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

/** Maps a release year to an era label + short contextual note. */
function getEraContext(year: number | null | undefined): { era: string; note: string } | null {
  if (!year) return null;
  if (year <= 2004) return { era: "Early Houston Roots", note: "From the streets of Third Ward to the mic — this era laid the foundation." };
  if (year <= 2007) return { era: "South Park Coalition Era", note: "Recorded during Mr. CAP's formative years as an original SPC member." };
  if (year <= 2012) return { era: "Independent Grind", note: "A period of relentless output, building a catalog brick by brick." };
  if (year <= 2016) return { era: "Business & Brand Building", note: "Music meets entrepreneurship — CAP Distributions and Mortuary Media take shape." };
  if (year <= 2026) return { era: "The Art of ISM", note: "A creative peak — narrative-driven lyricism meets major distribution through Sony / The Orchard." };
  if (year <= 2022) return { era: "Documentary & Legacy", note: "Shifting focus to storytelling beyond music — film, recognition, and cultural preservation." };
  return { era: "Web3 & Ownership", note: "Pioneering digital ownership — NFTs, first-party streaming, and direct-to-fan infrastructure." };
}

interface StoryBlockProps {
  description?: string | null;
  releaseYear?: number | null;
  className?: string;
}

const StoryBlock = ({ description, releaseYear, className = "" }: StoryBlockProps) => {
  const era = getEraContext(releaseYear);

  if (!description && !era) return null;

  return (
    <div className={`border-t border-border/20 pt-6 ${className}`}>
      <h3 className="text-foreground font-medium mb-3 flex items-center gap-2 text-sm">
        <BookOpen className="w-4 h-4 text-primary" />
        The Story Behind This
      </h3>
      {era && (
        <div className="mb-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium tracking-widest uppercase bg-primary/10 text-primary px-2.5 py-1 rounded-full">
            {era.era}
          </span>
          <span className="text-xs text-muted-foreground italic">{era.note}</span>
        </div>
      )}
      {description && (
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{description}</p>
      )}
      <Link to="/legacy" className="inline-block mt-3 text-xs text-primary hover:underline">
        Explore Mr. CAP's full timeline →
      </Link>
    </div>
  );
};

export default StoryBlock;
