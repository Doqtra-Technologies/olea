"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { WhatsOnEntry } from "@/lib/content";

const PAST = "Past events";

export function WhatsOnGrid({ items }: { items: WhatsOnEntry[] }) {
  // Finished events only appear under Past events, so the other tabs stay current.
  const upcoming = items.filter((i) => !i.past);
  const past = items.filter((i) => i.past);
  const categories = ["All", ...new Set(upcoming.map((i) => i.category)), ...(past.length ? [PAST] : [])];
  const [filter, setFilter] = useState("All");
  const shown = filter === PAST ? past : filter === "All" ? upcoming : upcoming.filter((i) => i.category === filter);

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
      {shown.length === 0 && <p className="mt-8 font-display text-2xl text-ink/70">New events coming soon.</p>}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((item) => (
          <Link
            key={item.slug}
            href={`/whats-on/${item.slug}`}
            className="animate-rise group block border border-ink/15 bg-cream transition-shadow hover:shadow-lg"
          >
            <div className="relative aspect-[5/7] overflow-hidden">
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className={`object-cover object-top transition-transform duration-700 group-hover:scale-105 ${item.past ? "opacity-80 grayscale-[35%]" : ""}`}
              />
            </div>
            <div className="min-h-32 p-5">
              <p className="eyebrow text-[10px] text-leaf">{item.past ? `${item.category} · Past event` : item.category}</p>
              <h3 className="mt-3 font-display text-2xl">{item.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/70">{item.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
