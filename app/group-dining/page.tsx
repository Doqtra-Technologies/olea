import type { Metadata } from "next";
import Image from "next/image";
import { Button, Container } from "@/components/ui";
import { privateDining, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Private Dining",
  description: "Private dining, group celebrations and Mediterranean menus at Olea Social in Covent Garden.",
};

export default function PrivateDiningPage() {
  return (
    <>
      <section className="bg-forest-950">
        <div className="relative flex min-h-[70vh] items-end overflow-hidden pt-28">
          <Image
            src="/images/dining-room.jpg"
            alt="Olea Social's dining room, ready for a private gathering"
            fill
            priority
            sizes="100vw"
            className="animate-slow-zoom object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
          <Container className="relative pb-8">
            <p className="eyebrow mb-4 text-brass">Private dining</p>
            <h1 className="animate-rise font-display text-6xl font-light text-cream sm:text-8xl">A table of your own</h1>
          </Container>
        </div>
        <div className="bg-forest-900">
          <Container className="flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
            <p className="max-w-3xl text-sm leading-relaxed text-white/80">{privateDining}</p>
            <a
              href="#enquire"
              className="eyebrow flex items-center gap-3 whitespace-nowrap border-white/20 text-white hover:text-brass md:border-l md:pl-8"
            >
              Enquire now →
            </a>
          </Container>
        </div>
      </section>

      <section className="bg-sand py-16 text-ink sm:py-24">
        <Container>
          <h2 className="eyebrow font-medium">Made for coming together</h2>
          <div className="mt-2 h-px w-8 bg-leaf" />
          <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <h3 className="font-display text-4xl font-light sm:text-5xl">Gather around the table</h3>
              <p className="mt-6 max-w-2xl leading-relaxed text-ink/75">
                Bring friends, family or colleagues together over Mediterranean dishes made for sharing.
                From a relaxed lunch to a special celebration, our team can help plan your visit.
              </p>
            </div>
            <div className="border border-ink/15 p-8 lg:col-span-5">
              <p className="eyebrow text-leaf">In the heart of Covent Garden</p>
              <address className="mt-4 text-sm not-italic leading-relaxed text-ink/75">
                {site.address.line1}
                <br />
                {site.address.city} {site.address.postcode}
              </address>
              <a href={site.phoneHref} className="mt-4 inline-block font-display text-2xl text-forest-800 underline-offset-4 hover:underline">
                {site.phone}
              </a>
            </div>
          </div>
        </Container>
      </section>

      <section id="enquire" className="scroll-mt-20 bg-forest-950 py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="eyebrow text-brass">Private dining enquiries</p>
            <h2 className="mt-4 font-display text-4xl font-light text-cream sm:text-5xl">Let&apos;s plan your gathering</h2>
            <p className="mt-6 max-w-xl leading-relaxed text-white/70">
              Call our team to discuss your preferred date, group size and menu. We&apos;ll help you plan
              a memorable occasion at Olea Social.
            </p>
          </div>
          <div className="space-y-4 border border-white/10 p-8 lg:col-span-5">
            <p className="eyebrow text-[10px] text-white/50">Call the restaurant</p>
            <a href={site.phoneHref} className="block font-display text-3xl text-cream hover:text-brass">
              {site.phone}
            </a>
            <div className="flex flex-wrap gap-3 pt-4">
              <Button href="/book">Book online</Button>
              <Button href="/menu#christmas" variant="light">
                Festive menus
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
