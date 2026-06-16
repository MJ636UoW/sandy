/* ==========================================================================
   GEN-Z PORTFOLIO MASTER SCRIPT
   ========================================================================== */

  
  // ---------------------------------------------------------
  // 1. STATE & GLOBAL CONFIG (SYNCED TO CUSTOMIZER)
  // ---------------------------------------------------------
  const state = {
    cursor: {
      enabled: true,
      size: 8,
      ringSize: 40,
      magneticStrength: 0.5,
      glow: 0.6,
      color: '#B8FF00'
    },
    floating: {
      enabled: true,
      speed: 2.0,
      parallax: 0.5,
      distance: 50
    },
    background: {
      noise: true,
      grid: true,
      aurora: true,
      particles: true,
      blobs: true,
      speed: 3.0
    },
    aesthetics: {
      badgeSpeed: 10,
      servicesSpeed: 400,
      servicesDir: 'up',
      testimonialSpeed: 600,
      marqueeSpeed: 20
    }
  };

  const defaults = JSON.parse(JSON.stringify(state));

  // Mouse coordinate tracking
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const cursorDot = document.getElementById('custom-cursor-dot');
  const cursorRing = document.getElementById('custom-cursor-ring');
  
  // Track cursor position with interpolation
  let ringX = 0, ringY = 0;
  let dotX = 0, dotY = 0;

  // ---------------------------------------------------------
  // 2. MAGNETIC CURSOR & MORPHING ENGINE
  // ---------------------------------------------------------
  const initCursor = () => {
    window.addEventListener('mousemove', (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    });

    const updateCursorPosition = () => {
      if (!state.cursor.enabled) return;

      // Lerp custom cursor dot
      dotX += (mouse.targetX - dotX) * 0.35;
      dotY += (mouse.targetY - dotY) * 0.35;
      cursorDot.style.left = `${dotX}px`;
      cursorDot.style.top = `${dotY}px`;

      // Lerp custom cursor ring
      ringX += (mouse.targetX - ringX) * 0.15;
      ringY += (mouse.targetY - ringY) * 0.15;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;

      requestAnimationFrame(updateCursorPosition);
    };

    updateCursorPosition();

    // Hover states for link morphs
    const hoverables = document.querySelectorAll('a, button, .filter-btn, .service-card, .portfolio-item, #sandbox-trigger');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
        if (el.classList.contains('btn-primary') || el.classList.contains('btn-secondary') || el.classList.contains('service-card')) {
          document.body.classList.add('cursor-dark-hover');
        }
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
        document.body.classList.remove('cursor-dark-hover');
      });
    });

    // Magnetic Attraction Behavior
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const elX = rect.left + rect.width / 2;
        const elY = rect.top + rect.height / 2;
        
        const deltaX = e.clientX - elX;
        const deltaY = e.clientY - elY;
        
        // Intensity of attraction
        const strength = parseFloat(el.getAttribute('data-magnetic-strength') || 0.4) * (state.cursor.magneticStrength * 2);
        
        // Translate the actual element
        el.style.transform = `translate(${deltaX * strength}px, ${deltaY * strength}px)`;
        
        // Snaps cursor ring to hover element
        if (state.cursor.enabled) {
          mouse.targetX = elX + (deltaX * strength * 0.5);
          mouse.targetY = elY + (deltaY * strength * 0.5);
        }
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0px, 0px)';
      });
    });
  };

  initCursor();

  // ---------------------------------------------------------
  // 3. BACKGROUND EFFECTS ENGINE (CANVAS)
  // ---------------------------------------------------------
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Noise Overlay Toggles
  const updateStaticOverlays = () => {
    document.getElementById('noise-overlay').style.opacity = state.background.noise ? '1' : '0';
    document.getElementById('grid-overlay').style.opacity = state.background.grid ? '1' : '0';
  };
  updateStaticOverlays();

  // Particle System
  const particles = [];
  const particleCount = 65;

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 100;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedY = -(Math.random() * 1.5 + 0.5);
      this.alpha = Math.random() * 0.4 + 0.1;
      this.angle = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.02 - 0.01;
    }

    update() {
      this.y += this.speedY * (state.floating.speed / 2);
      this.angle += this.wobbleSpeed;
      this.x += Math.sin(this.angle) * 0.4;

      if (this.y < -50 || this.x < -50 || this.x > width + 50) {
        this.reset();
      }
    }

    draw() {
      ctx.fillStyle = `rgba(184, 255, 0, ${this.alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const initParticles = () => {
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  };
  initParticles();

  // Touch Particle Trail System
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
      ctx.fillStyle = `rgba(184, 255, 0, ${this.alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const spawnTouchParticles = (x, y) => {
    for (let i = 0; i < 2; i++) {
      touchParticles.push(new TouchParticle(x, y));
    }
    if (touchParticles.length > 150) {
      touchParticles.shift();
    }
  };

  window.addEventListener('mousemove', (e) => {
    if (state.background.particles) {
      spawnTouchParticles(e.clientX, e.clientY);
    }
  });

  window.addEventListener('touchmove', (e) => {
    if (state.background.particles && e.touches.length > 0) {
      const touch = e.touches[0];
      spawnTouchParticles(touch.clientX, touch.clientY);
    }
  }, { passive: true });

  // Vector Blobs
  const blobs = [
    { x: width * 0.25, y: height * 0.3, radius: 180, baseRadius: 180, color: 'rgba(184, 255, 0, 0.04)', angle: 0 },
    { x: width * 0.75, y: height * 0.7, radius: 250, baseRadius: 250, color: 'rgba(184, 255, 0, 0.03)', angle: Math.PI }
  ];

  const drawBlobs = (t) => {
    if (!state.background.blobs) return;

    blobs.forEach(blob => {
      blob.angle += 0.003 * state.background.speed;
      const wobble = Math.sin(blob.angle * 2) * 25;
      const r = blob.baseRadius + wobble;

      ctx.fillStyle = blob.color;
      ctx.beginPath();
      
      // Dynamic vector blob draw using multiple segments
      for (let i = 0; i < 8; i++) {
        const currAngle = (i / 8) * Math.PI * 2;
        const offset = Math.sin(t * 0.001 + i) * 15;
        let shiftX = 0, shiftY = 0;
        if (window.innerWidth < 1024 && hasDeviceOrientation) {
          shiftX = devTiltX * 45;
          shiftY = devTiltY * 45;
        }
        const xPos = blob.x + shiftX + Math.cos(currAngle) * (r + offset);
        const yPos = blob.y + shiftY + Math.sin(currAngle) * (r + offset);
        
        if (i === 0) {
          ctx.moveTo(xPos, yPos);
        } else {
          ctx.lineTo(xPos, yPos);
        }
      }
      ctx.closePath();
      ctx.fill();
    });
  };

  // Aurora Gradient Glow variables
  let auroraAngle = 0;

  const drawAurora = () => {
    if (!state.background.aurora) return;

    auroraAngle += 0.002 * state.background.speed;
    const ax = width / 2 + Math.cos(auroraAngle) * (width * 0.2);
    const ay = height / 2 + Math.sin(auroraAngle * 1.5) * (height * 0.2);

    const grad = ctx.createRadialGradient(ax, ay, 50, ax, ay, Math.max(width, height) * 0.65);
    grad.addColorStop(0, 'rgba(184, 255, 0, 0.08)');
    grad.addColorStop(0.3, 'rgba(184, 255, 0, 0.02)');
    grad.addColorStop(0.7, 'rgba(10, 10, 10, 0)');
    grad.addColorStop(1, 'rgba(10, 10, 10, 1)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  };

  // Canvas loop
  let tick = 0;
  const loopBg = () => {
    tick++;
    ctx.fillStyle = '#0A0A0A';
    ctx.fillRect(0, 0, width, height);

    drawAurora();
    drawBlobs(tick);

    if (state.background.particles) {
      particles.forEach(p => {
        p.update();
        p.draw();
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

    requestAnimationFrame(loopBg);
  };
  loopBg();

  // ---------------------------------------------------------
  // 4. ANTI-GRAVITY FLOATING ENGINE
  // ---------------------------------------------------------
  const floatingTags = document.querySelectorAll('.floating-tag');
  let floatTime = 0;

  // Device orientation variables
  let devTiltX = 0;
  let devTiltY = 0;
  let hasDeviceOrientation = false;

  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
      if (e.gamma !== null && e.beta !== null) {
        hasDeviceOrientation = true;
        // Normalize tilt values (-1.5 to 1.5)
        devTiltX = Math.min(Math.max(e.gamma / 25, -1.5), 1.5);
        devTiltY = Math.min(Math.max((e.beta - 45) / 25, -1.5), 1.5);
      }
    }, true);
  }

  const updateFloatingTags = () => {
    if (!state.floating.enabled) {
      floatingTags.forEach(tag => tag.style.transform = 'translate(0px, 0px)');
      return;
    }

    floatTime += 0.005 * state.floating.speed;

    floatingTags.forEach((tag, idx) => {
      // Skip updates if user is currently dragging the tag
      if (tag.classList.contains('is-dragging')) return;

      const speed = parseFloat(tag.getAttribute('data-speed'));
      const depth = parseFloat(tag.getAttribute('data-depth'));
      const dir = parseInt(tag.getAttribute('data-dir'));
      const dist = state.floating.distance;

      // Organic orbit movement
      const xOrbit = Math.cos(floatTime * speed) * dist * dir;
      const yOrbit = Math.sin(floatTime * speed * 1.2) * dist * dir;

      // Mouse parallax follow vector or device orientation on mobile
      let dx = 0, dy = 0;
      if (window.innerWidth < 1024 && hasDeviceOrientation) {
        dx = devTiltX * 80 * depth * state.floating.parallax;
        dy = devTiltY * 80 * depth * state.floating.parallax;
      } else {
        dx = (mouse.targetX - width / 2) * depth * state.floating.parallax;
        dy = (mouse.targetY - height / 2) * depth * state.floating.parallax;
      }

      tag.style.transform = `translate(${xOrbit + dx}px, ${yOrbit + dy}px)`;
    });

    requestAnimationFrame(updateFloatingTags);
  };

  updateFloatingTags();

  // Mobile Touch Drag-and-Throw physics for Floating Tags
  floatingTags.forEach(tag => {
    let isDraggingTag = false;
    let tagStartX = 0, tagStartY = 0;

    tag.addEventListener('touchstart', (e) => {
      isDraggingTag = true;
      tag.classList.add('is-dragging');
      const touch = e.touches[0];
      const rect = tag.getBoundingClientRect();
      const heroRect = document.getElementById('hero').getBoundingClientRect();
      // Calculate offset inside the tag
      tagStartX = touch.clientX - rect.left;
      tagStartY = touch.clientY - rect.top;
      tag.style.transition = 'none';
    }, { passive: true });

    tag.addEventListener('touchmove', (e) => {
      if (!isDraggingTag) return;
      const touch = e.touches[0];
      const containerRect = document.getElementById('hero').getBoundingClientRect();
      
      const x = touch.clientX - containerRect.left - tagStartX;
      const y = touch.clientY - containerRect.top - tagStartY;
      
      // Directly position tag
      tag.style.position = 'absolute';
      tag.style.left = `${x}px`;
      tag.style.top = `${y}px`;
      tag.style.transform = 'none';
    }, { passive: true });

    tag.addEventListener('touchend', () => {
      if (!isDraggingTag) return;
      isDraggingTag = false;
      tag.classList.remove('is-dragging');
      tag.style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
      // Reset left/top positions to return to original CSS slots, transforming back to orbit
      tag.style.left = '';
      tag.style.top = '';
    });

    tag.addEventListener('click', (e) => {
      e.preventDefault();
      const mapTagToService = (tagText) => {
        const text = tagText.toLowerCase();
        if (text.includes('photo')) return 0;
        if (text.includes('video')) return 1;
        if (text.includes('story') || text.includes('edit')) return 2;
        if (text.includes('creative') || text.includes('director') || text.includes('brand')) return 3;
        return -1;
      };
      const serviceCards = document.querySelectorAll('.service-card');
      const targetIndex = mapTagToService(tag.textContent);
      if (targetIndex !== -1 && serviceCards[targetIndex]) {
        serviceCards[targetIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Spotlight it immediately
        serviceCards.forEach(c => c.classList.remove('in-focus'));
        serviceCards[targetIndex].classList.add('in-focus');
        
        // Rumble haptic feedback
        if (navigator.vibrate) navigator.vibrate([15, 10, 15]);
      }
    });
  });

  // ---------------------------------------------------------
  // 5. ABOUT SECTION & STATS ANIMATIONS
  // ---------------------------------------------------------
  const statsElements = document.querySelectorAll('.stat-box');
  let animatedStats = false;

  const countUp = (el, target) => {
    let current = 0;
    const duration = 1500; // 1.5s
    const stepTime = Math.abs(Math.floor(duration / target));
    const timer = setInterval(() => {
      current += 1;
      el.querySelector('.counter').textContent = current;
      if (current >= target) {
        el.querySelector('.counter').textContent = target;
        clearInterval(timer);
      }
    }, Math.max(stepTime, 15));
  };

  const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        
        // Trigger Stats counter once
        if (entry.target.id === 'about' && !animatedStats) {
          animatedStats = true;
          statsElements.forEach(box => {
            const targetVal = parseInt(box.getAttribute('data-stat-target'));
            countUp(box, targetVal);
          });
        }
      }
    });
  }, observerOptions);

  // Apply reveal hooks
  const revealElements = document.querySelectorAll('.scroll-reveal');
  revealElements.forEach(el => observer.observe(el));

  // ---------------------------------------------------------
  // 6. PORTFOLIO FILTER & LIGHTBOX GALLERY
  // ---------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button active
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        if (filterValue === 'all' || item.classList.contains(filterValue)) {
          item.classList.remove('filtered-out');
        } else {
          item.classList.add('filtered-out');
        }
      });
    });
  });

  // Lightbox implementation (with gallery support)
  const lightbox = document.getElementById('portfolio-lightbox');
  const lightboxContent = lightbox ? lightbox.querySelector('.lightbox-content') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  const lightboxPrev = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
  const lightboxNext = lightbox ? lightbox.querySelector('.lightbox-next') : null;
  const lightboxCat = lightbox ? lightbox.querySelector('.lightbox-category') : null;
  const lightboxTitle = lightbox ? lightbox.querySelector('.lightbox-title') : null;

  let currentGalleryItems = [];
  let currentGalleryIndex = 0;

  const updateLightbox = () => {
    if (!lightboxContent || currentGalleryItems.length === 0) return;
    const item = currentGalleryItems[currentGalleryIndex];

    lightboxContent.innerHTML = ''; // Clear container

    if (item.videoSrc) {
      const videoEl = document.createElement('video');
      videoEl.src = item.videoSrc;
      videoEl.controls = true;
      videoEl.autoplay = true;
      videoEl.loop = true;
      lightboxContent.appendChild(videoEl);
    } else if (item.src) {
      const imgEl = document.createElement('img');
      imgEl.src = item.src;
      lightboxContent.appendChild(imgEl);
    }

    if (lightboxCat) lightboxCat.textContent = item.category;
    if (lightboxTitle) lightboxTitle.textContent = item.title;

    // Show/hide navigation arrows
    if (currentGalleryItems.length > 1) {
      if (lightboxPrev) lightboxPrev.style.display = 'flex';
      if (lightboxNext) lightboxNext.style.display = 'flex';
    } else {
      if (lightboxPrev) lightboxPrev.style.display = 'none';
      if (lightboxNext) lightboxNext.style.display = 'none';
    }
  };

  portfolioItems.forEach(item => {
    // Play video on hover
    const video = item.querySelector('.video-preview');
    if (video) {
      item.addEventListener('mouseenter', () => video.play());
      item.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
      });
    }

    // Lightbox open
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-src');
      const videoSrc = item.getAttribute('data-video-src');
      const title = item.getAttribute('data-title');
      const category = item.getAttribute('data-category');

      currentGalleryItems = [{ src, videoSrc, title, category }];
      currentGalleryIndex = 0;
      updateLightbox();

      if (lightbox) lightbox.classList.add('active');
    });
  });

  // Services cards gallery trigger
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const mediaStr = card.getAttribute('data-gallery-media');
      if (!mediaStr) return;

      const title = card.getAttribute('data-gallery-title') || 'Gallery';
      const category = card.getAttribute('data-gallery-cat') || 'Works';
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

      if (lightbox) lightbox.classList.add('active');
    });
  });

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      currentGalleryIndex = (currentGalleryIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length;
      updateLightbox();
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      currentGalleryIndex = (currentGalleryIndex + 1) % currentGalleryItems.length;
      updateLightbox();
    });
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      if (lightbox) lightbox.classList.remove('active');
      if (lightboxContent) lightboxContent.innerHTML = '';
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === lightboxContent) {
        lightbox.classList.remove('active');
        if (lightboxContent) lightboxContent.innerHTML = '';
      }
    });
  }

  // ---------------------------------------------------------
  // 7. SERVICES SECTION SETTINGS
  // ---------------------------------------------------------

  const updateServicesConfig = () => {
    serviceCards.forEach(card => {
      // Clear previous classes
      card.classList.remove('flood-dir-down', 'flood-dir-right', 'flood-dir-left');
      
      if (state.aesthetics.servicesDir !== 'up') {
        card.classList.add(`flood-dir-${state.aesthetics.servicesDir}`);
      }
    });

    document.documentElement.style.setProperty('--services-hover-speed', `${state.aesthetics.servicesSpeed}ms`);
    document.documentElement.style.setProperty('--services-flood-color', state.cursor.color);
  };
  updateServicesConfig();

  // ---------------------------------------------------------
  // 8. TESTIMONIALS SLIDER
  // ---------------------------------------------------------
  const slider = document.getElementById('testimonials-slider');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  
  let currentSlide = 0;
  const slideCount = slides.length;
  let autoPlayTimer;

  const updateSliderPosition = () => {
    const slideWidth = slides[0].getBoundingClientRect().width;
    slider.style.transform = `translateX(-${currentSlide * (slideWidth + 30)}px)`;
  };

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % slideCount;
    updateSliderPosition();
  };

  const prevSlide = () => {
    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
    updateSliderPosition();
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayTimer = setInterval(nextSlide, 5000);
  };

  const stopAutoPlay = () => {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoPlay();
    });
  }

  // Drag and Swipe implementation
  let startX, isDragging = false, currentTranslate = 0, prevTranslate = 0;

  if (slider) {
    slider.addEventListener('mousedown', (e) => {
      startX = e.pageX - slider.offsetLeft;
      isDragging = true;
      stopAutoPlay();
    });

    slider.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 0.8;
      slider.style.transform = `translateX(${prevTranslate + walk}px)`;
    });

    slider.addEventListener('mouseup', (e) => {
      isDragging = false;
      const endX = e.pageX - slider.offsetLeft;
      const deltaX = endX - startX;
      
      if (Math.abs(deltaX) > 80) {
        if (deltaX < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      } else {
        updateSliderPosition();
      }
      
      if (slides && slides.length > 0) {
        const slideWidth = slides[0].getBoundingClientRect().width;
        prevTranslate = -currentSlide * (slideWidth + 30);
      }
      startAutoPlay();
    });

    slider.addEventListener('mouseleave', () => {
      if (isDragging) {
        isDragging = false;
        updateSliderPosition();
      }
      startAutoPlay();
    });

    // Touch Swipe support
    slider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      stopAutoPlay();
    });

    slider.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const touchX = e.touches[0].clientX;
      const walk = (touchX - startX) * 0.8;
      slider.style.transform = `translateX(${prevTranslate + walk}px)`;
    });

    slider.addEventListener('touchend', (e) => {
      isDragging = false;
      const endX = e.changedTouches[0].clientX;
      const deltaX = endX - startX;

      if (Math.abs(deltaX) > 50) {
        if (deltaX < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      } else {
        updateSliderPosition();
      }

      if (slides && slides.length > 0) {
        const slideWidth = slides[0].getBoundingClientRect().width;
        prevTranslate = -currentSlide * (slideWidth + 30);
      }
      startAutoPlay();
    });
  }

  startAutoPlay();

  // Resize adjust slider
  window.addEventListener('resize', updateSliderPosition);

  // ---------------------------------------------------------
  // 9. HEADER SCROLL & MOBILE NAVIGATION OVERLAY
  // ---------------------------------------------------------
  const header = document.querySelector('.main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  const menuTrigger = document.querySelector('.mobile-menu-trigger');
  const navOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuTrigger) {
    menuTrigger.addEventListener('click', () => {
      menuTrigger.classList.toggle('active');
      if (navOverlay) navOverlay.classList.toggle('active');
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (menuTrigger) menuTrigger.classList.remove('active');
      if (navOverlay) navOverlay.classList.remove('active');
    });
  });

  // ---------------------------------------------------------
  // 10. CONTACT FORM SUBMISSION
  // ---------------------------------------------------------
  const contactForm = document.getElementById('portfolio-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simulate premium transmission effect
      const submitBtn = contactForm.querySelector('.form-submit-btn span');
      if (submitBtn) {
        submitBtn.textContent = 'TRANSMITTING...';
        submitBtn.style.color = '#B8FF00';
        
        setTimeout(() => {
          submitBtn.textContent = 'TRANSMISSION COMPLETE ✓';
          contactForm.reset();
          
          setTimeout(() => {
            submitBtn.textContent = 'SEND TRANSMISSION';
            submitBtn.style.color = '';
          }, 3000);
        }, 1800);
      }
    });
  }

  // Sync state to CSS/JS engine
  const applySettings = () => {
    // 1. Cursor
    if (state.cursor.enabled) {
      document.body.classList.add('custom-cursor-enabled');
      if (cursorDot) cursorDot.style.display = 'block';
      if (cursorRing) cursorRing.style.display = 'block';
    } else {
      document.body.classList.remove('custom-cursor-enabled');
      if (cursorDot) cursorDot.style.display = 'none';
      if (cursorRing) cursorRing.style.display = 'none';
    }

    document.documentElement.style.setProperty('--cursor-size', `${state.cursor.size}px`);
    document.documentElement.style.setProperty('--cursor-ring-size', `${state.cursor.ringSize}px`);
    document.documentElement.style.setProperty('--cursor-glow-intensity', state.cursor.glow);
    document.documentElement.style.setProperty('--cursor-color', state.cursor.color);
    document.documentElement.style.setProperty('--accent', state.cursor.color);
    
    // Convert hex to rgb for glow
    const hex = state.cursor.color;
    if (hex && hex.startsWith('#')) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      document.documentElement.style.setProperty('--accent-glow', `rgba(${r}, ${g}, ${b}, 0.35)`);
    }

    // 2. Anti-Gravity Floating speed
    // Synced inside floating requestAnimationFrame loop
    
    // 3. Background Toggles
    updateStaticOverlays();
    
    // 4. Circular Badge Speed
    const badgeSvg = document.querySelector('.rotating-badge-svg');
    if (badgeSvg) {
      badgeSvg.style.animationDuration = `${160 / state.aesthetics.badgeSpeed}s`;
    }

    // 5. Testimonial carousel transitions
    document.documentElement.style.setProperty('--testimonial-transition-speed', `${state.aesthetics.testimonialSpeed}ms`);

    // 6. Marquee Velocity
    document.documentElement.style.setProperty('--marquee-speed-duration', `${state.aesthetics.marqueeSpeed}s`);

    // 7. Services configurations
    updateServicesConfig();
  };

  // Initial settings execution
  applySettings();
  document.body.classList.add('custom-cursor-enabled');

  // ---------------------------------------------------------
  // MOBILE QUICK ACTIONS SHEET DRAW
  // ---------------------------------------------------------
  const actionSheet = document.getElementById('mobile-action-sheet');
  const sheetHandle = document.querySelector('.sheet-handle-area');

  if (actionSheet && sheetHandle) {
    sheetHandle.addEventListener('click', () => {
      actionSheet.classList.toggle('active');
    });

    // Handle touch swipe to close/open
    let touchStartY = 0;
    sheetHandle.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    sheetHandle.addEventListener('touchend', (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchEndY - touchStartY;
      if (diffY > 40 && actionSheet.classList.contains('active')) {
        actionSheet.classList.remove('active');
      } else if (diffY < -40 && !actionSheet.classList.contains('active')) {
        actionSheet.classList.add('active');
      }
    }, { passive: true });
  }

  // ---------------------------------------------------------
  // MOBILE-NATIVE INTERACTION ENGINE (SCROLL-SPOTLIGHT, 3D TOUCH TILT & HAPTICS)
  // ---------------------------------------------------------
  const initMobileInteractions = () => {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const serviceCards = document.querySelectorAll('.service-card');
    const allCards = [...portfolioItems, ...serviceCards];

    // If not mobile size, skip the unified LERP/Tilt touch controls to allow customizer settings
    if (window.innerWidth >= 1024) return;

    const cardStates = new Map();

    allCards.forEach(card => {
      card.classList.add('js-tilt');
      cardStates.set(card, {
        currentX: 0, currentY: 0, currentScale: 1,
        targetX: 0, targetY: 0, targetScale: 1,
        isTouchActive: false
      });

      // Bind Touch Events for 3D Tilt on Drag
      card.addEventListener('touchstart', (e) => {
        const state = cardStates.get(card);
        state.isTouchActive = true;
        state.targetScale = 1.04;
        updateTilt(e, card, state);
      }, { passive: true });

      card.addEventListener('touchmove', (e) => {
        const state = cardStates.get(card);
        if (!state.isTouchActive) return;
        updateTilt(e, card, state);
      }, { passive: true });

      const resetTilt = () => {
        const state = cardStates.get(card);
        state.isTouchActive = false;
        state.targetX = 0;
        state.targetY = 0;
        state.targetScale = card.classList.contains('in-focus') ? 1.02 : 1;
      };

      card.addEventListener('touchend', resetTilt, { passive: true });
      card.addEventListener('touchcancel', resetTilt, { passive: true });
    });

    function updateTilt(e, card, state) {
      if (e.touches.length === 0) return;
      const touch = e.touches[0];
      const rect = card.getBoundingClientRect();
      const cardWidth = rect.width;
      const cardHeight = rect.height;

      // Finger location offset relative to center of the card
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;

      const percentX = (touchX / cardWidth) - 0.5; // range: -0.5 to 0.5
      const percentY = (touchY / cardHeight) - 0.5; // range: -0.5 to 0.5

      const maxTilt = 12; // Max degrees of tilt
      state.targetX = -percentY * maxTilt; // Rotate around X axis based on Y movement
      state.targetY = percentX * maxTilt;  // Rotate around Y axis based on X movement
    }

    // Scroll-Spotlight: Highlight center-most items & trigger haptics
    let lastVibratedItem = null;

    const updateScrollSpotlight = () => {
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

      // Update Portfolio Spotlight
      portfolioItems.forEach(item => {
        const state = cardStates.get(item);
        if (!state) return;
        const isFocused = item === closestPortfolioItem;

        if (isFocused) {
          if (!item.classList.contains('in-focus')) {
            item.classList.add('in-focus');
            const video = item.querySelector('.video-preview');
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
            const video = item.querySelector('.video-preview');
            if (video && !video.paused) {
              video.pause();
            }
          }
          if (!state.isTouchActive) state.targetScale = 1;
        }
      });

      // Update Service Spotlight
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

    window.addEventListener('scroll', updateScrollSpotlight, { passive: true });
    updateScrollSpotlight();

    // Unified Animation loop for rendering smooth translations
    const renderLoop = () => {
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;

      allCards.forEach(card => {
        const state = cardStates.get(card);
        if (!state) return;
        const rect = card.getBoundingClientRect();

        // Scroll drives vertical tilt rotation when finger is not touching the screen
        if (!state.isTouchActive && rect.top < viewportHeight && rect.bottom > 0) {
          const itemCenter = rect.top + rect.height / 2;
          const distanceFromCenter = itemCenter - viewportCenter;
          const maxScrollTilt = 10;
          state.targetX = (distanceFromCenter / (viewportHeight / 2)) * maxScrollTilt;
          state.targetX = Math.min(Math.max(state.targetX, -maxScrollTilt), maxScrollTilt);
          state.targetY = 0;
        }

        // Interpolate transformations
        state.currentX += (state.targetX - state.currentX) * 0.15;
        state.currentY += (state.targetY - state.currentY) * 0.15;
        state.currentScale += (state.targetScale - state.currentScale) * 0.15;

        card.style.transform = `translate3d(0, 0, 0) rotateX(${state.currentX}deg) rotateY(${state.currentY}deg) scale(${state.currentScale})`;
      });

      requestAnimationFrame(renderLoop);
    };

    renderLoop();
  };

  initMobileInteractions();

  // ---------------------------------------------------------
  // HERO DIAGONAL WIPE-REVEAL
  // ---------------------------------------------------------
  const initHeroWipeReveal = () => {
    const heroSection = document.getElementById('hero');
    const diagonalMask = document.querySelector('.diagonal-mask');

    if (!heroSection || !diagonalMask) return;

    const handleWipe = (clientX, clientY) => {
      const rect = heroSection.getBoundingClientRect();
      const isMobile = window.innerWidth < 1024;

      if (isMobile) {
        // Vertical wipe on mobile (subtle effect)
        const yPosition = clientY - rect.top;
        const pct = (yPosition / rect.height) * 100;
        const clampedPct = 15 + (pct - 50) * 0.1; // Smoothly ranges between 10% and 20%
        diagonalMask.style.setProperty('--wipe-val', `${clampedPct}%`);
      } else {
        // Horizontal wipe on desktop (subtle effect)
        const xPosition = clientX - rect.left;
        const pct = (xPosition / rect.width) * 100;
        const clampedPct = 15 + (pct - 50) * 0.1; // Smoothly ranges between 10% and 20%
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

    // Smooth return to default polygon coordinates on pointer out
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

  initHeroWipeReveal();
