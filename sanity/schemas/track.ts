/**
 * Sanity Studio schema: Track
 * Individual track content model with full metadata.
 */
import { defineType, defineField } from "sanity";

export default defineType({
  name: "track",
  title: "Track",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (Rule) => Rule.required() }),
    defineField({ name: "audioFile", title: "Audio File", type: "file", options: { accept: "audio/*" } }),
    defineField({ name: "duration", title: "Duration (seconds)", type: "number" }),
    defineField({ name: "trackNumber", title: "Track Number", type: "number" }),
    defineField({ name: "lyrics", title: "Lyrics", type: "text", rows: 30 }),
    defineField({ name: "isrc", title: "ISRC", type: "string", description: "International Standard Recording Code" }),
    defineField({ name: "writers", title: "Writers", type: "string", description: "Comma-separated list of songwriters" }),
    defineField({ name: "producers", title: "Producers", type: "string", description: "Comma-separated list of producers" }),
    defineField({ name: "featuredArtists", title: "Featured Artists", type: "string" }),
    defineField({ name: "credits", title: "Credits", type: "text", rows: 6 }),
    defineField({
      name: "release",
      title: "Release",
      type: "reference",
      to: [{ type: "release" }],
      description: "The release this track belongs to",
    }),
    defineField({ name: "coverArt", title: "Cover Art", type: "image", options: { hotspot: true }, description: "Override cover art (defaults to release cover)" }),
    defineField({ name: "explicit", title: "Explicit", type: "boolean", initialValue: false }),
    // DSP Links
    defineField({ name: "spotifyUrl", title: "Spotify URL", type: "url" }),
    defineField({ name: "appleMusicUrl", title: "Apple Music URL", type: "url" }),
    defineField({ name: "youtubeMusicUrl", title: "YouTube Music URL", type: "url" }),
    // SEO
    defineField({ name: "seoTitle", title: "SEO Title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "text", rows: 2 }),
    defineField({ name: "storyBehind", title: "Story Behind the Song", type: "text", rows: 6, description: "Artist narrative for the track page" }),
  ],
  orderings: [{ title: "Track Number", name: "trackNumberAsc", by: [{ field: "trackNumber", direction: "asc" }] }],
  preview: {
    select: { title: "title", trackNumber: "trackNumber", release: "release.title" },
    prepare({ title, trackNumber, release }) {
      return { title, subtitle: `${trackNumber ? `#${trackNumber} — ` : ""}${release || "Single"}` };
    },
  },
});
