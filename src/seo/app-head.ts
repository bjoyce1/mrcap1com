/**
 * Home-screen app details for one page. index.html carries the site's own manifest and icon;
 * a page with an `app` entry (SPC Legends) swaps them so "Add to Home Screen" installs that page
 * as its own app. The build writes the swapped tags into the page's static HTML, and the SEO
 * component swaps them in the browser when someone arrives by client-side navigation.
 */
import type { AppHead } from "./types";

/** The site's own install details, as index.html has them. Other pages go back to these. */
export const SITE_APP_HEAD = { manifest: "/manifest.json", icon: "/icons/icon-192.png", themeColor: "#110B18" } as const;

/** Tags in the template that an app head replaces. */
export const APP_HEAD_TAGS = [
  /<link\b[^>]*\brel\s*=\s*"(?:manifest|apple-touch-icon)"[^>]*>\s*/gi,
  /<meta\b[^>]*\bname\s*=\s*"(?:theme-color|apple-mobile-web-app-title|application-name)"[^>]*>\s*/gi,
];

const attr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

export function appHeadTags(app: AppHead): string[] {
  return [
    `<link rel="manifest" href="${attr(app.manifest)}" />`,
    `<link rel="apple-touch-icon" href="${attr(app.icon)}" />`,
    `<meta name="theme-color" content="${attr(app.themeColor)}" />`,
    `<meta name="apple-mobile-web-app-title" content="${attr(app.title)}" />`,
    `<meta name="application-name" content="${attr(app.title)}" />`,
  ];
}

function upsert(doc: Document, selector: string, make: () => HTMLElement, key: "href" | "content", value: string | null): void {
  let el = doc.head.querySelector<HTMLElement>(selector);
  if (value === null) {
    el?.remove();
    return;
  }
  if (!el) {
    el = make();
    doc.head.appendChild(el);
  }
  el.setAttribute(key, value);
}

function write(doc: Document, head: { manifest: string; icon: string; themeColor: string; title: string | null }): void {
  const link = (rel: string) => () => Object.assign(doc.createElement("link"), { rel });
  const meta = (name: string) => () => Object.assign(doc.createElement("meta"), { name });
  upsert(doc, 'link[rel="manifest"]', link("manifest"), "href", head.manifest);
  upsert(doc, 'link[rel="apple-touch-icon"]', link("apple-touch-icon"), "href", head.icon);
  upsert(doc, 'meta[name="theme-color"]', meta("theme-color"), "content", head.themeColor);
  upsert(doc, 'meta[name="apple-mobile-web-app-title"]', meta("apple-mobile-web-app-title"), "content", head.title);
  upsert(doc, 'meta[name="application-name"]', meta("application-name"), "content", head.title);
}

/** Puts the page's app details in the live <head>. The returned function restores the site's own. */
export function applyAppHead(doc: Document, app: AppHead): () => void {
  write(doc, app);
  return () => write(doc, { ...SITE_APP_HEAD, title: null });
}
