<?php
/**
 * Applies the menus the client sent on 24 November 2026: Pre-Theatre and Christmas (changed dishes and PDFs),
 * and the new Party Menu 1 and Party Menu 2. The Gluten Free PDF sent with them was identical to the one online.
 *
 *   wp eval-file update-menus-2026-11-24.php <folder holding the PDFs>
 *
 * Safe to run again. Only the dishes named here change, and previous PDFs stay in the media library.
 */

require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';
require_once ABSPATH . 'wp-admin/includes/image.php';

$dir = rtrim($args[0] ?? '/public/menus', '/');
$files = [
    'pre-theatre' => ['pre-theatre.pdf', 'pre-theatre-menu.pdf', 'Pre-Theatre menu'],
    'christmas' => ['christmas-2026.pdf', 'christmas-menu-2026.pdf', 'Christmas menu 2026'],
    'party-menu-1' => ['party-menu-1.pdf', 'party-menu-1.pdf', 'Party Menu 1'],
    'party-menu-2' => ['party-menu-2.pdf', 'party-menu-2.pdf', 'Party Menu 2'],
];
foreach ($files as [$file]) if (!is_readable("$dir/$file")) WP_CLI::error("Missing $dir/$file");

function olea_nov24_menu(string $slug): int
{
    return get_posts(['post_type' => 'olea_menu', 'name' => $slug, 'post_status' => 'any', 'fields' => 'ids', 'numberposts' => 1])[0] ?? 0;
}

/** Replaces a dish with its new [name, description], wherever it sits in the sections. Stops if it isn't there. */
function olea_nov24_replace(array $sections, array $old, array $new): array
{
    $hits = 0;
    foreach ($sections as &$section) {
        foreach ($section['dishes'] as &$dish) {
            $now = [$dish['name'], $dish['description']];
            if ($now === $new) $hits++;
            if ($now !== $old) continue;
            [$dish['name'], $dish['description']] = $new;
            $hits++;
        }
    }
    if ($hits !== 1) WP_CLI::error("Expected one \"{$old[0]}\" ({$old[1]}), found $hits. It may have been edited in WordPress.");
    return $sections;
}

