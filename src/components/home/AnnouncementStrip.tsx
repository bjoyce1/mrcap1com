import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Disc3, X } from "lucide-react";

const STORAGE_KEY = "announcementDismissed";

const AnnouncementStrip = () => {
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) === "true"
  );
  const stripRef = useRef<HTMLDivElement>(null);

  // Pin the strip above the fixed header by publishing its height as a CSS
  // variable; the header offsets itself with it and resets when it unmounts.
  useEffect(() => {
    if (dismissed) return;
    const strip = stripRef.current;
    if (!strip) return;

    const publish = () =>
      document.documentElement.style.setProperty(
        "--announcement-offset",
        `${strip.offsetHeight}px`
      );
    publish();

    const observer = new ResizeObserver(publish);
    observer.observe(strip);
    return () => {
      observer.disconnect();
      document.documentElement.style.setProperty("--announcement-offset", "0px");
    };
  }, [dismissed]);

  if (dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setDismissed(true);
  };

  return (
    <div
      ref={stripRef}
      className="fixed top-0 left-0 right-0 z-[60] bg-primary/10 border-b border-primary/20 backdrop-blur-sm overflow-hidden"
    >
      {/* Slow horizontal shimmer */}
      <div
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-[announcement-shimmer_8s_linear_infinite]"
        aria-hidden="true"
      />
      <style>{`
        @keyframes announcement-shimmer {
          0% { transform: translateX(0); }
          100% { transform: translateX(500%); }
        }
      `}</style>
      <div className="relative max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-sm">
        <Disc3 className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: "3s" }} />
        <span className="text-foreground/80 font-medium">
          <span className="text-primary font-semibold">NEW:</span>{" "}
          "The Ties That Bind Us": SPC Group Album Out Now
        </span>
        <Link
          to="/mr-cap-discography"
          className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-semibold transition-colors"
        >
          Listen <ArrowRight className="w-3 h-3" />
        </Link>
        <button
          onClick={handleDismiss}
          className="ml-2 p-1 text-foreground/70 hover:text-foreground transition-colors"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementStrip;
