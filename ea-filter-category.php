<?php
/**
 * Plugin Name: EA Filter Category
 * Description: Filters product categories and brands in the WooCommerce product editor.
 * Version:     1.1.0
 * Author:      EA
 * Text Domain: ea-filter-category
 * Requires at least: 6.5
 * Requires PHP: 7.4
 * WC requires at least: 8.0
 *
 * @package EA_Filter_Category
 */

defined( 'ABSPATH' ) || exit;

define( 'EA_FILTER_CATEGORY_VERSION', '1.1.0' );

/** Load assets only in product creation and edit screens. */
function ea_filter_category_enqueue_admin_assets() {
	$screen = get_current_screen();
	if ( ! $screen || 'post' !== $screen->base || 'product' !== $screen->post_type ) {
		return;
	}

	$asset_url = plugin_dir_url( __FILE__ );

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