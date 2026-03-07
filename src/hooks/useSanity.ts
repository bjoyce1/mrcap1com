import { useQuery } from "@tanstack/react-query";
import { sanityQuery } from "@/lib/sanity";

/**
 * Generic hook to run a GROQ query against Sanity.
 * Caches via react-query with the provided key.
 */
export function useSanityQuery<T = unknown>(
  key: string[],
  query: string,
  params?: Record<string, unknown>,
  options?: { enabled?: boolean; staleTime?: number }
) {
  return useQuery({
    queryKey: ["sanity", ...key],
    queryFn: () => sanityQuery<T>(query, params),
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 1000 * 60 * 5, // 5 min default
  });
}

// ── Pre-built queries for common content types ──

/** Fetch all published blog posts, newest first */
export function useSanityBlogPosts() {
  return useSanityQuery<SanityBlogPost[]>(
    ["blog-posts"],
    `*[_type == "blogPost" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
      _id, title, slug, excerpt, publishedAt, category,
      "coverImage": coverImage.asset->url,
      author, tags, readTime
    }`
  );
}

/** Fetch a single blog post by slug */
export function useSanityBlogPost(slug: string) {
  return useSanityQuery<SanityBlogPost | null>(
    ["blog-post", slug],
    `*[_type == "blogPost" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
      _id, title, slug, excerpt, publishedAt, category,
      "coverImage": coverImage.asset->url,
      author, tags, readTime, body
    }`,
    { slug },
    { enabled: !!slug }
  );
}

/** Fetch upcoming events */
export function useSanityEvents() {
  return useSanityQuery<SanityEvent[]>(
    ["events"],
    `*[_type == "event" && date >= now() && !(_id in path("drafts.**"))] | order(date asc) {
      _id, title, date, venue, city, state, ticketUrl, description,
      "flyer": flyer.asset->url
    }`
  );
}

/** Fetch music releases */
export function useSanityReleases() {
  return useSanityQuery<SanityRelease[]>(
    ["releases"],
    `*[_type == "release" && !(_id in path("drafts.**"))] | order(releaseDate desc) {
      _id, title, slug, releaseDate, type, description,
      "coverArt": coverArt.asset->url,
      spotifyUrl, appleMusicUrl, youtubeMusicUrl
    }`
  );
}

// ── Type definitions matching expected Sanity schemas ──

export interface SanityBlogPost {
  _id: string;
  title: string;
  slug: { current: string } | string;
  excerpt?: string;
  publishedAt: string;
  category?: string;
  coverImage?: string;
  author?: string;
  tags?: string[];
  readTime?: number;
  body?: unknown; // Portable Text blocks
}

export interface SanityEvent {
  _id: string;
  title: string;
  date: string;
  venue?: string;
  city?: string;
  state?: string;
  ticketUrl?: string;
  description?: string;
  flyer?: string;
}

export interface SanityRelease {
  _id: string;
  title: string;
  slug?: { current: string } | string;
  releaseDate: string;
  type?: "album" | "single" | "ep" | "mixtape";
  description?: string;
  coverArt?: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  youtubeMusicUrl?: string;
}