/** Uploads the PDF once, recognised afterwards by its checksum. */
function olea_nov24_pdf(string $path, string $name, string $title): int
{
    $checksum = md5_file($path);
    $found = get_posts(['post_type' => 'attachment', 'post_status' => 'inherit', 'meta_key' => '_olea_checksum', 'meta_value' => $checksum, 'fields' => 'ids', 'numberposts' => 1]);
    if ($found) return $found[0];
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
foreach (['pre-theatre', 'christmas'] as $slug) if (!$menus[$slug]) WP_CLI::error("There is no menu with the slug $slug.");

// Work out every change before writing anything.
$pre = get_field('sections', $menus['pre-theatre']);
$pre = olea_nov24_replace($pre, ['Babaganoush', 'Grilled aubergine, yogurt, tahini, garlic and lemon (V)'], ['Babaganoush', 'Grilled aubergine, yogurt, tahini, garlic, lemon, grilled pepper, onion (V)']);
$pre = olea_nov24_replace($pre, ['Seabream fillet', 'Sautéed diced aubergine, cherry tomatoes, asparagus, shallots and white wine'], ['Seabass fillet', 'Sautéed diced aubergine, cherry tomatoes, asparagus, shallots and white wine']);

$christmas = get_field('columns', $menus['christmas']);
foreach ($christmas as &$column) {
    if ($column['title'] !== 'Menu 2') continue;
    $column['sections'] = olea_nov24_replace($column['sections'], ['Lamb shank', 'Slow cooked with onions, peppers and bulgur rice'], ['Lamb shank', 'Slow cooked lamb shank (boneless) with onions, peppers and keşkek, butter sauce']);
}
unset($column);

$dishes = fn (array $rows) => array_map(fn (array $d) => ['name' => $d[0], 'description' => $d[1], 'price' => ''], $rows);
$section = fn (string $title, array $rows) => ['title' => $title, 'note' => '', 'featured' => 0, 'dishes' => $dishes($rows)];
$starters = [
    ['Hummus', 'Dried black olive flakes, sesame seeds (VG)'],
    ['Tabbouleh', 'Parsley, mint, crushed wheat, tomatoes, spring onions and lemon (VG)'],
    ['Babaganoush', 'Grilled aubergine, yogurt, tahini, garlic, lemon, grilled pepper, onion (V)'],
    ['Falafel', 'Fritters of crushed chickpeas, fava beans and peppers (VG)'],
    ['Cacik', 'Yogurt, cucumber, mint, dill (V)'],
];
// slug => [label, tab order (between Christmas and Kids), price, sections]
$party = [
    'party-menu-1' => ['Party Menu 1', 62, '£48 per person', [
        $section('Selection of starters', $starters),
        $section('A choice of main', [
            ['Lamb kofte', 'Yogurt, crispy bread, grilled peppers and tomatoes'],
            ['Chicken tagine', 'Braised chicken, spice-infused sauce, prunes, dried apricots, almonds, with rice'],
            ['Grilled salmon', 'Salmon fillet, smoky piperade, confit baby potatoes'],
            ['Chargrilled cauliflower', 'Carrot and orange purée, garlic flakes and dried olives (VG)'],
            ['Chicken shish', 'Grilled cubes of marinated chicken breast served with grilled asparagus, courgettes and lavash bread'],
        ]),
        $section('Dessert', [['Baklava', 'Pistachio and honey cream (V)']]),
    ]],
    'party-menu-2' => ['Party Menu 2', 64, '£55 per person', [
        $section('Selection of starters', [
            ...$starters,
            ['Manchego croquetas', 'Manchego cheese, chilli jam (V)'],
            ['Calamari', 'Fried baby calamari served with lime mayo'],
            ['Hellim cheese', 'Chargrilled Cypriot cheese (V)'],
        ]),
        $section('A choice of main', [
            ['Mixed grill', 'Grilled cubes of chicken, lamb and kofte served with grilled asparagus and courgette, with ezme salad and lavash bread'],
            ['Sirloin steak', '280g Black Angus sirloin, peppercorn sauce, sautéed spiced potatoes'],
            ['Lamb chops', 'Grilled lamb chops, served with fennel salad'],
            ['Vegetable moussaka', 'Layers of aubergine, courgette, potatoes and peppers topped with béchamel sauce and cheese gratin (V)'],
            ['Seabass', 'Sautéed diced aubergine, cherry tomatoes, asparagus, shallots and white wine'],
            ['Lamb shank', 'Slow cooked lamb shank (boneless) with onions, peppers, keşkek, drizzled with butter sauce'],
        ]),
        $section('A choice of dessert', [
            ['Baklava', 'Pistachio and honey cream (V)'],
            ['Chocolate brownie', 'Vanilla ice cream and chocolate sauce'],
        ]),
    ]],
];

update_field('field_olea_menu_sections', $pre, $menus['pre-theatre']);
update_field('field_olea_menu_columns', $christmas, $menus['christmas']);
foreach ($party as $slug => [$label, $order, $price, $sections]) {
    $id = wp_insert_post(['ID' => $menus[$slug], 'post_type' => 'olea_menu', 'post_name' => $slug, 'post_title' => $label, 'post_status' => 'publish', 'menu_order' => $order], true);
    if (is_wp_error($id)) WP_CLI::error($id->get_error_message());
    $menus[$slug] = $id;
    update_field('field_olea_menu_price', $price, $id);
    update_field('field_olea_menu_sections', $sections, $id);
}
foreach ($files as $slug => [$file, $name, $title]) {
    update_field('field_olea_menu_pdf', olea_nov24_pdf("$dir/$file", $name, $title), $menus[$slug]);
}

// Saving a menu is what tells the site to reload its content.
wp_update_post(['ID' => $menus['pre-theatre']]);
WP_CLI::success('Pre-Theatre, Christmas, Party Menu 1 and Party Menu 2 updated.');
