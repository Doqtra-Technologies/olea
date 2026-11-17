import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { CONTENT_TAG } from "@/lib/content";

// Called by the Olea Content WordPress plugin: purges cached content whenever something is saved or deleted.
export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return new Response("REVALIDATE_SECRET is not set", { status: 500 });

  const given = Buffer.from(req.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return new Response("Invalid secret", { status: 401 });
  }

  // expire: 0 so the next visit shows the edit immediately instead of one stale view first.
  revalidateTag(CONTENT_TAG, { expire: 0 });
  return Response.json({ revalidated: true, now: Date.now() });
}
