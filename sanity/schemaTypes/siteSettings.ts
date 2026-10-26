import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "tagline", type: "string", description: "Shown under the logo on the home page." }),
    defineField({
      name: "address",
      type: "object",
      fields: [
        defineField({ name: "line1", title: "Street", type: "string" }),
        defineField({ name: "city", type: "string" }),
        defineField({ name: "postcode", type: "string" }),
      ],
    }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "email", type: "string", validation: (rule) => rule.email() }),
    defineField({
      name: "bookingUrl",
      title: "Booking URL",
      type: "url",
      description: "Every “Book a table” button links here.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "hours",
      title: "Opening hours",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "days", type: "string", description: "e.g. Monday – Friday" }),
            defineField({ name: "time", type: "string", description: "e.g. 11:30am – 11:30pm" }),
          ],
          preview: { select: { title: "days", subtitle: "time" } },
        }),
      ],
    }),
    defineField({ name: "mapsUrl", title: "Google Maps link", type: "url" }),
    defineField({
      name: "social",
      title: "Social profiles",
      type: "array",
      of: [{ type: "link" }],
      description: "Shown in the footer.",
    }),
    defineField({ name: "dietary", title: "Menu allergy & service note", type: "text", rows: 4 }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});
