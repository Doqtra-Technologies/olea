import { cacheLife, cacheTag } from "next/cache";
import { londonToday } from "@/lib/dates";
import { dietary as defaultDietary, menuNotice, menus as defaultMenus, type Menu } from "@/lib/menus";
import { home, posts as defaultPosts, privateDining, site, story, whatsOn, type PostSource, type WhatsOnItem } from "@/lib/site";

// Content comes from WordPress (the Olea Content plugin in wordpress/) when WORDPRESS_URL is set.
// Anything missing there falls back to the built-in content in lib/site.ts and lib/menus.ts,
// so the site never renders empty.

export const CONTENT_TAG = "content";

const wordpressUrl = process.env.WORDPRESS_URL?.replace(/\/+$/, "");

export type Promo = (typeof home.promos)[number];
export type Post = {
  slug: string;
  title: string;
  metaTitle?: string;
  excerpt: string;
  image?: string;
  alt?: string;
  date: string;
  intro: string[];
  /** HTML from the WordPress editor. */
  body: string;
  outro?: string;
  outroHref?: string;
};

/**
 * Reads one of the plugin's endpoints. A failed request throws rather than falling back,
 * so an outage keeps the last good content in the cache instead of replacing it with the defaults.
 */
async function fetchContent<T>(path: string): Promise<T | null> {
  if (!wordpressUrl) return null;
  // ?rest_route= works whether or not WordPress has pretty permalinks switched on.
  const res = await fetch(`${wordpressUrl}/?rest_route=/olea/v1/${path}`, { signal: AbortSignal.timeout(15_000) });
  if (!res.ok) throw new Error(`WordPress returned ${res.status} for ${path}`);
  return res.json();
}

const escapeHtml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Converts the built-in posts' heading + paragraph sections into the HTML a WordPress post would have. */
function sectionsToHtml(sections: PostSource["sections"]) {
  return sections
    .flatMap((s) => [`<h2>${escapeHtml(s.heading)}</h2>`, ...s.body.map((p) => `<p>${escapeHtml(p)}</p>`)])
    .join("\n");
}

/** Overlays the fields WordPress has filled in onto the defaults. */
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
  const doc = await fetchContent<Partial<typeof site & { dietary: string }>>("settings");
  const settings = merge({ ...site, dietary: defaultDietary }, doc);
  return { ...settings, phoneHref: telHref(settings.phone) };
}

export type Settings = Awaited<ReturnType<typeof getSettings>>;

export async function getHome() {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  return merge(home, await fetchContent<Partial<typeof home>>("home"));
}

export async function getStory() {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  return merge(story, await fetchContent<Partial<typeof story>>("about"));
}

export async function getPrivateDiningIntro() {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  return (await fetchContent<string>("private-dining")) || privateDining;
}

export async function getWhatsOn() {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  const [page, items] = await Promise.all([
    fetchContent<Partial<typeof whatsOn>>("whats-on"),
    fetchContent<WhatsOnItem[]>("events"),
  ]);
  // Captured in the cache, so finished events move to Past events when it refreshes.
  const today = londonToday();
  const list: WhatsOnItem[] = items?.length ? items : whatsOn.items;
  return { ...merge(whatsOn, page), items: list.map((i) => ({ ...i, past: !!i.endsOn && i.endsOn < today })) };
}

export type WhatsOnEntry = Awaited<ReturnType<typeof getWhatsOn>>["items"][number];

/** The menu page notice, or null once its last day has passed. */
export async function getMenuNotice() {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  return londonToday() <= menuNotice.until ? menuNotice.text : null;
}

export async function getMenus(): Promise<Menu[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  const menus = await fetchContent<Menu[]>("menus");
  if (!menus?.length) return defaultMenus;
  return menus.map((m) => ({ ...m, columns: m.columns?.length ? m.columns : undefined }));
}

export async function getPosts(): Promise<Post[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  const posts = await fetchContent<Post[]>("posts");
  return posts?.length ? posts : defaultPosts.map(({ sections, ...p }) => ({ ...p, body: sectionsToHtml(sections) }));
}

export async function getPost(slug: string) {
  return (await getPosts()).find((p) => p.slug === slug);
}
