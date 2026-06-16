<?php
/**
 * Main Template File - index.php
 *
 * @package Gen-Z_Luxury_Portfolio_Theme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// Media URL resolver helper function
if ( ! function_exists( 'genz_resolve_media_urls' ) ) {
	function genz_resolve_media_urls( $media_str ) {
		if ( empty( $media_str ) ) {
			return '';
		}
		$urls = explode( ',', $media_str );
		$resolved_urls = array();
		foreach ( $urls as $url ) {
			$url = trim( $url );
			if ( strpos( $url, '/assets/' ) === 0 ) {
				$resolved_urls[] = get_template_directory_uri() . $url;
			} else {
				$resolved_urls[] = $url;
			}
		}
		return implode( ',', $resolved_urls );
	}
}
?>
<!doctype html>
<html <?php language_attributes(); ?>>
  <head>
    <meta charset="<?php bloginfo( 'charset' ) ; ?>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <?php wp_head(); ?>
  </head>
  <body <?php body_class(); ?>>
    <?php wp_body_open(); ?>

    <!-- Background Canvas Engine -->
    <canvas id="bg-canvas"></canvas>
    <div id="noise-overlay"></div>
    <div id="grid-overlay"></div>

    <!-- Magnetic Custom Cursor -->
    <div id="custom-cursor-ring"></div>
    <div id="custom-cursor-dot"></div>

    <!-- Main Navigation Bar -->
    <header class="main-header">
      <div class="header-container">
        <a href="#" class="logo magnetic" data-magnetic-strength="0.3">
          <?php bloginfo( 'name' ); ?><span>•</span>STUDIO
        </a>
        <nav class="nav-links">
          <a href="#about" class="nav-link magnetic" data-magnetic-strength="0.4"><?php esc_html_e( 'About', 'genz-portfolio-theme' ); ?></a>
          <a href="#portfolio" class="nav-link magnetic" data-magnetic-strength="0.4"><?php esc_html_e( 'Works', 'genz-portfolio-theme' ); ?></a>
          <a href="#services" class="nav-link magnetic" data-magnetic-strength="0.4"><?php esc_html_e( 'Services', 'genz-portfolio-theme' ); ?></a>
          <a href="#testimonials" class="nav-link magnetic" data-magnetic-strength="0.4"><?php esc_html_e( 'Reviews', 'genz-portfolio-theme' ); ?></a>
          <a href="#contact" class="nav-link magnetic" data-magnetic-strength="0.4"><?php esc_html_e( 'Book', 'genz-portfolio-theme' ); ?></a>
        </nav>
        <div class="header-action">
          <a href="#contact" class="btn-primary magnetic" data-magnetic-strength="0.5">
            <span><?php esc_html_e( 'GET IN TOUCH', 'genz-portfolio-theme' ); ?></span>
          </a>
        </div>
        <!-- Mobile Menu Trigger -->
        <button class="mobile-menu-trigger" aria-label="<?php esc_attr_e( 'Toggle Menu', 'genz-portfolio-theme' ); ?>">
          <span></span>
          <span></span>
        </button>
      </div>
    </header>

    <!-- Mobile Navigation Overlay -->
    <div class="mobile-nav-overlay">
      <nav class="mobile-nav-links">
        <a href="#about" class="mobile-nav-link"><?php esc_html_e( 'About', 'genz-portfolio-theme' ); ?></a>
        <a href="#portfolio" class="mobile-nav-link"><?php esc_html_e( 'Works', 'genz-portfolio-theme' ); ?></a>
        <a href="#services" class="mobile-nav-link"><?php esc_html_e( 'Services', 'genz-portfolio-theme' ); ?></a>
        <a href="#testimonials" class="mobile-nav-link"><?php esc_html_e( 'Reviews', 'genz-portfolio-theme' ); ?></a>
        <a href="#contact" class="mobile-nav-link"><?php esc_html_e( 'Book Now', 'genz-portfolio-theme' ); ?></a>
      </nav>
    </div>

    <!-- MAIN SCROLL CONTAINER -->
    <main class="scroll-container">
      
      <!-- HERO SECTION -->
      <section id="hero" class="hero-section">
        <!-- Split Composition Layer -->
        <div class="hero-split-left">
          <div class="hero-content-wrapper hero-fade-in">
            <h1 class="hero-title">
              <?php echo wp_kses_post( get_theme_mod( 'genz_hero_title', 'SHAPING<br><span class="accent-text text-glow">VISIONS</span><br>INTO ART.' ) ); ?>
            </h1>
            <p class="hero-subtitle">
              <?php echo esc_html( get_theme_mod( 'genz_hero_subtitle', 'Premium fashion-editorial photographer & videographer defining the visual language of 2026.' ) ); ?>
            </p>
            <div class="hero-actions">
              <a href="#portfolio" class="btn-primary magnetic" data-magnetic-strength="0.3">
                <span><?php esc_html_e( 'VIEW SHOWREEL', 'genz-portfolio-theme' ); ?></span>
              </a>
              <a href="#contact" class="btn-secondary magnetic" data-magnetic-strength="0.3">
                <span><?php esc_html_e( 'COLLABORATE', 'genz-portfolio-theme' ); ?></span>
              </a>
            </div>
          </div>
        </div>

        <div class="hero-split-right">
          <!-- Non-rectangular diagonal mask shape -->
          <div class="diagonal-mask">
            <div class="cinematic-bg-wrapper">
              <?php 
              $hero_img = get_theme_mod( 'genz_hero_image' );
              if ( ! $hero_img ) {
                  $hero_img = get_template_directory_uri() . '/assets/images/portfolio1.png';
              }
              ?>
              <img src="<?php echo esc_url( $hero_img ); ?>" alt="<?php esc_attr_e( 'Cinematic Editorial Portrait', 'genz-portfolio-theme' ); ?>" class="cinematic-bg-img">
              <div class="cinematic-overlay"></div>
            </div>
          </div>
        </div>

        <!-- Anti-Gravity Floating elements -->
        <div class="floating-tags-container" id="floating-tags-container">
          <div class="floating-tag depth-1" data-speed="1.2" data-depth="0.08" data-dir="1">
            <span><?php esc_html_e( 'Photographer', 'genz-portfolio-theme' ); ?></span>
          </div>
          <div class="floating-tag depth-2" data-speed="1.8" data-depth="0.15" data-dir="-1">
            <span><?php esc_html_e( 'Videographer', 'genz-portfolio-theme' ); ?></span>
          </div>
          <div class="floating-tag depth-3" data-speed="0.8" data-depth="0.04" data-dir="1">
            <span><?php esc_html_e( 'Director', 'genz-portfolio-theme' ); ?></span>
          </div>
          <div class="floating-tag depth-2" data-speed="2.2" data-depth="0.12" data-dir="-1">
            <span><?php esc_html_e( 'Storyteller', 'genz-portfolio-theme' ); ?></span>
          </div>
          <div class="floating-tag depth-1" data-speed="1.5" data-depth="0.06" data-dir="1">
            <span><?php esc_html_e( 'Creative Director', 'genz-portfolio-theme' ); ?></span>
          </div>
        </div>
      </section>

      <!-- TICKER / MARQUEE SECTION -->
      <section class="marquee-section">
        <div class="marquee-container" id="ticker-1">
          <div class="marquee-track">
            <span><?php esc_html_e( 'AVAILABLE WORLDWIDE', 'genz-portfolio-theme' ); ?></span>
            <span class="dot">★</span>
            <span><?php esc_html_e( 'BOOKINGS OPEN', 'genz-portfolio-theme' ); ?></span>
            <span class="dot">★</span>
            <span><?php esc_html_e( 'CREATIVE STORYTELLER', 'genz-portfolio-theme' ); ?></span>
            <span class="dot">★</span>
            <span><?php esc_html_e( 'CINEMATIC VIBES', 'genz-portfolio-theme' ); ?></span>
            <span class="dot">★</span>
            <span><?php esc_html_e( 'FASHION EDITORIAL', 'genz-portfolio-theme' ); ?></span>
            <span class="dot">★</span>
          </div>
        </div>
      </section>

      <!-- ABOUT SECTION -->
      <section id="about" class="about-section scroll-reveal" data-reveal="fade-up">
        <div class="section-container">
          <div class="about-grid">
            
            <div class="about-visual">
              <div class="profile-card">
                <?php 
                $about_img = get_theme_mod( 'genz_about_image' );
                if ( ! $about_img ) {
                    $about_img = get_template_directory_uri() . '/assets/images/profile.png';
                }
                ?>
                <img src="<?php echo esc_url( $about_img ); ?>" alt="<?php esc_attr_e( 'Kai Portrait', 'genz-portfolio-theme' ); ?>" class="profile-img">
                <div class="glass-card-overlay"></div>
              </div>
              
              <!-- Rotating Circular Badge -->
              <div class="rotating-badge-wrapper" id="rotating-badge-container">
                <svg viewBox="0 0 100 100" class="rotating-badge-svg">
                  <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
                  <text class="rotating-badge-text">
                    <textPath href="#circlePath" startOffset="0%">
                      <?php esc_html_e( 'CREATIVE VISION • BEYOND THE LENS • EST. 2026 •', 'genz-portfolio-theme' ); ?>
                    </textPath>
                  </text>
                </svg>
                <div class="badge-dot"></div>
              </div>
            </div>

            <div class="about-content">
              <h2 class="section-title">
                <?php echo wp_kses_post( get_theme_mod( 'genz_about_title', 'THE MIND<br>BEHIND <span class="accent-text">THE LENS</span>' ) ); ?>
              </h2>
              <p class="about-text">
                <?php echo esc_html( get_theme_mod( 'genz_about_text', 'I capture raw, electric moments sitting at the intersection of streetwear subculture, dynamic sports, and high-fashion editorial. By blending creative camera movements with cinematic grain and glass refraction techniques, I create visual poetry that leaves a trace.' ) ); ?>
              </p>
              
              <!-- Statistics Counter Grid -->
              <div class="stats-grid">
                <div class="stat-box glass-card" data-stat-target="<?php echo esc_attr( get_theme_mod( 'genz_stat_projects', '150' ) ); ?>">
                  <div class="stat-number"><span class="counter">0</span>+</div>
                  <div class="stat-label"><?php esc_html_e( 'Projects Completed', 'genz-portfolio-theme' ); ?></div>
                </div>
                <div class="stat-box glass-card" data-stat-target="<?php echo esc_attr( get_theme_mod( 'genz_stat_clients', '98' ) ); ?>">
                  <div class="stat-number"><span class="counter">0</span>%</div>
                  <div class="stat-label"><?php esc_html_e( 'Happy Clients', 'genz-portfolio-theme' ); ?></div>
                </div>
                <div class="stat-box glass-card" data-stat-target="<?php echo esc_attr( get_theme_mod( 'genz_stat_countries', '12' ) ); ?>">
                  <div class="stat-number"><span class="counter">0</span>+</div>
                  <div class="stat-label"><?php esc_html_e( 'Countries Served', 'genz-portfolio-theme' ); ?></div>
                </div>
                <div class="stat-box glass-card" data-stat-target="<?php echo esc_attr( get_theme_mod( 'genz_stat_experience', '5' ) ); ?>">
                  <div class="stat-number"><span class="counter">0</span>+</div>
                  <div class="stat-label"><?php esc_html_e( 'Years Experience', 'genz-portfolio-theme' ); ?></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- PORTFOLIO SECTION -->
      <section id="portfolio" class="portfolio-section scroll-reveal" data-reveal="fade-up">
        <div class="section-container">
          <div class="portfolio-header">
            <h2 class="section-title"><?php esc_html_e( 'SELECTED', 'genz-portfolio-theme' ); ?> <span class="accent-text"><?php esc_html_e( 'WORKS', 'genz-portfolio-theme' ); ?></span></h2>
            
            <!-- Category Filters -->
            <div class="portfolio-filters">
              <button class="filter-btn active" data-filter="all"><?php esc_html_e( 'All', 'genz-portfolio-theme' ); ?></button>
              <button class="filter-btn" data-filter="fashion"><?php esc_html_e( 'Fashion', 'genz-portfolio-theme' ); ?></button>
              <button class="filter-btn" data-filter="editorial"><?php esc_html_e( 'Editorial', 'genz-portfolio-theme' ); ?></button>
              <button class="filter-btn" data-filter="video"><?php esc_html_e( 'Video', 'genz-portfolio-theme' ); ?></button>
            </div>
          </div>

          <!-- Masonry Grid -->
          <div class="portfolio-grid" id="portfolio-grid">
            
            <?php
            $args = array(
                'post_type'      => 'post',
                'posts_per_page' => 12,
                'post_status'    => 'publish',
            );
            $portfolio_query = new WP_Query( $args );
            if ( $portfolio_query->have_posts() ) :
                while ( $portfolio_query->have_posts() ) : $portfolio_query->the_post();
                    // Extract category slugs and display tags
                    $categories = get_the_category();
                    $cat_classes = array();
                    $cat_names = array();
                    if ( ! empty( $categories ) ) {
                        foreach ( $categories as $category ) {
                            $cat_classes[] = esc_attr( strtolower( $category->slug ) );
                            $cat_names[] = esc_html( strtoupper( $category->name ) );
                        }
                    }
                    $cat_class_str = implode( ' ', $cat_classes );
                    $cat_display = ! empty( $cat_names ) ? implode( ' / ', $cat_names ) : 'PORTFOLIO';

                    // Get featured image source
                    $img_src = '';
                    if ( has_post_thumbnail() ) {
                        $img_src = get_the_post_thumbnail_url( get_the_ID(), 'full' );
                    } else {
                        $img_src = get_template_directory_uri() . '/assets/images/portfolio1.png';
                    }

                    // Check for video url custom field or category
                    $video_src = get_post_meta( get_the_ID(), 'video_url', true );
                    $is_video = ! empty( $video_src ) || in_array( 'video', $cat_classes );

                    // Determine grid size
                    $post_index = $portfolio_query->current_post;
                    $grid_size = 'size-medium';
                    if ( $post_index % 3 == 0 ) {
                        $grid_size = 'size-tall';
                    } elseif ( $post_index % 3 == 1 ) {
                        $grid_size = 'size-wide';
                    }
                    ?>
                    <div class="portfolio-item <?php echo esc_attr( $grid_size . ' ' . $cat_class_str ); ?> scroll-reveal" 
                         data-reveal="fade-up" 
                         <?php if ( $is_video ) : ?>
                         data-video-src="<?php echo esc_url( $video_src ); ?>"
                         <?php else : ?>
                         data-src="<?php echo esc_url( $img_src ); ?>"
                         <?php endif; ?>
                         data-title="<?php echo esc_attr( get_the_title() ); ?>" 
                         data-category="<?php echo esc_attr( $cat_display ); ?>">
                      <div class="portfolio-media-wrapper">
                        <?php if ( $is_video ) : ?>
                        <video src="<?php echo esc_url( $video_src ); ?>" poster="<?php echo esc_url( $img_src ); ?>" muted loop playsinline class="portfolio-media video-preview"></video>
                        <div class="portfolio-overlay">
                          <div class="portfolio-info">
                            <span class="portfolio-cat"><?php echo $cat_display; ?></span>
                            <h3 class="portfolio-title"><?php the_title(); ?></h3>
                          </div>
                          <span class="portfolio-play-icon">▶</span>
                        </div>
                        <?php else : ?>
                        <img src="<?php echo esc_url( $img_src ); ?>" alt="<?php echo esc_attr( get_the_title() ); ?>" class="portfolio-media">
                        <div class="portfolio-overlay">
                          <div class="portfolio-info">
                            <span class="portfolio-cat"><?php echo $cat_display; ?></span>
                            <h3 class="portfolio-title"><?php the_title(); ?></h3>
                          </div>
                          <span class="portfolio-arrow">↗</span>
                        </div>
                        <?php endif; ?>
                      </div>
                    </div>
                    <?php
                endwhile;
                wp_reset_postdata();
            else :
                // FALLBACK STATIC SHOWCASE ITEMS
                ?>
                <!-- Item 1 (Fashion) -->
                <div class="portfolio-item size-tall fashion scroll-reveal" data-reveal="fade-up" data-src="<?php echo get_template_directory_uri(); ?>/assets/images/portfolio1.png" data-title="CYBER SUITS" data-category="Fashion Editorial">
                  <div class="portfolio-media-wrapper">
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/portfolio1.png" alt="Cyber Suits" class="portfolio-media">
                    <div class="portfolio-overlay">
                      <div class="portfolio-info">
                        <span class="portfolio-cat">FASHION</span>
                        <h3 class="portfolio-title">CYBER SUITS</h3>
                      </div>
                      <span class="portfolio-arrow">↗</span>
                    </div>
                  </div>
                </div>

                <!-- Item 2 (Editorial) -->
                <div class="portfolio-item size-wide editorial scroll-reveal" data-reveal="fade-up" data-src="<?php echo get_template_directory_uri(); ?>/assets/images/portfolio2.png" data-title="REFRACTED LIGHT" data-category="Creative Portrait">
                  <div class="portfolio-media-wrapper">
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/portfolio2.png" alt="Refracted Light" class="portfolio-media">
                    <div class="portfolio-overlay">
                      <div class="portfolio-info">
                        <span class="portfolio-cat">EDITORIAL</span>
                        <h3 class="portfolio-title">NEON RAIN</h3>
                      </div>
                      <span class="portfolio-arrow">↗</span>
                    </div>
                  </div>
                </div>

                <!-- Item 3 (Video) -->
                <div class="portfolio-item size-medium video scroll-reveal" data-reveal="fade-up" data-video-src="https://assets.mixkit.co/videos/preview/mixkit-cinematic-shot-of-a-skater-performing-tricks-43306-large.mp4" data-title="SKATE CHRONICLES" data-category="Cinematic Video">
                  <div class="portfolio-media-wrapper">
                    <video src="https://assets.mixkit.co/videos/preview/mixkit-cinematic-shot-of-a-skater-performing-tricks-43306-large.mp4" poster="<?php echo get_template_directory_uri(); ?>/assets/images/portfolio3.png" muted loop playsinline class="portfolio-media video-preview"></video>
                    <div class="portfolio-overlay">
                      <div class="portfolio-info">
                        <span class="portfolio-cat">VIDEO</span>
                        <h3 class="portfolio-title">SKATE MOTION</h3>
                      </div>
                      <span class="portfolio-play-icon">▶</span>
                    </div>
                  </div>
                </div>

                <!-- Item 4 (Editorial) -->
                <div class="portfolio-item size-wide editorial scroll-reveal" data-reveal="fade-up" data-src="<?php echo get_template_directory_uri(); ?>/assets/images/portfolio3.png" data-title="CONCRETE CURVES" data-category="Architectural Space">
                  <div class="portfolio-media-wrapper">
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/portfolio3.png" alt="Concrete Curves" class="portfolio-media">
                    <div class="portfolio-overlay">
                      <div class="portfolio-info">
                        <span class="portfolio-cat">EDITORIAL</span>
                        <h3 class="portfolio-title">CONCRETE CURVES</h3>
                      </div>
                      <span class="portfolio-arrow">↗</span>
                    </div>
                  </div>
                </div>

                <!-- Item 5 (Fashion) -->
                <div class="portfolio-item size-tall fashion editorial scroll-reveal" data-reveal="fade-up" data-src="<?php echo get_template_directory_uri(); ?>/assets/images/portfolio4.png" data-title="GLASS IDENTITY" data-category="Fashion Editorial">
                  <div class="portfolio-media-wrapper">
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/portfolio4.png" alt="Glass Identity" class="portfolio-media">
                    <div class="portfolio-overlay">
                      <div class="portfolio-info">
                        <span class="portfolio-cat">FASHION</span>
                        <h3 class="portfolio-title">GLASS EYE</h3>
                      </div>
                      <span class="portfolio-arrow">↗</span>
                    </div>
                  </div>
                </div>

                <!-- Item 6 (Video) -->
                <div class="portfolio-item size-medium video scroll-reveal" data-reveal="fade-up" data-video-src="https://assets.mixkit.co/videos/preview/mixkit-top-view-of-cars-on-a-highway-41852-large.mp4" data-title="METROPOLIS FLOW" data-category="Urban Cinematography">
                  <div class="portfolio-media-wrapper">
                    <video src="https://assets.mixkit.co/videos/preview/mixkit-top-view-of-cars-on-a-highway-41852-large.mp4" poster="<?php echo get_template_directory_uri(); ?>/assets/images/portfolio2.png" muted loop playsinline class="portfolio-media video-preview"></video>
                    <div class="portfolio-overlay">
                      <div class="portfolio-info">
                        <span class="portfolio-cat">CINEMATIC VIDEO</span>
                        <h3 class="portfolio-title">METROPOLIS</h3>
                      </div>
                      <span class="portfolio-play-icon">▶</span>
                    </div>
                  </div>
                </div>
                <?php
            endif;
            ?>

          </div>
        </div>
      </section>

      <!-- SERVICES SECTION -->
      <section id="services" class="services-section scroll-reveal" data-reveal="fade-up">
        <div class="section-container">
          <h2 class="section-title"><?php esc_html_e( 'OUR', 'genz-portfolio-theme' ); ?> <span class="accent-text"><?php esc_html_e( 'SERVICES', 'genz-portfolio-theme' ); ?></span></h2>
          
          <div class="services-grid">
            
            <!-- Service 1 -->
            <div class="service-card glass-card scroll-reveal" data-reveal="fade-up"
                 data-gallery-title="<?php echo esc_attr( get_theme_mod( 'genz_service1_title', 'PHOTOGRAPHY' ) ); ?> Showcase"
                 data-gallery-cat="<?php echo esc_attr( get_theme_mod( 'genz_service1_title', 'PHOTOGRAPHY' ) ); ?>"
                 data-gallery-media="<?php echo esc_attr( genz_resolve_media_urls( get_theme_mod( 'genz_service1_media', '/assets/images/portfolio1.png,/assets/images/portfolio2.png,/assets/images/portfolio4.png,/assets/images/profile.png' ) ) ); ?>">
              <div class="service-flood-bg"></div>
              <div class="service-content">
                <div class="service-header">
                  <span class="service-num">01</span>
                  <div class="service-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                  </div>
                </div>
                <h3 class="service-title"><?php echo esc_html( get_theme_mod( 'genz_service1_title', 'PHOTOGRAPHY' ) ); ?></h3>
                <p class="service-desc"><?php echo esc_html( get_theme_mod( 'genz_service1_desc', 'High-fashion editorial, street culture portraits, and artist campaign photography with high-contrast cinematic styles.' ) ); ?></p>
                <span class="service-link"><?php esc_html_e( 'MORE DETAILS', 'genz-portfolio-theme' ); ?> <span>→</span></span>
              </div>
            </div>

            <!-- Service 2 -->
            <div class="service-card glass-card scroll-reveal" data-reveal="fade-up"
                 data-gallery-title="<?php echo esc_attr( get_theme_mod( 'genz_service2_title', 'VIDEOGRAPHY' ) ); ?> Campaigns"
                 data-gallery-cat="<?php echo esc_attr( get_theme_mod( 'genz_service2_title', 'VIDEOGRAPHY' ) ); ?>"
                 data-gallery-media="<?php echo esc_attr( genz_resolve_media_urls( get_theme_mod( 'genz_service2_media', 'https://assets.mixkit.co/videos/preview/mixkit-cinematic-shot-of-a-skater-performing-tricks-43306-large.mp4,https://assets.mixkit.co/videos/preview/mixkit-top-view-of-cars-on-a-highway-41852-large.mp4' ) ) ); ?>">
              <div class="service-flood-bg"></div>
              <div class="service-content">
                <div class="service-header">
                  <span class="service-num">02</span>
                  <div class="service-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <polygon points="23 7 16 12 23 17 23 7"/>
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                    </svg>
                  </div>
                </div>
                <h3 class="service-title"><?php echo esc_html( get_theme_mod( 'genz_service2_title', 'VIDEOGRAPHY' ) ); ?></h3>
                <p class="service-desc"><?php echo esc_html( get_theme_mod( 'genz_service2_desc', 'Creative commercials, visual reels, and high-energy music videos containing rapid edits and camera-movement aesthetics.' ) ); ?></p>
                <span class="service-link"><?php esc_html_e( 'MORE DETAILS', 'genz-portfolio-theme' ); ?> <span>→</span></span>
              </div>
            </div>

            <!-- Service 3 -->
            <div class="service-card glass-card scroll-reveal" data-reveal="fade-up"
                 data-gallery-title="<?php echo esc_attr( get_theme_mod( 'genz_service3_title', 'EDITING & POST' ) ); ?> Showcase"
                 data-gallery-cat="<?php echo esc_attr( get_theme_mod( 'genz_service3_title', 'EDITING & POST' ) ); ?>"
                 data-gallery-media="<?php echo esc_attr( genz_resolve_media_urls( get_theme_mod( 'genz_service3_media', '/assets/images/portfolio2.png,/assets/images/portfolio4.png' ) ) ); ?>">
              <div class="service-flood-bg"></div>
              <div class="service-content">
                <div class="service-header">
                  <span class="service-num">03</span>
                  <div class="service-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                    </svg>
                  </div>
                </div>
                <h3 class="service-title"><?php echo esc_html( get_theme_mod( 'genz_service3_title', 'EDITING & POST' ) ); ?></h3>
                <p class="service-desc"><?php echo esc_html( get_theme_mod( 'genz_service3_desc', 'Distortion overlays, glitch textures, custom color correction, and dynamic transitions to fit modern branding requirements.' ) ); ?></p>
                <span class="service-link"><?php esc_html_e( 'MORE DETAILS', 'genz-portfolio-theme' ); ?> <span>→</span></span>
              </div>
            </div>

            <!-- Service 4 -->
            <div class="service-card glass-card scroll-reveal" data-reveal="fade-up"
                 data-gallery-title="<?php echo esc_attr( get_theme_mod( 'genz_service4_title', 'BRAND STYLING' ) ); ?> Showcase"
                 data-gallery-cat="<?php echo esc_attr( get_theme_mod( 'genz_service4_title', 'BRAND STYLING' ) ); ?>"
                 data-gallery-media="<?php echo esc_attr( genz_resolve_media_urls( get_theme_mod( 'genz_service4_media', '/assets/images/portfolio1.png,/assets/images/profile.png' ) ) ); ?>">
              <div class="service-flood-bg"></div>
              <div class="service-content">
                <div class="service-header">
                  <span class="service-num">04</span>
                  <div class="service-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <rect x="2" y="2" width="20" height="20" rx="2" ry="2"/>
                      <path d="M7 2v20M17 2v20M2 7h20M2 17h20"/>
                    </svg>
                  </div>
                </div>
                <h3 class="service-title"><?php echo esc_html( get_theme_mod( 'genz_service4_title', 'BRAND STYLING' ) ); ?></h3>
                <p class="service-desc"><?php echo esc_html( get_theme_mod( 'genz_service4_desc', 'Complete visual direction to establish unique styling, layout pacing, and visual identities across platforms.' ) ); ?></p>
                <span class="service-link"><?php esc_html_e( 'MORE DETAILS', 'genz-portfolio-theme' ); ?> <span>→</span></span>
              </div>
            </div>

          </div>
        </div>
      </section>

      <!-- TESTIMONIALS SECTION -->
      <section id="testimonials" class="testimonials-section scroll-reveal" data-reveal="fade-up">
        <div class="section-container">
          <h2 class="section-title"><?php esc_html_e( 'CLIENT', 'genz-portfolio-theme' ); ?> <span class="accent-text"><?php esc_html_e( 'FEEDBACK', 'genz-portfolio-theme' ); ?></span></h2>
          
          <div class="testimonials-slider-container">
            <div class="testimonials-slider" id="testimonials-slider">
              
              <!-- Slide 1 -->
              <div class="testimonial-slide glass-card">
                <div class="testimonial-quote">"<?php echo esc_html( get_theme_mod( 'genz_testimonial1_quote', 'Kai completely redefined our streetwear brand\'s campaign. The dynamic camera movements combined with acid green color grading gave us a distinct edge on our website. Absolutely next level.' ) ); ?>"</div>
                <div class="testimonial-client">
                  <div class="client-avatar">
                    <?php 
                    $t1_avatar = get_theme_mod( 'genz_testimonial1_avatar' );
                    if ( ! $t1_avatar ) {
                        $t1_avatar = get_template_directory_uri() . '/assets/images/portfolio1.png';
                    }
                    ?>
                    <img src="<?php echo esc_url( $t1_avatar ); ?>" alt="<?php echo esc_attr( get_theme_mod( 'genz_testimonial1_name', 'Amara Vance' ) ); ?>">
                  </div>
                  <div class="client-info">
                    <div class="client-name"><?php echo esc_html( get_theme_mod( 'genz_testimonial1_name', 'Amara Vance' ) ); ?></div>
                    <div class="client-role"><?php echo esc_html( get_theme_mod( 'genz_testimonial1_role', 'Founder, NEO-GRID Tokyo' ) ); ?></div>
                  </div>
                </div>
              </div>

              <!-- Slide 2 -->
              <div class="testimonial-slide glass-card">
                <div class="testimonial-quote">"<?php echo esc_html( get_theme_mod( 'genz_testimonial2_quote', 'Working with Kai was seamless. The edits match exactly what modern Gen-Z visual design looks like: punchy, authentic, and cinematic. The custom website integrations are incredible.' ) ); ?>"</div>
                <div class="testimonial-client">
                  <div class="client-avatar">
                    <?php 
                    $t2_avatar = get_theme_mod( 'genz_testimonial2_avatar' );
                    if ( ! $t2_avatar ) {
                        $t2_avatar = get_template_directory_uri() . '/assets/images/portfolio2.png';
                    }
                    ?>
                    <img src="<?php echo esc_url( $t2_avatar ); ?>" alt="<?php echo esc_attr( get_theme_mod( 'genz_testimonial2_name', 'Jaden Miller' ) ); ?>">
                  </div>
                  <div class="client-info">
                    <div class="client-name"><?php echo esc_html( get_theme_mod( 'genz_testimonial2_name', 'Jaden Miller' ) ); ?></div>
                    <div class="client-role"><?php echo esc_html( get_theme_mod( 'genz_testimonial2_role', 'Director, SATELLITE Records' ) ); ?></div>
                  </div>
                </div>
              </div>

              <!-- Slide 3 -->
              <div class="testimonial-slide glass-card">
                <div class="testimonial-quote">"<?php echo esc_html( get_theme_mod( 'genz_testimonial3_quote', 'Highly recommended for architectural and fashion-editorial work. The eye for detail and post-production coloring is amazing. We got an Awwwards nominee using this material.' ) ); ?>"</div>
                <div class="testimonial-client">
                  <div class="client-avatar">
                    <?php 
                    $t3_avatar = get_theme_mod( 'genz_testimonial3_avatar' );
                    if ( ! $t3_avatar ) {
                        $t3_avatar = get_template_directory_uri() . '/assets/images/portfolio3.png';
                    }
                    ?>
                    <img src="<?php echo esc_url( $t3_avatar ); ?>" alt="<?php echo esc_attr( get_theme_mod( 'genz_testimonial3_name', 'Sofia Laurent' ) ); ?>">
                  </div>
                  <div class="client-info">
                    <div class="client-name"><?php echo esc_html( get_theme_mod( 'genz_testimonial3_name', 'Sofia Laurent' ) ); ?></div>
                    <div class="client-role"><?php echo esc_html( get_theme_mod( 'genz_testimonial3_role', 'Creative Lead, MAISON Agency' ) ); ?></div>
                  </div>
                </div>
              </div>

            </div>
            
            <!-- Slider Navigation -->
            <div class="slider-nav">
              <button class="slider-btn prev-btn magnetic" aria-label="<?php esc_attr_e( 'Previous Slide', 'genz-portfolio-theme' ); ?>">←</button>
              <button class="slider-btn next-btn magnetic" aria-label="<?php esc_attr_e( 'Next Slide', 'genz-portfolio-theme' ); ?>">→</button>
            </div>
          </div>
        </div>
      </section>

      <!-- TICKER / MARQUEE SECTION 2 -->
      <section class="marquee-section spacer-bottom">
        <div class="marquee-container speed-reverse" id="ticker-2">
          <div class="marquee-track">
            <span><?php esc_html_e( 'MODERN WEB TRENDS 2026', 'genz-portfolio-theme' ); ?></span>
            <span class="dot">★</span>
            <span><?php esc_html_e( 'AWWWARDS QUALITY', 'genz-portfolio-theme' ); ?></span>
            <span class="dot">★</span>
            <span><?php esc_html_e( 'APPLE × NIKE DESIGN', 'genz-portfolio-theme' ); ?></span>
            <span class="dot">★</span>
            <span><?php esc_html_e( 'CREATIVE DIRECTION', 'genz-portfolio-theme' ); ?></span>
            <span class="dot">★</span>
          </div>
        </div>
      </section>

      <!-- CONTACT SECTION -->
      <section id="contact" class="contact-section scroll-reveal" data-reveal="fade-up">
        <div class="section-container">
          <div class="contact-grid">
            
            <div class="contact-info-block">
              <h2 class="section-title">
                <?php esc_html_e( "LET'S MAKE", "genz-portfolio-theme" ); ?><br><?php esc_html_e( 'SOMETHING', 'genz-portfolio-theme' ); ?><br><span class="accent-text text-glow"><?php esc_html_e( 'UNREAL.', 'genz-portfolio-theme' ); ?></span>
              </h2>
              <p class="contact-desc">
                <?php esc_html_e( 'Book a shoot, propose an editorial collaboration, or just ask a question.', 'genz-portfolio-theme' ); ?>
              </p>
              
              <!-- Integration Links -->
              <div class="contact-integrations">
                <?php $email = get_theme_mod( 'genz_contact_email', 'hello@kai.studio' ); ?>
                <a href="mailto:<?php echo esc_attr( $email ); ?>" class="integration-item magnetic" data-magnetic-strength="0.3">
                  <span class="integration-icon">✉</span>
                  <div class="integration-text">
                    <div class="integration-label"><?php esc_html_e( 'EMAIL', 'genz-portfolio-theme' ); ?></div>
                    <div class="integration-val"><?php echo esc_html( $email ); ?></div>
                  </div>
                </a>

                <?php $whatsapp = get_theme_mod( 'genz_contact_whatsapp', '+1 (555) 019-2026' ); ?>
                <a href="https://wa.me/<?php echo esc_attr( preg_replace( '/[^0-9]/', '', $whatsapp ) ); ?>" class="integration-item magnetic" data-magnetic-strength="0.3" target="_blank" rel="noopener">
                  <span class="integration-icon">💬</span>
                  <div class="integration-text">
                    <div class="integration-label"><?php esc_html_e( 'WHATSAPP', 'genz-portfolio-theme' ); ?></div>
                    <div class="integration-val"><?php echo esc_html( $whatsapp ); ?></div>
                  </div>
                </a>

                <?php $instagram = get_theme_mod( 'genz_contact_instagram', '@kai.visions' ); ?>
                <a href="https://instagram.com/<?php echo esc_attr( str_replace( '@', '', $instagram ) ); ?>" class="integration-item magnetic" data-magnetic-strength="0.3" target="_blank" rel="noopener">
                  <span class="integration-icon">📸</span>
                  <div class="integration-text">
                    <div class="integration-label"><?php esc_html_e( 'INSTAGRAM', 'genz-portfolio-theme' ); ?></div>
                    <div class="integration-val"><?php echo esc_html( $instagram ); ?></div>
                  </div>
                </a>
              </div>
            </div>

            <div class="contact-form-block glass-card">
              <form id="portfolio-contact-form" class="modern-form">
                
                <div class="form-row-2">
                  <div class="form-group">
                    <input type="text" id="form-name" required placeholder=" " />
                    <label for="form-name"><?php esc_html_e( 'Full Name', 'genz-portfolio-theme' ); ?></label>
                    <span class="input-line"></span>
                  </div>
                  <div class="form-group">
                    <input type="email" id="form-email" required placeholder=" " />
                    <label for="form-email"><?php esc_html_e( 'Email Address', 'genz-portfolio-theme' ); ?></label>
                    <span class="input-line"></span>
                  </div>
                </div>

                <div class="form-row-2">
                  <div class="form-group">
                    <input type="tel" id="form-phone" placeholder=" " />
                    <label for="form-phone"><?php esc_html_e( 'Phone (Optional)', 'genz-portfolio-theme' ); ?></label>
                    <span class="input-line"></span>
                  </div>
                  <div class="form-group">
                    <select id="form-service" required>
                      <option value="" disabled selected hidden></option>
                      <option value="photography"><?php esc_html_e( 'Photography Campaign', 'genz-portfolio-theme' ); ?></option>
                      <option value="videography"><?php esc_html_e( 'Videography / Showreel', 'genz-portfolio-theme' ); ?></option>
                      <option value="editing"><?php esc_html_e( 'Editing & Post-Production', 'genz-portfolio-theme' ); ?></option>
                      <option value="custom"><?php esc_html_e( 'Full Visual Direction', 'genz-portfolio-theme' ); ?></option>
                    </select>
                    <label for="form-service"><?php esc_html_e( 'Service Needed', 'genz-portfolio-theme' ); ?></label>
                    <span class="input-line"></span>
                  </div>
                </div>

                <div class="form-group">
                  <select id="form-budget" required>
                    <option value="" disabled selected hidden></option>
                    <option value="starter"><?php esc_html_e( '$1,500 - $3,000', 'genz-portfolio-theme' ); ?></option>
                    <option value="medium"><?php esc_html_e( '$3,000 - $7,000', 'genz-portfolio-theme' ); ?></option>
                    <option value="premium"><?php esc_html_e( '$7,000 - $15,000', 'genz-portfolio-theme' ); ?></option>
                    <option value="agency"><?php esc_html_e( '$15,000+', 'genz-portfolio-theme' ); ?></option>
                  </select>
                  <label for="form-budget"><?php esc_html_e( 'Project Budget', 'genz-portfolio-theme' ); ?></label>
                  <span class="input-line"></span>
                </div>

                <div class="form-group">
                  <textarea id="form-message" required placeholder=" " rows="4"></textarea>
                  <label for="form-message"><?php esc_html_e( 'Tell us about your project', 'genz-portfolio-theme' ); ?></label>
                  <span class="input-line"></span>
                </div>

                <button type="submit" class="btn-primary form-submit-btn magnetic" data-magnetic-strength="0.3">
                  <span><?php esc_html_e( 'SEND TRANSMISSION', 'genz-portfolio-theme' ); ?></span>
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="main-footer">
        <div class="section-container footer-content">
          <p>© <?php echo date('Y'); ?> <?php bloginfo( 'name' ); ?> STUDIO. <?php esc_html_e( 'ALL RIGHTS RESERVED.', 'genz-portfolio-theme' ); ?></p>
        </div>
      </footer>

    </main>

    <!-- FULLSCREEN PORTFOLIO LIGHTBOX -->
    <div id="portfolio-lightbox" class="lightbox-overlay">
      <button class="lightbox-close" aria-label="<?php esc_attr_e( 'Close Lightbox', 'genz-portfolio-theme' ); ?>">×</button>
      <button class="lightbox-prev" aria-label="<?php esc_attr_e( 'Previous Slide', 'genz-portfolio-theme' ); ?>">←</button>
      <button class="lightbox-next" aria-label="<?php esc_attr_e( 'Next Slide', 'genz-portfolio-theme' ); ?>">→</button>
      <div class="lightbox-content">
        <!-- Media will be inserted here dynamically -->
      </div>
      <div class="lightbox-details">
        <span class="lightbox-category"></span>
        <h4 class="lightbox-title"></h4>
      </div>
    </div>

    <!-- MOBILE QUICK ACTIONS SHEET -->
    <div id="mobile-action-sheet" class="mobile-sheet">
      <div class="sheet-handle-area">
        <div class="sheet-handle"></div>
      </div>
      <div class="sheet-header">
        <h5><?php bloginfo( 'name' ); ?> STUDIO • <?php esc_html_e( 'QUICK CONNECT', 'genz-portfolio-theme' ); ?></h5>
      </div>
      <div class="sheet-content">
        <a href="tel:<?php echo esc_attr( preg_replace( '/[^0-9]/', '', $whatsapp ) ); ?>" class="sheet-btn">
          <span class="btn-icon">📞</span> <?php esc_html_e( 'CALL STUDIO', 'genz-portfolio-theme' ); ?>
        </a>
        <a href="https://wa.me/<?php echo esc_attr( preg_replace( '/[^0-9]/', '', $whatsapp ) ); ?>" class="sheet-btn highlight" target="_blank" rel="noopener">
          <span class="btn-icon">💬</span> <?php esc_html_e( 'WHATSAPP', 'genz-portfolio-theme' ); ?>
        </a>
        <a href="mailto:<?php echo esc_attr( $email ); ?>" class="sheet-btn">
          <span class="btn-icon">✉</span> <?php esc_html_e( 'EMAIL', 'genz-portfolio-theme' ); ?>
        </a>
        <a href="https://instagram.com/<?php echo esc_attr( str_replace( '@', '', $instagram ) ); ?>" class="sheet-btn" target="_blank" rel="noopener">
          <span class="btn-icon">📸</span> <?php esc_html_e( 'INSTAGRAM', 'genz-portfolio-theme' ); ?>
        </a>
      </div>
    </div>

    <?php wp_footer(); ?>
  </body>
</html>
