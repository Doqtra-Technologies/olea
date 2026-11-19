type Enquiry = {
  bookingOption: string;
  date: string;
  guests: number;
  startTime: string;
  eventType: string;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  message: string;
  website: string;
};

const recipient = "booking@oleasocial.co.uk";
const allowedBookingOptions = new Set([
  "Group booking",
  "Semi-private dining",
  "Private dining",
  "Full restaurant hire",
]);
const allowedEventTypes = new Set(["On-Premise", "Off-Premise"]);
const rateLimitWindowMs = 10 * 60 * 1000;
const rateLimitMax = 5;
const recentSubmissions = new Map<string, { count: number; resetAt: number }>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized.length > 0 && normalized.length <= maxLength ? normalized : null;
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  return parsed.getUTCFullYear() === year && parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day;
}

type FieldErrors = Partial<Record<keyof Enquiry, string>>;

function parseEnquiry(value: unknown): { enquiry: Enquiry } | { fieldErrors: FieldErrors } | null {
  if (!isRecord(value)) return null;

  const bookingOption = readString(value.bookingOption, 40);
  const date = readString(value.date, 10);
  const startTime = readString(value.startTime, 5);
  const eventType = value.eventType === undefined ? "On-Premise" : readString(value.eventType, 20);
  const firstName = readString(value.firstName, 80);
  const lastName = readString(value.lastName, 80);
  const mobile = typeof value.mobile === "string" ? value.mobile.trim() : "";
  const email = readString(value.email, 254);
  const message = typeof value.message === "string" ? value.message.trim() : null;
  const guests = Number(value.guests);

  if (typeof value.website !== "string") return null;

  const fieldErrors: FieldErrors = {};
  if (!bookingOption || !allowedBookingOptions.has(bookingOption)) {
    fieldErrors.bookingOption = "Please choose a booking option.";
  }
  if (!date || !isValidDate(date)) fieldErrors.date = "Please enter a valid date.";
  if (
    !startTime ||
    !/^\d{2}:\d{2}$/.test(startTime) ||
    Number(startTime.slice(0, 2)) > 23 ||
    Number(startTime.slice(3, 5)) > 59
  ) {
    fieldErrors.startTime = "Please enter a valid start time.";
  }
  if (!eventType || !allowedEventTypes.has(eventType)) fieldErrors.eventType = "Please choose a type of event.";
  if (!firstName) fieldErrors.firstName = "Please enter your first name.";
  if (!lastName) fieldErrors.lastName = "Please enter your last name.";
  if (mobile.length > 40) fieldErrors.mobile = "Please enter a shorter mobile number.";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = "Please enter a valid email address.";
  if (!Number.isInteger(guests) || guests < 1 || guests > 500) {
    fieldErrors.guests = "Please enter between 1 and 500 people.";
  }
  if (message === null || message.length > 300) fieldErrors.message = "Please keep your message to 300 characters.";

  if (
    Object.keys(fieldErrors).length > 0 ||
    !bookingOption ||
    !date ||
    !startTime ||
    !eventType ||
    !firstName ||
    !lastName ||
    !email ||
    message === null
  ) {
    return { fieldErrors };
  }

  return {
    enquiry: {
      bookingOption,
      date,
      guests,
      startTime,
      eventType,
      firstName,
      lastName,
      mobile,
      email,
      message,
      website: value.website,
    },
  };
}

function isRateLimited(request: Request) {
  const now = Date.now();
  const address =
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const current = recentSubmissions.get(address);

  if (!current || current.resetAt <= now) {
    recentSubmissions.set(address, { count: 1, resetAt: now + rateLimitWindowMs });
    if (recentSubmissions.size > 1000) {
      for (const [key, value] of recentSubmissions) {
        if (value.resetAt <= now) recentSubmissions.delete(key);
      }
    }
    return false;
  }

  if (current.count >= rateLimitMax) return true;

  current.count += 1;
  return false;
}

export async function POST(request: Request) {
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") {
    return Response.json({ error: "Invalid request." }, { status: 415 });
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > 10_000) {
    return Response.json({ error: "Enquiry is too large." }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = parseEnquiry(payload);
  if (!parsed || "fieldErrors" in parsed) {
    return Response.json(
      { error: "Please check the required enquiry details.", fieldErrors: parsed?.fieldErrors ?? {} },
      { status: 400 },
    );
  }
  const { enquiry } = parsed;

  if (enquiry.website) {
    return Response.json({ message: "Enquiry received." });
  }

  if (isRateLimited(request)) {
    return Response.json(
      { error: "Too many enquiries. Please try again later or call us." },
      { status: 429 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Private dining email is not configured: RESEND_API_KEY is missing.");
    return Response.json({ error: "Enquiries are temporarily unavailable. Please call us." }, { status: 503 });
  }

  const fullName = `${enquiry.firstName} ${enquiry.lastName}`;
  const emailText = [
    "New private dining enquiry from the Olea Social website",
    "",
    `Booking option: ${enquiry.bookingOption}`,
    `Date: ${enquiry.date}`,
    `Number of people: ${enquiry.guests}`,
    `Start time: ${enquiry.startTime}`,
    `Type of event: ${enquiry.eventType}`,
    "",
    `Name: ${fullName}`,
    `Mobile: ${enquiry.mobile || "(Not provided)"}`,
    `Email: ${enquiry.email}`,
    "",
    "Message:",
    enquiry.message || "(No message provided)",
  ].join("\n");

  let resendResponse: Response;
  try {
    resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Olea Social <bookings@mail.oleasocial.co.uk>",
        to: [recipient],
        reply_to: enquiry.email,
        subject: `Private dining enquiry from ${fullName}`,
        text: emailText,
      }),
    });
  } catch (error) {
    console.error("Private dining email delivery request failed.", error);
    return Response.json({ error: "We couldn't send your enquiry. Please call us." }, { status: 502 });
  }

  if (!resendResponse.ok) {
    let resendError: { name?: unknown; message?: unknown } = {};
    try {
      resendError = await resendResponse.json();
    } catch {
      // Body was not JSON; the status code is still logged.
    }
    console.error(
      `Resend rejected a private dining enquiry: status=${resendResponse.status} name=${String(resendError.name ?? "unknown")} message=${String(resendError.message ?? "").slice(0, 200)}`,
    );
    return Response.json({ error: "We couldn't send your enquiry. Please call us." }, { status: 502 });
  }

  return Response.json({ message: "Thank you. Your enquiry has been sent to our team." });
}
