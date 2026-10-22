"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { WhatsOnItem } from "@/lib/site";

export function WhatsOnGrid({ items }: { items: WhatsOnItem[] }) {
  const categories = ["All", ...new Set(items.map((i) => i.category))];
  const [filter, setFilter] = useState("All");
  const shown = filter === "All" ? items : items.filter((i) => i.category === filter);

  return (
    <>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter events">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
            className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
              filter === c ? "border-forest-800 bg-forest-800 text-white" : "border-forest-800/30 text-forest-800/80 hover:border-forest-800"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((item) => (
          <Link
            key={item.slug}
            href={`/whats-on/${item.slug}`}
            className="animate-rise group block border border-ink/15 bg-cream transition-shadow hover:shadow-lg"
          >
            <div className={`relative overflow-hidden ${item.category === "Events" ? "aspect-[4/3] bg-white" : "aspect-square"}`}>
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className={`transition-transform duration-700 group-hover:scale-105 ${item.category === "Events" ? "object-contain" : "object-cover"}`}
              />
            </div>
            <div className="min-h-32 p-5">
              <p className="eyebrow text-[10px] text-leaf">{item.category}</p>
              <h3 className="mt-3 font-display text-2xl">{item.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/70">{item.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
