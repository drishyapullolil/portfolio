/**
 * Drishya Jose - Portfolio Main Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Theme Management
  initThemeToggle();

  // 2. Initialize Ambient Particle Canvas
  initAmbientCanvas();

  // 3. Initialize Typewriter Effect
  initTypewriter();

  // 4. Initialize Navigation and Mobile Menu
  initNavigation();

  // 5. Initialize Project Filter & Modal Viewer
  initProjects();

  // 6. Initialize Clipboard Copy & Toast Notifications
  initCopyButtons();

  // 7. Initialize Contact Form
  initContactForm();

  // 8. Initialize Scroll Reveal Animations
  initScrollAnimations();
});

/* ==========================================================================
   1. Theme Toggle (Dark / Light)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved theme or default to dark
  const savedTheme = localStorage.getItem('dj_theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('dj_theme', newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }
}

/* ==========================================================================
   2. Ambient Particle Canvas Animation
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 18), 50);

  let mouse = {
    x: null,
    y: null,
    radius: 120
  };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
    }

    draw() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(99, 102, 241, 0.45)' : 'rgba(99, 102, 241, 0.25)';
      ctx.fill();
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse proximity interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = (dx / distance) * force * 1.5;
          const directionY = (dy / distance) * force * 1.5;
          this.x -= directionX;
          this.y -= directionY;
        }
      }

      this.draw();
    }
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          const opacity = (1 - dist / 130) * (isDark ? 0.2 : 0.08);
          ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  createParticles();

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => p.update());
    connectParticles();
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. Typewriter Effect
   ========================================================================== */
function initTypewriter() {
  const element = document.getElementById('typewriter');
  if (!element) return;

  const roles = [
    'Full Stack Web Applications',
    'Smart IoT Solutions & Telemetry',
    'RESTful APIs in Node.js & Express',
    'Enterprise Backends with Spring Boot',
    'Responsive & Modern React.js Interfaces'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      element.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      element.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 1800; // Pause at full text
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   4. Navigation & Mobile Menu & Active Scrolling
   ========================================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Navbar background glass elevation on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
    });

    // Close menu when link is clicked
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-open');
      });
    });
  }

  // Active Link Highlighter on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');
      const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

      if (activeLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          activeLink.classList.add('active');
        } else {
          activeLink.classList.remove('active');
        }
      }
    });
  });
}

/* ==========================================================================
   5. Projects Filtering & Interactive Modal Viewer
   ========================================================================== */
const projectDetailsData = {
  movesmart: {
    title: 'MoveSmart — IoT-Based Smart Private Bus Management System',
    category: 'Full Stack & IoT Transport Architecture',
    tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'RFID/NFC', 'GPS Telemetry', 'Role-Based Access'],
    overview: 'MoveSmart is a full-stack smart fleet and passenger management platform engineered to modernize private bus transit systems through hardware automation and real-time cloud data pipelines.',
    features: [
      'Automated Passenger Booking & Digital Seat Allocation with real-time seat status synchronization.',
      'RFID/NFC Smart Card Tap-In/Tap-Out ticketing interface, eliminating physical paper tickets.',
      'GPS Real-Time Telemetry Tracking for vehicle live location streaming on interactive maps.',
      'Smart Driver & Route Scheduling Engine with built-in conflict-prevention algorithms.',
      'Onboard Waste & Facility Management module with automated maintenance ticket routing.',
      'Multi-tiered Role-Based Access Control (Admin, Fleet Operator, Driver, Passenger).'
    ],
    architecture: 'Built using React.js on the client for smooth reactive dashboards, backed by Node.js/Express REST microservices and MongoDB for flexible telemetry data models.',
    github: 'https://github.com/drishyapullolil'
  },
  smartbottle: {
    title: 'Smart Bottle — IoT Hydration Monitoring Product',
    category: 'Embedded Systems & Smart Health Product',
    tags: ['Arduino', 'Embedded C/C++', 'Ultrasonic / Level Sensors', 'IoT Architecture', 'Audio-Visual Alerts'],
    overview: 'An embedded IoT hydration tracking product designed to ensure optimal personal hydration through automated sensor measurements, consumption analytics, and smart notifications.',
    features: [
      'High-precision real-time liquid level monitoring using ultrasonic and depth sensors.',
      'Embedded Arduino micro-controller firmware programmed with custom intake algorithms.',
      'Adaptive Reminder Logic triggering multi-stage alert sequences (pulsing LEDs, audio buzzer tone, and device indicators).',
      'Power-efficient sleep-mode intervals extending portable battery longevity.',
      'Daily hydration progress metric calculations.'
    ],
    architecture: 'Custom embedded firmware written in C/C++ running on Arduino platform with calibrated analog-to-digital sensor signal processing.',
    github: 'https://github.com/drishyapullolil'
  },
  diary: {
    title: 'Personal Diary Application — RESTful SaaS Web App',
    category: 'Java Spring Boot Enterprise SaaS',
    tags: ['Java', 'Spring Boot', 'Spring Security', 'MySQL', 'Hibernate/JPA', 'REST APIs', 'RBAC'],
    overview: 'A privacy-first, multi-tenant digital journaling platform engineered with rigorous software design patterns, layered architecture, and enterprise security standards.',
    features: [
      'Comprehensive Full CRUD functionality for diary entries with rich markdown and categorized tags.',
      'Role-Based Authentication & Authorization (RBAC) utilizing secure session and token handling.',
      'Layered architecture adhering strictly to Controller-Service-Repository separation of concerns.',
      'Optimized MySQL relational schema with indexing for instant journal retrieval and search.',
      'Encrypted data storage ensuring complete confidentiality of personal reflections.'
    ],
    architecture: 'Java Spring Boot microservices interacting with MySQL via Spring Data JPA and Hibernate ORM.',
    github: 'https://github.com/drishyapullolil'
  },
  yardsofgrace: {
    title: 'Yards of Grace — Saree E-Commerce Platform',
    category: 'E-Commerce Retail Platform',
    tags: ['PHP', 'MySQL', 'JavaScript', 'HTML5', 'CSS3', 'Session Management', 'Checkout Workflows'],
    overview: 'A responsive full-featured e-commerce storefront tailored for traditional and contemporary apparel, featuring dynamic catalogs, shopping carts, and order execution.',
    features: [
      'Interactive Product Catalog with categorized filtering by fabric, price range, and occasion.',
      'Dynamic client-side Shopping Cart with instant quantity updates and total cost estimation.',
      'Secure User Authentication & Account Management with past order history tracking.',
      'Relational MySQL database backend handling product inventories, invoices, and customer transactions.',
      'Optimized for rapid mobile and desktop browsing speeds.'
    ],
    architecture: 'Modular PHP backend with MySQL relational transactions and JavaScript-enhanced frontend workflows.',
    github: 'https://github.com/drishyapullolil'
  },
  recipemanagement: {
    title: 'Recipe Management System — Content Platform',
    category: 'Content Management & Publishing',
    tags: ['WordPress', 'PHP', 'CMS Development', 'Full-Text Search', 'Responsive Web'],
    overview: 'A high-performance content platform engineered for organizing, discovering, and publishing culinary recipes with dynamic taxonomy categorization and full-text search.',
    features: [
      'Customized taxonomies for cuisines, dietary preferences, prep times, and ingredients.',
      'Lightning-fast full-text search engine for instant recipe exploration.',
      'Mobile-optimized typography and responsive layouts for distraction-free cooking mode.',
      'Structured schema metadata markup for optimal search engine indexing (SEO).',
      'Performance-tuned caching and media compression for sub-second load times.'
    ],
    architecture: 'Custom WordPress & PHP architecture optimized for high concurrency and rich content delivery.',
    github: 'https://github.com/drishyapullolil'
  }
};

