<?php
/**
 * One-off: copies the live content from the old Sanity dataset into WordPress, with its images and PDFs.
 * Run it with ../import.sh. Running it again updates the same items instead of duplicating them,
 * and overwrites anything edited in WordPress since, so don't run it after editors have started work.
 */

require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';
require_once ABSPATH . 'wp-admin/includes/image.php';

const OLEA_SANITY_API = 'https://i3daovoa.api.sanity.io/v2026-10-01/data/query/production';

$file = '{ "url": asset->url, "name": asset->originalFilename, alt }';
$section = '{ title, note, featured, "dishes": coalesce(dishes[]{ name, description, price }, []) }';
$groq = <<<GROQ
{
  "settings": *[_id == "siteSettings"][0],
  "home": *[_id == "homePage"][0]{ intro, introSub, body, promos[]{ eyebrow, title, body, cta, "image": image$file } },
  "about": *[_id == "aboutPage"][0]{ title, paragraphs, name, regions, "slides": slides[]$file, "gallery": gallery[]$file },
  "privateDining": *[_id == "privateDiningPage"][0].intro,
  "whatsOn": *[_id == "whatsOnPage"][0]{ eyebrow, title, intro },
  "menus": *[_type == "menu" && defined(slug.current)] | order(order asc, _createdAt asc){
    "slug": slug.current, label, title, price, intro, order, "pdf": pdf$file,
    "sections": coalesce(sections[]$section, []),
    "columns": coalesce(columns[]{ title, price, "sections": coalesce(sections[]$section, []) }, [])
  },
  "events": *[_type == "event" && defined(slug.current)] | order(order asc, _createdAt desc){
    "slug": slug.current, title, category, summary, details, date, endsOn, showOnHome, order,
    "image": image$file, "banner": banner$file, "menu": menu->slug.current
  },
  "posts": *[_type == "post" && defined(slug.current)] | order(date asc){
    "slug": slug.current, title, metaTitle, excerpt, date, intro, body, outro, outroHref, "image": image$file
  }
}
GROQ;

$response = wp_remote_get(OLEA_SANITY_API . '?query=' . rawurlencode($groq), ['timeout' => 60]);
if (is_wp_error($response)) WP_CLI::error($response->get_error_message());
$data = json_decode(wp_remote_retrieve_body($response), true)['result'] ?? null;
if (!$data) WP_CLI::error('Sanity returned no content: ' . wp_remote_retrieve_body($response));

/** Downloads a Sanity image or PDF into the media library once, and returns its attachment ID (0 for none). */
function olea_import_file(?array $asset): int
{
    if (empty($asset['url'])) return 0;
    $found = get_posts(['post_type' => 'attachment', 'post_status' => 'inherit', 'meta_key' => '_olea_source', 'meta_value' => $asset['url'], 'fields' => 'ids', 'numberposts' => 1]);
    $id = $found[0] ?? 0;
    if (!$id) {
        $tmp = download_url($asset['url'], 300);
        if (is_wp_error($tmp)) WP_CLI::error("{$asset['url']}: {$tmp->get_error_message()}");
        // Keep the name the file was uploaded with, and the extension Sanity serves it under.
        $extension = pathinfo(parse_url($asset['url'], PHP_URL_PATH), PATHINFO_EXTENSION);
        $name = pathinfo($asset['name'] ?? '', PATHINFO_FILENAME) ?: 'olea';
        $id = media_handle_sideload(['name' => "$name.$extension", 'tmp_name' => $tmp], 0);
        if (is_wp_error($id)) WP_CLI::error("{$asset['url']}: {$id->get_error_message()}");
        update_post_meta($id, '_olea_source', $asset['url']);
        WP_CLI::log("  uploaded $name.$extension");
    }
    if (!empty($asset['alt'])) update_post_meta($id, '_wp_attachment_image_alt', wp_slash($asset['alt']));
    return $id;
}

/** Creates the post, or updates the one that already has this slug. */
function olea_import_post(string $type, string $slug, array $args): int
{
    $found = get_posts(['post_type' => $type, 'name' => $slug, 'post_status' => 'any', 'fields' => 'ids', 'numberposts' => 1]);
    $id = wp_insert_post(wp_slash($args + ['ID' => $found[0] ?? 0, 'post_type' => $type, 'post_name' => $slug, 'post_status' => 'publish']), true);
    if (is_wp_error($id)) WP_CLI::error("$type $slug: {$id->get_error_message()}");
    return $id;
}

