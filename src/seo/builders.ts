/**
 * SEO for data-driven pages (tracks, albums, cities, blog and press posts, Self Love
 * stories) and the list-style JSON-LD some static pages carry. Pure functions: the
 * React pages call them with live data, the build calls them with the catalog snapshot.
 */
import { DEFAULT_OG_IMAGE, SAME_AS, SITE_URL, SPC_ROLE, abs } from "./site";
import { cleanJson, fitDescription, fitTitle, noDashes, paragraphs, plainText } from "./text";
import type { JsonLdNode, SeoEntry } from "./types";

/* ------------------------------------------------------------------ shared nodes */

export const PERSON_ID = `${SITE_URL}/#person`;

export const breadcrumb = (...crumbs: [string, string][]): JsonLdNode => ({
  "@type": "BreadcrumbList",
  itemListElement: [["Home", "/"] as [string, string], ...crumbs].map(([name, path], i) => ({
    "@type": "ListItem",
    position: i + 1,
    name,
    item: path === "/" ? SITE_URL : abs(path),
  })),
});

export const personRef = { "@type": "Person", "@id": PERSON_ID, name: "Mr. CAP" };

export const artistNode = { "@type": "MusicGroup", name: "Mr. CAP", "@id": `${SITE_URL}/#artist`, sameAs: SAME_AS };

const isoDuration = (s?: number | null) =>
  s ? `PT${Math.floor(s / 60)}M${Math.floor(s % 60)}S` : undefined;

/** Second sentence for track pages, longest wording first; the fitter picks what fits. */
const STREAM_LINES = [
  "Stream it free on mrcap1.com, read the credits and lyrics, and explore the full Mr. CAP catalog.",
  "Stream it free on mrcap1.com, read the credits and lyrics, and explore the catalog.",
  "Stream it free on mrcap1.com and read the credits and lyrics.",
  "Stream it free on mrcap1.com, with credits and lyrics.",
  "Stream it free on mrcap1.com.",
];
const CLOSERS = ["Houston hip-hop, direct from the artist.", "No middleman.", "Straight from the source."];

const credit = (t: { artist: string; featured_artists?: string | null }) =>
  t.featured_artists ? `${t.artist} ft. ${t.featured_artists}` : t.artist;

/* ------------------------------------------------------------------ tracks & albums */

export interface TrackLike {
  slug: string;
  title: string;
  artist: string;
  featured_artists?: string | null;
  album_id?: string | null;
  release_year?: number | null;
  duration?: number | null;
  cover_art_url?: string | null;
  isrc?: string | null;
  story_behind?: string | null;
  producers?: string | null;
}

export interface AlbumLike {
  id?: string;
  slug: string;
  title: string;
  artist: string;
  release_year?: number | null;
  cover_art_url?: string | null;
  description?: string | null;
  track_count?: number | null;
}

export const trackPath = (slug: string) => `/music/${slug}`;
export const albumPath = (slug: string) => `/albums/${slug}`;

export function trackSeo(track: TrackLike, album?: AlbumLike | null): SeoEntry {
  const by = credit(track);
  const year = track.release_year ? ` (${track.release_year})` : "";
  const path = trackPath(track.slug);
  const summary = [
    noDashes(`"${track.title}"${year} is ${album ? `a track from ${album.title}` : "a single"} by ${by}, streaming free on mrcap1.com straight from the artist.`),
    ...(track.story_behind ? paragraphs(track.story_behind, 2) : []),
    ...(album?.description ? [plainText(album.description)] : []),
  ].slice(0, 3);
  if (summary.length < 2) summary.push("Listen on the site, read the credits and lyrics, and explore three decades of Houston hip-hop from Mr. CAP and the South Park Coalition.");

  return {
    path,
    title: fitTitle(track.title, "Mr. CAP"),
    description: fitDescription(
      [
        `Listen to "${track.title}" by ${by}${track.release_year ? `, released ${track.release_year}` : ""}.`,
        STREAM_LINES,
      ],
      CLOSERS,
    ),
    ogType: "music.song",
    ogImage: track.cover_art_url ? abs(track.cover_art_url) : DEFAULT_OG_IMAGE,
    ogImageAlt: `${track.title} cover art`,
    h1: noDashes(track.title),
    summary,
    links: [
      ...(album ? [{ href: albumPath(album.slug), label: `${album.title}, the album` }] : []),
      { href: "/music", label: "Stream the catalog" },
      { href: "/mr-cap-discography", label: "Discography" },
    ],
    jsonLd: [
      cleanJson({
        "@type": "MusicRecording",
        name: track.title,
        url: abs(path),
        byArtist: { "@type": "MusicGroup", name: track.artist },
        ...(isoDuration(track.duration) ? { duration: isoDuration(track.duration) } : {}),
        ...(track.release_year ? { datePublished: String(track.release_year) } : {}),
        ...(track.isrc ? { isrcCode: track.isrc } : {}),
        ...(track.cover_art_url ? { image: abs(track.cover_art_url) } : {}),
        ...(album ? { inAlbum: { "@type": "MusicAlbum", name: album.title, url: abs(albumPath(album.slug)) } } : {}),
      }),
      breadcrumb(["Music", "/music"], [noDashes(track.title), path]),
    ],
  };
}

