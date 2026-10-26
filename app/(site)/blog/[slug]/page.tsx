import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Container } from "@/components/ui";
import { PostBody } from "@/components/post-body";
import { getPost, getPosts } from "@/lib/content";

export async function generateStaticParams() {
  return (await getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article className="bg-cream text-ink">
      <header className="bg-forest-900 pb-16 pt-32 text-cream">
        <Container className="max-w-4xl">
          <Link href="/blog" className="eyebrow text-brass hover:text-white">
            ← Blog
          </Link>
          <h1 className="animate-rise mt-8 font-display text-4xl font-light leading-tight sm:text-6xl">{post.title}</h1>
          <p className="eyebrow mt-6 text-[10px] text-white/50">
            {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </Container>
      </header>

      <Container className="max-w-4xl">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image src={post.image} alt={post.alt} fill priority sizes="(min-width: 1024px) 900px, 100vw" className="object-cover" />
        </div>
      </Container>

      <Container className="max-w-3xl py-16 sm:py-20">
        <div className="space-y-6 font-display text-xl leading-relaxed">
          {post.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <PostBody value={post.body} />
        <div className="mt-16 border-t border-ink/15 pt-10">
          {post.outro && <p className="font-display text-2xl">{post.outro}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/menu#christmas">Christmas menus</Button>
            <Button href="/private-dining" variant="outline" className="!border-forest-800 !text-forest-800 hover:!bg-forest-800 hover:!text-cream">
              Send an enquiry
            </Button>
          </div>
        </div>
      </Container>
    </article>
  );
}