/** Sets fields by key, because a field that has never been saved can't be found by name. */
function olea_import_fields(string $group, $post_id, array $values): void
{
    foreach ($values as $name => $value) update_field("field_olea_{$group}_{$name}", $value ?? '', $post_id);
}

function olea_import_paragraphs(?array $paragraphs): string
{
    return implode("\n\n", $paragraphs ?? []);
}

function olea_import_sections(array $sections): array
{
    return array_map(fn (array $s) => [
        'title' => $s['title'],
        'note' => $s['note'] ?? '',
        'featured' => empty($s['featured']) ? 0 : 1,
        'dishes' => array_map(fn (array $d) => ['name' => $d['name'], 'description' => $d['description'] ?? '', 'price' => $d['price'] ?? ''], $s['dishes']),
    ], $sections);
}

/** Converts Sanity's rich text into the block editor's markup: headings, paragraphs, bullets, bold, italic and links. */
function olea_import_body(array $blocks): string
{
    $out = [];
    $items = [];
    $flush = function () use (&$out, &$items) {
        if (!$items) return;
        $list = implode("\n", array_map(fn (string $li) => "<!-- wp:list-item -->\n<li>$li</li>\n<!-- /wp:list-item -->", $items));
        $out[] = "<!-- wp:list -->\n<ul class=\"wp-block-list\">$list</ul>\n<!-- /wp:list -->";
        $items = [];
    };
    foreach ($blocks as $block) {
        if (($block['_type'] ?? '') !== 'block') continue;
        $links = array_column($block['markDefs'] ?? [], 'href', '_key');
        $html = '';
        foreach ($block['children'] ?? [] as $span) {
            $text = nl2br(esc_html($span['text'] ?? ''), false);
            foreach ($span['marks'] ?? [] as $mark) {
                if ($mark === 'strong' || $mark === 'em') $text = "<$mark>$text</$mark>";
                elseif (isset($links[$mark])) $text = '<a href="' . esc_url($links[$mark]) . "\">$text</a>";
            }
            $html .= $text;
        }
        if (!empty($block['listItem'])) {
            $items[] = $html;
            continue;
        }
        $flush();
        $out[] = ($block['style'] ?? 'normal') === 'h2'
            ? "<!-- wp:heading -->\n<h2 class=\"wp-block-heading\">$html</h2>\n<!-- /wp:heading -->"
            : "<!-- wp:paragraph -->\n<p>$html</p>\n<!-- /wp:paragraph -->";
    }
    $flush();
    return implode("\n\n", $out);
}

// The client's draft of this post had four phrases in bold, which the Sanity version never carried.
const OLEA_BOLD = [
    'christmas-private-dining' => [
        'Our private dining rooms bring' => 'Our <strong>private dining rooms</strong> bring',
        'your private dining experience' => 'your <strong>private dining experience</strong>',
        'for a Christmas party, say' => 'for a <strong>Christmas party</strong>, say',
        'have a private dining room in mind' => 'have a <strong>private dining room</strong> in mind',
    ],
];

WP_CLI::log('Settings and pages');
$s = $data['settings'] ?? [];
olea_import_fields('settings', 'olea_settings', [
    'name' => $s['name'] ?? '',
    'tagline' => $s['tagline'] ?? '',
    'address' => ($s['address'] ?? []) + ['line1' => '', 'city' => '', 'postcode' => ''],
    'phone' => $s['phone'] ?? '',
    'email' => $s['email'] ?? '',
    'booking_url' => $s['bookingUrl'] ?? '',
    'maps_url' => $s['mapsUrl'] ?? '',
    'hours' => array_map(fn (array $h) => ['days' => $h['days'] ?? '', 'time' => $h['time'] ?? ''], $s['hours'] ?? []),
    'social' => array_map(fn (array $l) => ['label' => $l['label'] ?? '', 'href' => $l['href'] ?? ''], $s['social'] ?? []),
    'dietary' => $s['dietary'] ?? '',
]);

