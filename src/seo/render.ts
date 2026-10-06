/**
 * Turns the built index.html into a route's own HTML: route-specific head tags, JSON-LD,
 * and a crawlable content block. Plain string work on our own template (no DOM needed),
 * so it runs in the Vite build and in unit tests alike.
 *
 * Tags that change per route carry data-rh="true" so react-helmet-async replaces them once
 * the app boots, instead of adding a second copy.
 */
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT, LOCALE, SITE_NAME, TWITTER_HANDLE, abs } from "./site";
import { noDashes } from "./text";
import type { JsonLdNode, SeoEntry } from "./types";

export const ROBOTS_INDEX = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
export const ROBOTS_NOINDEX = "noindex, nofollow";

export const BODY_START = "<!--seo:body-->";
export const BODY_END = "<!--/seo:body-->";

export const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** JSON that is safe inside <script>: no "</script>" or HTML comment openers can break out. */
export const scriptJson = (value: unknown) =>
  JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");

export const jsonLdDocument = (nodes: JsonLdNode[]) => ({ "@context": "https://schema.org", "@graph": nodes });

export interface RenderOptions {
  /** false for the root index.html, which is also the fallback for unknown paths */
  canonical?: boolean;
  /** nodes appended to the entry's own JSON-LD (lists built from live data) */
  extraJsonLd?: JsonLdNode[];
}

const canonicalOf = (e: SeoEntry) => e.canonical ?? abs(e.path);

/** The <head> block for one route. */
export function headTags(entry: SeoEntry, opts: RenderOptions = {}): string {
  const withCanonical = opts.canonical !== false;
  const url = canonicalOf(entry);
  const title = noDashes(entry.title);
  const description = noDashes(entry.description);
  const ogTitle = noDashes(entry.ogTitle ?? title);
  const ogDescription = noDashes(entry.ogDescription ?? description);
  const image = entry.ogImage ?? DEFAULT_OG_IMAGE;
  const imageAlt = entry.ogImageAlt ?? (image === DEFAULT_OG_IMAGE ? DEFAULT_OG_IMAGE_ALT : ogTitle);
  const nodes = [...(entry.jsonLd ?? []), ...(opts.extraJsonLd ?? [])];

  const meta = (attr: "name" | "property", key: string, content: string) =>
    `<meta data-rh="true" ${attr}="${key}" content="${escapeHtml(content)}" />`;

  return [
    `<title>${escapeHtml(title)}</title>`,
    meta("name", "description", description),
    withCanonical ? `<link data-rh="true" rel="canonical" href="${escapeHtml(url)}" />` : "",
    `<meta name="robots" content="${entry.noIndex ? ROBOTS_NOINDEX : ROBOTS_INDEX}" />`,
    meta("property", "og:site_name", SITE_NAME),
    meta("property", "og:locale", LOCALE),
    meta("property", "og:type", entry.ogType ?? "website"),
    meta("property", "og:title", ogTitle),
    meta("property", "og:description", ogDescription),
    withCanonical ? meta("property", "og:url", url) : "",
    meta("property", "og:image", image),
    meta("property", "og:image:alt", imageAlt),
    ...(image === DEFAULT_OG_IMAGE ? [meta("property", "og:image:width", "1200"), meta("property", "og:image:height", "630")] : []),
    ...(entry.extraMeta ?? []).map((m) => meta("property", m.property, m.content)),
    meta("name", "twitter:card", "summary_large_image"),
    meta("name", "twitter:site", TWITTER_HANDLE),
    meta("name", "twitter:title", ogTitle),
    meta("name", "twitter:description", ogDescription),
    meta("name", "twitter:image", image),
    nodes.length ? `<script data-rh="true" type="application/ld+json">${scriptJson(jsonLdDocument(nodes))}</script>` : "",
  ]
    .filter(Boolean)
    .map((t) => `    ${t}`)
    .join("\n");
}

/** The crawlable content block: the page's H1, its summary, and related links. */
export function bodyBlock(entry: SeoEntry): string {
  const p = (text: string) => `<p style="color:#bbb;line-height:1.7;margin:0 0 1rem">${escapeHtml(noDashes(text))}</p>`;
  const links = (entry.links ?? [])
    .map((l) => `<li style="margin:0.25rem 0"><a href="${escapeHtml(l.href)}" style="color:#D4A843">${escapeHtml(noDashes(l.label))}</a></li>`)
    .join("");
  return [
    `<h1 style="color:#D4A843;font-weight:700;font-size:2rem;margin:0 0 1rem">${escapeHtml(noDashes(entry.h1))}</h1>`,
    ...entry.summary.map(p),
    links ? `<ul style="list-style:none;padding:0;margin:1.5rem 0 0">${links}</ul>` : "",
  ]
    .filter(Boolean)
    .join("\n            ");
}

/** Tags in the template that the route block replaces. */
const REPLACED_HEAD = [
  /<title>[\s\S]*?<\/title>\s*/gi,
  /<meta\b[^>]*\b(?:name|property)\s*=\s*"(?:description|robots|googlebot|og:[^"]*|twitter:[^"]*|article:[^"]*)"[^>]*>\s*/gi,
  /<link\b[^>]*\brel\s*=\s*"canonical"[^>]*>\s*/gi,
  /<script\b[^>]*type\s*=\s*"application\/ld\+json"[^>]*>[\s\S]*?<\/script>\s*/gi,
];

export function renderPage(template: string, entry: SeoEntry, opts: RenderOptions = {}): string {
  const headEnd = template.indexOf("</head>");
  if (headEnd < 0) throw new Error("index.html has no </head>");
  let head = template.slice(0, headEnd);
  const rest = template.slice(headEnd);
  for (const re of REPLACED_HEAD) head = head.replace(re, "");
  head = `${head.trimEnd()}\n${headTags(entry, opts)}\n  `;

  let html = head + rest;
  const a = html.indexOf(BODY_START);
  const b = html.indexOf(BODY_END);
  if (a < 0 || b < a) throw new Error("index.html is missing the <!--seo:body--> markers");
  html = `${html.slice(0, a + BODY_START.length)}\n            ${bodyBlock(entry)}\n            ${html.slice(b)}`;
  return html;
}
