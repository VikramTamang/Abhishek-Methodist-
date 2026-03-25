/* ============================================================
   ABHISEK METHODIST CHURCH — MAIN JAVASCRIPT
   Interactive features, animations, form validation
   ============================================================ */

'use strict';

// ======================================================
// PRELOADER
// ======================================================
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('hidden');
      setTimeout(() => preloader.remove(), 700);
    }
    // Trigger hero animations after preloader
    document.querySelectorAll('.hero-content [data-animate]').forEach((el, i) => {
      const delay = parseInt(el.getAttribute('data-delay') || 0);
      setTimeout(() => el.classList.add('animated'), 300 + delay);
    });
  }, 2000);
});

// ======================================================
// NAVBAR: SCROLL BEHAVIOR + ACTIVE LINKS
// ======================================================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Scrolled class for navbar background
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Scroll-to-top button
  const scrollTopBtn = document.getElementById('scrollTop');
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('show');
  } else {
    scrollTopBtn.classList.remove('show');
  }

  // Active section highlight in navbar
  let currentSection = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
});

// ======================================================
// HAMBURGER MENU
// ======================================================
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksContainer.classList.toggle('open');
});

// Close menu when a link is clicked
navLinksContainer.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksContainer.classList.remove('open');
  });
});

// ======================================================
// SCROLL-TO-TOP BUTTON
// ======================================================
document.getElementById('scrollTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ======================================================
// SCROLL REVEAL ANIMATIONS (IntersectionObserver)
// ======================================================
const animateObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = parseInt(el.getAttribute('data-delay') || 0);
      setTimeout(() => el.classList.add('animated'), delay);
      animateObserver.unobserve(el);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-animate]').forEach(el => {
  // Skip hero elements — handled on load
  if (!el.closest('.hero-content')) {
    animateObserver.observe(el);
  }
});

// ======================================================
// ANIMATED COUNTERS (Stats)
// ======================================================
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.getAttribute('data-count'));
        animateCounter(el, target);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObserver.observe(heroStats);

