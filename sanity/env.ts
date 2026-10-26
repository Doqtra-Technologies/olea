export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-10-01";

// Until a project ID is set, the site renders the built-in content in lib/site.ts and lib/menus.ts.
export const isSanityConfigured = projectId !== "";
