import type { Metadata } from "next";
import Image from "next/image";
import { LeafMark } from "@/components/brand";
import { StorySlider } from "@/components/story-slider";
import { BookingLink, Button, Container } from "@/components/ui";
import { getStory } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Story",
  description: "How Olea Social brought the food cultures of the Mediterranean together under one roof in Covent Garden.",
};

export default async function AboutPage() {
  const story = await getStory();
  return (
    <>
      <section className="bg-forest-950 pt-20">
        <div className="grid min-h-[80vh] lg:grid-cols-2">
          <StorySlider slides={story.slides} />
          <div className="flex items-center bg-forest-900 px-6 py-16 sm:px-12 lg:px-16">
            <div className="animate-rise max-w-lg">
              <p className="eyebrow text-brass">About us</p>
              <h1 className="mt-4 font-display text-5xl font-light leading-tight text-cream sm:text-6xl">{story.title}</h1>
              <div className="mt-8 space-y-5 text-sm leading-relaxed text-white/75 sm:text-base">
                {story.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-sand py-20 text-ink sm:py-28">
        <Container className="grid items-center gap-12 lg:grid-cols-12">
          <div className="reveal flex justify-center lg:col-span-4">
            <LeafMark className="h-64 w-auto text-leaf sm:h-80" title="Olea leaf" />
          </div>
          <div className="reveal lg:col-span-8">
            <p className="eyebrow text-leaf">What&apos;s in a name</p>
            <h2 className="mt-4 font-display text-4xl font-light leading-tight sm:text-5xl">
              <span className="italic">Olea</span>, the olive tree. <span className="italic">Social</span>, the table we share.
            </h2>
            <div className="mt-8 max-w-2xl space-y-5 leading-relaxed text-ink/80">
              {story.name.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-forest-900 py-16 sm:py-20">
        <Container>
          <h2 className="eyebrow font-medium text-white">Flavours from six coasts</h2>
          <div className="mt-2 h-px w-8 bg-brass" />
          <ul className="mt-10 grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-3 lg:grid-cols-6">
            {story.regions.map((r) => (
              <li key={r} className="reveal bg-forest-900 py-10 text-center font-display text-2xl font-light text-cream">
                {r}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-forest-950 py-16 sm:py-20">
        <Container>
          <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2" aria-label="Gallery">
            {story.gallery.map((g, i) => (
              <div key={`${g.src}-${i}`} className="relative aspect-[3/4] w-[62%] shrink-0 snap-start sm:w-[32%] lg:w-[calc(20%-9.6px)]">
                <Image src={g.src} alt={g.alt} fill sizes="(min-width: 1024px) 20vw, 60vw" className="object-cover" />
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap gap-3">
            <Button href="/menu">Explore the menu</Button>
            <BookingLink variant="light">
              Book a table
            </BookingLink>
          </div>
        </Container>
      </section>
    </>
  );
}
