/* ==========================================================================
   GEN-Z PORTFOLIO ELEMENTOR FRONTEND SCRIPTS
   ========================================================================== */

(function($) {
  'use strict';

  let currentGalleryItems = [];
  let currentGalleryIndex = 0;

  const initLightboxElements = () => {
    if ($('#wp-portfolio-lightbox').length === 0) {
      $('body').append(`
        <div id="wp-portfolio-lightbox" class="lightbox-overlay">
          <button class="lightbox-close">×</button>
          <button class="lightbox-prev">←</button>
          <button class="lightbox-next">→</button>
          <div class="lightbox-content"></div>
          <div class="lightbox-details">
            <span class="lightbox-category"></span>
            <h4 class="lightbox-title"></h4>
          </div>
        </div>
      `);
    }

    const lightbox = $('#wp-portfolio-lightbox');
    const lightboxContent = lightbox.find('.lightbox-content');
    const lightboxClose = lightbox.find('.lightbox-close');
    const lightboxPrev = lightbox.find('.lightbox-prev');
    const lightboxNext = lightbox.find('.lightbox-next');
    const lightboxCat = lightbox.find('.lightbox-category');
    const lightboxTitle = lightbox.find('.lightbox-title');

    const updateLightbox = () => {
      if (!lightboxContent.length || currentGalleryItems.length === 0) return;
      const item = currentGalleryItems[currentGalleryIndex];

      lightboxContent.empty();

      if (item.videoSrc) {
        lightboxContent.append(`<video src="${item.videoSrc}" controls autoplay loop></video>`);
      } else if (item.src) {
        lightboxContent.append(`<img src="${item.src}" alt="${item.title}">`);
      }

      lightboxCat.text(item.category);
      lightboxTitle.text(item.title);

      if (currentGalleryItems.length > 1) {
        lightboxPrev.css('display', 'flex');
        lightboxNext.css('display', 'flex');
      } else {
        lightboxPrev.css('display', 'none');
        lightboxNext.css('display', 'none');
      }
    };

    if (!lightbox.data('init-events')) {
      lightbox.data('init-events', true);

      lightboxClose.on('click', () => {
        lightbox.removeClass('active');
        lightboxContent.empty();
      });

      lightboxPrev.on('click', (e) => {
        e.stopPropagation();
        currentGalleryIndex = (currentGalleryIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length;
        updateLightbox();
      });

      lightboxNext.on('click', (e) => {
        e.stopPropagation();
        currentGalleryIndex = (currentGalleryIndex + 1) % currentGalleryItems.length;
        updateLightbox();
      });

      lightbox.on('click', function(e) {
        if (e.target === this || $(e.target).hasClass('lightbox-content')) {
          lightbox.removeClass('active');
          lightboxContent.empty();
        }
      });
    }

    return {
      lightbox,
      updateLightbox
    };
  };

  // Mouse coordinate tracking for global interactions
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
  });

  // Helper function: Magnetic attraction logic
  const applyMagneticEffect = ($scope) => {
    const magnetics = $scope.find('.magnetic');
    
    magnetics.each(function() {
      const el = $(this);
      const strengthAttr = parseFloat(el.data('magnetic-strength') || 0.4);

      el.on('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const elX = rect.left + rect.width / 2;
        const elY = rect.top + rect.height / 2;
        
        const deltaX = e.clientX - elX;
        const deltaY = e.clientY - elY;
        
        const strength = strengthAttr * 1.0; // Multiplying by a baseline factor
        
        el.css('transform', `translate(${deltaX * strength}px, ${deltaY * strength}px)`);

        // If custom cursor is active, snap its target coordinates
        const ring = $('#wp-custom-cursor-ring');
        if (ring.length) {
          mouse.targetX = elX + (deltaX * strength * 0.5);
          mouse.targetY = elY + (deltaY * strength * 0.5);
        }
      });

      el.on('mouseleave', function() {
        el.css('transform', 'translate(0px, 0px)');
      });
    });
  };

  // Helper function: Add cursor morph states on hover
  const applyCursorHoverMorphs = ($scope) => {
    const hoverables = $scope.find('a, button, .filter-btn, .wp-service-card, .wp-portfolio-item');
    
    hoverables.on('mouseenter', function() {
      $('body').addClass('wp-cursor-hover');
    });
    
    hoverables.on('mouseleave', function() {
      $('body').removeClass('wp-cursor-hover');
    });
  };

  // ---------------------------------------------------------
  // 1. CURSOR WIDGET HANDLER
  // ---------------------------------------------------------
  const GenzCursorHandler = function($scope) {
    // Remove duplicate cursors if any
    $('#wp-custom-cursor-dot, #wp-custom-cursor-ring').remove();

    const enabled = $scope.find('.wp-cursor-config').data('enable') === 'yes';
    if (!enabled) {
      $('body').removeClass('wp-custom-cursor-enabled');
      return;
    }

    $('body').addClass('wp-custom-cursor-enabled');
    $('body').append('<div id="wp-custom-cursor-ring"></div><div id="wp-custom-cursor-dot"></div>');

    const dot = $('#wp-custom-cursor-dot');
    const ring = $('#wp-custom-cursor-ring');

    const size = $scope.find('.wp-cursor-config').data('size') || 8;
    const ringSize = $scope.find('.wp-cursor-config').data('ring-size') || 40;
    const glow = $scope.find('.wp-cursor-config').data('glow') || 0.6;
    const color = $scope.find('.wp-cursor-config').data('color') || '#B8FF00';

    document.documentElement.style.setProperty('--cursor-size', `${size}px`);
    document.documentElement.style.setProperty('--cursor-ring-size', `${ringSize}px`);
    document.documentElement.style.setProperty('--cursor-glow', glow);
    document.documentElement.style.setProperty('--cursor-color', color);

    let ringX = 0, ringY = 0;
    let dotX = 0, dotY = 0;

    const animateCursor = () => {
      if (!$('body').hasClass('wp-custom-cursor-enabled')) return;

      dotX += (mouse.targetX - dotX) * 0.35;
      dotY += (mouse.targetY - dotY) * 0.35;
      dot.css({ left: `${dotX}px`, top: `${dotY}px` });

      ringX += (mouse.targetX - ringX) * 0.15;
      ringY += (mouse.targetY - ringY) * 0.15;
      ring.css({ left: `${ringX}px`, top: `${ringY}px` });

      requestAnimationFrame(animateCursor);
    };

    animateCursor();
    applyCursorHoverMorphs($scope);
    applyMagneticEffect($scope);
  };

  // ---------------------------------------------------------
  // 2. HERO WIDGET HANDLER (Anti-Gravity elements)
  // ---------------------------------------------------------
  const GenzHeroHandler = function($scope) {
    applyCursorHoverMorphs($scope);
    applyMagneticEffect($scope);

    const tags = $scope.find('.wp-floating-tag');
    const container = $scope.find('.wp-floating-tags-container');
    const config = container.data('config') || {};

    if (config.enable !== 'yes') {
      tags.css('transform', 'translate(0px, 0px)');
      return;
    }

    let floatTime = 0;
    const animateFloating = () => {
      if (!$.contains(document, container[0])) return; // Exit if element removed

      floatTime += 0.005 * (config.speed || 2.0);

      tags.each(function(idx) {
        const tag = $(this);
        const speed = parseFloat(tag.data('speed') || 1.0);
        const depth = parseFloat(tag.data('depth') || 0.08);
        const dir = parseInt(tag.data('dir') || 1);
        const distance = config.distance || 50;

        // Trigonometric orbit equations
        const xOrbit = Math.cos(floatTime * speed) * distance * dir;
        const yOrbit = Math.sin(floatTime * speed * 1.2) * distance * dir;

        // Mouse follow offset vectors
        const dx = (mouse.targetX - window.innerWidth / 2) * depth * (config.parallax || 0.5);
        const dy = (mouse.targetY - window.innerHeight / 2) * depth * (config.parallax || 0.5);

        tag.css('transform', `translate(${xOrbit + dx}px, ${yOrbit + dy}px)`);
      });

      requestAnimationFrame(animateFloating);
    };

    // Bind click handlers for tag navigation to services
    tags.on('click', function(e) {
      e.preventDefault();
      const tagText = $(this).text().trim().toLowerCase();
      
      const mapTagToServiceIndex = (text) => {
        if (text.includes('photo')) return 0;
        if (text.includes('video')) return 1;
        if (text.includes('drone')) return 2;
        if (text.includes('story') || text.includes('edit')) return 3;
        if (text.includes('creative') || text.includes('director') || text.includes('brand')) return 4;
        return -1;
      };

      const targetIndex = mapTagToServiceIndex(tagText);
      const wpServiceCards = $('.wp-service-card');
      
      if (targetIndex !== -1 && wpServiceCards.length > targetIndex) {
        wpServiceCards.eq(targetIndex)[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Spotlight it
        wpServiceCards.removeClass('in-focus');
        wpServiceCards.eq(targetIndex).addClass('in-focus');
        
        // Rumble haptic feedback
        if (navigator.vibrate) navigator.vibrate([15, 10, 15]);
      }
    });

    animateFloating();
  };

  // ---------------------------------------------------------
  // 3. ABOUT WIDGET HANDLER
  // ---------------------------------------------------------
  const GenzAboutHandler = function($scope) {
    applyCursorHoverMorphs($scope);
    applyMagneticEffect($scope);

    // Speed setting for rotating badge
    const badgeSvg = $scope.find('.wp-rotating-badge-svg');
    const badgeSpeed = badgeSvg.parent().data('speed') || 10;
    badgeSvg.css('animation-duration', `${160 / badgeSpeed}s`);

    // Counter animations on reveal
    const stats = $scope.find('.wp-stat-box');
    let animated = false;

    const runCounters = () => {
      stats.each(function() {
        const box = $(this);
        const target = parseInt(box.data('stat-target') || 0);
        const counterText = box.find('.wp-counter');
        
        let current = 0;
        const duration = 1500;
        const step = Math.max(Math.floor(duration / target), 15);

        const timer = setInterval(() => {
          current += 1;
          counterText.text(current);
          if (current >= target) {
            counterText.text(target);
            clearInterval(timer);
          }
        }, step);
      });
    };

    // Trigger waypoint countup
    if (typeof elementorModules !== 'undefined') {
      new Waypoint({
        element: $scope[0],
        handler: function() {
          if (!animated) {
            animated = true;
            runCounters();
          }
        },
        offset: '75%'
      });
    } else {
      runCounters(); // Fallback if Waypoints not loaded
    }
  };

  // ---------------------------------------------------------
  // 4. PORTFOLIO WIDGET HANDLER (Filters & Lightbox)
  // ---------------------------------------------------------
  const GenzPortfolioHandler = function($scope) {
    applyCursorHoverMorphs($scope);
    applyMagneticEffect($scope);

    const filterBtns = $scope.find('.filter-btn');
    const items = $scope.find('.wp-portfolio-item');

    filterBtns.on('click', function() {
      filterBtns.removeClass('active');
      $(this).addClass('active');

      const filterVal = $(this).data('filter');

      items.each(function() {
        const item = $(this);
        if (filterVal === 'all' || item.hasClass(filterVal)) {
          item.removeClass('filtered-out');
        } else {
          item.addClass('filtered-out');
        }
      });
    });

    // Hover Video previews autoplay
    items.each(function() {
      const item = $(this);
      const video = item.find('video');
      if (video.length) {
        item.on('mouseenter', () => video[0].play());
        item.on('mouseleave', () => {
          video[0].pause();
          video[0].currentTime = 0;
        });
      }
    });

    // Lightbox modal setup
    const { lightbox, updateLightbox } = initLightboxElements();

    items.on('click', function() {
      const item = $(this);
      const src = item.data('src');
      const videoSrc = item.data('video-src');
      const title = item.data('title');
      const category = item.data('category');

      currentGalleryItems = [{ src, videoSrc, title, category }];
      currentGalleryIndex = 0;
      updateLightbox();
      lightbox.addClass('active');
    });
  };

  // ---------------------------------------------------------
  // 5. SERVICES CARD FLOOD CONFIGS
  // ---------------------------------------------------------
  const GenzServicesHandler = function($scope) {
    applyCursorHoverMorphs($scope);
    applyMagneticEffect($scope);

    const grid = $scope.find('.wp-services-grid');
    const speed = grid.data('speed') || 400;
    const direction = grid.data('direction') || 'up';
    const floodColor = grid.data('flood-color') || '#B8FF00';

    grid.find('.wp-service-flood-bg').css('background-color', floodColor);
    
    const { lightbox, updateLightbox } = initLightboxElements();

    grid.find('.wp-service-card').each(function() {
      const card = $(this);
      card.removeClass('wp-flood-down wp-flood-right wp-flood-left');
      if (direction !== 'up') {
        card.addClass(`wp-flood-${direction}`);
      }

      // Gallery trigger click
      card.on('click', function(e) {
        const mediaStr = card.attr('data-gallery-media');
        if (!mediaStr) return;

        const title = card.attr('data-gallery-title') || 'Gallery';
        const category = card.attr('data-gallery-cat') || 'Works';
        const mediaUrls = mediaStr.split(',');

        currentGalleryItems = mediaUrls.map((url, idx) => {
          const isVideo = url.endsWith('.mp4') || url.includes('mixkit.co');
          return {
            src: isVideo ? '' : url,
            videoSrc: isVideo ? url : '',
            title: `${title} (${idx + 1}/${mediaUrls.length})`,
            category: category
          };
        });

        currentGalleryIndex = 0;
        updateLightbox();
        lightbox.addClass('active');
      });
    });

    $scope.css('--services-speed', `${speed}ms`);
  };

  // ---------------------------------------------------------
  // 6. TESTIMONIALS SLIDER
  // ---------------------------------------------------------
  const GenzTestimonialsHandler = function($scope) {
    applyCursorHoverMorphs($scope);
    applyMagneticEffect($scope);

    const container = $scope.find('.wp-testimonials-container');
    const slider = $scope.find('.wp-testimonials-slider');
    const slides = $scope.find('.wp-testimonial-slide');
    const prevBtn = $scope.find('.prev-btn');
    const nextBtn = $scope.find('.next-btn');

    if (!slider.length) return;

    const transitionSpeed = container.data('transition') || 600;
    $scope.css('--slider-speed', `${transitionSpeed}ms`);

    let currentSlide = 0;
    const slideCount = slides.length;
    let timer;

    const getTranslateX = () => {
      const slideWidth = slides.eq(0).outerWidth(true);
      return -currentSlide * slideWidth;
    };

    const updateSlider = () => {
      slider.css('transform', `translateX(${getTranslateX()}px)`);
    };

    const next = () => {
      currentSlide = (currentSlide + 1) % slideCount;
      updateSlider();
    };

    const prev = () => {
      currentSlide = (currentSlide - 1 + slideCount) % slideCount;
      updateSlider();
    };

    const startTimer = () => {
      clearInterval(timer);
      timer = setInterval(next, 5000);
    };

    nextBtn.on('click', () => {
      next();
      startTimer();
    });

    prevBtn.on('click', () => {
      prev();
      startTimer();
    });

    // Simple Drag & Swipe logic
    let startX = 0, isDragging = false, currentX = 0;

    slider.on('mousedown touchstart', function(e) {
      clearInterval(timer);
      startX = e.pageX || e.originalEvent.touches[0].pageX;
      isDragging = true;
    });

    $(window).on('mousemove touchmove', function(e) {
      if (!isDragging) return;
      const x = e.pageX || e.originalEvent.touches[0].pageX;
      const walk = (x - startX) * 0.7;
      slider.css('transform', `translateX(${getTranslateX() + walk}px)`);
    });

    $(window).on('mouseup touchend', function(e) {
      if (!isDragging) return;
      isDragging = false;
      const endX = e.pageX || e.originalEvent.changedTouches[0].pageX;
      const diff = endX - startX;

      if (Math.abs(diff) > 50) {
        if (diff < 0) {
          next();
        } else {
          prev();
        }
      } else {
        updateSlider();
      }
      startTimer();
    });

    startTimer();
  };

  // ---------------------------------------------------------
  // 7. MARQUEE TICKER HANDLER
  // ---------------------------------------------------------
  const GenzMarqueeHandler = function($scope) {
    applyCursorHoverMorphs($scope);
    const wrap = $scope.find('.wp-marquee-wrap');
    const speed = wrap.data('speed') || 20;
    
    wrap.css('--marquee-duration', `${speed}s`);
  };

  // ---------------------------------------------------------
  // 8. BACKGROUND EFFECTS HANDLER (CANVAS DRAWINGS)
  // ---------------------------------------------------------
  const GenzBackgroundHandler = function($scope) {
    const canvasWrap = $scope.find('.wp-bg-canvas-wrapper');
    const enableParticles = canvasWrap.data('particles') === 'yes';
    const enableAurora = canvasWrap.data('aurora') === 'yes';
    const enableBlobs = canvasWrap.data('blobs') === 'yes';
    const speed = parseFloat(canvasWrap.data('speed') || 3.0);
    const accent = canvasWrap.data('color') || '#B8FF00';

    const canvas = canvasWrap.find('canvas')[0];
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvasWrap.width();
    let height = canvas.height = canvasWrap.height();

    $(window).on('resize', () => {
      width = canvas.width = canvasWrap.width();
      height = canvas.height = canvasWrap.height();
    });

    // Particle pool setup
    const particles = [];
    if (enableParticles) {
      for (let i = 0; i < 40; i++) {
        particles.push({
          x: Math.random() * width,
          y: height + Math.random() * 50,
          size: Math.random() * 2 + 0.5,
          speedY: -(Math.random() * 1.2 + 0.3),
          alpha: Math.random() * 0.35 + 0.1,
          angle: Math.random() * Math.PI
        });
      }
    }

    // Touch particles trail
    const touchParticles = [];
    class TouchParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3.5 + 1.5;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5 + 0.5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 0.3;
        this.alpha = 1.0;
        this.fade = Math.random() * 0.025 + 0.015;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.fade;
      }
      draw() {
        ctx.fillStyle = `rgba(${rgb}, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const spawnTouch = (x, y) => {
      const rect = canvas.getBoundingClientRect();
      const localX = x - rect.left;
      const localY = y - rect.top;
      for (let i = 0; i < 2; i++) {
        touchParticles.push(new TouchParticle(localX, localY));
      }
      if (touchParticles.length > 150) touchParticles.shift();
    };

    $(window).on('mousemove', (e) => {
      if (enableParticles) spawnTouch(e.clientX, e.clientY);
    });

    $(window).on('touchmove', (e) => {
      if (enableParticles && e.originalEvent.touches.length > 0) {
        spawnTouch(e.originalEvent.touches[0].clientX, e.originalEvent.touches[0].clientY);
      }
    });

    // Convert hex accent to RGB
    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `${r}, ${g}, ${b}`;
    };
    const rgb = hexToRgb(accent);

    // Vector Blobs setup
    const blobs = [
      { x: width * 0.3, y: height * 0.4, r: 120, a: 0 },
      { x: width * 0.7, y: height * 0.6, r: 160, a: Math.PI }
    ];

    let t = 0;
    let auroraAngle = 0;

    const drawLoop = () => {
      if (!$.contains(document, canvas)) return; // Stop loop if removed

      t++;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Aurora Gradient Mesh
      if (enableAurora) {
        auroraAngle += 0.002 * speed;
        const ax = width / 2 + Math.cos(auroraAngle) * (width * 0.15);
        const ay = height / 2 + Math.sin(auroraAngle * 1.3) * (height * 0.15);

        const grad = ctx.createRadialGradient(ax, ay, 20, ax, ay, Math.max(width, height) * 0.5);
        grad.addColorStop(0, `rgba(${rgb}, 0.06)`);
        grad.addColorStop(0.4, `rgba(${rgb}, 0.01)`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Draw Vector Blobs
      if (enableBlobs) {
        blobs.forEach(b => {
          b.a += 0.003 * speed;
          const wobble = Math.sin(b.a) * 15;
          const radius = b.r + wobble;

          ctx.fillStyle = `rgba(${rgb}, 0.03)`;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const currAngle = (i / 6) * Math.PI * 2;
            const offset = Math.sin(t * 0.001 + i) * 10;
            const px = b.x + Math.cos(currAngle) * (radius + offset);
            const py = b.y + Math.sin(currAngle) * (radius + offset);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
        });
      }

      // 3. Draw Particles
      if (enableParticles) {
        ctx.fillStyle = `rgba(${rgb}, 0.3)`;
        particles.forEach(p => {
          p.y += p.speedY;
          p.x += Math.sin(p.angle) * 0.2;
          p.angle += 0.01;

          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb}, ${p.alpha})`;
          ctx.fill();
        });

        // Draw and prune touch trail particles
        for (let i = touchParticles.length - 1; i >= 0; i--) {
          const tp = touchParticles[i];
          tp.update();
          if (tp.alpha <= 0) {
            touchParticles.splice(i, 1);
          } else {
            tp.draw();
          }
        }
      }

      requestAnimationFrame(drawLoop);
    };

    drawLoop();
  };

  // ---------------------------------------------------------
  // BIND ELEMENTOR FRONTEND LIFE CYCLE HOOKS
  // ---------------------------------------------------------
  $(window).on('elementor/frontend/init', function() {
    elementorFrontend.hooks.addAction('frontend/element_ready/genz-cursor-widget.default', GenzCursorHandler);
    elementorFrontend.hooks.addAction('frontend/element_ready/genz-hero-widget.default', GenzHeroHandler);
    elementorFrontend.hooks.addAction('frontend/element_ready/genz-about-widget.default', GenzAboutHandler);
    elementorFrontend.hooks.addAction('frontend/element_ready/genz-portfolio-widget.default', GenzPortfolioHandler);
    elementorFrontend.hooks.addAction('frontend/element_ready/genz-services-widget.default', GenzServicesHandler);
    elementorFrontend.hooks.addAction('frontend/element_ready/genz-testimonials-widget.default', GenzTestimonialsHandler);
    elementorFrontend.hooks.addAction('frontend/element_ready/genz-marquee-widget.default', GenzMarqueeHandler);
    elementorFrontend.hooks.addAction('frontend/element_ready/genz-background-effects.default', GenzBackgroundHandler);
  });

  // ---------------------------------------------------------
  // UNIFIED MOBILE FRONTEND ENGINE (SCROLL-SPOTLIGHT & 3D TILT)
  // ---------------------------------------------------------
  const initWPMobileInteractions = () => {
    if (window.innerWidth >= 1024) return;

    const portfolioItems = document.querySelectorAll('.wp-portfolio-item');
    const serviceCards = document.querySelectorAll('.wp-service-card');
    const allCards = [...portfolioItems, ...serviceCards];

    const cardStates = new Map();

    allCards.forEach(card => {
      card.classList.add('js-tilt');
      cardStates.set(card, {
        currentX: 0, currentY: 0, currentScale: 1,
        targetX: 0, targetY: 0, targetScale: 1,
        isTouchActive: false
      });

      card.addEventListener('touchstart', (e) => {
        const state = cardStates.get(card);
        state.isTouchActive = true;
        state.targetScale = 1.04;
        updateWPTilt(e, card, state);
      }, { passive: true });

      card.addEventListener('touchmove', (e) => {
        const state = cardStates.get(card);
        if (!state.isTouchActive) return;
        updateWPTilt(e, card, state);
      }, { passive: true });

      const resetWPTilt = () => {
        const state = cardStates.get(card);
        state.isTouchActive = false;
        state.targetX = 0;
        state.targetY = 0;
        state.targetScale = card.classList.contains('in-focus') ? 1.02 : 1;
      };

      card.addEventListener('touchend', resetWPTilt, { passive: true });
      card.addEventListener('touchcancel', resetWPTilt, { passive: true });
    });

    function updateWPTilt(e, card, state) {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = card.getBoundingClientRect();
      const cardWidth = rect.width;
      const cardHeight = rect.height;

      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;

      const percentX = (touchX / cardWidth) - 0.5;
      const percentY = (touchY / cardHeight) - 0.5;

      const maxTilt = 12;
      state.targetX = -percentY * maxTilt;
      state.targetY = percentX * maxTilt;
    }

    let lastVibratedItem = null;

    const updateWPScrollSpotlight = () => {
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;

      let closestPortfolioItem = null;
      let minPortfolioDist = Infinity;

      let closestServiceCard = null;
      let minServiceDist = Infinity;

      portfolioItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        if (rect.top < viewportHeight && rect.bottom > 0) {
          const itemCenter = rect.top + rect.height / 2;
          const dist = Math.abs(itemCenter - viewportCenter);
          if (dist < minPortfolioDist) {
            minPortfolioDist = dist;
            closestPortfolioItem = item;
          }
        }
      });

      serviceCards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < viewportHeight && rect.bottom > 0) {
          const cardCenter = rect.top + rect.height / 2;
          const dist = Math.abs(cardCenter - viewportCenter);
          if (dist < minServiceDist) {
            minServiceDist = dist;
            closestServiceCard = card;
          }
        }
      });

      portfolioItems.forEach(item => {
        const state = cardStates.get(item);
        if (!state) return;
        const isFocused = item === closestPortfolioItem;

        if (isFocused) {
          if (!item.classList.contains('in-focus')) {
            item.classList.add('in-focus');
            const video = item.querySelector('video');
            if (video && video.paused) {
              video.play().catch(() => {});
            }
            if (lastVibratedItem !== item) {
              if (navigator.vibrate) navigator.vibrate(8);
              lastVibratedItem = item;
            }
          }
          if (!state.isTouchActive) state.targetScale = 1.02;
        } else {
          if (item.classList.contains('in-focus')) {
            item.classList.remove('in-focus');
            const video = item.querySelector('video');
            if (video && !video.paused) {
              video.pause();
            }
          }
          if (!state.isTouchActive) state.targetScale = 1;
        }
      });

      serviceCards.forEach(card => {
        const state = cardStates.get(card);
        if (!state) return;
        const isFocused = card === closestServiceCard;

        if (isFocused) {
          if (!card.classList.contains('in-focus')) {
            card.classList.add('in-focus');
            if (lastVibratedItem !== card) {
              if (navigator.vibrate) navigator.vibrate(8);
              lastVibratedItem = card;
            }
          }
          if (!state.isTouchActive) state.targetScale = 1.02;
        } else {
          if (card.classList.contains('in-focus')) {
            card.classList.remove('in-focus');
          }
          if (!state.isTouchActive) state.targetScale = 1;
        }
      });
    };

    window.addEventListener('scroll', updateWPScrollSpotlight, { passive: true });
    updateWPScrollSpotlight();

    const renderWPLoop = () => {
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;

      allCards.forEach(card => {
        const state = cardStates.get(card);
        if (!state) return;
        const rect = card.getBoundingClientRect();

        if (!state.isTouchActive && rect.top < viewportHeight && rect.bottom > 0) {
          const itemCenter = rect.top + rect.height / 2;
          const distanceFromCenter = itemCenter - viewportCenter;
          const maxScrollTilt = 10;
          state.targetX = (distanceFromCenter / (viewportHeight / 2)) * maxScrollTilt;
          state.targetX = Math.min(Math.max(state.targetX, -maxScrollTilt), maxScrollTilt);
          state.targetY = 0;
        }

        state.currentX += (state.targetX - state.currentX) * 0.15;
        state.currentY += (state.targetY - state.currentY) * 0.15;
        state.currentScale += (state.targetScale - state.currentScale) * 0.15;

        card.style.transform = `translate3d(0, 0, 0) rotateX(${state.currentX}deg) rotateY(${state.currentY}deg) scale(${state.currentScale})`;
      });

      requestAnimationFrame(renderWPLoop);
    };

    renderWPLoop();
  };

  // ---------------------------------------------------------
  // HERO DIAGONAL WIPE-REVEAL FOR WORDPRESS
  // ---------------------------------------------------------
  const initWPHeroWipeReveal = () => {
    const heroSection = document.querySelector('.wp-hero-section');
    const diagonalMask = document.querySelector('.wp-diagonal-mask');

    if (!heroSection || !diagonalMask) return;

    const handleWipe = (clientX, clientY) => {
      const rect = heroSection.getBoundingClientRect();
      const isMobile = window.innerWidth < 1024;

      if (isMobile) {
        const yPosition = clientY - rect.top;
        const pct = (yPosition / rect.height) * 100;
        const clampedPct = Math.min(Math.max(pct, 5), 50);
        diagonalMask.style.setProperty('--wipe-val', `${clampedPct}%`);
      } else {
        const xPosition = clientX - rect.left;
        const pct = (xPosition / rect.width) * 100;
        const clampedPct = Math.min(Math.max(pct, 5), 45);
        diagonalMask.style.setProperty('--wipe-val', `${clampedPct}%`);
      }
    };

    heroSection.addEventListener('mousemove', (e) => {
      handleWipe(e.clientX, e.clientY);
    });

    heroSection.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        handleWipe(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    const resetWipe = () => {
      diagonalMask.style.transition = 'clip-path 0.5s ease, -webkit-clip-path 0.5s ease';
      diagonalMask.style.removeProperty('--wipe-val');
      setTimeout(() => {
        diagonalMask.style.transition = '';
      }, 500);
    };

    heroSection.addEventListener('mouseleave', resetWipe);
    heroSection.addEventListener('touchend', resetWipe, { passive: true });
  };

  // Initialize on window load to ensure all dynamic elements exist
  $(window).on('load', () => {
    initWPMobileInteractions();
    initWPHeroWipeReveal();
  });

})(jQuery);
