<?php
/**
 * Applies the menus the client sent on 24 November 2026: Pre-Theatre and Christmas (changed dishes and PDFs),
 * the new Party Menu 1 and Party Menu 2, and the Gluten Free PDF (same content as before, now under a clean name).
 *
 *   wp eval-file update-menus-2026-11-24.php [folder holding the PDFs, default /menus]
 *
 * Safe to run again. Each of these five menus is set to exactly what menus-2026-11-24.json holds, so edits made
 * to them in WordPress since are overwritten. Previous PDFs stay in the media library.
 */

require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';
require_once ABSPATH . 'wp-admin/includes/image.php';

$dir = rtrim($args[0] ?? '/menus', '/');
$files = [
    'pre-theatre' => ['pre-theatre.pdf', 'pre-theatre-menu.pdf', 'Pre-Theatre menu'],
    'christmas' => ['christmas-2026.pdf', 'christmas-menu.pdf', 'Christmas menu'],
    'gluten-free' => ['gluten-free.pdf', 'gluten-free-menu.pdf', 'Gluten Free menu'],
    'party-menu-1' => ['party-menu-1.pdf', 'party-menu-1.pdf', 'Party Menu 1'],
    'party-menu-2' => ['party-menu-2.pdf', 'party-menu-2.pdf', 'Party Menu 2'],
];
foreach ($files as [$file]) if (!is_readable("$dir/$file")) WP_CLI::error("Missing $dir/$file");

function olea_nov24_menu(string $slug): int
{
    return get_posts(['post_type' => 'olea_menu', 'name' => $slug, 'post_status' => 'any', 'fields' => 'ids', 'numberposts' => 1])[0] ?? 0;
}

/** Uploads the PDF once under its file name, recognised afterwards by its checksum and that name. */
function olea_nov24_pdf(string $path, string $name, string $title): int
{
    $checksum = md5_file($path);
    $found = get_posts(['post_type' => 'attachment', 'post_status' => 'inherit', 'meta_key' => '_olea_checksum', 'meta_value' => $checksum, 'fields' => 'ids', 'numberposts' => -1]);
    foreach ($found as $id) if (basename(get_attached_file($id)) === $name) return $id;
    // Sideloading moves the file it is given, so hand it a copy.
    $tmp = wp_tempnam($name);
    copy($path, $tmp);
    $id = media_handle_sideload(['name' => $name, 'tmp_name' => $tmp], 0, $title);
    if (is_wp_error($id)) WP_CLI::error($id->get_error_message());
    update_post_meta($id, '_olea_checksum', $checksum);
    WP_CLI::log('Uploaded ' . wp_get_attachment_url($id));
    return $id;
}

$menus = array_combine(array_keys($files), array_map('olea_nov24_menu', array_keys($files)));
foreach (['pre-theatre', 'christmas', 'gluten-free'] as $slug) if (!$menus[$slug]) WP_CLI::error("There is no menu with the slug $slug.");

// The dishes, exactly as printed in the PDFs and in their order, live in menus-2026-11-24.json beside the PDFs.
$spec = json_decode((string) file_get_contents("$dir/menus-2026-11-24.json"), true);
if (!is_array($spec)) WP_CLI::error("Missing or invalid $dir/menus-2026-11-24.json");
$rows = fn (array $sections) => array_map(fn (array $s) => [
    'title' => $s['title'],
    'note' => '',
    'featured' => 0,
    'dishes' => array_map(fn (array $d) => ['name' => $d['name'], 'description' => $d['description'], 'price' => $d['price']], $s['dishes']),
], $sections);

// slug => [label, tab order (between Christmas and Kids), price]
$party = ['party-menu-1' => ['Party Menu 1', 62, '£48 per person'], 'party-menu-2' => ['Party Menu 2', 64, '£55 per person']];
foreach ($party as $slug => [$label, $order, $price]) {
    $id = wp_insert_post(['ID' => $menus[$slug], 'post_type' => 'olea_menu', 'post_name' => $slug, 'post_title' => $label, 'post_status' => 'publish', 'menu_order' => $order], true);
    if (is_wp_error($id)) WP_CLI::error($id->get_error_message());
    $menus[$slug] = $id;
    update_field('field_olea_menu_price', $price, $id);
}
foreach ($spec as $slug => $menu) {
    if (isset($menu['columns'])) {
        update_field('field_olea_menu_sections', [], $menus[$slug]);
        update_field('field_olea_menu_columns', array_map(fn (array $c) => ['title' => $c['title'], 'price' => $c['price'], 'sections' => $rows($c['sections'])], $menu['columns']), $menus[$slug]);
    } else {
        update_field('field_olea_menu_columns', [], $menus[$slug]);
        update_field('field_olea_menu_sections', $rows($menu['sections']), $menus[$slug]);
    }
}
foreach ($files as $slug => [$file, $name, $title]) {
    update_field('field_olea_menu_pdf', olea_nov24_pdf("$dir/$file", $name, $title), $menus[$slug]);
}

// Saving a menu is what tells the site to reload its content.
wp_update_post(['ID' => $menus['pre-theatre']]);
WP_CLI::success('Pre-Theatre, Christmas, Gluten Free, Party Menu 1 and Party Menu 2 updated.');
