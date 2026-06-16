<?php
/**
 * Gen-Z Luxury Portfolio Theme Functions
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// 1. Theme Setup
function genz_portfolio_theme_setup() {
    // Add support for post thumbnails (featured images)
    add_theme_support( 'post-thumbnails' );
}
add_action( 'after_setup_theme', 'genz_portfolio_theme_setup' );

// 2. Enqueue Scripts and Styles
function genz_portfolio_theme_scripts() {
    // Google Fonts
    wp_enqueue_style( 
        'genz-portfolio-fonts', 
        'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap', 
        array(), 
        null 
    );

    // Main stylesheet
    wp_enqueue_style( 
        'genz-portfolio-style', 
        get_template_directory_uri() . '/assets/css/theme-style.css', 
        array(), 
        '1.0.0' 
    );

    // Main JS script
    wp_enqueue_script( 
        'genz-portfolio-script', 
        get_template_directory_uri() . '/assets/js/theme-main.js', 
        array(), 
        '1.0.0', 
        true 
    );
}
add_action( 'wp_enqueue_scripts', 'genz_portfolio_theme_scripts' );

// 3. Register Customizer Settings for Full Editability
function genz_portfolio_customize_register( $wp_customize ) {
    
    // ==========================================
    // HERO SECTION CUSTOMIZER
    // ==========================================
    $wp_customize->add_section( 'genz_hero_section', array(
        'title'      => esc_html__( 'Hero Section Settings', 'genz-portfolio-theme' ),
        'priority'   => 30,
    ) );

    // Hero Title
    $wp_customize->add_setting( 'genz_hero_title', array(
        'default'   => 'SHAPING Visions INTO ART.',
        'sanitize_callback' => 'wp_kses_post',
    ) );
    $wp_customize->add_control( 'genz_hero_title', array(
        'label'    => esc_html__( 'Hero Title (Use HTML tags like <br> or <span class="accent-text text-glow">)', 'genz-portfolio-theme' ),
        'section'  => 'genz_hero_section',
        'type'     => 'textarea',
    ) );

    // Hero Subtitle
    $wp_customize->add_setting( 'genz_hero_subtitle', array(
        'default'   => 'Premium fashion-editorial photographer & videographer defining the visual language of 2026.',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'genz_hero_subtitle', array(
        'label'    => esc_html__( 'Hero Subtitle', 'genz-portfolio-theme' ),
        'section'  => 'genz_hero_section',
        'type'     => 'textarea',
    ) );

    // Hero Showcase Image
    $wp_customize->add_setting( 'genz_hero_image', array(
        'default'           => '',
        'sanitize_callback' => 'esc_url_raw',
    ) );
    $wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'genz_hero_image', array(
        'label'    => esc_html__( 'Hero Showcase Image', 'genz-portfolio-theme' ),
        'section'  => 'genz_hero_section',
        'settings' => 'genz_hero_image',
    ) ) );

    // ==========================================
    // ABOUT SECTION CUSTOMIZER
    // ==========================================
    $wp_customize->add_section( 'genz_about_section', array(
        'title'      => esc_html__( 'About Section Settings', 'genz-portfolio-theme' ),
        'priority'   => 40,
    ) );

    // About Main Title
    $wp_customize->add_setting( 'genz_about_title', array(
        'default'   => 'THE MIND<br>BEHIND <span class="accent-text">THE LENS</span>',
        'sanitize_callback' => 'wp_kses_post',
    ) );
    $wp_customize->add_control( 'genz_about_title', array(
        'label'    => esc_html__( 'About Title', 'genz-portfolio-theme' ),
        'section'  => 'genz_about_section',
        'type'     => 'textarea',
    ) );

    // About Text description
    $wp_customize->add_setting( 'genz_about_text', array(
        'default'   => 'I capture raw, electric moments sitting at the intersection of streetwear subculture, dynamic sports, and high-fashion editorial. By blending creative camera movements with cinematic grain and glass refraction techniques, I create visual poetry that leaves a trace.',
        'sanitize_callback' => 'sanitize_textarea_field',
    ) );
    $wp_customize->add_control( 'genz_about_text', array(
        'label'    => esc_html__( 'About Description Text', 'genz-portfolio-theme' ),
        'section'  => 'genz_about_section',
        'type'     => 'textarea',
    ) );

    // About Profile Image
    $wp_customize->add_setting( 'genz_about_image', array(
        'default'           => '',
        'sanitize_callback' => 'esc_url_raw',
    ) );
    $wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'genz_about_image', array(
        'label'    => esc_html__( 'About Profile Image', 'genz-portfolio-theme' ),
        'section'  => 'genz_about_section',
        'settings' => 'genz_about_image',
    ) ) );

    // Counter 1: Projects Completed
    $wp_customize->add_setting( 'genz_stat_projects', array( 'default' => '150', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'genz_stat_projects', array( 'label' => 'Projects Completed Count', 'section' => 'genz_about_section', 'type' => 'text' ) );

    // Counter 2: Happy Clients
    $wp_customize->add_setting( 'genz_stat_clients', array( 'default' => '98', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'genz_stat_clients', array( 'label' => 'Happy Clients %', 'section' => 'genz_about_section', 'type' => 'text' ) );

    // Counter 3: Countries Served
    $wp_customize->add_setting( 'genz_stat_countries', array( 'default' => '12', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'genz_stat_countries', array( 'label' => 'Countries Served Count', 'section' => 'genz_about_section', 'type' => 'text' ) );

    // Counter 4: Experience
    $wp_customize->add_setting( 'genz_stat_experience', array( 'default' => '5', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'genz_stat_experience', array( 'label' => 'Years Experience Count', 'section' => 'genz_about_section', 'type' => 'text' ) );

    // ==========================================
    // SERVICES SECTION CUSTOMIZER
    // ==========================================
    $wp_customize->add_section( 'genz_services_section', array(
        'title'      => esc_html__( 'Services Settings', 'genz-portfolio-theme' ),
        'priority'   => 45,
    ) );

    // Service 1
    $wp_customize->add_setting( 'genz_service1_title', array( 'default' => 'PHOTOGRAPHY', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'genz_service1_title', array( 'label' => 'Service 1 Title', 'section' => 'genz_services_section', 'type' => 'text' ) );
    $wp_customize->add_setting( 'genz_service1_desc', array( 'default' => 'High-fashion editorial, street culture portraits, and artist campaign photography with high-contrast cinematic styles.', 'sanitize_callback' => 'sanitize_textarea_field' ) );
    $wp_customize->add_control( 'genz_service1_desc', array( 'label' => 'Service 1 Description', 'section' => 'genz_services_section', 'type' => 'textarea' ) );
    $wp_customize->add_setting( 'genz_service1_media', array( 'default' => '/assets/images/portfolio1.png,/assets/images/portfolio2.png,/assets/images/portfolio4.png,/assets/images/profile.png', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'genz_service1_media', array( 'label' => 'Service 1 Gallery Media (Comma-separated URLs)', 'section' => 'genz_services_section', 'type' => 'textarea' ) );

    // Service 2
    $wp_customize->add_setting( 'genz_service2_title', array( 'default' => 'VIDEOGRAPHY', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'genz_service2_title', array( 'label' => 'Service 2 Title', 'section' => 'genz_services_section', 'type' => 'text' ) );
    $wp_customize->add_setting( 'genz_service2_desc', array( 'default' => 'Creative commercials, visual reels, and high-energy music videos containing rapid edits and camera-movement aesthetics.', 'sanitize_callback' => 'sanitize_textarea_field' ) );
    $wp_customize->add_control( 'genz_service2_desc', array( 'label' => 'Service 2 Description', 'section' => 'genz_services_section', 'type' => 'textarea' ) );
    $wp_customize->add_setting( 'genz_service2_media', array( 'default' => 'https://assets.mixkit.co/videos/preview/mixkit-cinematic-shot-of-a-skater-performing-tricks-43306-large.mp4,https://assets.mixkit.co/videos/preview/mixkit-top-view-of-cars-on-a-highway-41852-large.mp4', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'genz_service2_media', array( 'label' => 'Service 2 Gallery Media (Comma-separated URLs)', 'section' => 'genz_services_section', 'type' => 'textarea' ) );

    // Service 3
    $wp_customize->add_setting( 'genz_service3_title', array( 'default' => 'EDITING & POST', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'genz_service3_title', array( 'label' => 'Service 3 Title', 'section' => 'genz_services_section', 'type' => 'text' ) );
    $wp_customize->add_setting( 'genz_service3_desc', array( 'default' => 'Distortion overlays, glitch textures, custom color correction, and dynamic transitions to fit modern branding requirements.', 'sanitize_callback' => 'sanitize_textarea_field' ) );
    $wp_customize->add_control( 'genz_service3_desc', array( 'label' => 'Service 3 Description', 'section' => 'genz_services_section', 'type' => 'textarea' ) );
    $wp_customize->add_setting( 'genz_service3_media', array( 'default' => '/assets/images/portfolio2.png,/assets/images/portfolio4.png', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'genz_service3_media', array( 'label' => 'Service 3 Gallery Media (Comma-separated URLs)', 'section' => 'genz_services_section', 'type' => 'textarea' ) );

    // Service 4
    $wp_customize->add_setting( 'genz_service4_title', array( 'default' => 'BRAND STYLING', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'genz_service4_title', array( 'label' => 'Service 4 Title', 'section' => 'genz_services_section', 'type' => 'text' ) );
    $wp_customize->add_setting( 'genz_service4_desc', array( 'default' => 'Complete visual direction to establish unique styling, layout pacing, and visual identities across platforms.', 'sanitize_callback' => 'sanitize_textarea_field' ) );
    $wp_customize->add_control( 'genz_service4_desc', array( 'label' => 'Service 4 Description', 'section' => 'genz_services_section', 'type' => 'textarea' ) );
    $wp_customize->add_setting( 'genz_service4_media', array( 'default' => '/assets/images/portfolio1.png,/assets/images/profile.png', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'genz_service4_media', array( 'label' => 'Service 4 Gallery Media (Comma-separated URLs)', 'section' => 'genz_services_section', 'type' => 'textarea' ) );

    // ==========================================
    // TESTIMONIALS SECTION CUSTOMIZER
    // ==========================================
    $wp_customize->add_section( 'genz_testimonials_section', array(
        'title'      => esc_html__( 'Testimonials Settings', 'genz-portfolio-theme' ),
        'priority'   => 48,
    ) );

    // Testimonial 1
    $wp_customize->add_setting( 'genz_testimonial1_quote', array( 'default' => 'Kai completely redefined our streetwear brand\'s campaign. The dynamic camera movements combined with acid green color grading gave us a distinct edge on our website. Absolutely next level.', 'sanitize_callback' => 'sanitize_textarea_field' ) );
    $wp_customize->add_control( 'genz_testimonial1_quote', array( 'label' => 'Testimonial 1 Quote', 'section' => 'genz_testimonials_section', 'type' => 'textarea' ) );
    $wp_customize->add_setting( 'genz_testimonial1_name', array( 'default' => 'Amara Vance', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'genz_testimonial1_name', array( 'label' => 'Testimonial 1 Name', 'section' => 'genz_testimonials_section', 'type' => 'text' ) );
    $wp_customize->add_setting( 'genz_testimonial1_role', array( 'default' => 'Founder, NEO-GRID Tokyo', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'genz_testimonial1_role', array( 'label' => 'Testimonial 1 Role', 'section' => 'genz_testimonials_section', 'type' => 'text' ) );
    $wp_customize->add_setting( 'genz_testimonial1_avatar', array( 'default' => '', 'sanitize_callback' => 'esc_url_raw' ) );
    $wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'genz_testimonial1_avatar', array( 'label' => 'Testimonial 1 Avatar', 'section' => 'genz_testimonials_section', 'settings' => 'genz_testimonial1_avatar' ) ) );

    // Testimonial 2
    $wp_customize->add_setting( 'genz_testimonial2_quote', array( 'default' => 'Working with Kai was seamless. The edits match exactly what modern Gen-Z visual design looks like: punchy, authentic, and cinematic. The custom website integrations are incredible.', 'sanitize_callback' => 'sanitize_textarea_field' ) );
    $wp_customize->add_control( 'genz_testimonial2_quote', array( 'label' => 'Testimonial 2 Quote', 'section' => 'genz_testimonials_section', 'type' => 'textarea' ) );
    $wp_customize->add_setting( 'genz_testimonial2_name', array( 'default' => 'Jaden Miller', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'genz_testimonial2_name', array( 'label' => 'Testimonial 2 Name', 'section' => 'genz_testimonials_section', 'type' => 'text' ) );
    $wp_customize->add_setting( 'genz_testimonial2_role', array( 'default' => 'Director, SATELLITE Records', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'genz_testimonial2_role', array( 'label' => 'Testimonial 2 Role', 'section' => 'genz_testimonials_section', 'type' => 'text' ) );
    $wp_customize->add_setting( 'genz_testimonial2_avatar', array( 'default' => '', 'sanitize_callback' => 'esc_url_raw' ) );
    $wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'genz_testimonial2_avatar', array( 'label' => 'Testimonial 2 Avatar', 'section' => 'genz_testimonials_section', 'settings' => 'genz_testimonial2_avatar' ) ) );

    // Testimonial 3
    $wp_customize->add_setting( 'genz_testimonial3_quote', array( 'default' => 'Highly recommended for architectural and fashion-editorial work. The eye for detail and post-production coloring is amazing. We got an Awwwards nominee using this material.', 'sanitize_callback' => 'sanitize_textarea_field' ) );
    $wp_customize->add_control( 'genz_testimonial3_quote', array( 'label' => 'Testimonial 3 Quote', 'section' => 'genz_testimonials_section', 'type' => 'textarea' ) );
    $wp_customize->add_setting( 'genz_testimonial3_name', array( 'default' => 'Sofia Laurent', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'genz_testimonial3_name', array( 'label' => 'Testimonial 3 Name', 'section' => 'genz_testimonials_section', 'type' => 'text' ) );
    $wp_customize->add_setting( 'genz_testimonial3_role', array( 'default' => 'Creative Lead, MAISON Agency', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'genz_testimonial3_role', array( 'label' => 'Testimonial 3 Role', 'section' => 'genz_testimonials_section', 'type' => 'text' ) );
    $wp_customize->add_setting( 'genz_testimonial3_avatar', array( 'default' => '', 'sanitize_callback' => 'esc_url_raw' ) );
    $wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'genz_testimonial3_avatar', array( 'label' => 'Testimonial 3 Avatar', 'section' => 'genz_testimonials_section', 'settings' => 'genz_testimonial3_avatar' ) ) );

    // ==========================================
    // CONTACT DETAIL CUSTOMIZER
    // ==========================================
    $wp_customize->add_section( 'genz_contact_section', array(
        'title'      => esc_html__( 'Contact Settings', 'genz-portfolio-theme' ),
        'priority'   => 50,
    ) );

    // Contact Email
    $wp_customize->add_setting( 'genz_contact_email', array( 'default' => 'hello@kai.studio', 'sanitize_callback' => 'sanitize_email' ) );
    $wp_customize->add_control( 'genz_contact_email', array( 'label' => 'Email Address', 'section' => 'genz_contact_section', 'type' => 'text' ) );

    // Contact Whatsapp Link
    $wp_customize->add_setting( 'genz_contact_whatsapp', array( 'default' => '+1 (555) 019-2026', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'genz_contact_whatsapp', array( 'label' => 'WhatsApp Number', 'section' => 'genz_contact_section', 'type' => 'text' ) );

    // Contact Instagram Username
    $wp_customize->add_setting( 'genz_contact_instagram', array( 'default' => '@kai.visions', 'sanitize_callback' => 'sanitize_text_field' ) );
    $wp_customize->add_control( 'genz_contact_instagram', array( 'label' => 'Instagram Handle', 'section' => 'genz_contact_section', 'type' => 'text' ) );
}
add_action( 'customize_register', 'genz_portfolio_customize_register' );
