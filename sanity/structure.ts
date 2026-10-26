import type { StructureResolver } from "sanity/structure";

const singleton = (S: Parameters<StructureResolver>[0], id: string, title: string) =>
  S.listItem().title(title).id(id).child(S.document().schemaType(id).documentId(id).title(title));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      singleton(S, "siteSettings", "Site settings"),
      S.divider(),
      singleton(S, "homePage", "Home page"),
      singleton(S, "aboutPage", "About page"),
      singleton(S, "privateDiningPage", "Private dining page"),
      singleton(S, "whatsOnPage", "What's On page"),
      S.divider(),
      S.documentTypeListItem("event").title("What's On items"),
      S.documentTypeListItem("menu").title("Menus"),
      S.documentTypeListItem("post").title("Blog posts"),
    ]);
