import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const client = createClient({
  projectId: projectId || "missing-project-id",
  dataset,
  apiVersion,
  // Responses are cached by Next.js and purged by the /api/revalidate webhook, so read fresh from the API.
  useCdn: false,
});
