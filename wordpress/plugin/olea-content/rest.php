<?php
// Read-only endpoints under /wp-json/olea/v1/, in the shapes the site's lib/content.ts expects.
// Empty fields come back as null so the site falls back to its built-in content.

defined('ABSPATH') || exit;

function olea_text($value): ?string
{
    $value = is_string($value) ? trim($value) : '';
    return $value === '' ? null : $value;
}

/** Splits a textarea into its non-empty parts: paragraphs (blank line between) or lines. */
function olea_split($value, string $pattern = '/\R\s*\R/'): ?array
{
    $parts = array_values(array_filter(array_map('trim', preg_split($pattern, (string) $value))));
    return $parts ?: null;
}

function olea_rows($value): array
{
    return is_array($value) ? array_values($value) : [];
}

function olea_image($id): ?string
{
    return $id ? (wp_get_attachment_image_url((int) $id, 'full') ?: null) : null;
}

function olea_alt($id): ?string
{
    return $id ? olea_text(get_post_meta((int) $id, '_wp_attachment_image_alt', true)) : null;
}

function olea_photos($ids): ?array
{
    $photos = array_map(fn ($id) => ['src' => olea_image($id), 'alt' => olea_alt($id) ?? ''], olea_rows($ids));
    return array_values(array_filter($photos, fn ($p) => $p['src'])) ?: null;
}

function olea_menu_sections($rows): array
{
    return array_map(fn (array $s) => [
        'title' => (string) $s['title'],
        'note' => olea_text($s['note']),
        'featured' => (bool) $s['featured'],
        'dishes' => array_map(fn (array $d) => [
            'name' => (string) $d['name'],
            'description' => olea_text($d['description']),
            'price' => olea_text($d['price']),
        ], olea_rows($s['dishes'])),
    ], olea_rows($rows));
}

function olea_published(string $post_type, string $date_order): array
{
    return get_posts([
        'post_type' => $post_type,
        'post_status' => 'publish',
        'numberposts' => -1,
        'orderby' => $post_type === 'post' ? ['date' => $date_order] : ['menu_order' => 'ASC', 'date' => $date_order],
        'suppress_filters' => false,
    ]);
}

function olea_settings(): array
{
    $f = fn (string $name) => get_field($name, 'olea_settings');
    $address = array_map('strval', array_filter((array) $f('address')));
    return [
        'name' => olea_text($f('name')),
        'tagline' => olea_text($f('tagline')),
        'address' => $address ? $address + ['line1' => '', 'city' => '', 'postcode' => ''] : null,
        'phone' => olea_text($f('phone')),
        'email' => olea_text($f('email')),
        'bookingUrl' => olea_text($f('booking_url')),
        'mapsUrl' => olea_text($f('maps_url')),
        'dietary' => olea_text($f('dietary')),
        'hours' => olea_rows($f('hours')) ?: null,
        'social' => olea_rows($f('social')) ?: null,
    ];
}

function olea_home(): array
{
    $f = fn (string $name) => get_field($name, 'olea_home');
    $promos = array_map(fn (array $p, int $i) => [
        'id' => sanitize_title($p['title']) . "-$i",
        'eyebrow' => olea_text($p['eyebrow']),
        'title' => (string) $p['title'],
        'body' => olea_split($p['body']) ?? [],
        'cta' => $p['cta_label'] && $p['cta_href'] ? ['label' => $p['cta_label'], 'href' => $p['cta_href']] : null,
        'image' => olea_image($p['image']),
        'alt' => olea_alt($p['image']) ?? '',
    ], $rows = olea_rows($f('promos')), array_keys($rows));
    return [
        'intro' => olea_text($f('intro')),
        'introSub' => olea_text($f('intro_sub')),
        'body' => olea_text($f('body')),
        'promos' => $promos ?: null,
    ];
}

