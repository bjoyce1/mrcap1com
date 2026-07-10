import { useQuery } from "@tanstack/react-query";
import { sanityQuery } from "@/lib/sanity";

/**
 * Generic hook to run a named GROQ template against Sanity via the edge
 * function proxy. The proxy only accepts pre-defined templates.
 */
export function useSanityQuery<T = unknown>(
  key: string[],
  template: string,
  params?: Record<string, unknown>,
  options?: { enabled?: boolean; staleTime?: number }
) {
  return useQuery({
    queryKey: ["sanity", ...key],
    queryFn: () => sanityQuery<T>(template, params),
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 1000 * 60 * 5, // 5 min default
  });
}

// ── Pre-built queries for common content types ──

/** Fetch all published blog posts, newest first */
export function useSanityBlogPosts() {
  return useSanityQuery<SanityBlogPost[]>(["blog-posts"], "blog-posts");
}

/** Fetch a single blog post by slug */
export function useSanityBlogPost(slug: string) {
  return useSanityQuery<SanityBlogPost | null>(
    ["blog-post", slug],
    "blog-post-by-slug",
    { slug },
    { enabled: !!slug }
  );
}

/** Fetch upcoming events */
export function useSanityEvents() {
  return useSanityQuery<SanityEvent[]>(["events"], "events-upcoming");
}

/** Fetch music releases */
export function useSanityReleases() {
  return useSanityQuery<SanityRelease[]>(["releases"], "releases");
}

/** Fetch press entries */
export function useSanityPressEntries() {
  return useSanityQuery<SanityPressEntry[]>(["press-entries"], "press-entries");
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

export interface SanityPressEntry {
  _id: string;
  outlet: string;
  title: string;
  author?: string;
  date: string;
  summary: string;
  url?: string;
}
