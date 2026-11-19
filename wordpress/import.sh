#!/usr/bin/env bash
# One-off: copies the live Sanity content, images and PDFs into the local WordPress.
set -euo pipefail
cd "$(dirname "$0")"
set -a && . ./.env && set +a
docker compose run --rm -T cli wp eval-file /scripts/import-sanity.php --user="$WP_ADMIN_USER"
