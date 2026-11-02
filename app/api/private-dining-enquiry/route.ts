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

function parseEnquiry(value: unknown): Enquiry | null {
  if (!isRecord(value)) return null;

  const bookingOption = readString(value.bookingOption, 40);
  const date = readString(value.date, 10);
  const startTime = readString(value.startTime, 5);
  const eventType = readString(value.eventType, 20);
  const firstName = readString(value.firstName, 80);
  const lastName = readString(value.lastName, 80);
  const mobile = readString(value.mobile, 40);
  const email = readString(value.email, 254);
  const message = typeof value.message === "string" ? value.message.trim() : null;
  const guests = Number(value.guests);

  if (
    !bookingOption ||
    !allowedBookingOptions.has(bookingOption) ||
    !date ||
    !isValidDate(date) ||
    !startTime ||
    !/^\d{2}:\d{2}$/.test(startTime) ||
    Number(startTime.slice(0, 2)) > 23 ||
    Number(startTime.slice(3, 5)) > 59 ||
    !eventType ||
    !allowedEventTypes.has(eventType) ||
    !firstName ||
    !lastName ||
    !mobile ||
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !Number.isInteger(guests) ||
    guests < 1 ||
    guests > 500 ||
    message === null ||
    message.length > 300 ||
    typeof value.website !== "string"
  ) {
    return null;
  }

  return {
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

  const enquiry = parseEnquiry(payload);
  if (!enquiry) {
    return Response.json({ error: "Please check the required enquiry details." }, { status: 400 });
  }

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
    `Mobile: ${enquiry.mobile}`,
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
        from: "Olea Social Website <booking@oleasocial.co.uk>",
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
    console.error("Resend rejected a private dining enquiry.", {
      status: resendResponse.status,
    });
    return Response.json({ error: "We couldn't send your enquiry. Please call us." }, { status: 502 });
  }

  return Response.json({ message: "Thank you. Your enquiry has been sent to our team." });
}
