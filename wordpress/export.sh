#!/usr/bin/env bash
# Writes the local WordPress content to wordpress/export/, ready to load into the hosted WordPress.
# Nothing in it is secret: users, passwords and site settings such as the address stay out.
# README.md ("Hosting WordPress") has the import steps.
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p export
wp() { docker compose run --rm -T cli wp "$@" 2>/dev/null; }

# Posts, menus, What's On items and the media library records, with their IDs kept so fields that
# point at an image or PDF still resolve after the import.
wp db export - --tables=wp_posts,wp_postmeta,wp_terms,wp_termmeta,wp_term_taxonomy,wp_term_relationships > export/content.sql

# The same content as a standard WordPress export file, for tools that prefer one.
wp export --stdout > export/olea-content.xml

# The "Olea Site" settings pages and the site icon, which live in the options table.
wp eval '
global $wpdb;
$rows = $wpdb->get_results("SELECT option_name, option_value FROM $wpdb->options WHERE (option_name LIKE \"olea\\_%\" OR option_name LIKE \"\\_olea\\_%\" OR option_name = \"site_icon\") AND option_name <> \"olea_last_revalidate\" ORDER BY option_name");
$out = [];
foreach ($rows as $row) $out[$row->option_name] = maybe_unserialize($row->option_value);
echo json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), "\n";
' > export/options.json

# The uploaded images and PDFs. Resized copies are left out; WordPress rebuilds them on the host.
docker compose exec -T wordpress sh -c "cd wp-content && find uploads -type f ! -regex '.*-[0-9]+x[0-9]+\.[a-z]+' -print0 | sort -z | tar --null -T - -czf -" > export/uploads.tar.gz

ls -lh export
