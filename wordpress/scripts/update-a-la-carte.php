<?php
/**
 * Sets the A la carte menu to the November 2026 version: its intro, its dishes and its PDF download.
 * Run it with ../update-a-la-carte.sh. Safe to run again; it writes the same content each time.
 *
 * Each section is [title, note, featured, dishes], and each dish is [name, description, price].
 */

require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';
require_once ABSPATH . 'wp-admin/includes/image.php';

const OLEA_ALC_PDF = '/menus/a-la-carte.pdf';
const OLEA_ALC_PDF_NAME = 'a-la-carte-menu.pdf';
const OLEA_ALC_INTRO = 'Our chef has crafted a unique Mediterranean menu with ingredients and flavours from the Mediterranean coast. Using timeless cooking techniques and authentic flavours, all served with a modern twist.';

$sections = [
    ['Starters', '', false, [
        ['Olives', 'Dried apricots and lemon oil (VG)', '5'],
        ['Bread basket', 'Herb butter (V)', '5.5'],
        ['Atom', 'Yogurt, hint of garlic, fresh chilli, smoked paprika, sesame, olive oil', '9'],
        ['Hummus', 'Dried black olive flakes, sesame seeds (VG)', '9.5'],
        ['Tabbouleh', 'Parsley, mint, crushed wheat, tomatoes, spring onions and lemon (VG)', '8'],
        ['Babaganoush', 'Grilled aubergine, yogurt, tahini, garlic, lemon, grilled pepper, onion (V)', '9.5'],
        ['Antep ezme', 'Chopped tomatoes, onions and chilli pepper salad (VG)', '8.5'],
        ['Cacik', 'Yogurt, cucumber, mint and dill (V)', '8.5'],
        ['Burrata', 'Heirloom tomatoes (V)', '13'],
        ['Turkish aubergine shakshuka', 'Served on yogurt (V)', '9.5'],
        ['Charcoal grilled halloumi', '(V)', '10'],
        ['Sucuk', 'Grilled spicy beef sausage', '8.5'],
        ['Manchego croquetas', '3 pcs, chilli jam (V)', '9.5'],
        ['Fried baby calamari', 'Lime mayo', '11.5'],
        ['Smoked salmon', 'Pickled cucumber, garlic yogurt, salmon roe, cucumber sauce', '11.5'],
        ['Cast iron prawns', 'Oyster, chestnut & button mushrooms, confit garlic', '13'],
        ['Falafel', 'Fritters of crushed chickpeas, fava beans and peppers (VG)', '8.5'],
        ['Crispy courgette', 'Beetroot purée, yogurt and garlic', '8.5'],
        ['Lambs liver', 'Sautéed lambs liver in butter sauce served on cauliflower purée, red onions, sumac', '11'],
        ['Cheese plate', 'Manchego, St Nectaire, parmesan, blue cheese, with grapes, walnuts, olive oil torta and quince chutney (V)', '15.5'],
    ]],
    ['Fish & Seafood', '', false, [
        ['Seabass fillet', 'Sautéed diced aubergine, cherry tomatoes, asparagus, shallots and white wine', '26'],
        ['Grilled monkfish shish', 'Garlic & yogurt marinade, preserved lemon, saffron rice, romesco sauce, grilled courgette', '29'],
        ['Grilled salmon', 'Salmon fillet, smoky piperade, confit baby potatoes', '27'],
        ['Grilled tiger prawn', 'Red pepper, carrot sauce with chickpeas and spinach', '28'],
        ['Prawn and Cornish crab spaghetti', 'Sautéed prawns, Cornish white crab meat, garlic, chilli, parsley', '27'],
        ['Grilled octopus', 'Tendered octopus with pan-fried potatoes, romesco sauce', '24'],
    ]],
    ['Vegetarian & Vegan', '', false, [
        ['Grilled confit artichoke', 'Seared polenta, mustard, baby carrots, orange (VG)', '20'],
        ['Chargrilled cauliflower', 'Carrot and orange purée, garlic flakes, dried olives (VG)', '22'],
        ['Vegetable moussaka', 'Layers of aubergine, courgette, potatoes and peppers topped with béchamel and cheese gratin, served with cacik (V)', '22'],
    ]],
    ['Salads', '', false, [
        ['Fresh mixed salad', 'Baby spinach, green apple, oak lettuce, Tulum cheese and cherry tomatoes (vegan option available) (V)', '17'],
        ['Chicken salad', 'Grilled chicken, baby spinach, green apple, oak lettuce and cherry tomatoes', '24'],
        ['Salmon salad', 'Grilled salmon, baby spinach, green apple, oak lettuce and cherry tomatoes', '26'],
        ['Artichoke salad', 'Sliced avocado, beetroot carpaccio, white truffle oil', '17'],
    ]],
    ['Meat', '', false, [
        ['Lamb kofte skewer', 'Yogurt, crispy bread, grilled pepper and tomato', '26'],
        ['Chicken shish', 'Grilled asparagus and courgettes with sumac, cacik and lavash bread', '25'],
        ['Chicken tagine', 'Braised chicken, spice-infused sauce, prunes, dried apricots, almonds, with rice', '24'],
        ['Lamb shish', 'Grilled asparagus and courgettes with sumac, grilled pepper and ezme salad', '27'],
        ['Mixed grill', 'Grilled cubes of chicken, lamb and kofte with grilled asparagus and courgette, ezme salad', '27.5'],
        ['Lamb chops', '3 pcs, with fennel salad', '28.5'],
        ['Minced meat moussaka', 'Served with cacik', '26'],
        ['Incik', 'Slow cooked lamb shank (boneless) with onions, peppers, keşkek, drizzled with butter sauce', '28'],
    ]],
    ['Signature Steaks', '', true, [
        ['Sirloin steak 280g', 'Sautéed spiced potatoes, peppercorn sauce', '37'],
        ['Black Angus rib-eye 280g', 'Sautéed spiced potatoes, chimichurri', '43'],
    ]],
    ['Stone Oven-Baked Pide', 'Anatolian pizza', false, [
        ['Spinach, feta and chilli flakes', '(V)', '17.5'],
        ['Mushroom and taleggio', '(V)', '17.5'],
        ['Beef pepperoni and mozzarella', '', '17.5'],
        ['Minced lamb and vegetables', '', '17.5'],
    ]],
    ['Sides', '', false, [
        ['Samphire', 'Pine nuts and garlic oil (VG)', '8.5'],
        ['Spiced new potatoes', 'Parsley (V)', '7'],
        ['Chips', 'Spicy mayo (V)', '6'],
        ['Basmati rice', '(VG)', '5'],
        ['Bulgur rice', '(VG)', '5'],
        ['Saffron rice', '(VG)', '7'],
        ['Fresh mixed salad', '(VG)', '7'],
        ['Grilled asparagus and courgettes', 'Crispy garlic (VG)', '6'],
    ]],
];

