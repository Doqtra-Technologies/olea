import type { Metadata } from "next";
import { MenuTabs } from "@/components/menu-tabs";
import { Container, PageHero, ReserveFab } from "@/components/ui";
import { getMenuNotice, getMenus, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "A la carte, gluten free, set lunch, meze lunch, pre-theatre, kids and Christmas menus at Olea Social, Covent Garden.",
};

export default async function MenuPage() {
  const [menus, { dietary }, notice] = await Promise.all([getMenus(), getSettings(), getMenuNotice()]);
  return (
    <>
      <PageHero
        image="/images/our-menus.webp"
        alt="Two guests raising glasses of white wine over a table of meze, tabbouleh and bread"
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
      {notice && (
        <section aria-label="Menu availability" className="bg-forest-900 pt-10">
          <Container className="max-w-4xl">
            <div role="note" className="border border-brass bg-brass/10 px-6 py-6 text-center sm:px-10">
              <p className="eyebrow text-[10px] text-brass">Festive season</p>
              <p className="mt-3 font-display text-lg leading-relaxed text-cream sm:text-xl">{notice}</p>
            </div>
          </Container>
        </section>
      )}
      <MenuTabs menus={menus} dietary={dietary} />
      <ReserveFab />
    </>
  );
}
