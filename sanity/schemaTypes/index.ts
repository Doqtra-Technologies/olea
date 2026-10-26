import { event, menu, post } from "./documents";
import { dish, imageWithAlt, link, menuColumn, menuSection } from "./objects";
import { aboutPage, homePage, privateDiningPage, whatsOnPage } from "./pages";
import { siteSettings } from "./siteSettings";

export const singletonTypes = new Set(["siteSettings", "homePage", "aboutPage", "privateDiningPage", "whatsOnPage"]);

export const schemaTypes = [
  siteSettings,
  homePage,
  aboutPage,
  privateDiningPage,
  whatsOnPage,
  event,
  menu,
  post,
  imageWithAlt,
  dish,
  menuSection,
  menuColumn,
  link,
];
