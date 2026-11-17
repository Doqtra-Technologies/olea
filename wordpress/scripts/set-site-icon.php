<?php
/**
 * Sets the WordPress site icon (browser tab and admin) to the Olea Stamp.
 * setup.sh runs it. Safe to run again: the image is uploaded once and recognised by its checksum.
 */

require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';
require_once ABSPATH . 'wp-admin/includes/image.php';

const OLEA_ICON = '/public/icon-512.png';

if (!is_readable(OLEA_ICON)) WP_CLI::error('Missing ' . OLEA_ICON . ' (public/icon-512.png in the repository).');
$checksum = md5_file(OLEA_ICON);
$existing = get_posts(['post_type' => 'attachment', 'post_status' => 'inherit', 'meta_key' => '_olea_checksum', 'meta_value' => $checksum, 'fields' => 'ids', 'numberposts' => 1]);
$icon = $existing[0] ?? 0;
if (!$icon) {
    // Sideloading moves the file it is given, so hand it a copy.
    $tmp = wp_tempnam('olea-stamp.png');
    copy(OLEA_ICON, $tmp);
    $icon = media_handle_sideload(['name' => 'olea-stamp.png', 'tmp_name' => $tmp], 0, 'Olea Stamp');
    if (is_wp_error($icon)) WP_CLI::error($icon->get_error_message());
    update_post_meta($icon, '_olea_checksum', $checksum);
    update_post_meta($icon, '_wp_attachment_image_alt', 'Olea Social stamp');
}
update_option('site_icon', $icon);
WP_CLI::success("Site icon set (attachment $icon).");
