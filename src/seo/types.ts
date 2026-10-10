export interface SeoLink {
  href: string;
  label: string;
}

export type JsonLdNode = Record<string, unknown>;

/**
 * Everything one URL needs for search and link previews. The React <SEO> component
 * and the build-time HTML pages both read these, so the two can't drift.
 */
export interface SeoEntry {
  /** canonical path, e.g. "/music" */
  path: string;
  /** under 60 characters, " | " between parts */
  title: string;
  /** 140 to 160 characters */
  description: string;
  /** absolute URL; defaults to SITE_URL + path */
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogType?: "website" | "article" | "profile" | "music.song" | "music.album" | "book" | "product";
  /** the page's main heading, as the page itself shows it */
  h1: string;
  /** 2 to 4 short paragraphs from the page's own copy, for the no-JavaScript fallback */
  summary: string[];
  /** related pages, linked from the no-JavaScript fallback */
  links?: SeoLink[];
  /** schema.org nodes; combined into one @graph */
  jsonLd?: JsonLdNode[];
  noIndex?: boolean;
  /** extra <meta property="article:*"> etc. */
  extraMeta?: { property: string; content: string }[];
}
