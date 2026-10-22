"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { site, type home } from "@/lib/site";

type Promo = (typeof home.promos)[number];

export function PromoCarousel({ promos }: { promos: Promo[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const promo = promos[index];
  const go = (dir: number) => setIndex((i) => (i + dir + promos.length) % promos.length);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % promos.length), 7000);
    return () => clearTimeout(t);
  }, [index, paused, promos.length]);

  return (
    <section
      className="bg-sand pb-16 pt-14 text-ink sm:pb-20 sm:pt-20"
      aria-roledescription="carousel"
      aria-label="Promotions"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="relative grid lg:grid-cols-12 lg:items-center">
          <div className="relative aspect-[4/3] overflow-hidden lg:col-span-10 lg:col-start-3 lg:row-start-1 lg:aspect-[16/10]">
            {promos.map((p, i) => (
              <Image
                key={p.id}
                src={p.image}
                alt={p.alt}
                fill
                sizes="(min-width: 1024px) 80vw, 100vw"
                className={`object-cover transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
              />
            ))}
          </div>
          <div
            key={promo.id}
            aria-live="polite"
            className="animate-rise relative -mt-12 bg-forest-800 p-8 text-center text-cream shadow-xl sm:mx-8 sm:p-12 lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:mx-0 lg:mt-16"
          >
            <p className="eyebrow text-[10px] text-leaf-light">{promo.eyebrow}</p>
            <h2 className="mt-5 font-display text-3xl font-light sm:text-4xl">{promo.title}</h2>
            <div className="mx-auto mt-6 max-w-sm space-y-3 text-sm leading-relaxed text-cream/80">
              {promo.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <Link
              href={promo.cta.href}
              className="mt-8 inline-block border-b border-brass pb-1 font-mono text-[11px] font-medium uppercase tracking-[0.25em] text-brass hover:opacity-70"
            >
              {promo.cta.label}
            </Link>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous promotion"
              onClick={() => go(-1)}
              className="flex h-9 w-9 items-center justify-center border border-ink/40 hover:bg-ink hover:text-sand"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <div className="flex gap-2">
              {promos.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  aria-label={`Show ${p.title}`}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                  className={`h-0.5 w-8 transition-colors ${i === index ? "bg-ink" : "bg-ink/25"}`}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next promotion"
              onClick={() => go(1)}
              className="flex h-9 w-9 items-center justify-center border border-ink/40 hover:bg-ink hover:text-sand"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
          <a
            href={site.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-forest-800 px-6 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-cream hover:bg-forest-700"
          >
            Reserve now
          </a>
        </div>
      </div>
    </section>
  );
}
