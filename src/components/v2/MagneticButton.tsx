import { ReactNode, useRef, MouseEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  variant?: "primary" | "ghost" | "outline";
  href?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
}

const variants = {
  primary:
    "bg-v2-accent text-v2-accent-ink hover:bg-v2-accent-hi",
  outline:
    "border border-v2-ink/40 text-v2-ink hover:border-v2-ink hover:bg-v2-ink hover:text-v2-bg",
  ghost:
    "text-v2-ink hover:text-v2-accent",
};

/** Cursor-magnetic CTA with slow editorial hover. */
export default function MagneticButton({
  children,
  variant = "primary",
  href,
  onClick,
  className,
  type = "button",
}: MagneticButtonProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.4}px)`;
  };
  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = "translate(0,0)";
  };

  const inner = (
    <span
      ref={ref}
      className="inline-block transition-transform duration-500 ease-out v2-link-sweep"
    >
      {children}
    </span>
  );

  const cls = cn(
    "inline-flex items-center justify-center gap-2 px-7 py-4 v2-eyebrow !text-[0.72rem] !text-current transition-colors duration-500 ease-out cursor-pointer",
    variants[variant],
    className,
  );

  if (href) {
    return (
      <a href={href} className={cls} onMouseMove={handleMove} onMouseLeave={handleLeave}>
        {inner}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls} onMouseMove={handleMove} onMouseLeave={handleLeave}>
      {inner}
    </button>
  );
}
