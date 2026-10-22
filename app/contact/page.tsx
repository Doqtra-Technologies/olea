import type { Metadata } from "next";
import { Button, Container, PageHero } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Opening hours, address and telephone for Olea Social, 10 Upper St Martin's Lane, Covent Garden.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        image="/images/exterior.jpg"
        alt="The Olea Social dining room"
        eyebrow="Contact & location"
        title="Olea Social Covent Garden"
      >
        <address className="not-italic">
          <p>
            {site.address.line1}, {site.address.city} {site.address.postcode}
          </p>
          <a href={site.phoneHref} className="hover:text-brass">
            {site.phone}
          </a>
        </address>
      </PageHero>

      <section className="bg-cream py-16 text-ink sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 className="font-display text-3xl text-forest-800">Opening times</h2>
            <dl className="mt-6 space-y-5">
              {site.hours.map((h) => (
                <div key={h.days}>
                  <dt className="eyebrow text-[10px] text-leaf">{h.days}</dt>
                  <dd className="mt-1 font-display text-2xl">{h.time}</dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-12 font-display text-3xl text-forest-800">Where to find us</h2>
            <address className="mt-6 not-italic leading-relaxed">
              {site.address.line1}
              <br />
              {site.address.city} {site.address.postcode}
              <br />
              <a href={site.phoneHref} className="underline underline-offset-4 hover:text-leaf">
                {site.phone}
              </a>
            </address>
            <p className="mt-4 text-sm text-ink/60">A short walk from Covent Garden and Leicester Square.</p>

            <div className="mt-8 flex flex-col gap-3 sm:max-w-xs">
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-forest-800 px-6 py-3 text-center font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-cream hover:bg-forest-700"
              >
                Map &amp; directions
              </a>
              <Button href="/book" variant="outline" className="!border-forest-800 !text-forest-800 hover:!bg-forest-800 hover:!text-cream">
                Book now
              </Button>
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden border border-ink/10 lg:col-span-8">
            <iframe
              title="Map showing Olea Social on Upper St Martin's Lane"
              src={site.mapsEmbed}
              className="absolute inset-0 h-full w-full grayscale-[40%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
