/**
 * Every URL the build writes an HTML file for, with its SEO entry. Static routes and
 * their aliases come from routes.ts; data pages come from the repo's content files and
 * the catalog (live from Supabase/Sanity at build time, or the committed snapshot).
 */
import { blogPosts } from "../data/blogPosts";
import { allCities } from "../data/cities";
import { selfLove2024 } from "../data/selfLove2024";
import { pressPageData } from "../content/press";
import { ALIASES, ROUTES, routeSeo } from "./routes";
import {
  type AlbumLike,
  type BlogPostLike,
  type PressEntryLike,
  type TrackLike,
  albumPath,
  albumSeo,
  blogListLd,
  blogPostSeo,
  musicPlaylistLd,
  pressListLd,
  pressPostSeo,
  selfLoveStorySeo,
  trackPath,
  trackSeo,
} from "./builders";
import type { JsonLdNode, SeoEntry } from "./types";

export interface Catalog {
  tracks?: (TrackLike & { id?: string })[] | null;
  albums?: (AlbumLike & { id?: string })[] | null;
  blogPosts?: Record<string, unknown>[] | null;
  pressEntries?: Record<string, unknown>[] | null;
}

export interface PageSpec {
  /** where the file is served, e.g. "/music" -> music/index.html; "/" is the root index.html */
  path: string;
  entry: SeoEntry;
  extraJsonLd?: JsonLdNode[];
}

const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Sanity posts win over the repo's fallback copies, the same way the app chooses. */
function blogSource(catalog: Catalog): BlogPostLike[] {
  // shape of the Sanity blog-posts template (see supabase/functions/sanity-query)
  const sanity = (catalog.blogPosts ?? []) as { slug?: string | { current?: string }; title?: string; excerpt?: string; category?: string; publishedAt?: string; author?: string; tags?: string[] }[];
  if (sanity.length) {
    return sanity.map((s) => ({
      slug: (typeof s.slug === "string" ? s.slug : s.slug?.current) ?? "",
      title: s.title ?? "",
      excerpt: s.excerpt ?? "",
      category: s.category,
      date: (s.publishedAt ?? "").slice(0, 10),
      author: s.author,
      tags: s.tags,
    })).filter((p) => p.slug && p.title);
  }
  return blogPosts;
}

function pressSource(catalog: Catalog): PressEntryLike[] {
  const sanity = (catalog.pressEntries ?? []) as (Omit<PressEntryLike, "slug"> & { slug?: string })[];
  const list = sanity.length ? sanity.map((e) => ({ ...e, slug: slugify(e.title) })) : pressPageData.timeline.map((e) => ({ ...e, slug: e.slug || slugify(e.title) }));
  return list as PressEntryLike[];
}

export function collectPages(catalog: Catalog = {}): PageSpec[] {
  const pages: PageSpec[] = [];
  const tracks = catalog.tracks ?? [];
  const albums = catalog.albums ?? [];
  const blog = blogSource(catalog);
  const press = pressSource(catalog);

  const extraFor = (path: string): JsonLdNode[] | undefined => {
    if (path === "/music" && tracks.length) return [musicPlaylistLd(tracks)];
    if (path === "/blog" && blog.length) return [blogListLd(blog)];
    if (path === "/press" && press.length) return [pressListLd(press)];
    return undefined;
  };

  for (const entry of ROUTES) pages.push({ path: entry.path, entry, extraJsonLd: extraFor(entry.path) });
  // Private auth shells contain no release content and are never sitemap entries.
  for (const path of ["/greatday-preview", "/admin/greatday"]) pages.push({ path, entry: {
    path, title: "Private review | Mr. CAP", description: "Administrator access is required for this private Mr. CAP review. This restricted page offers no public release, audio, purchases or newsletter registration.",
    h1: "Private review", summary: ["Administrator access required."], noIndex: true,
  } });
  for (const [alias, target] of Object.entries(ALIASES)) pages.push({ path: alias, entry: routeSeo(target), extraJsonLd: extraFor(target) });

  // the city pages were one template with the name swapped; each old URL now serves the live page
  for (const city of allCities) pages.push({ path: `/city/${city.slug}`, entry: routeSeo("/live") });
  for (const story of selfLove2024) pages.push({ path: `/self-love/${story.year}/${story.slug}`, entry: selfLoveStorySeo(story) });
  for (const post of blog) pages.push({ path: `/blog/${post.slug}`, entry: blogPostSeo(post) });
  for (const entry of press) pages.push({ path: `/press/${entry.slug}`, entry: pressPostSeo(entry) });

  const albumById = new Map(albums.filter((a) => a.id).map((a) => [a.id as string, a]));
  for (const album of albums) {
    const entry = albumSeo(album, tracks.filter((t) => t.album_id && t.album_id === album.id));
    pages.push({ path: albumPath(album.slug), entry });
    pages.push({ path: `/album/${album.slug}`, entry }); // alias, same canonical
    // the vinyl page folded into its album page
    if (album.slug === "the-art-of-ism") for (const old of ["/vinyl", "/art-of-ism-vinyl"]) pages.push({ path: old, entry });
  }
  for (const track of tracks) {
    const entry = trackSeo(track, track.album_id ? albumById.get(track.album_id) : null);
    pages.push({ path: trackPath(track.slug), entry });
    pages.push({ path: `/track/${track.slug}`, entry }); // alias, same canonical
  }

  // one file per path; the first definition wins (static routes beat data pages)
  const seen = new Set<string>();
  return pages.filter((p) => (seen.has(p.path) ? false : (seen.add(p.path), true)));
}
