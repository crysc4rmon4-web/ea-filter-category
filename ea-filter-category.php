<?php
/**
 * Plugin Name: EA Filter Category
 * Plugin URI:  https://example.com/
 * Description: Adds a live filter input to the WooCommerce product category metabox in wp-admin.
 * Version:     1.0.0
 * Author:      EA
 * Text Domain: ea-filter-category
 * Requires at least: 6.5
 * Requires PHP: 7.4
 * WC requires at least: 8.0
 *
 * @package EA_Filter_Category
 */

defined( 'ABSPATH' ) || exit;

define( 'EA_FILTER_CATEGORY_VERSION', '1.0.0' );
define( 'EA_FILTER_CATEGORY_FILE', __FILE__ );

/**
 * Enqueue assets only on WooCommerce product edit screens.
 *
 * @param string $hook_suffix Current admin page.
 */
function ea_filter_category_enqueue_admin_assets( $hook_suffix ) {
	if ( ! in_array( $hook_suffix, array( 'post.php', 'post-new.php' ), true ) ) {
		return;
	}

	$screen = get_current_screen();

	if ( ! $screen || 'post' !== $screen->base || 'product' !== $screen->post_type ) {
		return;
	}

	$asset_url = plugin_dir_url( EA_FILTER_CATEGORY_FILE );

	wp_enqueue_style(
		'ea-filter-category-admin',
		$asset_url . 'assets/css/admin.css',
		array(),
		EA_FILTER_CATEGORY_VERSION
	);

	wp_enqueue_script(
		'ea-filter-category-admin',
		$asset_url . 'assets/js/admin.js',
		array(),
		EA_FILTER_CATEGORY_VERSION,
		true
	);
}
add_action( 'admin_enqueue_scripts', 'ea_filter_category_enqueue_admin_assets' );
