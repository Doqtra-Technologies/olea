"use client";

import { useState, type FormEvent } from "react";

type PrivateDiningEnquiryFormProps = {
  phone: string;
  phoneHref: string;
};

const inputStyles =
  "mt-2 min-h-14 w-full border border-forest-800/15 bg-cream px-4 py-3 font-display text-base text-ink placeholder:text-ink/45 focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/40";

const labelStyles = "block font-mono text-xs text-white/85";

export function PrivateDiningEnquiryForm({ phone, phoneHref }: PrivateDiningEnquiryFormProps) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(`Online enquiries aren't connected yet. Please call ${phone} to contact our team.`);
  }

  return (
    <form className="grid gap-8" onSubmit={handleSubmit}>
      <fieldset className="grid gap-5">
        <legend className="eyebrow mb-5 text-brass">Booking details</legend>
        <label className={labelStyles}>
          Booking option
          <select name="bookingOption" defaultValue="" className={inputStyles}>
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
            <input name="date" type="date" className={inputStyles} />
          </label>
          <label className={labelStyles}>
            Number of people
            <input name="guests" type="number" min="1" placeholder="Number of people" className={inputStyles} />
          </label>
          <label className={labelStyles}>
            Start time
            <input name="startTime" type="time" defaultValue="12:00" className={inputStyles} />
          </label>
          <label className={labelStyles}>
            Type of event
            <select name="eventType" defaultValue="On-Premise" className={inputStyles}>
              <option>On-Premise</option>
              <option>Off-Premise</option>
            </select>
          </label>
        </div>
      </fieldset>

      <fieldset className="grid gap-5">
        <legend className="eyebrow mb-5 text-brass">Personal details</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelStyles}>
            First name
            <input name="firstName" autoComplete="given-name" placeholder="First name" className={inputStyles} />
          </label>
          <label className={labelStyles}>
            Last name
            <input name="lastName" autoComplete="family-name" placeholder="Last name" className={inputStyles} />
          </label>
          <label className={labelStyles}>
            Mobile number
            <input name="mobile" type="tel" autoComplete="tel" placeholder="Mobile number" className={inputStyles} />
          </label>
          <label className={labelStyles}>
            Email address
            <input name="email" type="email" autoComplete="email" placeholder="Email address" className={inputStyles} />
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

      <div>
        <button
          type="submit"
          className="inline-flex min-h-12 items-center justify-center bg-brass px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:bg-brass-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
        >
          Send enquiry
        </button>
        <p role="status" className="mt-4 min-h-5 text-sm text-white/80">
          {status || (
            <>
              Online submissions aren&apos;t connected yet. To enquire now, call{" "}
              <a href={phoneHref} className="text-brass underline underline-offset-4 hover:text-white">
                {phone}
              </a>
              .
            </>
          )}
        </p>
      </div>
    </form>
  );
}
