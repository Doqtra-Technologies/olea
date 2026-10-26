import type { PortableTextBlock } from "@portabletext/react";
import { cacheLife, cacheTag } from "next/cache";
import { sectionsToBlocks } from "@/lib/sanity/blocks";
import { client } from "@/lib/sanity/client";
import {
  aboutQuery,
  eventsQuery,
  homeQuery,
  menusQuery,
  postsQuery,
  privateDiningQuery,
  settingsQuery,
  whatsOnPageQuery,
} from "@/lib/sanity/queries";
import { dietary as defaultDietary, menus as defaultMenus, type Menu } from "@/lib/menus";
import { home, posts as defaultPosts, privateDining, site, story, whatsOn, type WhatsOnItem } from "@/lib/site";
import { isSanityConfigured } from "@/sanity/env";

// Content comes from Sanity when it's configured. Anything missing there falls back to the
// built-in content in lib/site.ts and lib/menus.ts, so the site never renders empty.

export const CONTENT_TAG = "sanity";

export type Promo = (typeof home.promos)[number];
export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  alt: string;
  date: string;
  intro: string[];
  body: PortableTextBlock[];
  outro?: string;
};

async function fetchContent<T>(query: string): Promise<T | null> {
  if (!isSanityConfigured) return null;
  return client.fetch<T>(query);
}

/** Overlays the fields Sanity has filled in onto the defaults. */
function merge<T extends object>(defaults: T, doc: Partial<Record<keyof T, unknown>> | null): T {
  if (!doc) return defaults;
  const filled = Object.entries(doc).filter(([, v]) => v !== null && v !== undefined && v !== "");
  return { ...defaults, ...Object.fromEntries(filled) };
}

function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export async function getSettings() {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  const doc = await fetchContent<Partial<typeof site & { dietary: string }>>(settingsQuery);
  const settings = merge({ ...site, dietary: defaultDietary }, doc);
  return { ...settings, phoneHref: telHref(settings.phone) };
}

export type Settings = Awaited<ReturnType<typeof getSettings>>;

export async function getHome() {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  return merge(home, await fetchContent<Partial<typeof home>>(homeQuery));
}

export async function getStory() {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  return merge(story, await fetchContent<Partial<typeof story>>(aboutQuery));
}

export async function getPrivateDiningIntro() {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  return (await fetchContent<string>(privateDiningQuery)) || privateDining;
}

export async function getWhatsOn() {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  const [page, items] = await Promise.all([
    fetchContent<Partial<typeof whatsOn>>(whatsOnPageQuery),
    fetchContent<WhatsOnItem[]>(eventsQuery),
  ]);
  return { ...merge(whatsOn, page), items: items?.length ? items : whatsOn.items };
}

export async function getMenus(): Promise<Menu[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  const menus = await fetchContent<Menu[]>(menusQuery);
  if (!menus?.length) return defaultMenus;
  return menus.map((m) => ({ ...m, columns: m.columns?.length ? m.columns : undefined }));
}

export async function getPosts(): Promise<Post[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  const posts = await fetchContent<Post[]>(postsQuery);
  return posts?.length ? posts : defaultPosts.map(({ sections, ...p }) => ({ ...p, body: sectionsToBlocks(sections) }));
}

export async function getPost(slug: string) {
  return (await getPosts()).find((p) => p.slug === slug);
}
