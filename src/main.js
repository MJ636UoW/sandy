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
        const xPos = blob.x + Math.cos(currAngle) * (r + offset);
        const yPos = blob.y + Math.sin(currAngle) * (r + offset);
        
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
    }

    requestAnimationFrame(loopBg);
  };
  loopBg();

  // ---------------------------------------------------------
  // 4. ANTI-GRAVITY FLOATING ENGINE
  // ---------------------------------------------------------
  const floatingTags = document.querySelectorAll('.floating-tag');
  let floatTime = 0;

  const updateFloatingTags = () => {
    if (!state.floating.enabled) {
      floatingTags.forEach(tag => tag.style.transform = 'translate(0px, 0px)');
      return;
    }

    floatTime += 0.005 * state.floating.speed;

    floatingTags.forEach((tag, idx) => {
      const speed = parseFloat(tag.getAttribute('data-speed'));
      const depth = parseFloat(tag.getAttribute('data-depth'));
      const dir = parseInt(tag.getAttribute('data-dir'));
      const dist = state.floating.distance;

      // Organic orbit movement
      const xOrbit = Math.cos(floatTime * speed) * dist * dir;
      const yOrbit = Math.sin(floatTime * speed * 1.2) * dist * dir;

      // Mouse parallax follow vector
      const dx = (mouse.targetX - width / 2) * depth * state.floating.parallax;
      const dy = (mouse.targetY - height / 2) * depth * state.floating.parallax;

      tag.style.transform = `translate(${xOrbit + dx}px, ${yOrbit + dy}px)`;
    });

    requestAnimationFrame(updateFloatingTags);
  };

  updateFloatingTags();

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

  // Lightbox implementation
  const lightbox = document.getElementById('portfolio-lightbox');
  const lightboxContent = lightbox ? lightbox.querySelector('.lightbox-content') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  const lightboxCat = lightbox ? lightbox.querySelector('.lightbox-category') : null;
  const lightboxTitle = lightbox ? lightbox.querySelector('.lightbox-title') : null;

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

      if (lightboxContent) {
        lightboxContent.innerHTML = ''; // Clear container

        if (videoSrc) {
          const videoEl = document.createElement('video');
          videoEl.src = videoSrc;
          videoEl.controls = true;
          videoEl.autoplay = true;
          videoEl.loop = true;
          lightboxContent.appendChild(videoEl);
        } else if (src) {
          const imgEl = document.createElement('img');
          imgEl.src = src;
          lightboxContent.appendChild(imgEl);
        }
      }

      if (lightboxCat) lightboxCat.textContent = category;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightbox) lightbox.classList.add('active');
    });
  });

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
  const serviceCards = document.querySelectorAll('.service-card');

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
