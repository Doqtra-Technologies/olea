# Olea Social: WordPress go-live and rollback

No secret values live in this file. Secrets: `wordpress/deploy/.env.deploy` (server, DB, WP admin) and
`wordpress/.env` (`OLEA_REVALIDATE_SECRET`), both gitignored.

## Where things are

| Piece | Where |
| --- | --- |
| Website (Next.js), new | Vercel team **nikhilbajantri86-gmailcoms-projects**, project **olea-social** (region lhr1, Node 26.x). Not Git-connected: deploy with the CLI only (see below) |
| Website, old | Vercel team **gourmetica**, project **olea** (no access from our account). Serves oleasocial.co.uk until the domain moves. Never deploy to it |
| CMS | https://cms.oleasocial.co.uk/wp-admin, GoDaddy cPanel account `cbyvgpab6678`, docroot `~/public_html/cms`, DB `olea_wp` (prefix `wp_`) |
| Old CMS (rollback) | Sanity project `i3daovoa`, dataset `production`. Kept, not deleted |
| DNS / email | GoDaddy. Root `@` A 216.198.79.1 (Vercel), `www` CNAME to Vercel, `cms` A 92.205.169.47, mail on Microsoft 365 + Resend. Only the Vercel records may change for the domain move; never MX/SPF/DKIM/DMARC/autodiscover/Resend |

## olea-social environment variables (Production and Preview)

| Name | Used by | Value |
| --- | --- | --- |
| `WORDPRESS_URL` | lib/content.ts, next.config.ts (image remotePatterns) | `https://cms.oleasocial.co.uk` |
| `REVALIDATE_SECRET` | app/api/revalidate | `OLEA_REVALIDATE_SECRET` in `wordpress/.env` (same as wp-config.php on the server) |
| `RESEND_API_KEY` | app/api/private-dining-enquiry | **not set yet.** Needed before the domain moves, or the private dining form answers "temporarily unavailable" (503) |

## Deploying

Deploy only committed files, from a clean copy, with the CLI:

```bash
D=$(mktemp -d) && git archive HEAD | tar -x -C "$D" && cp -r .vercel "$D"/ && cd "$D"
vercel deploy                 # preview
vercel deploy --prod          # production
```

`vercel.json` sets `git.deploymentEnabled: false`, so pushes to GitHub start no build in any Vercel
project linked to the repo, including the old gourmetica one. To use Git auto-deploys on olea-social later, connect the repo
to olea-social first, disconnect it from gourmetica/olea, then remove that setting.
`.vercelignore` also keeps `.env*`, `docs/`, `wordpress/` and `public/amendment/` out of any upload.
The project has Vercel Authentication on every URL except custom domains. For automated checks, use the
"Protection Bypass for Automation" secret (Project → Settings → Deployment Protection), sent as the
`x-vercel-protection-bypass` header or set once as a cookie with `?x-vercel-protection-bypass=<secret>&x-vercel-set-bypass-cookie=true`.

## Deployments

| When | URL | Commit | Result |
| --- | --- | --- | --- |
| 2026-11-19 | https://olea-social-k7e36rnlt-nikhilbajantri86-gmailcoms-projects.vercel.app (production, aliased https://olea-social-indol.vercel.app) | aaa1ea9 | 14/14 pages match local (text, images, PDF links, 10 menu tabs, logo); 28/28 loads at 375px + 1440px with no console errors, 4xx/5xx, broken images or overflow; brand fonts load; 9/9 menu PDFs 200; revalidate test: price edit shown 2s after calling /api/revalidate, revert 1s, wrong secret 401 |

## Rollback

### Website back to Sanity, in olea-social

Use this if the site fails after the domain moves to olea-social. `main` (`de030e5`) is still the Sanity
version. Its env var names are below. Values come from the Sanity project (sanity.io/manage → `i3daovoa`) and the
old `.env.example` defaults. Never commit them.

| Name | Value source |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `i3daovoa` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | optional, code default `2026-10-01` |
| `SANITY_REVALIDATE_SECRET` | the secret in the Sanity webhook (sanity.io/manage → API → Webhooks), or a new one there and here |
| `RESEND_API_KEY` | same as above |

```bash
vercel env add NEXT_PUBLIC_SANITY_PROJECT_ID production   # and the others above
D=$(mktemp -d) && git archive de030e5 | tar -x -C "$D" && cp -r .vercel "$D"/ && cd "$D" && vercel deploy --prod
```

Faster, for a problem in a new release only: `vercel rollback <previous olea-social deployment URL>` or
Promote to Production in the dashboard.

### Domain back to the old project

Only possible from the gourmetica account: re-add oleasocial.co.uk + www there. The DNS records point at
Vercel in general, not at a project, so DNS needs no change apart from the TXT verification Vercel may ask for.

### CMS server

The CMS is self-contained in `~/public_html/cms` and DB `olea_wp`. Nothing else on the account was changed.
Undeploy: empty `~/public_html/cms` (keep `.well-known` and `cgi-bin`) and drop the `wp_` tables in `olea_wp`.

## Backups (on the server)

Times are server time (MST, UTC−7), so 03:15 MST is 10:15 UK time in winter.

- Daily 03:15: DB dump to `~/backups/olea/db-YYYYMMDD.sql.gz`, kept 14 days.
- Weekly (Sunday 03:45): `~/backups/olea/uploads-YYYYMMDD.tar.gz`, kept 14 days.
- Script: `~/bin/olea-backup.sh db|uploads` (crontab: `crontab -l`). Uses wp-config's DB creds; no password in cron.
- These live on the same server. For off-site copies, pull them now and then:
  `scp 'olea-cpanel:backups/olea/*' ~/olea-backups/`.

### Restore

```bash
ssh olea-cpanel
cd ~/public_html/cms
wp db export ~/backups/olea/before-restore.sql          # safety copy of the current state
gunzip -c ~/backups/olea/db-YYYYMMDD.sql.gz | wp db import -
tar -xzf ~/backups/olea/uploads-YYYYMMDD.tar.gz -C wp-content/   # only if files were lost
wp cache flush && wp rewrite flush --hard
```

Then save any post in wp-admin (or call the revalidate route) so the website drops its cache.

## Users

- Admin: username and password are `WP_ADMIN_USER` / `WP_ADMIN_PASS` in `wordpress/deploy/.env.deploy`.
  Its email is still the placeholder `admin@example.com`. Change it in wp-admin → Profile.
- WordPress can't send email (blocked by `wp-content/mu-plugins/olea-hardening.php`), so new users and
  password resets get no email. Hand passwords over directly.
- Pinar (client editor). The Editor role can edit menus, What's On, blog, media and the Olea Site pages, but not
  plugins, settings or users. Replace `PINAR_EMAIL`; the command prints a generated password once:

  ```bash
  ssh olea-cpanel 'cd ~/public_html/cms && php -d memory_limit=512M /usr/bin/wp user create pinar PINAR_EMAIL --role=editor --first_name=Pinar --porcelain && php -d memory_limit=512M /usr/bin/wp user reset-password pinar --show-password --skip-email'
  ```