// ======================================================
// PARTICLES (Hero Background)
// ======================================================
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 30;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position: absolute;
      width: ${Math.random() * 4 + 2}px;
      height: ${Math.random() * 4 + 2}px;
      background: rgba(255,255,255,${Math.random() * 0.3 + 0.05});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: particleFloat ${Math.random() * 8 + 6}s ease-in-out ${Math.random() * 5}s infinite;
    `;
    container.appendChild(p);
  }

  // Inject keyframes if not added
  if (!document.getElementById('particleStyles')) {
    const style = document.createElement('style');
    style.id = 'particleStyles';
    style.textContent = `
      @keyframes particleFloat {
        0%, 100% { transform: translateY(0) translateX(0); opacity: 0.4; }
        25% { transform: translateY(-25px) translateX(10px); opacity: 0.8; }
        50% { transform: translateY(-50px) translateX(-10px); opacity: 0.4; }
        75% { transform: translateY(-25px) translateX(15px); opacity: 0.7; }
      }
    `;
    document.head.appendChild(style);
  }
}
createParticles();

// ======================================================
// TESTIMONIES SLIDER
// ======================================================
const slider = document.getElementById('testimoniesSlider');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('sliderDots');

if (slider && prevBtn && nextBtn && dotsContainer) {
  const cards = slider.querySelectorAll('.testimony-card');
  let currentIndex = 0;
  let cardWidth = 0;
  let cardsPerView = 3;
  let maxIndex = 0;
  let autoplayInterval;

  function getCardsPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1100) return 2;
    return 3;
  }

  function setupSlider() {
    cardsPerView = getCardsPerView();
    maxIndex = Math.max(0, cards.length - cardsPerView);

    // Build dots
    dotsContainer.innerHTML = '';
    const dotsCount = maxIndex + 1;
    for (let i = 0; i < dotsCount; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === currentIndex) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }

    // Set card widths
    const sliderWrap = document.querySelector('.testimonies-slider-wrap');
    const wrapWidth = sliderWrap.offsetWidth;
    const gap = 28;
    cardWidth = (wrapWidth - gap * (cardsPerView - 1)) / cardsPerView;

    cards.forEach(card => {
      card.style.flex = `0 0 ${cardWidth}px`;
      card.style.maxWidth = `${cardWidth}px`;
    });

    goTo(Math.min(currentIndex, maxIndex));
  }

  function goTo(index) {
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    const translateX = currentIndex * (cardWidth + 28);
    slider.style.transform = `translateX(-${translateX}px)`;

    // Update dots
    dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === maxIndex;
    prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
    nextBtn.style.opacity = currentIndex === maxIndex ? '0.5' : '1';
  }

  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      if (currentIndex >= maxIndex) {
        goTo(0);
      } else {
        goTo(currentIndex + 1);
      }
    }, 4500);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  prevBtn.addEventListener('click', () => { goTo(currentIndex - 1); stopAutoplay(); startAutoplay(); });
  nextBtn.addEventListener('click', () => { goTo(currentIndex + 1); stopAutoplay(); startAutoplay(); });

  // Touch/swipe support
  let touchStartX = 0;
  slider.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].clientX; });
  slider.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      stopAutoplay();
      if (diff > 0) goTo(currentIndex + 1);
      else goTo(currentIndex - 1);
      startAutoplay();
    }
  });

  // Pause on hover
  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  window.addEventListener('resize', setupSlider);
  setupSlider();
  startAutoplay();
}

// ======================================================
// CONTACT FORM VALIDATION
// ======================================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
  }
  function clearErrors() {
    ['nameError', 'emailError', 'messageError'].forEach(id => showError(id, ''));
  }
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();
    const name = document.getElementById('cName').value.trim();
    const email = document.getElementById('cEmail').value.trim();
    const message = document.getElementById('cMessage').value.trim();
    let valid = true;

    if (!name || name.length < 2) {
      showError('nameError', 'Please enter your full name (at least 2 characters).');
      valid = false;
    }
    if (!email || !validateEmail(email)) {
      showError('emailError', 'Please enter a valid email address.');
      valid = false;
    }
    if (!message || message.length < 15) {
      showError('messageError', 'Please enter a message (at least 15 characters).');
      valid = false;
    }

    if (valid) {
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        const success = document.getElementById('formSuccess');
        success.classList.add('show');
        setTimeout(() => success.classList.remove('show'), 5000);
      }, 1500);
    }
  });
}

// ======================================================
// PRAYER REQUEST FORM
// ======================================================
const prayerForm = document.getElementById('prayerForm');
if (prayerForm) {
  prayerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = prayerForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    setTimeout(() => {
      prayerForm.reset();
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-check"></i> Prayer Request Submitted!';
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-hands-praying"></i> Submit Prayer Request';
      }, 3000);
    }, 1200);
  });
}

// ======================================================
// SMOOTH SCROLL for all # anchor links
// ======================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ======================================================
// NAVBAR: Start as transparent (always shown against hero)
// ======================================================
// Apply scrolled class immediately if page reloads mid-scroll
if (window.scrollY > 50) navbar.classList.add('scrolled');

// ======================================================
// DYNAMIC CONTENT — Fetch from backend API
// ======================================================
const PUBLIC_API = 'https://abhishek-methodist-church.onrender.com/api/content';

async function safeFetch(url) {
  try {
    const res = await fetch(url);
    if (res.ok) return await res.json();
  } catch (e) {
    // Backend offline — keep static HTML fallback
  }
  return null;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value) el.textContent = value;
}

// Load Home content
async function loadPublicHome() {
  const data = await safeFetch(`${PUBLIC_API}/home`);
  if (!data) return;
  setText('heroSubtitle', data.heroSubtitle);
  setText('pastorMsgTitle', data.pastorMessageTitle);
  setText('pastorMsgBody', data.pastorMessageBody);
}

// Load About content
async function loadPublicAbout() {
  const data = await safeFetch(`${PUBLIC_API}/about`);
  if (!data) return;
  setText('aboutVision', data.vision);
  setText('aboutMission', data.mission);
}

// Load Contact content
async function loadPublicContact() {
  const data = await safeFetch(`${PUBLIC_API}/contact`);
  if (!data) return;
  setText('publicAddress', data.address);
  setText('publicPhone', data.phone);
  setText('publicEmail', data.email);
  if (data.mapLocation) {
    const iframe = document.getElementById('publicMapIframe');
    if (iframe) iframe.src = data.mapLocation;
  }
}

// Load Branches
async function loadPublicBranches() {
  const data = await safeFetch(`${PUBLIC_API}/branch`);
  if (!data || data.length === 0) return;
  const grid = document.getElementById('publicBranchesGrid');
  if (!grid) return;
  const colors = ['branch-blue', 'branch-red', 'branch-purple'];
  grid.innerHTML = data.map((branch, i) => `
    <div class="branch-card" data-animate="fade-up" data-delay="${i * 100}">
      <div class="branch-img-wrap">
        ${branch.imageUrl
          ? `<img src="http://localhost:5000${branch.imageUrl}" alt="${branch.name}" style="width:100%;height:100%;object-fit:cover;border-radius:8px 8px 0 0;">`
          : `<div class="branch-img-placeholder ${colors[i % colors.length]}"><i class="fas fa-church"></i></div>`}
      </div>
      <div class="branch-info">
        <div class="branch-tag">Branch</div>
        <h4>${branch.name}</h4>
        <div class="branch-detail"><i class="fas fa-map-marker-alt"></i> ${branch.location}</div>
        ${branch.details ? `<div class="branch-detail"><i class="fas fa-info-circle"></i> ${branch.details}</div>` : ''}
        <a href="#contact" class="branch-btn">Get Directions</a>
      </div>
    </div>
  `).join('');
  // Re-observe newly added elements for scroll animations
  grid.querySelectorAll('[data-animate]').forEach(el => animateObserver.observe(el));
}

// Load Testimonies
async function loadPublicTestimonies() {
  const data = await safeFetch(`${PUBLIC_API}/testimony`);
  if (!data || data.length === 0) return;
  const slider = document.getElementById('testimoniesSlider');
  if (!slider) return;
  const colors = ['#1a56db,#3b82f6', '#be123c,#f43f5e', '#7c3aed,#a855f7', '#d97706,#f59e0b', '#059669,#10b981'];
  slider.innerHTML = data.map((t, i) => `
    <div class="testimony-card">
      <div class="tc-quote"><i class="fas fa-quote-left"></i></div>
      <p class="tc-text">${t.message}</p>
      <div class="tc-stars">★★★★★</div>
      <div class="tc-author">
        <div class="tc-avatar" style="background: linear-gradient(135deg, ${colors[i % colors.length]})">${t.name.charAt(0).toUpperCase()}</div>
        <div>
          <div class="tc-name">${t.name}</div>
          <div class="tc-role">Church Member</div>
        </div>
      </div>
    </div>
  `).join('');
  // Re-initialise the slider after DOM update
  if (typeof setupSlider === 'function') setupSlider();
}

// Initialise all dynamic sections on page load
document.addEventListener('DOMContentLoaded', () => {
  loadPublicHome();
  loadPublicAbout();
  loadPublicContact();
  loadPublicBranches();
  loadPublicTestimonies();
});
