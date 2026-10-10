/**
 * sitemap.xml from the same page list the build writes, so the two can't drift:
 * every indexable page once, under its canonical URL. Aliases (/about, /track/x,
 * /album/x) point at another page's canonical and stay out, as do noindex pages.
 */
import { escapeHtml } from "./render";
import { abs } from "./site";
import type { PageSpec } from "./pages";

export function sitemapUrls(pages: PageSpec[]): string[] {
  const urls: string[] = [];
  const seen = new Set<string>();
  for (const { path, entry } of pages) {
    if (entry.noIndex) continue;
    const own = abs(path);
    if ((entry.canonical ?? abs(entry.path)) !== own || seen.has(own)) continue;
    seen.add(own);
    urls.push(own);
  }
  return urls;
}

export const sitemapXml = (urls: string[]) =>
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((u) => `  <url><loc>${escapeHtml(u)}</loc></url>`),
    "</urlset>",
    "",
  ].join("\n");
