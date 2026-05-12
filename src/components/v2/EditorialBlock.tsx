import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Reveal from "./Reveal";

interface EditorialBlockProps {
  eyebrow?: string;
  title: ReactNode;
  body?: ReactNode;
  image?: string;
  imageAlt?: string;
  /** Image side on desktop. */
  side?: "left" | "right";
  actions?: ReactNode;
  className?: string;
}

/** Asymmetric two-column editorial block: image + headline + body. */
export default function EditorialBlock({
  eyebrow,
  title,
  body,
  image,
  imageAlt = "",
  side = "right",
  actions,
  className,
}: EditorialBlockProps) {
  return (
    <section className={cn("v2-surface px-6 md:px-12 lg:px-20 py-24 md:py-40", className)}>
      <div
        className={cn(
          "grid gap-12 md:gap-20 items-center",
          image ? "md:grid-cols-12" : "md:grid-cols-1",
        )}
      >
        {image && side === "left" && (
          <Reveal className="md:col-span-6 lg:col-span-7">
            <div className="aspect-[4/5] overflow-hidden">
              <img src={image} alt={imageAlt} className="h-full w-full object-cover" loading="lazy" />
            </div>
          </Reveal>
        )}
        <Reveal
          className={cn(
            image ? "md:col-span-6 lg:col-span-5" : "max-w-3xl",
            side === "left" && image && "md:order-last",
          )}
          delay={0.1}
        >
          {eyebrow && <p className="v2-eyebrow mb-6">{eyebrow}</p>}
          <h2 className="v2-display text-v2-ink text-[clamp(2rem,5vw,4.5rem)] max-w-[18ch]">{title}</h2>
          {body && <div className="v2-body mt-8 text-base md:text-lg space-y-4 max-w-prose">{body}</div>}
          {actions && <div className="mt-10 flex flex-wrap gap-4">{actions}</div>}
        </Reveal>
        {image && side === "right" && (
          <Reveal className="md:col-span-6 lg:col-span-7" delay={0.05}>
            <div className="aspect-[4/5] overflow-hidden">
              <img src={image} alt={imageAlt} className="h-full w-full object-cover" loading="lazy" />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
