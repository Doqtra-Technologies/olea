"use client";

import type { ReactNode } from "react";
import { buttonStyles } from "@/components/button-styles";
import { useSettings } from "@/components/settings-provider";

export function BookingLink({
  children,
  className = "",
  variant = "solid",
}: {
  children: ReactNode;
  className?: string;
  variant?: "solid" | "outline" | "light";
}) {
  const { bookingUrl } = useSettings();
  return (
    <a
      href={bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.2em] transition-colors ${buttonStyles[variant]} ${className}`}
    >
      {children}
    </a>
  );
}

export function ReserveFab() {
  const { bookingUrl } = useSettings();
  return (
    <a
      href={bookingUrl}
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
