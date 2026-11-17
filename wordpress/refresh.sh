#!/usr/bin/env bash
# Makes the local site reload its content from WordPress. Only needed when a firewall
# stops WordPress (in Docker) from telling the site itself after a save.
set -euo pipefail
cd "$(dirname "$0")"
set -a && . ./.env && set +a
curl -fsS -X POST -H "Authorization: Bearer $REVALIDATE_SECRET" "${1:-http://localhost:3000}/api/revalidate"
echo
