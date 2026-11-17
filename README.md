# Olea Social website

Next.js site with content managed in WordPress. WordPress only holds the content: the site reads it over the
REST API, and visitors never see WordPress itself.

```bash
wordpress/setup.sh   # once: local WordPress at http://localhost:8080
npm run dev          # http://localhost:3000
```

## Content

Everything editable lives in the WordPress admin (`/wp-admin`):

| WordPress item              | Drives                                                                    |
| --------------------------- | ------------------------------------------------------------------------- |
| Olea Site → Site settings   | Address, phone, booking URL, opening hours, maps, social links, menu note |
| Olea Site → Home page       | Intro copy and the promotions carousel                                    |
| Olea Site → About page      | Story text, regions, slideshow and gallery photos                         |
| Olea Site → Private dining  | Intro paragraph                                                           |
| Olea Site → What's On page  | Page heading and intro                                                    |
| What's On                   | Event/offer cards and their detail pages                                  |
| Menus                       | Every menu tab on `/menu`, dishes, prices and PDF downloads               |
| Posts                       | `/blog` and each post                                                     |

Menus and What's On items are sorted by their **Order** number, lowest first. Their **Slug** is part of the
site's links (`/menu#christmas`, `/whats-on/festive-season`). Image alt text is set on the image in the media library.

Until `WORDPRESS_URL` is set, and for any field left empty in WordPress, the site falls back to the built-in
content in `lib/site.ts` and `lib/menus.ts`.

## How it fits together

- `wordpress/plugin/olea-content/` is a small WordPress plugin. It defines the content types and fields
  (using the free [Secure Custom Fields](https://wordpress.org/plugins/secure-custom-fields/) plugin), serves them
  at `/wp-json/olea/v1/…`, and calls the site's `/api/revalidate` after every save.
- `lib/content.ts` reads those endpoints. Pages are cached for an hour and refreshed straight away when
  WordPress calls `/api/revalidate`.

## Local WordPress

Needs Docker. `wordpress/setup.sh` starts WordPress and its database, installs both plugins, and writes
`wordpress/.env` (admin login) and `.env.local` (for the site). Run it again any time; finished steps are skipped.

```bash
wordpress/setup.sh                              # start
docker compose -f wordpress/docker-compose.yml stop      # stop, keeping the content
docker compose -f wordpress/docker-compose.yml down -v   # delete the local WordPress and its content
```

`wordpress/import.sh` copies the content, images and PDFs from the old Sanity dataset into WordPress. It is a
one-off for the move: running it again overwrites edits made in WordPress since.

For edits to show on the local site straight away, WordPress (in Docker) must be able to reach the site on port
3000. With ufw, allow it once:

```bash
sudo ufw allow from 172.16.0.0/12 to any port 3000 proto tcp
```

Without that rule, run `wordpress/refresh.sh` after editing to make the site reload its content.

## Hosting WordPress

1. Install WordPress on the host (any PHP 8.1+ WordPress hosting), at its own address such as `cms.<domain>`.
2. Install and activate **Secure Custom Fields**, then upload `wordpress/plugin/olea-content` and activate it.
3. Add to `wp-config.php`:
   ```php
   define('OLEA_SITE_URL', 'https://<live-domain>');
   define('OLEA_REVALIDATE_URL', 'https://<live-domain>/api/revalidate');
   define('OLEA_REVALIDATE_SECRET', '<long random string>');
   ```
4. Move the content across: export the local database and `wp-content/uploads`, import them on the host and
   replace `http://localhost:8080` with the new address (`wp search-replace`), or run
   `wordpress/scripts/import-sanity.php` there with WP-CLI.
5. On the site's host (e.g. Vercel) set `WORDPRESS_URL` to the WordPress address and `REVALIDATE_SECRET` to the
   same secret, then redeploy.
6. Under **Settings → Reading**, keep "Discourage search engines" ticked so only the real site is indexed.

Without the revalidate settings, content still refreshes on its own within an hour.
