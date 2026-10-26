# Olea Social website

Next.js site with content managed in [Sanity](https://www.sanity.io). The Sanity Studio is built in at `/studio`.

```bash
npm run dev   # http://localhost:3000, Studio at http://localhost:3000/studio
```

## Content

Everything editable lives in the Studio:

| Studio item          | Drives                                                                    |
| -------------------- | ------------------------------------------------------------------------- |
| Site settings        | Address, phone, booking URL, opening hours, maps, social links, menu note |
| Home page            | Intro copy and the promotions carousel                                    |
| About page           | Story text, regions, slideshow and gallery photos                         |
| Private dining page  | Intro paragraph                                                           |
| What's On page       | Page heading and intro                                                    |
| What's On items      | Event/offer cards and their detail pages                                  |
| Menus                | Every menu tab on `/menu`, dishes, prices and PDF downloads               |
| Blog posts           | `/blog` and each post                                                     |

Until `NEXT_PUBLIC_SANITY_PROJECT_ID` is set, and for any field left empty in Sanity, the site falls back
to the built-in content in `lib/site.ts` and `lib/menus.ts`.

## Setting up Sanity

1. Create a project at [sanity.io/manage](https://www.sanity.io/manage) (or run `npx sanity init --env` and skip
   the template). Use the `production` dataset.
2. Copy `.env.example` to `.env.local` and fill in the project ID and a long random `SANITY_REVALIDATE_SECRET`.
3. In the project's **API → CORS origins**, add `http://localhost:3000` and the live domain, both with
   **Allow credentials** ticked, so the Studio can sign in.
4. Import the current site content, images and PDFs:
   ```bash
   npx sanity login
   npm run sanity:seed            # only creates documents that don't exist yet
   ```
   `npm run sanity:seed -- --force` overwrites Sanity with the built-in content. It discards edits made in the Studio.
5. In **API → Webhooks**, add a webhook so published changes appear on the live site straight away:
   - URL: `https://<live-domain>/api/revalidate`
   - Dataset: `production`, trigger on create, update and delete
   - Projection: `{_type}`, HTTP method: `POST`
   - Secret: the same value as `SANITY_REVALIDATE_SECRET`
6. Set the same three environment variables on the host (e.g. Vercel) and redeploy.
7. Invite the client under **Members** in sanity.io/manage. They sign in at `https://<live-domain>/studio`.

Without the webhook, content still refreshes on its own within an hour.
