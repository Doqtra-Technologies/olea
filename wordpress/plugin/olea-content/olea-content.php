<?php
/**
 * Plugin Name: Olea Content
 * Description: Menus, What's On items, blog fields and site settings for the Olea Social website, served to the site over the REST API.
 * Version: 1.0.0
 * Requires Plugins: secure-custom-fields
 */

defined('ABSPATH') || exit;

/** Reads a setting from a wp-config.php constant, or from the environment (Docker). */
function olea_config(string $name): string
{
    return (string) (defined($name) ? constant($name) : getenv($name));
}

add_action('init', function () {
    register_post_type('olea_menu', [
        'labels' => [
            'name' => 'Menus',
            'singular_name' => 'Menu',
            'add_new_item' => 'Add menu',
            'edit_item' => 'Edit menu',
            'search_items' => 'Search menus',
        ],
        'public' => false,
        'show_ui' => true,
        'menu_icon' => 'dashicons-food',
        'menu_position' => 20,
        // The title is the tab label, the slug is the link ID (/menu#christmas) and Order sorts the tabs.
        'supports' => ['title', 'slug', 'page-attributes'],
    ]);

    register_post_type('olea_event', [
        'labels' => [
            'name' => 'What’s On',
            'singular_name' => 'What’s On item',
            'add_new_item' => 'Add What’s On item',
            'edit_item' => 'Edit What’s On item',
            'search_items' => 'Search What’s On',
        ],
        'public' => false,
        'show_ui' => true,
        'menu_icon' => 'dashicons-calendar-alt',
        'menu_position' => 21,
        'supports' => ['title', 'slug', 'page-attributes'],
    ]);
});

// Blog posts use the featured image as their photo, whatever theme is active.
add_action('after_setup_theme', fn () => add_theme_support('post-thumbnails'));

// The slug is part of the site's links, so show its box without a trip to Screen Options.
add_filter('default_hidden_meta_boxes', function (array $hidden, WP_Screen $screen) {
    return in_array($screen->post_type, ['olea_menu', 'olea_event'], true) ? array_diff($hidden, ['slugdiv']) : $hidden;
}, 10, 2);

// Menus and What's On items are sorted by their Order number in the admin list too.
add_action('pre_get_posts', function (WP_Query $query) {
    if (!is_admin() || !$query->is_main_query() || $query->get('orderby')) return;
    if (in_array($query->get('post_type'), ['olea_menu', 'olea_event'], true)) {
        $query->set('orderby', ['menu_order' => 'ASC', 'date' => 'ASC']);
    }
});

// Send posts to the site exactly as typed, without WordPress swapping in curly quotes and dashes.
add_filter('run_wptexturize', '__return_false');

// WordPress only holds the content: anyone opening its front end is sent to the real site.
add_action('template_redirect', function () {
    if ($site = olea_config('OLEA_SITE_URL')) {
        wp_redirect($site, 302);
        exit;
    }
});

add_filter('post_link', function (string $link, WP_Post $post) {
    $site = olea_config('OLEA_SITE_URL');
    return $site && $post->post_type === 'post' ? rtrim($site, '/') . '/blog/' . $post->post_name : $link;
}, 10, 2);

add_action('plugins_loaded', function () {
    if (!function_exists('acf_add_local_field_group')) {
        add_action('admin_notices', function () {
            echo '<div class="notice notice-error"><p>Olea Content needs the Secure Custom Fields plugin to be active.</p></div>';
        });
        return;
    }
    require __DIR__ . '/fields.php';
    require __DIR__ . '/rest.php';
    require __DIR__ . '/revalidate.php';
});
