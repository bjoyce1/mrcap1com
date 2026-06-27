import type { CSSProperties } from "react";

export function Vinyl({ cover }: { cover: string }) {
  return <div className="vinyl" style={{ ["--label" as never]: `url(${cover})` } as CSSProperties} aria-hidden="true" />;
}

export default Vinyl;
