import { defineArrayMember, defineField, defineType } from "sanity";

const paragraphs = (name: string, title: string) =>
  defineField({ name, title, type: "array", of: [defineArrayMember({ type: "text", rows: 4 })] });

export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  fields: [
    defineField({ name: "intro", title: "Intro headline", type: "string" }),
    defineField({ name: "introSub", title: "Intro sub-headline", type: "text", rows: 3 }),
    defineField({ name: "body", type: "text", rows: 5 }),
    defineField({
      name: "promos",
      title: "Promotions carousel",
      type: "array",
      of: [
        defineArrayMember({
          name: "promo",
          type: "object",
          fields: [
            defineField({ name: "eyebrow", type: "string", description: "Small line above the title." }),
            defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
            paragraphs("body", "Paragraphs"),
            defineField({ name: "cta", title: "Button", type: "link" }),
            defineField({ name: "image", type: "imageWithAlt", validation: (rule) => rule.required() }),
          ],
          preview: { select: { title: "title", subtitle: "eyebrow", media: "image" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    paragraphs("paragraphs", "Story"),
    paragraphs("name", "What’s in a name"),
    defineField({
      name: "regions",
      type: "array",
      of: [{ type: "string" }],
      description: "Also listed on the home page.",
    }),
    defineField({ name: "slides", title: "Slideshow", type: "array", of: [{ type: "imageWithAlt" }] }),
    defineField({ name: "gallery", type: "array", of: [{ type: "imageWithAlt" }] }),
  ],
  preview: { prepare: () => ({ title: "About page" }) },
});

export const privateDiningPage = defineType({
  name: "privateDiningPage",
  title: "Private dining page",
  type: "document",
  fields: [defineField({ name: "intro", type: "text", rows: 4 })],
  preview: { prepare: () => ({ title: "Private dining page" }) },
});

export const whatsOnPage = defineType({
  name: "whatsOnPage",
  title: "What’s On page",
  type: "document",
  fields: [
    defineField({ name: "eyebrow", type: "string" }),
    defineField({ name: "title", type: "string" }),
    defineField({ name: "intro", type: "text", rows: 3 }),
  ],
  preview: { prepare: () => ({ title: "What’s On page" }) },
});
