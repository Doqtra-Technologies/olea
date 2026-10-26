import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { CONTENT_TAG } from "@/lib/content";

// Sanity webhook target: purges cached content whenever a document is published or deleted.
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return new Response("SANITY_REVALIDATE_SECRET is not set", { status: 500 });

  const { isValidSignature } = await parseBody(req, secret, true);
  if (!isValidSignature) return new Response("Invalid signature", { status: 401 });

  // expire: 0 so the next visit shows the edit immediately instead of one stale view first.
  revalidateTag(CONTENT_TAG, { expire: 0 });
  return Response.json({ revalidated: true, now: Date.now() });
}
