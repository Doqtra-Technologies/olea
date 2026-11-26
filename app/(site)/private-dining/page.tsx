import type { Metadata } from "next";
import Image from "next/image";
import { Button, Container } from "@/components/ui";
import { PrivateDiningEnquiryForm } from "@/components/private-dining-enquiry-form";
import { getMenus, getPrivateDiningIntro, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Group Booking",
  description:
    "Private dining, business meetings, group celebrations and Eastern Mediterranean menus at Olea Social in Covent Garden.",
};

const businessImages = [
  { src: "/images/business-1.webp", alt: "Long tables and green leather chairs laid out in Olea Social's lower dining room" },
  { src: "/images/business-2.webp", alt: "A meeting table set with notepads and water beside the windows, under hanging greenery" },
  { src: "/images/business-3.webp", alt: "Rows of tables arranged for a group meeting in the Olea Social dining room" },
];

export default async function PrivateDiningPage() {
  const [privateDining, site, menus] = await Promise.all([getPrivateDiningIntro(), getSettings(), getMenus()]);
  // The group set menus are the Party Menu tabs on /menu (slugs party-menu-1, party-menu-2, …).
  const groupMenus = menus.filter((m) => m.id.startsWith("party-menu"));
  return (
    <>
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-forest-950 pt-28">
        <Image
          src="/images/private-dining-1.webp"
          alt="Long tables laid for a private event at Olea Social, with a screen set up at the far end"
          fill
          priority
          sizes="100vw"
          className="animate-slow-zoom object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
        <Container className="relative pb-10">
          <p className="eyebrow mb-4 text-brass">Group booking</p>
          <h1 className="animate-rise font-display text-6xl font-light text-cream sm:text-8xl">Olea Social</h1>
          <p className="mt-3 font-display text-2xl text-white/85 sm:text-3xl">Covent Garden</p>
        </Container>
      </section>

      <section className="bg-forest-900 py-10 sm:py-14">
        <Container className="max-w-5xl">
          <p className="font-display text-xl leading-relaxed text-white/85 sm:text-2xl">{privateDining}</p>
        </Container>
      </section>

      <section aria-label="Group booking at Olea Social" className="bg-forest-950 py-8 sm:py-12">
        <Container>
          <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[21/9]">
            <Image
              src="/images/private-dining-2.webp"
              alt="Olea Social's main dining room, with green banquettes and hanging greenery above the tables"
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

      {groupMenus.length > 0 && (
        <section aria-labelledby="group-menus" className="bg-forest-950 pb-16 sm:pb-24">
          <Container>
            <p className="eyebrow text-brass">Set menus for groups</p>
            <h2 id="group-menus" className="mt-6 font-display text-4xl font-light leading-tight text-cream sm:text-5xl">
              Group Menus
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {groupMenus.map((m) => (
                <div key={m.id} className="flex flex-col border border-white/15 p-6 sm:p-8">
                  <div className="flex flex-col gap-2 border-b border-white/10 pb-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <h3 className="font-display text-3xl text-cream">{m.title}</h3>
                    {m.price && <p className="eyebrow text-brass">{m.price}</p>}
                  </div>
                  <ul className="mt-6 flex-1 space-y-2 text-sm leading-relaxed text-white/70">
                    {m.sections.map((s) => (
                      <li key={s.title}>
                        <span className="text-white">{s.title}:</span> {s.dishes.map((d) => d.name).join(", ")}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button href={`/menu#${m.id}`}>View menu</Button>
                    {m.pdf && (
                      <Button href={m.pdf} variant="light">
                        Download PDF
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

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
