import { Helmet } from "react-helmet-async";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT, LOCALE, SITE_NAME, TWITTER_HANDLE, abs } from "@/seo/site";
import { noDashes } from "@/seo/text";
import { ROBOTS_NOINDEX, jsonLdDocument } from "@/seo/render";
import type { JsonLdNode, SeoEntry } from "@/seo/types";

interface SEOProps {
  /**
   * Preferred: an entry from src/seo/routes.ts (routeSeo("/music")) or a builder in
   * src/seo/builders.ts (trackSeo, albumSeo, ...). The build writes the same entry into
   * the route's static HTML, so the two always match.
   */
  entry?: SeoEntry;
  /** JSON-LD built from live data (a playlist, a list of posts), added to the entry's own */
  extraJsonLd?: JsonLdNode[];

  /** Older pages that are not on routes.ts yet pass their values directly. */
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  jsonLd?: object | object[];
  noIndex?: boolean;
}

const SEO = ({ entry, extraJsonLd, ...legacy }: SEOProps) => {
  const e: SeoEntry = entry ?? {
    path: legacy.canonical?.replace(/^https?:\/\/[^/]+/, "") || "/",
    canonical: legacy.canonical,
    title: legacy.title ?? SITE_NAME,
    description: legacy.description ?? "",
    ogType: legacy.ogType as SeoEntry["ogType"],
    ogImage: legacy.ogImage,
    h1: legacy.title ?? SITE_NAME,
    summary: [],
    noIndex: legacy.noIndex,
    jsonLd: legacy.jsonLd ? ((Array.isArray(legacy.jsonLd) ? legacy.jsonLd : [legacy.jsonLd]) as JsonLdNode[]) : undefined,
  };

  const url = e.canonical ?? abs(e.path);
  const title = noDashes(e.title);
  const description = noDashes(e.description);
  const ogTitle = noDashes(e.ogTitle ?? title);
  const ogDescription = noDashes(e.ogDescription ?? description);
  const image = e.ogImage ?? DEFAULT_OG_IMAGE;
  const imageAlt = e.ogImageAlt ?? (image === DEFAULT_OG_IMAGE ? DEFAULT_OG_IMAGE_ALT : ogTitle);
  // older pages may hand over a whole JSON-LD document; keep just its nodes
  const nodes = [...(e.jsonLd ?? []), ...(extraJsonLd ?? [])].flatMap((n) => {
    const doc = n as Record<string, unknown> & { "@graph"?: JsonLdNode[] };
    if (doc["@graph"]) return doc["@graph"];
    const { "@context": _context, ...rest } = doc;
    return [rest as JsonLdNode];
  });

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {/* indexable pages keep the sitewide robots tag from the HTML; only noindex pages override it */}
      {e.noIndex && <meta name="robots" content={ROBOTS_NOINDEX} />}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={LOCALE} />
      <meta property="og:type" content={e.ogType ?? "website"} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={imageAlt} />
      {image === DEFAULT_OG_IMAGE && <meta property="og:image:width" content="1200" />}
      {image === DEFAULT_OG_IMAGE && <meta property="og:image:height" content="630" />}
      {(e.extraMeta ?? []).map((m) => (
        <meta key={m.property} property={m.property} content={m.content} />
      ))}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={image} />

      {nodes.length > 0 && <script type="application/ld+json">{JSON.stringify(jsonLdDocument(nodes))}</script>}
    </Helmet>
  );
};

export default SEO;