function initProjects() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  // Filter Buttons
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal Functionality
  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-dynamic-content');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const triggerBtns = document.querySelectorAll('[data-modal]');

  function openProjectModal(projectId) {
    const project = projectDetailsData[projectId];
    if (!project || !modal || !modalBody) return;

    modalBody.innerHTML = `
      <div class="modal-header-section">
        <span class="modal-badge">${project.category}</span>
        <h3 class="modal-title">${project.title}</h3>
        <div class="modal-tech-list">
          ${project.tags.map((tag) => `<span>${tag}</span>`).join('')}
        </div>
      </div>

      <div class="modal-content-section">
        <h4 class="modal-section-h4"><i class="fa-solid fa-circle-info"></i> Project Overview</h4>
        <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 1rem;">${project.overview}</p>

        <h4 class="modal-section-h4"><i class="fa-solid fa-list-check"></i> Key Engineering Features</h4>
        <ul class="modal-features-list">
          ${project.features.map((feat) => `<li>${feat}</li>`).join('')}
        </ul>

        <h4 class="modal-section-h4"><i class="fa-solid fa-cubes"></i> Architecture & Stack</h4>
        <p style="color: var(--text-secondary); line-height: 1.7;">${project.architecture}</p>

        <div class="modal-actions-row">
          <a href="${project.github}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
            <i class="fa-brands fa-github"></i> View GitHub Repository
          </a>
          <button class="btn btn-glass btn-sm" id="modal-close-action">
            <i class="fa-solid fa-xmark"></i> Close Details
          </button>
        </div>
      </div>
    `;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Hook up internal close button
    const closeAction = document.getElementById('modal-close-action');
    if (closeAction) {
      closeAction.addEventListener('click', closeProjectModal);
    }
  }

  function closeProjectModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
  }

  triggerBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-modal');
      openProjectModal(projectId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeProjectModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeProjectModal();
    }
  });
}

/* ==========================================================================
   6. Copy Buttons & Toast Notifications
   ========================================================================== */
function initCopyButtons() {
  const emailButtons = document.querySelectorAll('.copy-email-btn');
  const phoneButtons = document.querySelectorAll('.copy-phone-btn');

  emailButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'drishyajose03@gmail.com';
      copyToClipboard(email, `Copied email: ${email}`);
    });
  });

  phoneButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const phone = btn.getAttribute('data-phone') || '+919539923291';
      copyToClipboard(phone, `Copied phone: ${phone}`);
    });
  });
}

function copyToClipboard(text, message) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(message);
    }).catch(() => {
      fallbackCopy(text, message);
    });
  } else {
    fallbackCopy(text, message);
  }
}

function fallbackCopy(text, message) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(message);
  } catch (err) {
    showToast('Failed to copy');
  }
  document.body.removeChild(textArea);
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   7. Contact Form Handling
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim() || 'Portfolio Collaboration Inquiry';
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.');
      return;
    }

    // Construct mailto link as instant fallback and feedback
    const mailtoUrl = `mailto:drishyajose03@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    
    showToast('Opening your email client to send message...');
    window.location.href = mailtoUrl;

    form.reset();
  });
}

/* ==========================================================================
   8. Scroll Animations via Intersection Observer
   ========================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.glass-panel, .timeline-item, .stat-card, .cert-card');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.12
      }
    );

    animatedElements.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      observer.observe(el);
    });
  }
}
