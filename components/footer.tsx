import Link from "next/link";
import { LeafMark, Logotype } from "@/components/brand";
import { NewsletterForm } from "@/components/newsletter-form";
import { getSettings } from "@/lib/content";

const explore = [
  { href: "/menu", label: "Menu" },
  { href: "/private-dining", label: "Private Dining" },
  { href: "/whats-on", label: "What's On" },
  { href: "/blog", label: "Blog" },
];

const heading = "font-mono text-[10px] uppercase tracking-[0.25em] text-white/40";
const link = "text-sm text-white/80 transition-colors hover:text-white";

export async function Footer() {
  const site = await getSettings();
  return (
    <footer className="bg-forest-900 text-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between gap-6 border-b border-white/10 py-12">
          <Logotype className="h-8 w-auto text-cream sm:h-10" />
          <LeafMark className="h-14 w-auto text-leaf-light" />
        </div>

        <div className="grid gap-12 py-14 md:grid-cols-3 md:gap-0">
          <div className="md:border-r md:border-white/10 md:pr-10">
            <h2 className={heading}>About us</h2>
            <ul className="mt-6 space-y-3">
              <li>
                <Link className={link} href="/about">
                  Our Story
                </Link>
              </li>
              <li>
                <Link className={link} href="/contact">
                  Contact &amp; Location
                </Link>
              </li>
              {site.social.map((s) => (
                <li key={s.href}>
                  <a className={link} href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:border-r md:border-white/10 md:px-10">
            <h2 className={heading}>Visit us</h2>
            <address className="mt-6 space-y-3 text-sm not-italic text-white/80">
              <p>
                {site.address.line1}
                <br />
                {site.address.city} {site.address.postcode}
              </p>
              <p>
                <a className="hover:text-white" href={site.phoneHref}>
                  {site.phone}
                </a>
              </p>
              <p>
                <a
                  className="font-display text-lg text-brass underline decoration-brass/40 underline-offset-4 transition-colors hover:text-white"
                  href={`mailto:${site.email}`}
                >
                  {site.email}
                </a>
              </p>
              {site.hours.map((h) => (
                <p key={h.days} className="text-white/60">
                  {h.days}: {h.time}
                </p>
              ))}
            </address>
          </div>

          <div className="md:pl-10">
            <h2 className={heading}>Explore</h2>
            <ul className="mt-6 space-y-3">
              {explore.map((item) => (
                <li key={item.href}>
                  <Link className={link} href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a className={link} href={site.bookingUrl} target="_blank" rel="noopener noreferrer">
                  Book a Table
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid gap-8 border-t border-white/10 py-12 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className={heading}>Join the Olea community</h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-white/60">
              Enter your email address to receive updates, exclusive offers, new launches and the
              latest news from Olea Social.
            </p>
          </div>
          <NewsletterForm />
        </div>

        <p className="border-t border-white/10 py-6 text-xs text-white/40">
          © 2026 Olea Social. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
