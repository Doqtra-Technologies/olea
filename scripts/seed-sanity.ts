/**
 * Imports the built-in content (lib/site.ts, lib/menus.ts, images and PDFs in public/) into Sanity.
 *
 *   npm run sanity:seed            # creates documents that don't exist yet
 *   npm run sanity:seed -- --force # overwrites existing documents with the built-in content
 */
import { createReadStream } from "node:fs";
import { basename, join } from "node:path";
import type { SanityDocumentStub } from "@sanity/client";
import { getCliClient } from "sanity/cli";
import { dietary, menus, type MenuSection } from "../lib/menus";
import { sectionsToBlocks } from "../lib/sanity/blocks";
import { home, posts, privateDining, site, story, whatsOn } from "../lib/site";

const client = getCliClient({ apiVersion: "2026-10-01" });
const force = process.argv.includes("--force");
const publicDir = join(process.cwd(), "public");
const uploads = new Map<string, Promise<string>>();

function upload(kind: "image" | "file", src: string) {
  if (!uploads.has(src)) {
    console.log(`  uploading ${src}`);
    const path = join(publicDir, src);
    uploads.set(src, client.assets.upload(kind, createReadStream(path), { filename: basename(path) }).then((a) => a._id));
  }
  return uploads.get(src)!;
}

let keyCount = 0;
const key = () => `k${(keyCount++).toString(36)}`;

async function image(src: string, alt: string) {
  return { _type: "imageWithAlt", _key: key(), alt, asset: { _type: "reference", _ref: await upload("image", src) } };
}

const sections = (list: MenuSection[]) =>
  list.map((s) => ({
    _type: "menuSection",
    _key: key(),
    title: s.title,
    note: s.note,
    featured: s.featured ?? false,
    dishes: s.dishes.map((d) => ({ _type: "dish", _key: key(), ...d })),
  }));

async function documents(): Promise<SanityDocumentStub[]> {
  const { line1, city, postcode } = site.address;
  return [
    {
      _id: "siteSettings",
      _type: "siteSettings",
      name: site.name,
      tagline: site.tagline,
      address: { line1, city, postcode },
      phone: site.phone,
      bookingUrl: site.bookingUrl,
      hours: site.hours.map((h) => ({ _key: key(), ...h })),
      mapsUrl: site.mapsUrl,
      mapsEmbed: site.mapsEmbed,
      social: site.social.map((s) => ({ _type: "link", _key: key(), ...s })),
      dietary,
    },
    {
      _id: "homePage",
      _type: "homePage",
      intro: home.intro,
      introSub: home.introSub,
      body: home.body,
      promos: await Promise.all(
        home.promos.map(async (p) => ({
          _type: "promo",
          _key: p.id,
          eyebrow: p.eyebrow,
          title: p.title,
          body: p.body,
          cta: { _type: "link", ...p.cta },
          image: await image(p.image, p.alt),
        })),
      ),
    },
    {
      _id: "aboutPage",
      _type: "aboutPage",
      title: story.title,
      paragraphs: story.paragraphs,
      name: story.name,
      regions: story.regions,
      slides: await Promise.all(story.slides.map((s) => image(s.src, s.alt))),
      gallery: await Promise.all(story.gallery.map((s) => image(s.src, s.alt))),
    },
    { _id: "privateDiningPage", _type: "privateDiningPage", intro: privateDining },
    { _id: "whatsOnPage", _type: "whatsOnPage", eyebrow: whatsOn.eyebrow, title: whatsOn.title, intro: whatsOn.intro },
    ...(await Promise.all(
      menus.map(async (m, i) => ({
        _id: `menu-${m.id}`,
        _type: "menu",
        label: m.label,
        title: m.title,
        slug: { _type: "slug", current: m.id },
        price: m.price,
        intro: m.intro,
        pdf: m.pdf ? { _type: "file", asset: { _type: "reference", _ref: await upload("file", m.pdf) } } : undefined,
        sections: sections(m.sections),
        columns: m.columns?.map((c) => ({ _type: "menuColumn", _key: key(), title: c.title, price: c.price, sections: sections(c.sections) })),
        order: (i + 1) * 10,
      })),
    )),
    ...(await Promise.all(
      whatsOn.items.map(async (item, i) => ({
        _id: `event-${item.slug}`,
        _type: "event",
        title: item.title,
        slug: { _type: "slug", current: item.slug },
        category: item.category,
        date: item.date,
        summary: item.summary,
        image: await image(item.image, item.alt),
        menu: item.menu ? { _type: "reference", _ref: `menu-${item.menu}` } : undefined,
        order: (i + 1) * 10,
      })),
    )),
    ...(await Promise.all(
      posts.map(async (p) => ({
        _id: `post-${p.slug}`,
        _type: "post",
        title: p.title,
        slug: { _type: "slug", current: p.slug },
        date: p.date,
        excerpt: p.excerpt,
        image: await image(p.image, p.alt),
        intro: p.intro,
        body: sectionsToBlocks(p.sections),
        outro: p.outro,
      })),
    )),
  ];
}

async function main() {
  console.log(`Seeding ${client.config().projectId}/${client.config().dataset}${force ? " (overwriting)" : ""}`);
  const docs = await documents();
  const tx = client.transaction();
  for (const doc of docs) {
    if (force) tx.createOrReplace(doc as SanityDocumentStub & { _id: string });
    else tx.createIfNotExists(doc as SanityDocumentStub & { _id: string });
  }
  await tx.commit();
  console.log(`Done: ${docs.length} documents ${force ? "written" : "created where missing"}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
