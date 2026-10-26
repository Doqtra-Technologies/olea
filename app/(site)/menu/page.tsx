import type { Metadata } from "next";
import { MenuTabs } from "@/components/menu-tabs";
import { PageHero, ReserveFab } from "@/components/ui";
import { getMenus, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Menu",
  description: "A la carte, set lunch, meze lunch, pre-theatre, kids and Christmas menus at Olea Social, Covent Garden.",
};

export default async function MenuPage() {
  const [menus, { dietary }] = await Promise.all([getMenus(), getSettings()]);
  return (
    <>
      <PageHero
        image="/images/hero.jpg"
        alt="A table of Mediterranean dishes"
        eyebrow="Food & Drink"
        title="Our Menus"
      >
        <p>
          Inspired by the coasts of Turkey, Greece, Spain, Italy and Morocco — made for sharing.{" "}
          <a href="#menu-select" className="text-brass underline underline-offset-4">
            Choose a menu
          </a>
          .
        </p>
      </PageHero>
      <MenuTabs menus={menus} dietary={dietary} />
      <ReserveFab />
    </>
  );
}
