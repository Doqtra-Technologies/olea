<?php
/**
 * Restores the "Olea Site" settings and the site icon from export/options.json on another WordPress.
 * Run after the database tables are imported: wp eval-file import-options.php options.json
 */

$file = $args[0] ?? '';
if (!is_readable($file)) WP_CLI::error('Usage: wp eval-file import-options.php <path to options.json>');
$options = json_decode(file_get_contents($file), true);
if (!is_array($options)) WP_CLI::error("$file is not valid JSON.");

foreach ($options as $name => $value) update_option($name, $value, false);
WP_CLI::success(count($options) . ' options restored.');
