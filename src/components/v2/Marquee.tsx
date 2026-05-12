import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

/** Slow infinite marquee — pause on reduced motion. */
export default function Marquee({ children, speed = 40, className }: MarqueeProps) {
  return (
    <div className={cn("v2-rail-fade overflow-hidden", className)}>
      <div
        className="flex gap-12 whitespace-nowrap will-change-transform animate-[v2marquee_linear_infinite] motion-reduce:animate-none"
        style={{ animationDuration: `${speed}s` }}
      >
        <div className="flex gap-12 shrink-0">{children}</div>
        <div className="flex gap-12 shrink-0" aria-hidden>
          {children}
        </div>
      </div>
      <style>{`@keyframes v2marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
