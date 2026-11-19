# Deploying the CMS to GoDaddy cPanel

Live at https://cms.oleasocial.co.uk (docroot `~/public_html/cms`, DB `olea_wp`, table prefix `wp_`).
SSH: `ssh olea-cpanel`. Credentials: `.env.deploy` here (gitignored, never commit). Values may contain `$`,
so read them with `grep '^KEY=' .env.deploy | cut -d= -f2-`, not `source`.

On the server, run wp-cli as `php -d memory_limit=512M /usr/bin/wp`: the default 128M fails on core download.

## Files

- `htaccess`: copied to `public_html/cms/.htaccess` (HTTPS 301, CORS for oleasocial.co.uk on /wp-json/, XML-RPC blocked, WordPress rules).
- `mu-plugins/olea-hardening.php`: copied to `wp-content/mu-plugins/`. Blocks all `wp_mail()` (the domain's mail is Microsoft 365, the server must not send) and XML-RPC.
- `wp-config.php` is generated on deploy and exists only on the server (mode 600): DB creds from `.env.deploy`,
  fresh salts, `WP_HOME`/`WP_SITEURL` https://cms.oleasocial.co.uk, `OLEA_SITE_URL` https://oleasocial.co.uk,
  `OLEA_REVALIDATE_URL` https://oleasocial.co.uk/api/revalidate, `OLEA_REVALIDATE_SECRET` (same as
  `OLEA_REVALIDATE_SECRET` in `wordpress/.env` and `REVALIDATE_SECRET` on Vercel), `DISALLOW_FILE_EDIT`,
  `FORCE_SSL_ADMIN`, `WP_MEMORY_LIMIT` 256M, `WP_DEBUG` false.

## How the first deploy was done (2026-11-19)

1. `wordpress/export.sh`, then on a temporary copy of the local DB: `wp search-replace 'http://localhost:8080'
   'https://cms.oleasocial.co.uk' --all-tables --precise` and `'http://localhost:3000' 'https://oleasocial.co.uk'`
   (post GUIDs), delete auto-drafts, dump the six content tables, re-export options.json. Grep the result for
   `localhost`, `mytemp.website`: must be zero.
2. Server: `wp core download --version=7.1.5`, wp-config, htaccess, mu-plugin, `wp core install --skip-email`
   (admin user: `WP_ADMIN_USER` in .env.deploy), `wp plugin install secure-custom-fields --activate`, copy `plugin/olea-content`,
   `wp db import content.sql`, `wp eval-file import-options.php options.json`, untar uploads into `wp-content/`,
   activate olea-content, delete akismet/hello and every theme but twentytwentyfive, `blog_public` 0, permalinks
   `/%postname%/`, `wp media regenerate --yes`, `wp rewrite flush --hard`, `wp cache flush`, dirs 755 / files 644 / wp-config 600.
3. Verified: REST parity with local (1753 fields, 0 mismatches; 10 menus, A la carte 55 rows, 3 What's On, 2 posts),
   all 24 media/PDF URLs 200, http→https 301, front end 302 → oleasocial.co.uk, xmlrpc 403, wp_mail returns false.

## Updating the plugin later

```bash
tar -czf - -C wordpress/plugin olea-content | ssh olea-cpanel 'tar -xzf - -C ~/public_html/cms/wp-content/plugins/'
```
