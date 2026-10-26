import { defineField, defineType } from "sanity";

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Describe the image for screen readers and search engines.",
      validation: (rule) => rule.required(),
    }),
  ],
});

export const dish = defineType({
  name: "dish",
  title: "Dish",
  type: "object",
  fields: [
    defineField({ name: "name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "description", type: "string", description: "Include dietary tags, e.g. (V) or (VG)." }),
    defineField({ name: "price", type: "string", description: "Number only, e.g. 9.5. Leave blank on set menus." }),
  ],
  preview: { select: { title: "name", subtitle: "price" } },
});

export const menuSection = defineType({
  name: "menuSection",
  title: "Menu section",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "note", type: "string", description: "Small line under the heading, e.g. “Anatolian pizza”." }),
    defineField({ name: "featured", type: "boolean", description: "Highlight this section.", initialValue: false }),
    defineField({ name: "dishes", type: "array", of: [{ type: "dish" }] }),
  ],
  preview: {
    select: { title: "title", dishes: "dishes" },
    prepare: ({ title, dishes }) => ({ title, subtitle: `${dishes?.length ?? 0} dishes` }),
  },
});

export const menuColumn = defineType({
  name: "menuColumn",
  title: "Menu option",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "price", type: "string", description: "e.g. £52" }),
    defineField({ name: "sections", type: "array", of: [{ type: "menuSection" }] }),
  ],
  preview: { select: { title: "title", subtitle: "price" } },
});

export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "href",
      title: "URL or path",
      type: "string",
      description: "A page on this site such as /menu, or a full https:// address.",
      validation: (rule) => rule.required(),
    }),
  ],
});
