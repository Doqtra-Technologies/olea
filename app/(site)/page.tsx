import Image from "next/image";
import Link from "next/link";
import { LeafMark, Logotype } from "@/components/brand";
import { PromoCarousel } from "@/components/promo-carousel";
import { Arrow, BookingLink, Button, Container } from "@/components/ui";
import { getHome, getSettings, getStory, getWhatsOn } from "@/lib/content";

export default async function Home() {
  const [home, site, story, whatsOn] = await Promise.all([getHome(), getSettings(), getStory(), getWhatsOn()]);
  return (
    <>
      <section className="relative flex min-h-screen items-center overflow-hidden bg-forest-950">
        <Image
          src="/images/hero.jpg"
          alt="A table of Mediterranean sharing dishes, wine and bread at Olea Social"
          fill
          priority
          sizes="100vw"
          className="animate-slow-zoom object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/10" />
        <Container className="relative">
          <div className="animate-rise">
            <h1>
              <span className="sr-only">Olea Social</span>
              <Logotype className="w-[88vw] max-w-[760px] text-cream drop-shadow-lg" title="" />
            </h1>
            <p className="mt-6 max-w-md font-display text-xl text-white/85 sm:text-2xl">{site.tagline}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <BookingLink>Book a table</BookingLink>
              <Button href="/menu" variant="light">
                View menus
              </Button>
            </div>
          </div>
        </Container>
        <div className="absolute bottom-6 left-5 flex items-center gap-3 sm:left-8 lg:left-12">
          <span className="h-10 w-px bg-brass" />
          <span className="eyebrow text-white/70">The modern Mediterranean</span>
        </div>
      </section>

      <section className="relative overflow-hidden bg-forest-900 py-20 sm:py-28">
        <LeafMark className="pointer-events-none absolute -right-24 top-10 hidden h-[520px] w-auto text-forest-800 lg:block" />
        <Container className="relative">
          <p className="reveal max-w-5xl font-display text-3xl font-light leading-snug text-white sm:text-4xl lg:text-5xl">
            <span className="block">{home.intro}</span>
            <span className="mt-2 block text-leaf-light">{home.introSub}</span>
          </p>
          <p className="reveal mt-10 max-w-3xl text-base leading-relaxed text-white/75 sm:text-lg">{home.body}</p>
          <ul className="reveal mt-10 flex flex-wrap gap-x-6 gap-y-2">
            {story.regions.map((r) => (
              <li key={r} className="eyebrow text-brass">
                {r}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <PromoCarousel promos={home.promos} />

      <section className="bg-forest-900 py-16 sm:py-24">
        <Container>
          <h2 className="eyebrow font-medium text-white">Find us in Covent Garden</h2>
          <div className="mt-2 h-px w-8 bg-brass" />
          <div className="mt-8 grid gap-4 lg:grid-cols-12">
            <Link href="/contact" className="group relative block aspect-[4/5] overflow-hidden lg:col-span-5">
              <Image
                src="/images/find-us.jpg"
                alt="Sunlit tables set for guests beside Olea Social's street-facing windows"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />
              <div className="absolute left-5 right-5 top-5 flex items-start gap-3">
                <span className="border border-white/70 px-2 py-1 font-mono text-[9px] uppercase leading-tight tracking-[0.15em] text-white">
                  London
                </span>
                <span className="font-display text-2xl leading-tight text-white">Olea Social Covent Garden</span>
              </div>
              <span className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 text-white transition-colors group-hover:bg-white group-hover:text-forest-900">
                <Arrow />
              </span>
            </Link>

            <div className="flex flex-col justify-between gap-10 bg-forest-800 p-8 sm:p-12 lg:col-span-7">
              <div>
                <p className="font-display text-3xl font-light leading-snug text-cream sm:text-4xl">
                  A short walk from Covent Garden and Leicester Square, on Upper St Martin&apos;s Lane.
                </p>
                <div className="mt-10 grid gap-8 sm:grid-cols-2">
                  <div>
                    <h3 className="eyebrow text-leaf-light">Opening hours</h3>
                    <dl className="mt-4 space-y-3 text-sm text-white/80">
                      {site.hours.map((h) => (
                        <div key={h.days}>
                          <dt className="font-medium text-white">{h.days}</dt>
                          <dd>{h.time}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <div>
                    <h3 className="eyebrow text-leaf-light">Where to find us</h3>
                    <address className="mt-4 text-sm not-italic leading-relaxed text-white/80">
                      {site.address.line1}
                      <br />
                      {site.address.city} {site.address.postcode}
                      <br />
                      <a href={site.phoneHref} className="underline underline-offset-4 hover:text-brass">
                        {site.phone}
                      </a>
                    </address>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <BookingLink>Book now</BookingLink>
                <Button href="/private-dining" variant="light">
                  Private dining
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-forest-950 py-16 sm:py-24">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 className="eyebrow font-medium text-white">What&apos;s on</h2>
              <div className="mt-2 h-px w-8 bg-brass" />
            </div>
            <Link href="/whats-on" className="eyebrow flex items-center gap-3 text-white hover:text-brass">
              See everything <Arrow />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {whatsOn.items.map((item) => (
              <Link
                key={item.slug}
                href={`/whats-on/${item.slug}`}
                className="reveal group flex h-full flex-col overflow-hidden bg-cream"
              >
                <div className="relative aspect-[5/7] overflow-hidden bg-forest-900">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 items-center justify-between gap-4 p-5">
                  <div>
                    <p className="eyebrow text-[10px] text-leaf">{item.category}</p>
                    <p className="mt-2 font-display text-2xl leading-tight text-ink">{item.title}</p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/40 text-ink transition-colors group-hover:bg-ink group-hover:text-cream">
                    <Arrow />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
