/**
 * Sanity Studio schema: Press Entry
 * Drop this file into your Sanity Studio's schemas/ directory.
 */
import { defineType, defineField } from "sanity";

export default defineType({
  name: "pressEntry",
  title: "Press Entry",
  type: "document",
  fields: [
    defineField({
      name: "outlet",
      title: "Outlet",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "Article URL",
      type: "url",
    }),
  ],
  orderings: [
    {
      title: "Date, Newest",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "outlet", date: "date" },
    prepare({ title, subtitle, date }) {
      return {
        title,
        subtitle: `${subtitle || ""} — ${date || ""}`,
      };
    },
  },
});
