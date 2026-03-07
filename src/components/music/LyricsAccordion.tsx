import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  lyrics?: string | null;
  className?: string;
}

export default function LyricsAccordion({ lyrics, className = "" }: Props) {
  const [open, setOpen] = useState(false);

  if (!lyrics) return null;

  return (
    <div className={`border-t border-border/20 pt-6 ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left group"
      >
        <h3 className="text-foreground font-medium text-sm">Lyrics</h3>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <pre className="mt-4 text-sm text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed max-h-[60vh] overflow-y-auto">
          {lyrics}
        </pre>
      )}
    </div>
  );
}