function olea_about(): array
{
    $f = fn (string $name) => get_field($name, 'olea_about');
    return [
        'title' => olea_text($f('title')),
        'paragraphs' => olea_split($f('paragraphs')),
        'name' => olea_split($f('name')),
        'regions' => olea_split($f('regions'), '/\R/'),
        'slides' => olea_photos($f('slides')),
        'gallery' => olea_photos($f('gallery')),
    ];
}

function olea_whats_on(): array
{
    $f = fn (string $name) => olea_text(get_field($name, 'olea_whats_on'));
    return ['eyebrow' => $f('eyebrow'), 'title' => $f('title'), 'intro' => $f('intro')];
}

function olea_events(): array
{
    return array_map(function (WP_Post $post) {
        $f = fn (string $name) => get_field($name, $post->ID);
        $menu = $f('menu') ? get_post((int) $f('menu')) : null;
        return [
            'slug' => $post->post_name,
            'title' => $post->post_title,
            'category' => olea_text($f('category')),
            'summary' => (string) $f('summary'),
            'details' => olea_split($f('details')),
            'date' => olea_text($f('date')),
            'endsOn' => olea_text($f('ends_on')),
            'showOnHome' => (bool) $f('show_on_home'),
            'image' => olea_image($f('image')),
            'alt' => olea_alt($f('image')) ?? '',
            'banner' => olea_image($f('banner')),
            'bannerAlt' => olea_alt($f('banner')),
            'menu' => $menu && $menu->post_status === 'publish' ? $menu->post_name : null,
        ];
    }, olea_published('olea_event', 'DESC'));
}

function olea_menus(): array
{
    return array_map(function (WP_Post $post) {
        $f = fn (string $name) => get_field($name, $post->ID);
        $columns = array_map(fn (array $c) => [
            'title' => (string) $c['title'],
            'price' => (string) $c['price'],
            'sections' => olea_menu_sections($c['sections']),
        ], olea_rows($f('columns')));
        return [
            'id' => $post->post_name,
            'label' => $post->post_title,
            'title' => olea_text($f('heading')) ?? $post->post_title,
            'price' => olea_text($f('price')),
            'intro' => olea_text($f('intro')),
            'pdf' => $f('pdf') ? (wp_get_attachment_url((int) $f('pdf')) ?: null) : null,
            'sections' => olea_menu_sections($f('sections')),
            'columns' => $columns ?: null,
        ];
    }, olea_published('olea_menu', 'ASC'));
}

function olea_posts(): array
{
    global $post;
    $posts = array_map(function (WP_Post $p) use (&$post) {
        $f = fn (string $name) => get_field($name, $p->ID);
        $photo = get_post_thumbnail_id($p);
        // Blocks and shortcodes render against the current post.
        $post = $p;
        setup_postdata($p);
        return [
            'slug' => $p->post_name,
            'title' => $p->post_title,
            'metaTitle' => olea_text($f('meta_title')),
            'excerpt' => trim($p->post_excerpt),
            'date' => mysql2date('Y-m-d', $p->post_date),
            'image' => olea_image($photo),
            'alt' => olea_alt($photo),
            'intro' => olea_split($f('intro')) ?? [],
            'body' => apply_filters('the_content', $p->post_content),
            'outro' => olea_text($f('outro')),
            'outroHref' => olea_text($f('outro_href')),
        ];
    }, olea_published('post', 'DESC'));
    wp_reset_postdata();
    return $posts;
}

add_action('rest_api_init', function () {
    $routes = [
        'settings' => 'olea_settings',
        'home' => 'olea_home',
        'about' => 'olea_about',
        'private-dining' => fn () => olea_text(get_field('intro', 'olea_private_dining')),
        'whats-on' => 'olea_whats_on',
        'events' => 'olea_events',
        'menus' => 'olea_menus',
        'posts' => 'olea_posts',
    ];
    foreach ($routes as $path => $callback) {
        register_rest_route('olea/v1', "/$path", [
            'methods' => 'GET',
            'callback' => fn () => rest_ensure_response($callback()),
            'permission_callback' => '__return_true',
        ]);
    }
});
