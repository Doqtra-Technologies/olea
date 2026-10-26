import type { PortableTextBlock } from "@portabletext/react";

/** Converts heading + paragraph sections into Portable Text blocks. */
export function sectionsToBlocks(sections: { heading: string; body: string[] }[]): PortableTextBlock[] {
  let n = 0;
  const block = (style: string, text: string): PortableTextBlock => {
    const key = `b${n++}`;
    return {
      _type: "block",
      _key: key,
      style,
      markDefs: [],
      children: [{ _type: "span", _key: `${key}s`, text, marks: [] }],
    };
  };
  return sections.flatMap((s) => [block("h2", s.heading), ...s.body.map((p) => block("normal", p))]);
}
