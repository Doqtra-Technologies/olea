#!/usr/bin/env bash
# Applies the November 2026 A la carte menu (dishes and PDF) to WordPress, then reloads the local site.
set -euo pipefail
cd "$(dirname "$0")"
set -a && . ./.env && set +a
docker compose run --rm -T cli wp eval-file /scripts/update-a-la-carte.php --user="$WP_ADMIN_USER"
./refresh.sh || echo "The site is not running on port 3000; it will pick the menu up when it starts."
