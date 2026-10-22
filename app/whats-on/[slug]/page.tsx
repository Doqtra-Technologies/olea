import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingLink, Button, Container, PageHero } from "@/components/ui";
import { menus } from "@/lib/menus";
import { whatsOn } from "@/lib/site";

export function generateStaticParams() {
  return whatsOn.items.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps<"/whats-on/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = whatsOn.items.find((i) => i.slug === slug);
  return item ? { title: item.title, description: item.summary } : {};
}

export default async function WhatsOnItemPage({ params }: PageProps<"/whats-on/[slug]">) {
  const { slug } = await params;
  const item = whatsOn.items.find((i) => i.slug === slug);
  if (!item) notFound();
  const menu = menus.find((m) => m.id === item.menu);
  const others = whatsOn.items.filter((i) => i.slug !== slug);

  return (
    <>
      <PageHero
        image={item.heroImage}
        alt={item.heroAlt ?? item.alt}
        eyebrow={item.category}
        title={item.title}
        back={{ href: "/whats-on", label: "What's On" }}
      />

      <section className="bg-cream py-16 text-ink sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            {item.date && <p className="eyebrow mb-4 text-leaf">{item.date}</p>}
            <p className="font-display text-2xl leading-relaxed sm:text-3xl">{item.summary}</p>
            {menu && (
              <div className="mt-10 border-t border-ink/15 pt-8">
                <p className="eyebrow text-leaf">{menu.title}</p>
                {menu.price && <p className="mt-2 font-display text-3xl">{menu.price}</p>}
                {menu.columns && (
                  <p className="mt-2 font-display text-3xl">
                    {menu.columns.map((c) => `${c.title} ${c.price}`).join(" · ")}
                  </p>
                )}
              </div>
            )}
            <div className="mt-10 flex flex-wrap gap-3">
              <BookingLink>{item.category === "Events" ? "Book your place" : "Book your table"}</BookingLink>
              {menu && (
                <Button href={`/menu#${menu.id}`} variant="outline" className="!text-forest-800 !border-forest-800 hover:!bg-forest-800 hover:!text-cream">
                  View the menu
                </Button>
              )}
            </div>
          </div>
          <div className={`relative bg-white lg:col-span-5 lg:col-start-8 ${item.category === "Events" ? "aspect-[3/2]" : "aspect-[4/5]"}`}>
            <Image
              src={item.image}
              alt={item.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className={item.category === "Events" ? "object-contain" : "object-cover"}
            />
          </div>
        </Container>
      </section>

      <section className="bg-forest-900 py-16">
        <Container>
          <h2 className="eyebrow font-medium text-white">More at Olea Social</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {others.map((o) => (
              <Link key={o.slug} href={`/whats-on/${o.slug}`} className="group flex items-center gap-5 border border-white/10 p-4 hover:border-brass">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden">
                  <Image src={o.image} alt="" fill sizes="96px" className="object-cover" />
                </div>
                <div>
                  <p className="eyebrow text-[10px] text-leaf-light">{o.category}</p>
                  <p className="mt-1 font-display text-2xl text-cream group-hover:text-brass">{o.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
