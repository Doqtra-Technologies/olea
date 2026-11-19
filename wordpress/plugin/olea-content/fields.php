<?php
// The editing screens: which fields each kind of content has.

defined('ABSPATH') || exit;

const OLEA_PARAGRAPHS_HELP = 'Leave a blank line between paragraphs.';

/** Options pages, each stored under its own ID so field names can repeat between them. */
const OLEA_PAGES = [
    'olea_settings' => 'Site settings',
    'olea_home' => 'Home page',
    'olea_about' => 'About page',
    'olea_private_dining' => 'Private dining page',
    'olea_whats_on' => 'What’s On page',
];

/**
 * Builds a field. Keys are derived from the group and name, so they stay stable
 * and the import script can address fields as field_olea_<group>_<name>.
 */
function olea_field(string $group, string $name, string $label, string $type = 'text', array $extra = []): array
{
    $key = "{$group}_{$name}";
    // 'collapsed' names the sub field whose value labels a closed row.
    if (isset($extra['collapsed'])) $extra['collapsed'] = "field_olea_{$key}_{$extra['collapsed']}";
    if (isset($extra['sub_fields'])) {
        $extra['sub_fields'] = array_map(fn (array $f) => olea_field($key, ...$f), $extra['sub_fields']);
    }
    return ['key' => "field_olea_{$key}", 'name' => $name, 'label' => $label, 'type' => $type] + $extra;
}

function olea_group(string $group, string $title, array $location, array $fields): void
{
    acf_add_local_field_group([
        'key' => "group_olea_{$group}",
        'title' => $title,
        'fields' => array_map(fn (array $f) => olea_field($group, ...$f), $fields),
        'location' => [[$location]],
    ]);
}

function olea_dishes(): array
{
    return ['dishes', 'Dishes', 'repeater', [
        'layout' => 'table',
        'button_label' => 'Add dish',
        'sub_fields' => [
            ['name', 'Name', 'text', ['required' => 1]],
            ['description', 'Description', 'text', ['instructions' => 'Include dietary tags, e.g. (V) or (VG).']],
            ['price', 'Price', 'text', ['instructions' => 'Number only, e.g. 9.5. Leave blank on set menus.', 'wrapper' => ['width' => 15]]],
        ],
    ]];
}

function olea_sections(string $label = 'Sections'): array
{
    return ['sections', $label, 'repeater', [
        'layout' => 'block',
        'button_label' => 'Add section',
        'collapsed' => 'title',
        'sub_fields' => [
            ['title', 'Title', 'text', ['required' => 1, 'wrapper' => ['width' => 40]]],
            ['note', 'Note', 'text', ['instructions' => 'Small line under the heading, e.g. “Anatolian pizza”.', 'wrapper' => ['width' => 40]]],
            ['featured', 'Featured', 'true_false', ['message' => 'Highlight this section', 'wrapper' => ['width' => 20]]],
            olea_dishes(),
        ],
    ]];
}

