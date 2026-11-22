"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Hand-off from the enquiry form. Kept in sessionStorage so no personal data ever appears in the URL.
export const ENQUIRY_SENT_FLAG = "olea:privateDiningEnquirySent";
export const ENQUIRY_FIRST_NAME = "olea:privateDiningFirstName";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function PrivateDiningThankYou({ phone }: { phone: string }) {
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    let genuine = false;
    let name = "";
    try {
      genuine = sessionStorage.getItem(ENQUIRY_SENT_FLAG) === "1";
      name = sessionStorage.getItem(ENQUIRY_FIRST_NAME) ?? "";
      // One-time: a refresh or a later direct visit must not count as another conversion.
      sessionStorage.removeItem(ENQUIRY_SENT_FLAG);
      sessionStorage.removeItem(ENQUIRY_FIRST_NAME);
    } catch {
      // Storage blocked: fall back to the generic thank-you with no event.
    }
    if (!genuine) return;
    // sessionStorage is browser-only and read-once, so it can't feed the server render; set it after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (name) setFirstName(name);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "private_dining_enquiry_submitted" });
  }, []);

  return (
    <div role="status" className="bg-cream px-6 py-10 text-ink sm:px-10 sm:py-14">
      <p className="eyebrow text-brass">Enquiry sent</p>
      <h2 className="mt-4 font-display text-3xl font-light leading-tight text-ink sm:text-4xl">
        Thank you{firstName ? `, ${firstName}` : ""}
      </h2>
      <p className="mt-5 max-w-xl leading-relaxed text-ink/80">
        Your enquiry has been sent. Our events team will be in touch shortly, usually within 24 hours. For anything
        urgent, call us on{" "}
        <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="text-brass underline underline-offset-4 hover:text-brass-dark">
          {phone}
        </a>
        .
      </p>
      <Link
        href="/private-dining#enquire"
        className="mt-8 inline-block font-mono text-xs text-brass underline underline-offset-4 hover:text-brass-dark"
      >
        Send another enquiry
      </Link>
    </div>
  );
}
