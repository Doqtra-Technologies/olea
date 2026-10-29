import { defineArrayMember, defineField, defineType } from "sanity";

const order = defineField({
  name: "order",
  title: "Sort order",
  type: "number",
  description: "Lower numbers appear first.",
  initialValue: 100,
});

export const event = defineType({
  name: "event",
  title: "What’s On item",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }),
    defineField({
      name: "category",
      type: "string",
      options: { list: ["Festive", "Menus", "Events"], layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "date", type: "string", description: "Shown as written, e.g. 7 November 2026 · 19:30" }),
    defineField({
      name: "endsOn",
      title: "Last day",
      type: "date",
      description: "Optional. The day after this date (London time) the item moves to Past events.",
    }),
    defineField({
      name: "showOnHome",
      title: "Show on home page",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "summary", type: "text", rows: 5, validation: (rule) => rule.required() }),
    defineField({ name: "image", type: "imageWithAlt", validation: (rule) => rule.required() }),
    defineField({
      name: "banner",
      type: "imageWithAlt",
      description: "Optional wide banner, shown uncropped at the top of the event page.",
    }),
    defineField({
      name: "details",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 4 })],
      description: "Optional extra paragraphs for the event page.",
    }),
    defineField({
      name: "menu",
      title: "Linked menu",
      type: "reference",
      to: [{ type: "menu" }],
      description: "Optional. Shows the menu price and a link to it.",
    }),
    order,
  ],
  orderings: [{ title: "Sort order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "category", media: "image" } },
});

export const menu = defineType({
  name: "menu",
  title: "Menu",
  type: "document",
  fields: [
    defineField({ name: "label", title: "Tab label", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      title: "Link ID",
      type: "slug",
      options: { source: "label" },
      description: "Used in links such as /menu#christmas.",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "price", type: "string", description: "e.g. £19.50 per person" }),
    defineField({ name: "intro", type: "text", rows: 3 }),
    defineField({ name: "pdf", title: "PDF download", type: "file", options: { accept: "application/pdf" } }),
    defineField({ name: "sections", type: "array", of: [defineArrayMember({ type: "menuSection" })] }),
    defineField({
      name: "columns",
      title: "Menu options",
      type: "array",
      of: [defineArrayMember({ type: "menuColumn" })],
      description: "For menus with several priced options side by side (e.g. Christmas). Leave empty otherwise.",
    }),
    order,
  ],
  orderings: [{ title: "Sort order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "label", subtitle: "price" } },
});

export const post = defineType({
  name: "post",
  title: "Blog post",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (rule) => rule.required() }),
    defineField({ name: "date", type: "date", validation: (rule) => rule.required() }),
    defineField({ name: "excerpt", type: "text", rows: 3, description: "Shown on the blog list and in search results." }),
    defineField({ name: "image", type: "imageWithAlt", validation: (rule) => rule.required() }),
    defineField({
      name: "intro",
      title: "Intro paragraphs",
      type: "array",
      of: [defineArrayMember({ type: "text", rows: 4 })],
      description: "Shown in larger type at the top.",
    }),
    defineField({
      name: "body",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading", value: "h2" },
          ],
          lists: [{ title: "Bullet", value: "bullet" }],
        }),
      ],
    }),
    defineField({ name: "outro", title: "Closing line", type: "string" }),
  ],
  orderings: [{ title: "Newest first", name: "dateDesc", by: [{ field: "date", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "date", media: "image" } },
});
