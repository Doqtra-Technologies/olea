#!/usr/bin/env bash
# Starts the local WordPress, installs it and activates the Olea content plugin.
# Safe to run again: every step is skipped once done.
set -euo pipefail
cd "$(dirname "$0")"

# Local-only credentials, generated once and kept out of git.
if [ ! -f .env ]; then
  cat > .env <<EOF
WORDPRESS_PORT=8080
WP_ADMIN_USER=admin
WP_ADMIN_PASSWORD=$(openssl rand -hex 12)
WP_ADMIN_EMAIL=admin@example.com
REVALIDATE_SECRET=$(openssl rand -hex 24)
EOF
  echo "Created wordpress/.env with a new admin password."
fi
set -a && . ./.env && set +a
url="http://localhost:${WORDPRESS_PORT}"

# The site reads WordPress through these two variables.
if [ ! -f ../.env.local ]; then
  printf 'WORDPRESS_URL=%s\nREVALIDATE_SECRET=%s\n' "$url" "$REVALIDATE_SECRET" > ../.env.local
  echo "Created .env.local for the Next.js site."
fi

docker compose up -d --wait
wp() { docker compose run --rm -T cli wp "$@"; }

if ! wp core is-installed 2>/dev/null; then
  wp core install --url="$url" --title="Olea Social" --skip-email \
    --admin_user="$WP_ADMIN_USER" --admin_password="$WP_ADMIN_PASSWORD" --admin_email="$WP_ADMIN_EMAIL"
  wp option update timezone_string Europe/London
  wp option update date_format "j F Y"
  wp option update blog_public 0
  wp rewrite structure "/%postname%/"
  wp post delete 1 2 --force
  wp plugin delete akismet hello
fi

wp plugin is-installed secure-custom-fields || wp plugin install secure-custom-fields
wp plugin activate secure-custom-fields olea-content

echo
echo "WordPress admin: $url/wp-admin (user and password are in wordpress/.env)"
echo "Import the live content once with: ./import.sh"
