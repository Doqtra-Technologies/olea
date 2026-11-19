<?php
// Tells the site to drop its cached content after an edit, so changes show straight away.
// Needs OLEA_REVALIDATE_URL (https://<site>/api/revalidate) and OLEA_REVALIDATE_SECRET.

defined('ABSPATH') || exit;

/** Queues one call for the end of the request, however many things were saved in it. */
function olea_queue_revalidate(): void
{
    static $queued = false;
    if ($queued || !olea_config('OLEA_REVALIDATE_URL') || !olea_config('OLEA_REVALIDATE_SECRET')) return;
    $queued = true;
    add_action('shutdown', function () {
        $response = wp_remote_post(olea_config('OLEA_REVALIDATE_URL'), [
            'timeout' => 3,
            'headers' => ['Authorization' => 'Bearer ' . olea_config('OLEA_REVALIDATE_SECRET')],
        ]);
        // Kept for troubleshooting: wp option get olea_last_revalidate
        update_option('olea_last_revalidate', [
            'time' => current_time('mysql'),
            'result' => is_wp_error($response) ? $response->get_error_message() : wp_remote_retrieve_response_code($response),
        ], false);
    });
}

add_action('save_post', function (int $id, WP_Post $post) {
    if (wp_is_post_revision($id) || wp_is_post_autosave($id) || $post->post_status === 'auto-draft') return;
    if (in_array($post->post_type, ['post', 'olea_menu', 'olea_event'], true)) olea_queue_revalidate();
}, 10, 2);

// Fields are written after save_post, and options pages don't fire save_post at all.
add_action('acf/save_post', 'olea_queue_revalidate', 20, 0);

add_action('deleted_post', 'olea_queue_revalidate', 10, 0);

// Alt text and replaced files.
add_action('edit_attachment', 'olea_queue_revalidate', 10, 0);
