import { defineQuery } from "next-sanity";

const image = `"image": image.asset->url, "alt": image.alt`;
const gallery = `{ "src": asset->url, alt }`;
const section = `{ title, note, featured, "dishes": coalesce(dishes[]{ name, description, price }, []) }`;

export const settingsQuery = defineQuery(`*[_id == "siteSettings"][0]{
  name, tagline, address, phone, email, bookingUrl, mapsUrl, dietary,
  hours[]{ days, time },
  social[]{ label, href }
}`);

export const homeQuery = defineQuery(`*[_id == "homePage"][0]{
  intro, introSub, body,
  promos[]{ "id": _key, eyebrow, title, "body": coalesce(body, []), cta{ label, href }, ${image} }
}`);

export const aboutQuery = defineQuery(`*[_id == "aboutPage"][0]{
  title, paragraphs, name, regions,
  "slides": slides[]${gallery},
  "gallery": gallery[]${gallery}
}`);

export const privateDiningQuery = defineQuery(`*[_id == "privateDiningPage"][0].intro`);

export const whatsOnPageQuery = defineQuery(`*[_id == "whatsOnPage"][0]{ eyebrow, title, intro }`);

export const eventsQuery = defineQuery(`*[_type == "event" && defined(slug.current)] | order(order asc, _createdAt desc){
  "slug": slug.current, title, category, summary, date, ${image},
  "menu": menu->slug.current
}`);

export const menusQuery = defineQuery(`*[_type == "menu" && defined(slug.current)] | order(order asc, _createdAt asc){
  "id": slug.current, label, title, price, intro,
  "pdf": pdf.asset->url,
  "sections": coalesce(sections[]${section}, []),
  "columns": columns[]{ title, price, "sections": coalesce(sections[]${section}, []) }
}`);

export const postsQuery = defineQuery(`*[_type == "post" && defined(slug.current)] | order(date desc){
  "slug": slug.current, title, excerpt, date, ${image},
  "intro": coalesce(intro, []), "body": coalesce(body, []), outro
}`);