add_action('acf/init', function () {
    acf_add_options_page(['page_title' => 'Olea Site', 'menu_slug' => 'olea-site', 'icon_url' => 'dashicons-store', 'position' => 22, 'redirect' => true]);
    foreach (OLEA_PAGES as $id => $title) {
        acf_add_options_sub_page(['page_title' => $title, 'menu_slug' => str_replace('_', '-', $id), 'parent_slug' => 'olea-site', 'post_id' => $id]);
    }
    $page = fn (string $id) => ['param' => 'options_page', 'operator' => '==', 'value' => str_replace('_', '-', $id)];
    $type = fn (string $post_type) => ['param' => 'post_type', 'operator' => '==', 'value' => $post_type];
    $image = ['return_format' => 'id', 'preview_size' => 'medium', 'instructions' => 'Set the alt text on the image itself, in the media library.'];

    olea_group('menu', 'Menu', $type('olea_menu'), [
        ['heading', 'Heading', 'text', ['instructions' => 'Shown above the dishes. Defaults to the tab label (the title above).']],
        ['price', 'Price', 'text', ['instructions' => 'e.g. £19.50 per person']],
        ['intro', 'Intro', 'textarea', ['rows' => 3]],
        ['pdf', 'PDF download', 'file', ['return_format' => 'id', 'mime_types' => 'pdf']],
        olea_sections(),
        ['columns', 'Menu options', 'repeater', [
            'instructions' => 'For menus with several priced options side by side (e.g. Christmas). Leave empty otherwise.',
            'layout' => 'block',
            'button_label' => 'Add menu option',
            'sub_fields' => [
                ['title', 'Title', 'text', ['required' => 1, 'wrapper' => ['width' => 50]]],
                ['price', 'Price', 'text', ['instructions' => 'e.g. £52', 'wrapper' => ['width' => 50]]],
                olea_sections(),
            ],
        ]],
    ]);

    olea_group('event', 'What’s On item', $type('olea_event'), [
        ['category', 'Category', 'radio', ['choices' => ['Festive' => 'Festive', 'Menus' => 'Menus', 'Events' => 'Events'], 'required' => 1, 'layout' => 'horizontal']],
        ['date', 'Date', 'text', ['instructions' => 'Shown as written, e.g. 7 November 2026 · 19:30']],
        ['ends_on', 'Last day', 'date_picker', [
            'instructions' => 'Optional. The day after this date (London time) the item moves to Past events.',
            'display_format' => 'j F Y',
            'return_format' => 'Y-m-d',
        ]],
        ['show_on_home', 'Show on home page', 'true_false'],
        ['summary', 'Summary', 'textarea', ['rows' => 5, 'required' => 1]],
        ['image', 'Image', 'image', $image + ['required' => 1]],
        ['banner', 'Banner', 'image', ['instructions' => 'Optional wide banner, shown uncropped at the top of the event page.'] + $image],
        ['details', 'Details', 'textarea', ['rows' => 8, 'instructions' => 'Optional extra paragraphs for the event page. ' . OLEA_PARAGRAPHS_HELP]],
        ['menu', 'Linked menu', 'post_object', [
            'post_type' => ['olea_menu'],
            'allow_null' => 1,
            'return_format' => 'id',
            'instructions' => 'Optional. Shows the menu price and a link to it.',
        ]],
    ]);

    olea_group('post', 'Blog post', $type('post'), [
        ['meta_title', 'Search title', 'text', ['instructions' => 'Optional. The page title shown in search results and browser tabs. Defaults to the title.']],
        ['intro', 'Intro paragraphs', 'textarea', ['rows' => 6, 'instructions' => 'Shown in larger type at the top. ' . OLEA_PARAGRAPHS_HELP]],
        ['outro', 'Closing line', 'text'],
        ['outro_href', 'Closing line link', 'text', ['instructions' => 'Optional. A page on this site (e.g. /private-dining) or a full URL.']],
    ]);

    olea_group('settings', 'Site settings', $page('olea_settings'), [
        ['name', 'Name'],
        ['tagline', 'Tagline', 'text', ['instructions' => 'Shown under the logo on the home page.']],
        ['address', 'Address', 'group', ['sub_fields' => [['line1', 'Street'], ['city', 'City'], ['postcode', 'Postcode']]]],
        ['phone', 'Phone'],
        ['email', 'Email', 'email'],
        ['booking_url', 'Booking link', 'url'],
        ['maps_url', 'Google Maps link', 'url'],
        ['hours', 'Opening hours', 'repeater', ['layout' => 'table', 'button_label' => 'Add row', 'sub_fields' => [
            ['days', 'Days', 'text', ['instructions' => 'e.g. Monday – Friday']],
            ['time', 'Time', 'text', ['instructions' => 'e.g. 11:30am – 11:30pm']],
        ]]],
        ['social', 'Social links', 'repeater', ['layout' => 'table', 'button_label' => 'Add link', 'sub_fields' => [
            ['label', 'Label'],
            ['href', 'URL'],
        ]]],
        ['dietary', 'Menu allergy & service note', 'textarea', ['rows' => 4]],
    ]);

    olea_group('home', 'Home page', $page('olea_home'), [
        ['intro', 'Intro headline'],
        ['intro_sub', 'Intro sub-headline', 'textarea', ['rows' => 3]],
        ['body', 'Body', 'textarea', ['rows' => 5]],
        ['promos', 'Promotions', 'repeater', ['layout' => 'block', 'button_label' => 'Add promotion', 'collapsed' => 'title', 'sub_fields' => [
            ['eyebrow', 'Eyebrow', 'text', ['instructions' => 'Small line above the title.']],
            ['title', 'Title', 'text', ['required' => 1]],
            ['body', 'Text', 'textarea', ['rows' => 5, 'instructions' => OLEA_PARAGRAPHS_HELP]],
            ['cta_label', 'Button label', 'text', ['wrapper' => ['width' => 40]]],
            ['cta_href', 'Button link', 'text', ['instructions' => 'A page on this site such as /menu, or a full https:// address.', 'wrapper' => ['width' => 60]]],
            ['image', 'Image', 'image', $image + ['required' => 1]],
        ]]],
    ]);

    olea_group('about', 'About page', $page('olea_about'), [
        ['title', 'Title'],
        ['paragraphs', 'Story', 'textarea', ['rows' => 10, 'instructions' => OLEA_PARAGRAPHS_HELP]],
        ['name', 'About the name', 'textarea', ['rows' => 8, 'instructions' => OLEA_PARAGRAPHS_HELP]],
        ['regions', 'Regions', 'textarea', ['rows' => 6, 'instructions' => 'One per line.']],
        ['slides', 'Slideshow', 'gallery', ['return_format' => 'id', 'mime_types' => 'jpg,jpeg,png,webp']],
        ['gallery', 'Gallery', 'gallery', ['return_format' => 'id', 'mime_types' => 'jpg,jpeg,png,webp']],
    ]);

    olea_group('private_dining', 'Private dining page', $page('olea_private_dining'), [
        ['intro', 'Intro', 'textarea', ['rows' => 4]],
    ]);

    olea_group('whats_on', 'What’s On page', $page('olea_whats_on'), [
        ['eyebrow', 'Eyebrow'],
        ['title', 'Title'],
        ['intro', 'Intro', 'textarea', ['rows' => 3]],
    ]);
});
