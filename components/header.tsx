"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logotype } from "@/components/brand";
import { BookingLink } from "@/components/booking-link";
import { useSettings } from "@/components/settings-provider";
import { nav } from "@/lib/site";

export function Header() {
  const site = useSettings();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // Menu is open only for the path it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "bg-forest-950/95 backdrop-blur" : "bg-gradient-to-b from-black/60 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" aria-label="Olea Social home" className="text-cream">
          <Logotype className="h-6 w-auto sm:h-7" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`font-mono text-[11px] uppercase tracking-[0.2em] transition-colors hover:text-brass ${
                  active ? "text-brass" : "text-white/90"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <BookingLink
            variant="outline"
            className="px-5 py-2.5"
          >
            Reserve
          </BookingLink>
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center text-white lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpenOn(open ? null : pathname)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M3 7h18M3 12h18M3 17h18" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="flex h-[calc(100dvh-5rem)] flex-col justify-between overflow-y-auto bg-forest-950 px-5 pb-10 pt-6 sm:px-8 lg:hidden"
        >
          <ul className="space-y-1">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block border-b border-white/10 py-4 font-display text-3xl font-light text-cream"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 space-y-4">
            <BookingLink
              className="block px-6 py-4 text-center text-xs"
            >
              Reserve a table
            </BookingLink>
            <a href={site.phoneHref} className="block text-center text-sm text-white/70">
              {site.phone}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
