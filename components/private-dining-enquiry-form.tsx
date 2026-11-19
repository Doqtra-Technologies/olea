"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type PrivateDiningEnquiryFormProps = {
  phone: string;
};

type FieldName =
  | "bookingOption"
  | "eventType"
  | "date"
  | "guests"
  | "startTime"
  | "firstName"
  | "lastName"
  | "mobile"
  | "email"
  | "message";

type FieldErrors = Partial<Record<FieldName, string>>;
type Status = "idle" | "sending" | "success" | "error";

const inputStyles =
  "mt-2 min-h-14 w-full border border-forest-800/15 bg-cream px-4 py-3 font-display text-base text-ink placeholder:text-ink/45 focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/40 aria-invalid:border-2 aria-invalid:border-terracotta disabled:cursor-not-allowed disabled:opacity-70";

const labelStyles = "block font-mono text-xs text-white/85";

export function PrivateDiningEnquiryForm({ phone }: PrivateDiningEnquiryFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formKey, setFormKey] = useState(0);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const focusFormOnRender = useRef(false);

  const phoneLink = (
    <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="text-brass underline underline-offset-4 hover:text-brass-dark">
      {phone}
    </a>
  );

  useEffect(() => {
    if (status === "success" && successHeadingRef.current) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      successHeadingRef.current.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      successHeadingRef.current.focus({ preventScroll: true });
    }
    if (status === "idle" && focusFormOnRender.current) {
      focusFormOnRender.current = false;
      formRef.current?.querySelector<HTMLElement>("select, input")?.focus();
    }
  }, [status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    // Read the values before the fieldset is disabled; disabled fields are left out of FormData.
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    setStatus("sending");
    setFieldErrors({});

    try {
      const response = await fetch("/api/private-dining-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const result: { fieldErrors?: FieldErrors } = await response.json().catch(() => ({}));
          setFieldErrors(result.fieldErrors ?? {});
        }
        setStatus("error");
        return;
      }

      setFirstName(String(payload.firstName ?? "").trim());
      setMessage("");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  function clearFieldError(name: string) {
    if (name in fieldErrors) {
      setFieldErrors((current) => {
        const next = { ...current };
        delete next[name as FieldName];
        return next;
      });
    }
  }

  function sendAnother() {
    focusFormOnRender.current = true;
    setFirstName("");
    setFieldErrors({});
    setFormKey((key) => key + 1);
    setStatus("idle");
  }

  function fieldProps(name: FieldName) {
    const error = fieldErrors[name];
    return {
      name,
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `enquiry-${name}-error` : undefined,
    };
  }

  function fieldError(name: FieldName) {
    const error = fieldErrors[name];
    if (!error) return null;
    return (
      <span id={`enquiry-${name}-error`} className="mt-2 block font-mono text-xs text-cream">
        <span aria-hidden="true" className="mr-1.5 inline-block size-2 rounded-full bg-terracotta" />
        {error}
      </span>
    );
  }

  const isSending = status === "sending";

  return (
    <>
      <div role="status" aria-live="polite">
        {status === "success" ? (
          <div className="bg-cream px-6 py-10 text-ink sm:px-10 sm:py-14">
            <p className="eyebrow text-brass">Enquiry sent</p>
            <h3
              ref={successHeadingRef}
              tabIndex={-1}
              className="mt-4 font-display text-3xl font-light leading-tight text-ink focus:outline-none sm:text-4xl"
            >
              Thank you{firstName ? `, ${firstName}` : ""}
            </h3>
            <p className="mt-5 max-w-xl leading-relaxed text-ink/80">
              Your enquiry has been sent. Our events team will be in touch shortly, usually within 24 hours. For
              anything urgent, call us on {phoneLink}.
            </p>
            <button
              type="button"
              onClick={sendAnother}
              className="mt-8 font-mono text-xs text-brass underline underline-offset-4 hover:text-brass-dark"
            >
              Send another enquiry
            </button>
          </div>
        ) : null}
      </div>

      {status !== "success" ? (
        <form
          key={formKey}
          ref={formRef}
          onSubmit={handleSubmit}
          onChange={(event) => clearFieldError((event.target as unknown as HTMLInputElement).name)}
          aria-busy={isSending}
        >
          <fieldset disabled={isSending} className="grid min-w-0 gap-8">
            <fieldset className="grid min-w-0 gap-5">
              <legend className="eyebrow mb-5 text-brass">Booking details</legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className={labelStyles}>
                  Booking option
                  <select {...fieldProps("bookingOption")} defaultValue="" required className={inputStyles}>
                    <option value="" disabled>
                      Booking option
                    </option>
                    <option>Group booking</option>
                    <option>Semi-private dining</option>
                    <option>Private dining</option>
                    <option>Full restaurant hire</option>
                  </select>
                  {fieldError("bookingOption")}
                </label>
                <label className={labelStyles}>
                  Type of event
                  <select {...fieldProps("eventType")} defaultValue="On-Premise" required className={inputStyles}>
                    <option>On-Premise</option>
                    <option>Off-Premise</option>
                  </select>
                  {fieldError("eventType")}
                </label>
                <label className={labelStyles}>
                  Date
                  <input {...fieldProps("date")} type="date" required className={inputStyles} />
                  {fieldError("date")}
                </label>
                <label className={labelStyles}>
                  Number of people
                  <input
                    {...fieldProps("guests")}
                    type="number"
                    min="1"
                    max="500"
                    required
                    placeholder="Number of people"
                    className={inputStyles}
                  />
                  {fieldError("guests")}
                </label>
                <label className={labelStyles}>
                  Start time
                  <input {...fieldProps("startTime")} type="time" defaultValue="12:00" required className={inputStyles} />
                  {fieldError("startTime")}
                </label>
              </div>
            </fieldset>

            <fieldset className="grid min-w-0 gap-5">
              <legend className="eyebrow mb-5 text-brass">Personal details</legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className={labelStyles}>
                  First name
                  <input
                    {...fieldProps("firstName")}
                    autoComplete="given-name"
                    required
                    maxLength={80}
                    placeholder="First name"
                    className={inputStyles}
                  />
                  {fieldError("firstName")}
                </label>
                <label className={labelStyles}>
                  Last name
                  <input
                    {...fieldProps("lastName")}
                    autoComplete="family-name"
                    required
                    maxLength={80}
                    placeholder="Last name"
                    className={inputStyles}
                  />
                  {fieldError("lastName")}
                </label>
                <label className={labelStyles}>
                  Mobile number (optional)
                  <input
                    {...fieldProps("mobile")}
                    type="tel"
                    autoComplete="tel"
                    maxLength={40}
                    placeholder="Mobile number"
                    className={inputStyles}
                  />
                  {fieldError("mobile")}
                </label>
                <label className={labelStyles}>
                  Email address
                  <input
                    {...fieldProps("email")}
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    placeholder="Email address"
                    className={inputStyles}
                  />
                  {fieldError("email")}
                </label>
              </div>
              <label className={labelStyles}>
                Message
                <textarea
                  {...fieldProps("message")}
                  maxLength={300}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Message (300 characters max)"
                  rows={5}
                  className={`${inputStyles} resize-y`}
                />
                {fieldError("message")}
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
              {status === "error" ? (
                <p
                  role="alert"
                  className="mb-6 border-l-4 border-terracotta bg-cream px-5 py-4 text-sm leading-relaxed text-terracotta-deep"
                >
                  Sorry, your enquiry couldn&apos;t be sent. Please try again, or call us on {phoneLink}.
                </p>
              ) : null}
              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center bg-brass px-8 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-on-brass transition-colors hover:bg-brass-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass disabled:cursor-wait disabled:hover:bg-brass"
              >
                {isSending ? "Sending…" : "Send enquiry"}
              </button>
              {status !== "error" ? (
                <p className="mt-4 min-h-5 text-sm text-white/80">To enquire by phone, call {phoneLink}.</p>
              ) : null}
            </div>
          </fieldset>
        </form>
      ) : null}
    </>
  );
}
