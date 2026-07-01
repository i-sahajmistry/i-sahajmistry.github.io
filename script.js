/* ===================================================================
   PORTFOLIO — Interactive Behaviors
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initThemeToggle();
  initMobileMenu();
  initHeroCanvas();
  initCardGlows();
  initParallax();
});

/* ---------- Navbar scroll behavior ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');
  const sections = document.querySelectorAll('section[id]');

  // Scroll effect
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        // Add/remove scrolled class
        if (scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }

        // Active section highlighting
        let current = '';

        // If at the very bottom, activate the last section
        const atBottom = (window.innerHeight + scrollY) >= (document.documentElement.scrollHeight - 20);
        if (atBottom) {
          const lastSection = sections[sections.length - 1];
          if (lastSection) current = lastSection.getAttribute('id');
        } else {
          sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionBottom) {
              current = section.getAttribute('id');
            }
          });
        }

        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('data-section') === current) {
            link.classList.add('active');
          }
        });

        ticking = false;
      });
      ticking = true;
    }
  });

  // Smooth scroll with offset
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        const navHeight = navbar.offsetHeight;
        const targetPos = target.offsetTop - navHeight;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        closeMobileMenu();
      }
    });
  });
}

/* ---------- Scroll-triggered reveal animations ---------- */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ---------- Theme toggle ---------- */
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  const html = document.documentElement;

  // Check saved preference
  const saved = localStorage.getItem('theme');
  if (saved) {
    html.setAttribute('data-theme', saved);
    icon.textContent = saved === 'light' ? '🌙' : '☀️';
  }

  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    icon.textContent = next === 'light' ? '🌙' : '☀️';
  });
}

/* ---------- Mobile menu ---------- */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const overlay = document.getElementById('nav-overlay');

  mobileToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      navLinks.classList.add('open');
      mobileToggle.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });

  overlay.addEventListener('click', closeMobileMenu);
}

function closeMobileMenu() {
  const navLinks = document.getElementById('nav-links');
  const mobileToggle = document.getElementById('mobile-toggle');
  const overlay = document.getElementById('nav-overlay');

  navLinks.classList.remove('open');
  mobileToggle.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

/* ---------- Hero particle / constellation canvas ---------- */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let animationId;

  const PARTICLE_COUNT = 60;
  const CONNECTION_DISTANCE = 150;
  const PARTICLE_SIZE = 1.5;

  function resize() {
    const hero = canvas.parentElement;
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * PARTICLE_SIZE + 0.5,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DISTANCE) {
          const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 93, 93, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 93, 93, ${p.opacity})`;
      ctx.fill();
    });
  }

  function updateParticles() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
    });
  }

  function animate() {
    updateParticles();
    drawParticles();
    animationId = requestAnimationFrame(animate);
  }

  // Pause animation when hero is not visible
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!animationId) animate();
      } else {
        if (animationId) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }
      }
    });
  }, { threshold: 0.1 });

  heroObserver.observe(canvas.parentElement);

  // Init
  resize();
  createParticles();
  animate();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
}

/* ---------- Interactive card spotlights ---------- */
function initCardGlows() {
  const cards = document.querySelectorAll('.timeline-card, .research-card, .skill-category, .edu-card, .achievement-card, .stat-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ---------- Scroll Parallax ---------- */
function initParallax() {
  const heroGlow1 = document.querySelector('.hero-glow-1');
  const heroGlow2 = document.querySelector('.hero-glow-2');
  const heroContent = document.querySelector('.hero-content');
  const aboutPhoto = document.querySelector('.about-photo-wrapper');
  
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        
        if (heroGlow1) {
          heroGlow1.style.transform = `translate3d(0, ${scrollY * 0.35}px, 0)`;
        }
        if (heroGlow2) {
          heroGlow2.style.transform = `translate3d(0, ${scrollY * 0.2}px, 0)`;
        }
        
        if (heroContent) {
          heroContent.style.transform = `translate3d(0, ${scrollY * 0.1}px, 0)`;
          heroContent.style.opacity = `${Math.max(0, 1 - scrollY / 700)}`;
        }
        
        if (aboutPhoto) {
          const rect = aboutPhoto.getBoundingClientRect();
          const viewHeight = window.innerHeight;
          if (rect.top < viewHeight && rect.bottom > 0) {
            const relativeScroll = (viewHeight - rect.top) / viewHeight;
            aboutPhoto.style.transform = `translate3d(0, ${relativeScroll * 20}px, 0)`;
          }
        }
        
        ticking = false;
      });
      ticking = true;
    }
  });
}
