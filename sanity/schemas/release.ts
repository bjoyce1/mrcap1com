/**
 * Sanity Studio schema: Release
 * Drop this file into your Sanity Studio's schemas/ directory.
 */
import { defineType, defineField } from "sanity";

export default defineType({
  name: "release",
  title: "Release",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "releaseDate",
      title: "Release Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "Release Type",
      type: "string",
      options: {
        list: [
          { title: "Album", value: "album" },
          { title: "Single", value: "single" },
          { title: "EP", value: "ep" },
          { title: "Mixtape", value: "mixtape" },
        ],
      },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "coverArt",
      title: "Cover Art",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "spotifyUrl",
      title: "Spotify URL",
      type: "url",
    }),
    defineField({
      name: "appleMusicUrl",
      title: "Apple Music URL",
      type: "url",
    }),
    defineField({
      name: "youtubeMusicUrl",
      title: "YouTube Music URL",
      type: "url",
    }),
  ],
  orderings: [
    {
      title: "Release Date, Newest",
      name: "releaseDateDesc",
      by: [{ field: "releaseDate", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", type: "type", date: "releaseDate", media: "coverArt" },
    prepare({ title, type, date, media }) {
      return {
        title,
        subtitle: `${type || "Release"} — ${date || "No date"}`,
        media,
      };
    },
  },
});
