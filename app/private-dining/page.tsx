import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui";
import { PrivateDiningEnquiryForm } from "@/components/private-dining-enquiry-form";
import { privateDining, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Private Dining",
  description: "Private dining, group celebrations and Mediterranean menus at Olea Social in Covent Garden.",
};

export default function PrivateDiningPage() {
  return (
    <>
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-forest-950 pt-28">
        <Image
          src="/images/dining-room.jpg"
          alt="Olea Social's dining room, ready for a private gathering"
          fill
          priority
          sizes="100vw"
          className="animate-slow-zoom object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
        <Container className="relative pb-10">
          <p className="eyebrow mb-4 text-brass">Private dining</p>
          <h1 className="animate-rise font-display text-6xl font-light text-cream sm:text-8xl">Olea Social</h1>
          <p className="mt-3 font-display text-2xl text-white/85 sm:text-3xl">Covent Garden</p>
        </Container>
      </section>

      <section className="bg-forest-900 py-10 sm:py-14">
        <Container className="max-w-5xl">
          <p className="font-display text-xl leading-relaxed text-white/85 sm:text-2xl">{privateDining}</p>
        </Container>
      </section>

      <section aria-label="Private dining at Olea Social" className="bg-forest-950 py-8 sm:py-12">
        <Container className="grid gap-4 sm:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/dining-room.jpg"
              alt="The Olea Social dining room set for a private gathering"
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/hero.jpg"
              alt="Mediterranean dishes prepared for sharing around the table"
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      <section id="enquire" className="scroll-mt-20 bg-forest-900 py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-brass">Make an enquiry</p>
            <h2 className="mt-6 font-display text-4xl font-light leading-tight text-cream sm:text-5xl">
              Send us a message today to plan your private dining
            </h2>
            <p className="mt-6 leading-relaxed text-white/70">
              Tell us about your occasion and our team will help you plan a gathering at Olea Social.
            </p>
            <address className="mt-8 text-sm not-italic leading-relaxed text-white/70">
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
            <PrivateDiningEnquiryForm phone={site.phone} phoneHref={site.phoneHref} />
          </div>
        </Container>
      </section>
    </>
  );
}
