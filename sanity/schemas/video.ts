/**
 * Sanity Studio schema: Video
 * Video content type with release relationship.
 */
import { defineType, defineField } from "sanity";

export default defineType({
  name: "video",
  title: "Video",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 }, validation: (Rule) => Rule.required() }),
    defineField({ name: "thumbnail", title: "Thumbnail", type: "image", options: { hotspot: true } }),
    defineField({ name: "embedUrl", title: "Embed URL", type: "url", description: "YouTube or Vimeo embed URL" }),
    defineField({ name: "videoFile", title: "Video File", type: "file", options: { accept: "video/*" }, description: "Self-hosted video file" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 4 }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Official Music Video", value: "official" },
          { title: "Lyric Video", value: "lyric" },
          { title: "Promo", value: "promo" },
          { title: "Interview", value: "interview" },
          { title: "Behind the Scenes", value: "behind-the-scenes" },
        ],
      },
    }),
    defineField({
      name: "relatedRelease",
      title: "Related Release",
      type: "reference",
      to: [{ type: "release" }],
    }),
    defineField({ name: "publishDate", title: "Publish Date", type: "date" }),
  ],
  orderings: [{ title: "Publish Date, Newest", name: "publishDateDesc", by: [{ field: "publishDate", direction: "desc" }] }],
  preview: {
    select: { title: "title", category: "category", media: "thumbnail" },
    prepare({ title, category, media }) {
      return { title, subtitle: category || "Video", media };
    },
  },
});