$h = $data['home'] ?? [];
olea_import_fields('home', 'olea_home', [
    'intro' => $h['intro'] ?? '',
    'intro_sub' => $h['introSub'] ?? '',
    'body' => $h['body'] ?? '',
    'promos' => array_map(fn (array $p) => [
        'eyebrow' => $p['eyebrow'] ?? '',
        'title' => $p['title'],
        'body' => olea_import_paragraphs($p['body'] ?? []),
        'cta_label' => $p['cta']['label'] ?? '',
        'cta_href' => $p['cta']['href'] ?? '',
        'image' => olea_import_file($p['image']),
    ], $h['promos'] ?? []),
]);

$a = $data['about'] ?? [];
olea_import_fields('about', 'olea_about', [
    'title' => $a['title'] ?? '',
    'paragraphs' => olea_import_paragraphs($a['paragraphs'] ?? []),
    'name' => olea_import_paragraphs($a['name'] ?? []),
    'regions' => implode("\n", $a['regions'] ?? []),
    'slides' => array_map('olea_import_file', $a['slides'] ?? []),
    'gallery' => array_map('olea_import_file', $a['gallery'] ?? []),
]);

olea_import_fields('private_dining', 'olea_private_dining', ['intro' => $data['privateDining'] ?? '']);
olea_import_fields('whats_on', 'olea_whats_on', array_intersect_key(($data['whatsOn'] ?? []) + ['eyebrow' => '', 'title' => '', 'intro' => ''], ['eyebrow' => 1, 'title' => 1, 'intro' => 1]));

$menus = [];
foreach ($data['menus'] as $i => $m) {
    WP_CLI::log("Menu: {$m['label']}");
    $id = $menus[$m['slug']] = olea_import_post('olea_menu', $m['slug'], ['post_title' => $m['label'], 'menu_order' => $m['order'] ?? ($i + 1) * 10]);
    olea_import_fields('menu', $id, [
        'heading' => $m['title'] === $m['label'] ? '' : $m['title'],
        'price' => $m['price'],
        'intro' => $m['intro'],
        'pdf' => olea_import_file($m['pdf']),
        'sections' => olea_import_sections($m['sections']),
        'columns' => array_map(fn (array $c) => ['title' => $c['title'], 'price' => $c['price'] ?? '', 'sections' => olea_import_sections($c['sections'])], $m['columns']),
    ]);
}

foreach ($data['events'] as $i => $e) {
    WP_CLI::log("What's On: {$e['title']}");
    $id = olea_import_post('olea_event', $e['slug'], ['post_title' => $e['title'], 'menu_order' => $e['order'] ?? ($i + 1) * 10]);
    olea_import_fields('event', $id, [
        'category' => $e['category'],
        'date' => $e['date'],
        'ends_on' => $e['endsOn'] ? str_replace('-', '', $e['endsOn']) : '',
        'show_on_home' => empty($e['showOnHome']) ? 0 : 1,
        'summary' => $e['summary'],
        'image' => olea_import_file($e['image']),
        'banner' => olea_import_file($e['banner']),
        'details' => olea_import_paragraphs($e['details']),
        'menu' => $menus[$e['menu'] ?? ''] ?? '',
    ]);
}

foreach ($data['posts'] as $p) {
    WP_CLI::log("Post: {$p['title']}");
    $id = olea_import_post('post', $p['slug'], [
        'post_title' => $p['title'],
        'post_excerpt' => $p['excerpt'] ?? '',
        'post_content' => strtr(olea_import_body($p['body'] ?? []), OLEA_BOLD[$p['slug']] ?? []),
        'post_date' => "{$p['date']} 00:00:00",
        'edit_date' => true,
    ]);
    olea_import_fields('post', $id, [
        'meta_title' => $p['metaTitle'],
        'intro' => olea_import_paragraphs($p['intro']),
        'outro' => $p['outro'],
        'outro_href' => $p['outroHref'],
    ]);
    $photo = olea_import_file($p['image']);
    $photo ? set_post_thumbnail($id, $photo) : delete_post_thumbnail($id);
}

WP_CLI::success(sprintf('Imported %d menus, %d What\'s On items and %d posts.', count($data['menus']), count($data['events']), count($data['posts'])));