export function albumSeo(album: AlbumLike, tracks: TrackLike[] = []): SeoEntry {
  const path = albumPath(album.slug);
  const count = album.track_count || tracks.length;
  const year = album.release_year ? ` from ${album.release_year}` : "";
  const summary = [
    noDashes(`${album.title} is ${album.artist === "Mr. CAP" ? "an album by Mr. CAP" : `an album by ${album.artist}, featuring Mr. CAP`}${year}${count ? `, ${count} tracks` : ""}.`),
    ...(album.description ? [plainText(album.description)] : []),
    ...(tracks.length ? [noDashes(`Tracklist: ${tracks.slice(0, 12).map((t) => t.title).join(", ")}${tracks.length > 12 ? ", and more" : ""}.`)] : []),
  ];
  if (summary.length < 2) summary.push("Stream it free on mrcap1.com, with credits and the story behind the record.");

  return {
    path,
    title: fitTitle(album.title, "Album by Mr. CAP"),
    description: fitDescription(
      [
        `Stream ${album.title} by ${album.artist}${count ? `, ${count} tracks` : ""}${year}.`,
        ["Listen free on mrcap1.com, with credits, lyrics, and the story behind the record.", "Listen free on mrcap1.com, with credits and the story behind the record.", "Listen free on mrcap1.com, with credits and lyrics."],
      ],
      CLOSERS,
    ),
    ogType: "music.album",
    ogImage: album.cover_art_url ? abs(album.cover_art_url) : DEFAULT_OG_IMAGE,
    ogImageAlt: `${album.title} cover art`,
    h1: noDashes(album.title),
    summary: summary.slice(0, 4),
    links: [
      ...tracks.slice(0, 4).map((t) => ({ href: trackPath(t.slug), label: noDashes(t.title) })),
      { href: "/music", label: "Stream the catalog" },
      { href: "/mr-cap-discography", label: "Discography" },
    ],
    jsonLd: [
      cleanJson({
        "@type": "MusicAlbum",
        name: album.title,
        url: abs(path),
        byArtist: { "@type": "MusicGroup", name: album.artist },
        ...(album.release_year ? { datePublished: String(album.release_year) } : {}),
        ...(count ? { numTracks: count } : {}),
        ...(album.cover_art_url ? { image: abs(album.cover_art_url) } : {}),
        ...(tracks.length
          ? {
              track: tracks.map((t, i) => ({
                "@type": "MusicRecording",
                name: t.title,
                position: i + 1,
                url: abs(trackPath(t.slug)),
                ...(isoDuration(t.duration) ? { duration: isoDuration(t.duration) } : {}),
              })),
            }
          : {}),
      }),
      breadcrumb(["Music", "/music"], [noDashes(album.title), path]),
    ],
  };
}

