import { PortableText, type PortableTextBlock, type PortableTextComponents } from "@portabletext/react";

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="mt-14 font-display text-3xl text-forest-800">{children}</h2>,
    normal: ({ children }) => <p className="mt-5 leading-relaxed text-ink/80">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="mt-5 list-disc space-y-2 pl-6 leading-relaxed text-ink/80">{children}</ul>,
  },
  marks: {
    link: ({ children, value }) => (
      <a href={value?.href} className="underline underline-offset-4 hover:text-leaf">
        {children}
      </a>
    ),
  },
};

export function PostBody({ value }: { value: PortableTextBlock[] }) {
  return <PortableText value={value} components={components} />;
}
