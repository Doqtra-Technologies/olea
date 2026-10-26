import Image from "next/image";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { buttonStyles } from "@/components/button-styles";

export { BookingLink, ReserveFab } from "@/components/booking-link";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>;
}

export function Rule({ className = "" }: { className?: string }) {
  return <div className={`h-px w-14 bg-brass ${className}`} />;
}

type ButtonProps = ComponentProps<typeof Link> & { variant?: "solid" | "outline" | "light" };


export function Button({ variant = "solid", className = "", ...props }: ButtonProps) {
  return (
    <Link
      {...props}
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.2em] transition-colors ${buttonStyles[variant]} ${className}`}
    />
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
}: {
  image?: string;
  alt?: string;
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <section
      className={`relative flex items-end overflow-hidden bg-forest-950 ${image ? "min-h-[72vh] pt-28" : "pt-36 sm:pt-44"}`}
    >
      {image && (
        <>
          <Image
            src={image}
            alt={alt ?? ""}
            fill
            priority
            sizes="100vw"
            className="animate-slow-zoom object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30" />
        </>
      )}
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
