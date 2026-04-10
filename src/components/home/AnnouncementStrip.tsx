import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Disc3, X } from "lucide-react";

const STORAGE_KEY = "announcementDismissed";

const AnnouncementStrip = () => {
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) === "true"
  );

  if (dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setDismissed(true);
  };

  return (
    <div className="relative z-50 bg-primary/10 border-b border-primary/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-sm">
        <Disc3 className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: "3s" }} />
        <span className="text-foreground/80 font-medium">
          <span className="text-primary font-semibold">NEW:</span>{" "}
          "The Ties That Bind Us" — SPC Group Album Out Now
        </span>
        <Link
          to="/listen"
          className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-semibold transition-colors"
        >
          Listen <ArrowRight className="w-3 h-3" />
        </Link>
        <button
          onClick={handleDismiss}
          className="ml-2 p-1 text-foreground/40 hover:text-foreground/80 transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementStrip;
