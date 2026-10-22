import type { Metadata } from "next";
import { Container, PageHero, ReserveFab } from "@/components/ui";
import { WhatsOnGrid } from "@/components/whats-on-grid";
import { whatsOn } from "@/lib/site";

export const metadata: Metadata = {
  title: "What's On",
  description: whatsOn.intro,
};

export default function WhatsOnPage() {
  return (
    <>
      <PageHero
        image="/images/whats-on.jpg"
        alt="Guests enjoying Mediterranean dishes and drinks at Olea Social"
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