$found = get_posts(['post_type' => 'olea_menu', 'name' => 'a-la-carte', 'post_status' => 'any', 'fields' => 'ids', 'numberposts' => 1]);
if (!$found) WP_CLI::error('There is no menu with the slug a-la-carte.');
$menu = $found[0];

update_field('field_olea_menu_intro', OLEA_ALC_INTRO, $menu);

update_field('field_olea_menu_sections', array_map(fn (array $s) => [
    'title' => $s[0],
    'note' => $s[1],
    'featured' => $s[2] ? 1 : 0,
    'dishes' => array_map(fn (array $d) => ['name' => $d[0], 'description' => $d[1], 'price' => $d[2]], $s[3]),
], $sections), $menu);
WP_CLI::log(sprintf('Dishes: %d in %d sections.', array_sum(array_map(fn (array $s) => count($s[3]), $sections)), count($sections)));

// The PDF: upload the new file once, recognised afterwards by its checksum.
if (!is_readable(OLEA_ALC_PDF)) WP_CLI::error('Missing ' . OLEA_ALC_PDF . ' (wordpress/menus/a-la-carte.pdf in the repository).');
$checksum = md5_file(OLEA_ALC_PDF);
$old = (int) get_field('pdf', $menu, false);
$existing = get_posts(['post_type' => 'attachment', 'post_status' => 'inherit', 'meta_key' => '_olea_checksum', 'meta_value' => $checksum, 'fields' => 'ids', 'numberposts' => 1]);
$new = $existing[0] ?? 0;
if (!$new) {
    // Sideloading moves the file it is given, so hand it a copy.
    $tmp = wp_tempnam(OLEA_ALC_PDF_NAME);
    copy(OLEA_ALC_PDF, $tmp);
    $new = media_handle_sideload(['name' => OLEA_ALC_PDF_NAME, 'tmp_name' => $tmp], 0, 'A la carte menu');
    if (is_wp_error($new)) WP_CLI::error($new->get_error_message());
    update_post_meta($new, '_olea_checksum', $checksum);
    WP_CLI::log('Uploaded ' . wp_get_attachment_url($new));
}
update_field('field_olea_menu_pdf', $new, $menu);

// Remove the previous PDF, unless another menu still links to it.
if ($old && $old !== $new) {
    $users = get_posts(['post_type' => 'olea_menu', 'post_status' => 'any', 'meta_key' => 'pdf', 'meta_value' => $old, 'fields' => 'ids', 'numberposts' => -1]);
    if ($users) {
        WP_CLI::log("Kept the previous PDF (attachment $old): still used by menu " . implode(', ', $users) . '.');
    } else {
        wp_delete_attachment($old, true);
        WP_CLI::log("Deleted the previous PDF (attachment $old).");
    }
}

WP_CLI::success('A la carte menu updated.');
