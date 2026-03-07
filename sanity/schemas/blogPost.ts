/**
 * Sanity Studio schema: Blog Post
 * Drop this file into your Sanity Studio's schemas/ directory.
 */
import { defineType, defineField } from "sanity";

export default defineType({
  name: "blogPost",
  title: "Blog Post",
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
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          "Houston Hip-Hop History",
          "South Park Coalition",
          "Music Industry Playbook",
          "Artist Success",
          "Blockchain & AI",
          "Behind the Music",
          "NFT Art & Music",
          "Crypto",
          "Media & Press",
          "Collaborations",
        ],
      },
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      initialValue: "Mr. CAP",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "readTime",
      title: "Read Time",
      type: "string",
      description: 'e.g. "5 min"',
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
            }),
          ],
        },
      ],
    }),
  ],
  orderings: [
    {
      title: "Published, Newest",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "category", date: "publishedAt", media: "coverImage" },
    prepare({ title, subtitle, date, media }) {
      return {
        title,
        subtitle: `${subtitle || ""} — ${date ? new Date(date).toLocaleDateString() : "Draft"}`,
        media,
      };
    },
  },
});
