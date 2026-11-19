# Olea Social: WordPress go-live and rollback

No secret values live in this file. Secrets: `wordpress/deploy/.env.deploy` (server, DB, WP admin) and
`wordpress/.env` (`OLEA_REVALIDATE_SECRET`), both gitignored.

## Where things are

| Piece | Where |
| --- | --- |
| Website (Next.js) | Vercel team **gourmetica**, project **olea** (vercel.com/gourmetica/olea), Git: Doqtra-Technologies/olea, production branch `main` |
| CMS | https://cms.oleasocial.co.uk/wp-admin, GoDaddy cPanel account `cbyvgpab6678`, docroot `~/public_html/cms`, DB `olea_wp` (prefix `wp_`) |
| Old CMS (rollback) | Sanity project `i3daovoa`. Kept, not deleted |
| DNS / email | GoDaddy. Root `@` A 216.198.79.1 (Vercel), `www` CNAME to Vercel, `cms` A 92.205.169.47, mail on Microsoft 365. Not changed by this migration |

## Vercel environment variables

The WordPress build reads only:

| Name | Value |
| --- | --- |
| `WORDPRESS_URL` | `https://cms.oleasocial.co.uk` |
| `REVALIDATE_SECRET` | the `OLEA_REVALIDATE_SECRET` value in `wordpress/.env` (must match wp-config.php on the server) |
| `RESEND_API_KEY` | unchanged (private dining enquiry form) |

Live project state before go-live (production deployment URL, existing env var names including the Sanity ones):
**not yet recorded.** The Vercel CLI on this machine is logged in to team `nikhilbajantri86-gmailcoms-projects`,
which cannot see the `gourmetica` team. Log in with the account that owns `gourmetica`, then run:

```bash
vercel switch gourmetica
vercel ls olea --prod            # current production deployment URL: write it here
vercel env ls --scope gourmetica # env var NAMES only: write them here
```

## Rollback

### Website back to Sanity (seconds)

In Vercel (team gourmetica → olea → Deployments), open the last production deployment from before the
merge and choose **Promote to Production** (CLI: `vercel promote <previous-deployment-url> --scope gourmetica`).
That build still uses Sanity, as long as the Sanity env vars and the Sanity project still exist. For a permanent revert, `git revert -m 1 <merge commit>` on `main`.

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
