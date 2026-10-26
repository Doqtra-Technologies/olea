import type { Metadata } from "next";
import { Container, PageHero, ReserveFab } from "@/components/ui";
import { WhatsOnGrid } from "@/components/whats-on-grid";
import { getWhatsOn } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const whatsOn = await getWhatsOn();
  return { title: "What's On", description: whatsOn.intro };
}

export default async function WhatsOnPage() {
  const whatsOn = await getWhatsOn();
  return (
    <>
      <PageHero
        image="/images/whats-on-banner.jpg"
        alt="Sunlit Olea Social dining room with hanging greenery, herringbone floor and floor-to-ceiling windows"
        eyebrow={whatsOn.eyebrow}
        title={whatsOn.title}
        back={{ href: "/", label: "Home" }}
      >
        <p>{whatsOn.intro}</p>
      </PageHero>
      <section className="bg-sand py-12 text-ink sm:py-16">
        <Container>
          <WhatsOnGrid items={whatsOn.items} />
        </Container>
      </section>
      <ReserveFab />
    </>
  );
}
