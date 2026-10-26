"use client";

import { useState, useSyncExternalStore } from "react";
import type { Menu, MenuSection } from "@/lib/menus";

function subscribeHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

function Section({ section }: { section: MenuSection }) {
  return (
    <div className={section.featured ? "border border-leaf/50 p-6 sm:p-8" : ""}>
      <h3 className="font-display text-3xl font-light text-cream">{section.title}</h3>
      {section.note && <p className="eyebrow mt-2 text-[10px] text-leaf-light">{section.note}</p>}
      <ul className="mt-6 divide-y divide-white/10">
        {section.dishes.map((d) => (
          <li key={d.name} className="flex gap-6 py-4">
            <div className="flex-1">
              <p className="font-mono text-sm text-white">{d.name}</p>
              {d.description && <p className="mt-1 text-sm leading-relaxed text-white/60">{d.description}</p>}
            </div>
            {d.price && <p className="font-mono text-sm text-brass">{d.price}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MenuTabs({ menus, dietary }: { menus: Menu[]; dietary: string }) {
  const hash = useSyncExternalStore(subscribeHash, () => window.location.hash.slice(1), () => "");
  const [picked, setPicked] = useState<string | null>(null);
  const active = picked ?? (menus.some((m) => m.id === hash) ? hash : menus[0].id);
  const menu = menus.find((m) => m.id === active) ?? menus[0];

  const select = (id: string) => {
    setPicked(id);
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <>
      <section id="menu-select" className="scroll-mt-24 bg-forest-900 py-10">
        <div role="tablist" aria-label="Menus" className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3 px-5">
          {menus.map((m) => (
            <button
              key={m.id}
              role="tab"
              id={`tab-${m.id}`}
              type="button"
              aria-selected={m.id === active}
              aria-controls="menu-panel"
              onClick={() => select(m.id)}
              className={`border px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
                m.id === active ? "border-brass text-brass" : "border-white/30 text-white/80 hover:border-white"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </section>

      <section id="menu-panel" role="tabpanel" aria-labelledby={`tab-${menu.id}`} className="bg-forest-950 py-16 sm:py-20">
        <div key={menu.id} className="animate-rise mx-auto max-w-5xl px-5 sm:px-8">
          <div className="text-center">
            <h2 className="font-display text-4xl font-light text-cream sm:text-5xl">{menu.title}</h2>
            {menu.price && <p className="eyebrow mt-4 text-brass">{menu.price}</p>}
            {menu.intro && <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-white/70">{menu.intro}</p>}
            {menu.pdf && (
              <a
                href={menu.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="eyebrow mt-6 inline-block border-b border-white/30 pb-1 text-[10px] text-white/70 hover:border-brass hover:text-brass"
              >
                Download PDF
              </a>
            )}
          </div>

          {menu.columns ? (
            <div className="mt-14 grid gap-12 md:grid-cols-2">
              {menu.columns.map((col) => (
                <div key={col.title} className="border border-white/10 p-6 sm:p-8">
                  <div className="flex items-baseline justify-between border-b border-white/10 pb-4">
                    <h3 className="eyebrow text-white">{col.title}</h3>
                    <p className="font-display text-2xl text-brass">{col.price} pp</p>
                  </div>
                  <div className="mt-8 space-y-10">
                    {col.sections.map((s) => (
                      <Section key={s.title} section={s} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`mt-14 gap-x-16 ${menu.sections.length > 1 ? "md:columns-2" : "mx-auto max-w-2xl"}`}>
              {menu.sections.map((s) => (
                <div key={s.title} className="mb-14 break-inside-avoid">
                  <Section section={s} />
                </div>
              ))}
            </div>
          )}

          <div className="mt-16 border-t border-white/10 pt-8 text-center">
            <p className="text-xs text-white/50">(V) vegetarian · (VG) vegan</p>
            <p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-white/40">{dietary}</p>
          </div>
        </div>
      </section>
    </>
  );
}
