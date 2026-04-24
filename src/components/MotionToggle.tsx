import { useEffect, useState } from "react";
import { FilmIcon, Pause, Play } from "lucide-react";
import { useMotionPreference } from "@/stores/motionPreferenceStore";
import { cn } from "@/lib/utils";

interface MotionToggleProps {
  /** Position variant. Defaults to a fixed bottom-left pill. */
  variant?: "fixed" | "inline";
  className?: string;
}

/**
 * Floating pill that lets visitors disable background motion (autoplaying
 * section videos). Persists to localStorage via `useMotionPreference`.
 *
 * Visible site-wide; hides itself on touch screens that already have the
 * mobile bottom nav by sitting in the bottom-left away from common controls.
 */
const MotionToggle = ({ variant = "fixed", className }: MotionToggleProps) => {
  const { motionEnabled, toggleMotion } = useMotionPreference();
  const [mounted, setMounted] = useState(false);

  // Avoid SSR/prerender hydration flash since the initial value depends on
  // localStorage + matchMedia (both browser-only).
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const label = motionEnabled ? "Pause background motion" : "Resume background motion";
  const Icon = motionEnabled ? Pause : Play;

  return (
    <button
      type="button"
      onClick={toggleMotion}
      aria-pressed={!motionEnabled}
      aria-label={label}
      title={label}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium uppercase tracking-widest",
        "bg-background/70 text-foreground/90 backdrop-blur-md",
        "shadow-[0_4px_24px_hsl(0_0%_0%/0.3)] transition hover:bg-background/90 hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        variant === "fixed" &&
          "fixed bottom-20 left-4 z-[60] md:bottom-6 md:left-6",
        className,
      )}
    >
      <span className="relative flex h-4 w-4 items-center justify-center">
        <FilmIcon
          className={cn(
            "h-4 w-4 transition-opacity",
            motionEnabled ? "opacity-100" : "opacity-50",
          )}
          aria-hidden="true"
        />
        <Icon
          className="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full bg-background p-[1px]"
          aria-hidden="true"
        />
      </span>
      <span className="hidden sm:inline">
        {motionEnabled ? "Motion On" : "Motion Off"}
      </span>
    </button>
  );
};

export default MotionToggle;
