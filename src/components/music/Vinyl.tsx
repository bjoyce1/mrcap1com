import type { CSSProperties } from "react";
import { coverThumb } from "./catalog";

/** The record that lives behind a sleeve. The label is the cover art (its smallest copy). */
export function Vinyl({ cover, className = "", style }: { cover: string | null | undefined; className?: string; style?: CSSProperties }) {
  return (
    <div
      className={`vinyl ${className}`}
      style={{ ["--label" as never]: `url("${coverThumb(cover)}")`, ...style } as CSSProperties}
      aria-hidden="true"
    />
  );
}

export default Vinyl;
