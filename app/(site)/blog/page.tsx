import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container, Rule } from "@/components/ui";
import { posts } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description: "News, stories and seasonal guides from Olea Social in Covent Garden.",
};

export default function BlogPage() {
  return (
    <section className="bg-forest-900 pb-20 pt-32">
      <Container>
        <p className="eyebrow text-brass">The Olea journal</p>
        <h1 className="mt-4 font-display text-5xl font-light text-cream sm:text-6xl">Blog</h1>
        <Rule className="mt-5" />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <p className="eyebrow mt-5 text-[10px] text-white/50">
                {new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <h2 className="mt-2 font-display text-2xl text-white group-hover:text-brass">{p.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
