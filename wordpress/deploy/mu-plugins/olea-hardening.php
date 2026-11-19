<?php
/**
 * Plugin Name: Olea hardening
 * Description: No mail through the server's mail(), no XML-RPC.
 */
defined('ABSPATH') || exit;

// WordPress must not send mail from this server (the domain's mail is Microsoft 365).
// Returning anything but null from pre_wp_mail stops wp_mail() before it reaches PHPMailer/mail().
add_filter('pre_wp_mail', fn () => false, PHP_INT_MAX);

add_filter('xmlrpc_enabled', '__return_false');
add_filter('wp_headers', function (array $headers) {
    unset($headers['X-Pingback']);
    return $headers;
});
