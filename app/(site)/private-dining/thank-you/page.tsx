import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui";
import { PrivateDiningThankYou } from "@/components/private-dining-thank-you";
import { getSettings } from "@/lib/content";

// Google Ads conversion URL: only reached via the enquiry form after a successful send.
export const metadata: Metadata = {
  title: "Enquiry sent",
  robots: { index: false, follow: false },
};

export default async function PrivateDiningThankYouPage() {
  const site = await getSettings();
  return (
    <>
      <section className="relative flex min-h-[50vh] items-end overflow-hidden bg-forest-950 pt-28">
        <Image
          src="/images/private-dining-1.webp"
          alt="Long tables laid for a private event at Olea Social, with a screen set up at the far end"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
        <Container className="relative pb-10">
          <p className="eyebrow mb-4 text-brass">Group booking</p>
          <h1 className="font-display text-6xl font-light text-cream sm:text-8xl">Olea Social</h1>
          <p className="mt-3 font-display text-2xl text-white/85 sm:text-3xl">Covent Garden</p>
        </Container>
      </section>

      <section className="bg-forest-900 py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-brass">Make an enquiry</p>
            <address className="mt-6 text-sm not-italic leading-relaxed text-white/70">
              {site.address.line1}
              <br />
              {site.address.city} {site.address.postcode}
              <br />
              <a href={site.phoneHref} className="mt-2 inline-block text-brass underline underline-offset-4 hover:text-white">
                {site.phone}
              </a>
            </address>
          </div>
          <div className="lg:col-span-8">
            <PrivateDiningThankYou phone={site.phone} />
          </div>
        </Container>
      </section>
    </>
  );
}
