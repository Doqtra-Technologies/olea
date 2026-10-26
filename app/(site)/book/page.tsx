import type { Metadata } from "next";
import Link from "next/link";
import { Container, Rule } from "@/components/ui";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Book a Table",
  description: "Reserve a table at Olea Social, Covent Garden.",
};

export default async function BookPage() {
  const site = await getSettings();
  return (
    <section className="bg-forest-900 pb-20 pt-32">
      <Container>
        <p className="eyebrow text-brass">Reserve a table</p>
        <h1 className="mt-4 font-display text-5xl font-light text-cream sm:text-6xl">
          Book your <span className="italic">table</span>
        </h1>
        <Rule className="mt-5" />
        <p className="mt-6 max-w-xl font-display text-lg text-white/80">
          Lunch, dinner, pre-theatre and group bookings at Olea Social, Covent Garden.
        </p>

        <div className="mt-10 grid gap-4 lg:grid-cols-12">
          <div
            aria-label="OpenTable booking"
            className="flex min-h-[560px] flex-col items-center justify-center gap-6 bg-cream p-8 text-center text-ink sm:p-12 lg:col-span-8"
          >
            <p className="eyebrow text-leaf">Book online with OpenTable</p>
            <h2 className="max-w-xl font-display text-4xl font-light leading-snug sm:text-5xl">
              Find a table at Olea Social
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-ink/65">
              Choose your date, time and party size through our OpenTable booking page.
            </p>
            <a
              href={site.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-14 items-center justify-center bg-brass px-10 py-4 font-mono text-sm font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:bg-brass-dark"
            >
              Book now
            </a>
            <p className="max-w-sm text-sm text-ink/60">
              Prefer to speak to our team? Call{" "}
              <a href={site.phoneHref} className="underline underline-offset-4">
                {site.phone}
              </a>
            </p>
          </div>

          <div className="space-y-px bg-white/10 lg:col-span-4">
            <div className="bg-forest-800 p-8">
              <h2 className="eyebrow text-leaf-light">Opening hours</h2>
              <dl className="mt-4 space-y-3 text-sm">
                {site.hours.map((h) => (
                  <div key={h.days}>
                    <dt className="text-white">{h.days}</dt>
                    <dd className="text-white/70">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="bg-forest-800 p-8">
              <h2 className="eyebrow text-leaf-light">Address</h2>
              <address className="mt-4 text-sm not-italic leading-relaxed text-white/80">
                {site.address.line1}
                <br />
                {site.address.city} {site.address.postcode}
              </address>
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="eyebrow mt-4 inline-block text-[10px] text-brass hover:text-white">
                Map &amp; directions →
              </a>
            </div>
            <div className="bg-forest-800 p-8">
              <h2 className="eyebrow text-leaf-light">Before you visit</h2>
              <Link href="/menu" className="mt-4 block font-display text-2xl text-cream hover:text-brass">
                Browse the menus →
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-6 text-xs text-white/50">
          For information relating to allergens, please speak to a member of our team.
        </p>
      </Container>
    </section>
  );
}
