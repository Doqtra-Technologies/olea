import type { Metadata } from "next";
import Image from "next/image";
import { Button, Container } from "@/components/ui";
import { PrivateDiningEnquiryForm } from "@/components/private-dining-enquiry-form";
import { getPrivateDiningIntro, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Private Dining",
  description:
    "Private dining, business meetings, group celebrations and Eastern Mediterranean menus at Olea Social in Covent Garden.",
};

const businessImages = [
  { src: "/images/business-1.webp", alt: "Long tables and green leather chairs laid out in Olea Social's lower dining room" },
  { src: "/images/business-2.webp", alt: "A meeting table set with notepads and water beside the windows, under hanging greenery" },
  { src: "/images/business-3.webp", alt: "Rows of tables arranged for a group meeting in the Olea Social dining room" },
];

export default async function PrivateDiningPage() {
  const [privateDining, site] = await Promise.all([getPrivateDiningIntro(), getSettings()]);
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
        <Container>
          <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[21/9]">
            <Image
              src="/images/dining-room.jpg"
              alt="The Olea Social dining room set for a private gathering"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      <section aria-labelledby="business-meetings" className="bg-forest-950 pb-16 pt-8 sm:pb-24 sm:pt-12">
        <Container>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="eyebrow text-brass">For business</p>
              <h2 id="business-meetings" className="mt-6 font-display text-4xl font-light leading-tight text-cream sm:text-5xl">
                Business Meetings
              </h2>
              <p className="mt-6 max-w-2xl leading-relaxed text-white/70">
                Host your next meeting, client lunch or team gathering in the heart of Covent Garden. Our private spaces
                offer a relaxed, professional setting with attentive service and menus tailored to your schedule — from
                working breakfasts to long lunches.
              </p>
            </div>
            <div className="lg:col-span-5 lg:text-right">
              <Button href="#enquire">Enquire Now</Button>
            </div>
          </div>
          <div className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
            {businessImages.map((img) => (
              <div key={img.src} className="relative aspect-[3/4] w-[80%] shrink-0 snap-start sm:w-[45%] md:w-auto">
                <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 33vw, 80vw" className="object-cover" />
              </div>
            ))}
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
            <PrivateDiningEnquiryForm phone={site.phone} />
          </div>
        </Container>
      </section>
    </>
  );
}