/** The /music page's playlist of every public track. */
export const musicPlaylistLd = (tracks: TrackLike[]): JsonLdNode =>
  cleanJson({
    "@type": "MusicPlaylist",
    name: "Mr. CAP: Stream Music",
    description: "Stream Mr. CAP's music directly. Houston hip hop, Southern rap, and underground classics.",
    url: abs("/music"),
    numTracks: tracks.length,
    track: tracks.map((t) => ({
      "@type": "MusicRecording",
      name: t.title,
      url: abs(trackPath(t.slug)),
      byArtist: { "@type": "MusicGroup", name: t.artist },
      ...(isoDuration(t.duration) ? { duration: isoDuration(t.duration) } : {}),
      ...(t.release_year ? { datePublished: String(t.release_year) } : {}),
    })),
  });

/* ------------------------------------------------------------------ blog & press */

export interface BlogPostLike {
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category?: string;
  date: string;
  author?: string;
  image?: string;
  tags?: string[];
}

export function blogPostSeo(post: BlogPostLike): SeoEntry {
  const path = `/blog/${post.slug}`;
  const body = post.content ? paragraphs(post.content, 3) : [];
  const words = post.content ? post.content.split(/\s+/).length : 0;
  return {
    path,
    title: fitTitle(post.title, ["Mr. CAP Blog", "Blog"]),
    description: fitDescription([post.excerpt], [post.category ? `From the Mr. CAP blog: ${post.category}.` : "From the Mr. CAP blog.", "Houston hip-hop, independence, and ownership.", "Read the full story on mrcap1.com.", "Read it on mrcap1.com."]),
    ogType: "article",
    ogImage: post.image ? abs(post.image) : DEFAULT_OG_IMAGE,
    h1: noDashes(post.title),
    summary: (body.length >= 2 ? body : [plainText(post.excerpt), ...body]).slice(0, 4),
    links: [
      { href: "/blog", label: "All blog posts" },
      { href: "/who-is-mr-cap", label: "Who is Mr. CAP" },
      { href: "/south-park-coalition", label: "The South Park Coalition" },
    ],
    extraMeta: [
      { property: "article:published_time", content: post.date },
      ...(post.category ? [{ property: "article:section", content: noDashes(post.category) }] : []),
    ],
    jsonLd: [
      cleanJson({
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.date,
        dateModified: post.date,
        author: { "@type": "Person", name: post.author || "Mr. CAP", url: abs("/who-is-mr-cap") },
        publisher: { "@type": "Organization", name: "Mr. CAP", url: SITE_URL },
        mainEntityOfPage: { "@type": "WebPage", "@id": abs(path) },
        ...(post.category ? { articleSection: post.category } : {}),
        ...(post.tags?.length ? { keywords: post.tags.join(", ") } : {}),
        ...(post.image ? { image: abs(post.image) } : {}),
        ...(words ? { wordCount: words } : {}),
        inLanguage: "en-US",
        about: personRef,
      }),
      breadcrumb(["Blog", "/blog"], [noDashes(post.title), path]),
    ],
  };
}

export const blogListLd = (posts: BlogPostLike[]): JsonLdNode =>
  cleanJson({
    "@type": "Blog",
    name: "Mr. CAP Blog",
    description: "Insights on Houston hip-hop history, the South Park Coalition, music industry success, blockchain innovation, and independent artist strategies.",
    url: abs("/blog"),
    author: personRef,
    blogPost: posts.slice(0, 30).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      datePublished: p.date,
      url: abs(`/blog/${p.slug}`),
      description: p.excerpt,
    })),
  });

