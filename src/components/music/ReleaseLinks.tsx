import { Link } from "react-router-dom";
import { Mic2, Video, Newspaper, Calendar, Mail } from "lucide-react";

interface Props {
  trackSlug?: string;
  albumSlug?: string;
  className?: string;
}

/**
 * Cross-links block for release pages.
 * Links to press, videos, blog, booking, and newsletter.
 */
export default function ReleaseLinks({ trackSlug, albumSlug, className = "" }: Props) {
  return (
    <div className={`border-t border-border/20 pt-6 ${className}`}>
      <h3 className="text-foreground font-medium text-sm mb-3">Explore</h3>
      <div className="flex flex-wrap gap-3">
        <Link to="/press" className="inline-flex items-center gap-1.5 text-sm border border-border/30 rounded-full px-4 py-2 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
          <Newspaper className="w-3.5 h-3.5" /> Press
        </Link>
        <Link to="/videos" className="inline-flex items-center gap-1.5 text-sm border border-border/30 rounded-full px-4 py-2 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
          <Video className="w-3.5 h-3.5" /> Videos
        </Link>
        <Link to="/live" className="inline-flex items-center gap-1.5 text-sm border border-border/30 rounded-full px-4 py-2 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
          <Calendar className="w-3.5 h-3.5" /> Live Dates
        </Link>
        <Link to="/booking" className="inline-flex items-center gap-1.5 text-sm border border-border/30 rounded-full px-4 py-2 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
          <Mic2 className="w-3.5 h-3.5" /> Booking
        </Link>
        <Link to="/about" className="inline-flex items-center gap-1.5 text-sm border border-border/30 rounded-full px-4 py-2 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
          <Mail className="w-3.5 h-3.5" /> About
        </Link>
      </div>
    </div>
  );
}
