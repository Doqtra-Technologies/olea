import Image from "next/image";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { site } from "@/lib/site";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>;
}

export function Rule({ className = "" }: { className?: string }) {
  return <div className={`h-px w-14 bg-brass ${className}`} />;
}

type ButtonProps = ComponentProps<typeof Link> & { variant?: "solid" | "outline" | "light" };

const buttonStyles = {
  solid: "bg-brass text-ink border border-brass hover:bg-brass-dark hover:border-brass-dark",
  outline: "border border-brass text-brass hover:bg-brass hover:text-ink",
  light: "border border-white/60 text-white hover:bg-white hover:text-forest-900",
};

export function Button({ variant = "solid", className = "", ...props }: ButtonProps) {
  return (
    <Link
      {...props}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.2em] transition-colors ${buttonStyles[variant]} ${className}`}
    />
  );
}

export function BookingLink({
  children,
  className = "",
  variant = "solid",
}: {
  children: ReactNode;
  className?: string;
  variant?: "solid" | "outline" | "light";
}) {
  return (
    <a
      href={site.bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.2em] transition-colors ${buttonStyles[variant]} ${className}`}
    >
      {children}
    </a>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function PageHero({
  image,
  alt,
  eyebrow,
  title,
  children,
  back,
  poster = false,
}: {
  image: string;
  alt: string;
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  back?: { href: string; label: string };
  poster?: boolean;
}) {
  if (poster) {
    return (
      <section className="relative overflow-hidden bg-forest-950 pb-14 pt-28 sm:pb-20 sm:pt-32">
        <Image src={image} alt="" fill priority sizes="100vw" className="scale-110 object-cover opacity-50 blur-2xl" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/40" />
        <Container className="relative grid items-end gap-10 lg:grid-cols-12">
          <div className="animate-rise lg:col-span-7">
            {back && (
              <Link href={back.href} className="eyebrow mb-8 inline-block text-brass hover:text-white">
                ← {back.label}
              </Link>
            )}
            {eyebrow && <p className="eyebrow mb-4 text-brass">{eyebrow}</p>}
            <h1 className="max-w-4xl font-display text-5xl font-light leading-[1.05] text-cream sm:text-6xl lg:text-7xl">
              {title}
            </h1>
            <Rule className="mt-6" />
            {children && <div className="mt-6 max-w-xl font-display text-lg leading-relaxed text-white/85">{children}</div>}
          </div>
          <div className="animate-rise w-full max-w-sm justify-self-center shadow-2xl lg:col-span-4 lg:col-start-9 lg:max-w-none">
            <Image
              src={image}
              alt={alt}
              width={1200}
              height={1600}
              priority
              sizes="(min-width: 1024px) 30vw, 384px"
              className="h-auto w-full"
            />
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-[72vh] items-end overflow-hidden bg-forest-950 pt-28">
      <Image
        src={image}
        alt={alt}
        fill
        priority
        sizes="100vw"
        className="animate-slow-zoom object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30" />
      <Container className="relative pb-14">
        <div className="animate-rise">
          {back && (
            <Link href={back.href} className="eyebrow mb-8 inline-block text-brass hover:text-white">
              ← {back.label}
            </Link>
          )}
          {eyebrow && <p className="eyebrow mb-4 text-brass">{eyebrow}</p>}
          <h1 className="max-w-4xl font-display text-5xl font-light leading-[1.05] text-cream sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <Rule className="mt-6" />
          {children && <div className="mt-6 max-w-xl font-display text-lg leading-relaxed text-white/85">{children}</div>}
        </div>
      </Container>
    </section>
  );
}

export function ReserveFab() {
  return (
    <a
      href={site.bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 bg-brass px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-ink shadow-lg transition-colors hover:bg-brass-dark"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
        <rect x="3" y="5" width="18" height="16" rx="1" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </svg>
      Reserve now
    </a>
  );
}