export interface PressEntryLike {
  slug: string;
  outlet: string;
  title: string;
  author?: string;
  date: string;
  summary: string;
  body?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export function pressPostSeo(entry: PressEntryLike): SeoEntry {
  const path = `/press/${entry.slug}`;
  const body = entry.body ? paragraphs(entry.body, 3) : [];
  return {
    path,
    title: entry.seoTitle && noDashes(entry.seoTitle).length <= 59 ? noDashes(entry.seoTitle) : fitTitle(entry.title, ["Mr. CAP Press", "Press"]),
    description: fitDescription([entry.seoDescription || entry.summary], [`Published by ${entry.outlet}.`, "From the Mr. CAP press archive.", "Read it in the archive.", "Houston hip-hop news.", "Read it here."]),
    ogType: "article",
    h1: noDashes(entry.title),
    summary: (body.length >= 2
      ? body
      : [
          plainText(entry.summary),
          ...body,
          noDashes(`Published by ${entry.outlet}${entry.author ? `, written by ${entry.author}` : ""}, ${entry.date}. Part of the official Mr. CAP press archive.`),
        ]
    ).slice(0, 4),
    links: [
      { href: "/press", label: "Press archive" },
      { href: "/press#press-kit", label: "Press kit" },
      { href: "/music", label: "Stream the music" },
    ],
    extraMeta: [{ property: "article:published_time", content: entry.date }],
    jsonLd: [
      cleanJson({
        "@type": "Article",
        headline: entry.title,
        ...(entry.author ? { author: { "@type": "Person", name: entry.author } } : {}),
        publisher: { "@type": "Organization", name: entry.outlet },
        datePublished: entry.date,
        description: entry.seoDescription || entry.summary,
        url: abs(path),
        about: personRef,
        mainEntityOfPage: { "@type": "WebPage", "@id": abs(path) },
      }),
      breadcrumb(["Press", "/press"], [noDashes(entry.title), path]),
    ],
  };
}

export const pressListLd = (entries: PressEntryLike[]): JsonLdNode =>
  cleanJson({
    "@type": "ItemList",
    name: "Mr. CAP Press Archive",
    itemListElement: entries.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: abs(`/press/${e.slug}`),
      name: e.title,
    })),
  });

/* ------------------------------------------------------------------ live events */

export interface PastShowLike {
  title: string;
  date?: string;
  city?: string;
  state?: string;
  venue?: string;
  flyer?: string;
  source?: string;
}

export const pastEventsLd = (shows: PastShowLike[]): JsonLdNode[] =>
  shows
    .filter((s) => s.date)
    .map((s) =>
      cleanJson({
        "@type": "MusicEvent",
        name: s.title,
        startDate: s.date,
        eventStatus: "https://schema.org/EventCompleted",
        performer: personRef,
        ...(s.flyer ? { image: abs(s.flyer) } : {}),
        ...(s.source ? { url: s.source } : {}),
        location: {
          "@type": "Place",
          ...(s.venue ? { name: s.venue } : {}),
          address: {
            "@type": "PostalAddress",
            ...(s.city ? { addressLocality: s.city } : {}),
            ...(s.state ? { addressRegion: s.state } : {}),
            addressCountry: "US",
          },
        },
      }),
    );

/* ------------------------------------------------------------------ Self Love */

export interface SelfLoveStoryLike {
  year: number;
  slug: string;
  character: string;
  storyTitle: string;
  roomTitle: string;
  coverImage: string;
  excerpt: string;
  body: string;
}

export function selfLoveStorySeo(story: SelfLoveStoryLike): SeoEntry {
  const path = `/self-love/${story.year}/${story.slug}`;
  const room = noDashes(story.roomTitle);
  return {
    path,
    title: fitTitle(story.storyTitle, "Self Love by Mr. CAP"),
    description: fitDescription(
      [story.excerpt, [`A story from ${room}, part of the Self Love art installation by Houston artist Mr. CAP.`, "A story from the Self Love art installation by Houston artist Mr. CAP."]],
      ["Step inside the work.", "Read it on mrcap1.com."],
    ),
    ogType: "article",
    ogImage: story.coverImage || DEFAULT_OG_IMAGE,
    h1: noDashes(story.storyTitle),
    summary: paragraphs(story.body, 3),
    links: [
      { href: `/self-love/${story.year}`, label: room },
      { href: "/self-love", label: "The Self Love installation" },
    ],
    jsonLd: [
      cleanJson({
        "@type": "ShortStory",
        name: story.storyTitle,
        about: story.character,
        author: personRef,
        isPartOf: { "@type": "VisualArtwork", name: "Self Love", url: abs("/self-love") },
        url: abs(path),
        image: story.coverImage,
      }),
      breadcrumb(["Self Love", "/self-love"], [room, `/self-love/${story.year}`], [noDashes(story.storyTitle), path]),
    ],
  };
}
