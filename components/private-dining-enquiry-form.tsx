"use client";

import { useState, type FormEvent } from "react";

type PrivateDiningEnquiryFormProps = {
  phone: string;
};

const inputStyles =
  "mt-2 min-h-14 w-full border border-forest-800/15 bg-cream px-4 py-3 font-display text-base text-ink placeholder:text-ink/45 focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/40";

const labelStyles = "block font-mono text-xs text-white/85";

export function PrivateDiningEnquiryForm({ phone }:PrivateDiningEnquiryFormProps) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/private-dining-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result: { message?: string; error?: string } = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "We couldn't send your enquiry.");
      }

      setStatus(result.message || "Thank you. Your enquiry has been sent to our team.");
      form.reset();
      setMessage("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "We couldn't send your enquiry.";
      setStatus(`${message} Please call ${phone} if you need help.`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-8" onSubmit={handleSubmit}>
      <fieldset className="grid gap-5">
        <legend className="eyebrow mb-5 text-brass">Booking details</legend>
        <label className={labelStyles}>
          Booking option
          <select name="bookingOption" defaultValue="" required className={inputStyles}>
            <option value="" disabled>
              Booking option
            </option>
            <option>Group booking</option>
            <option>Semi-private dining</option>
            <option>Private dining</option>
            <option>Full restaurant hire</option>
          </select>
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelStyles}>
            Date
            <input name="date" type="date" required className={inputStyles} />
          </label>
          <label className={labelStyles}>
            Number of people
            <input name="guests" type="number" min="1" max="500" required placeholder="Number of people" className={inputStyles} />
          </label>
          <label className={labelStyles}>
            Start time
            <input name="startTime" type="time" defaultValue="12:00" required className={inputStyles} />
          </label>
        </div>
      </fieldset>

      <fieldset className="grid gap-5">
        <legend className="eyebrow mb-5 text-brass">Personal details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelStyles}>
            First name
            <input name="firstName" autoComplete="given-name" required maxLength={80} placeholder="First name" className={inputStyles} />
          </label>
          <label className={labelStyles}>
            Last name
            <input name="lastName" autoComplete="family-name" required maxLength={80} placeholder="Last name" className={inputStyles} />
          </label>
          <label className={labelStyles}>
            Mobile number
            <input name="mobile" type="tel" autoComplete="tel" required maxLength={40} placeholder="Mobile number" className={inputStyles} />
          </label>
          <label className={labelStyles}>
            Email address
            <input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="Email address" className={inputStyles} />
          </label>
        </div>
        <label className={labelStyles}>
          Message
          <textarea
            name="message"
            maxLength={300}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Message (300 characters max)"
            rows={5}
            className={`${inputStyles} resize-y`}
          />
          <span className="mt-2 block text-right font-mono text-[10px] text-white/60">{message.length}/300</span>
        </label>
      </fieldset>

      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Leave this field empty
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-12 items-center justify-center bg-brass px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:bg-brass-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
        >
          {isSubmitting ? "Sending..." : "Send enquiry"}
        </button>
        <p role="status" aria-live="polite" className="mt-4 min-h-5 text-sm text-white/80">
          {status || (
            <>
              To enquire by phone, call <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="text-brass underline underline-offset-4 hover:text-white">{phone}</a>.
            </>
          )}
        </p>
      </div>
    </form>
  );
}
