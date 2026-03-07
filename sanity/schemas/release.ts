/**
 * Sanity Studio schema: Release
 * Full content model for albums, EPs, singles, and mixtapes.
 */
import { defineType, defineField } from "sanity";

export default defineType({
  name: "release",
  title: "Release",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (Rule) => Rule.required() }),
    defineField({ name: "coverArt", title: "Cover Art", type: "image", options: { hotspot: true } }),
    defineField({
      name: "type",
      title: "Release Type",
      type: "string",
      options: { list: [{ title: "Album", value: "album" }, { title: "Single", value: "single" }, { title: "EP", value: "ep" }, { title: "Mixtape", value: "mixtape" }] },
    }),
    defineField({ name: "releaseDate", title: "Release Date", type: "date", validation: (Rule) => Rule.required() }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
    defineField({ name: "credits", title: "Credits", type: "text", rows: 6, description: "Full credits block (producer, engineer, label, etc.)" }),
    defineField({
      name: "trackList",
      title: "Track List",
      type: "array",
      of: [{ type: "reference", to: [{ type: "track" }] }],
      description: "Ordered list of tracks on this release",
    }),
    defineField({ name: "featuredArtists", title: "Featured Artists", type: "string", description: "Comma-separated list of featured artists" }),
    defineField({ name: "producer", title: "Producer(s)", type: "string" }),
    defineField({ name: "lyrics", title: "Lyrics", type: "text", rows: 20 }),
    // DSP Links
    defineField({ name: "spotifyUrl", title: "Spotify URL", type: "url" }),
    defineField({ name: "appleMusicUrl", title: "Apple Music URL", type: "url" }),
    defineField({ name: "youtubeMusicUrl", title: "YouTube Music URL", type: "url" }),
    defineField({ name: "tidalUrl", title: "Tidal URL", type: "url" }),
    defineField({ name: "amazonMusicUrl", title: "Amazon Music URL", type: "url" }),
    defineField({ name: "soundcloudUrl", title: "SoundCloud URL", type: "url" }),
    defineField({ name: "audiomackUrl", title: "Audiomack URL", type: "url" }),
    // Audio
    defineField({ name: "audioFile", title: "Audio File", type: "file", options: { accept: "audio/*" }, description: "Optional audio file for on-site streaming" }),
    // SEO
    defineField({ name: "seoTitle", title: "SEO Title", type: "string", description: "Custom page title for search engines (max 60 chars)" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "text", rows: 2, description: "Custom meta description (max 160 chars)" }),
    defineField({ name: "ogImage", title: "OG Image", type: "image", description: "Custom social share image (1200×630)" }),
  ],
  orderings: [{ title: "Release Date, Newest", name: "releaseDateDesc", by: [{ field: "releaseDate", direction: "desc" }] }],
  preview: {
    select: { title: "title", type: "type", date: "releaseDate", media: "coverArt" },
    prepare({ title, type, date, media }) {
      return { title, subtitle: `${type || "Release"} — ${date || "No date"}`, media };
    },
  },
});
