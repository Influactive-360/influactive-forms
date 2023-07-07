<?php
/**
 * Plugin Name: Forms everywhere by Influactive
 * Description: A plugin to create custom forms and display them anywhere on your website.
 * Version: 1.0
 * Author: Influactive
 * Author URI: https://influactive.com
 * Text Domain: influactive-forms
 * Domain Path: /languages
 * License: GPL2
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 **/

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

include(plugin_dir_path(__FILE__) . 'back-end/post-type/definitions.php');
include(plugin_dir_path(__FILE__) . 'back-end/post-type/listing.php');
include(plugin_dir_path(__FILE__) . 'back-end/post-type/edit.php');
include(plugin_dir_path(__FILE__) . 'back-end/settings/page.php');
include(plugin_dir_path(__FILE__) . 'front-end/shortcode.php');

function influactive_forms_add_settings_link($links)
{
    $settings_link = '<a href="edit.php?post_type=influactive-forms&page=influactive-form-settings">' . __('Settings') . '</a>';
    $links[] = $settings_link;
    return $links;
}

add_action('admin_enqueue_scripts', 'influactive_form_edit');
function influactive_form_edit($hook): void
{
    if ('post.php' !== $hook && 'post-new.php' !== $hook) {
        return;
    }

    wp_enqueue_script('influactive-form', plugin_dir_url(__FILE__) . 'back-end/post-type/admin.js', array('influactive-form-sortable'), '1.0', true);
    wp_enqueue_script('influactive-form-sortable', 'https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.13.0/Sortable.min.js', array(), '1.0', true);
}
