import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeader({ eyebrow, title, action, align = "left", className }: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16",
        align === "center" && "items-center text-center md:flex-col md:items-center md:justify-center",
        className,
      )}
    >
      <div>
        {eyebrow && <p className="v2-eyebrow mb-4">{eyebrow}</p>}
        <h2 className="v2-display text-v2-ink text-[clamp(1.75rem,4vw,3.5rem)] max-w-[20ch]">{title}</h2>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
