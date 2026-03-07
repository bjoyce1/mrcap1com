/**
 * Sanity Studio schema: Event
 * Drop this file into your Sanity Studio's schemas/ directory.
 */
import { defineType, defineField } from "sanity";

export default defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "venue",
      title: "Venue",
      type: "string",
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
    }),
    defineField({
      name: "state",
      title: "State",
      type: "string",
    }),
    defineField({
      name: "ticketUrl",
      title: "Ticket URL",
      type: "url",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "flyer",
      title: "Flyer Image",
      type: "image",
      options: { hotspot: true },
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
    select: { title: "title", subtitle: "venue", date: "date" },
    prepare({ title, subtitle, date }) {
      return {
        title,
        subtitle: `${subtitle || ""} — ${date ? new Date(date).toLocaleDateString() : "No date"}`,
      };
    },
  },
});
