/* ============================================
   RESTORE PHYSIO — Interactions & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Preloader ----
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('preloader').classList.add('hidden');
    }, 1800);
  });

  // ---- Custom Cursor ----
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  
  if (window.matchMedia('(pointer: fine)').matches && cursorDot && cursorRing) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Hover effect on interactive elements
    const interactiveEls = document.querySelectorAll('a, button, .service-card, .gallery-item, .pricing-card, .faq-question');
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });
  }

  // ---- Sticky Navigation ----
  const navbar = document.getElementById('navbar');
  const hero = document.getElementById('hero');
  
  const navObserver = new IntersectionObserver((entries) => {
    const navCta = document.querySelector('.nav-cta');
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        navbar.classList.add('scrolled');
        if (navCta) {
          navCta.style.background = 'var(--primary)';
          navCta.style.color = '#FFFFFF';
        }
      } else {
        navbar.classList.remove('scrolled');
        if (navCta) {
          navCta.style.background = 'var(--accent)';
          navCta.style.color = '#FFFFFF';
        }
      }
    });
  }, { threshold: 0.1 });
  
  if (hero) navObserver.observe(hero);

  // ---- Active Nav Link ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ---- Mobile Menu ----
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ---- Scroll Reveal (IntersectionObserver) ----
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Animated Counters ----
  const counters = document.querySelectorAll('[data-target]');
  let countersAnimated = new Set();

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated.has(entry.target)) {
        countersAnimated.add(entry.target);
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const start = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      
      el.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString();
      }
    }
    requestAnimationFrame(update);
  }

  // ---- Testimonial Carousel ----
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');

  if (track && prevBtn && nextBtn) {
    let currentSlide = 0;
    const cards = track.querySelectorAll('.testimonial-card');
    
    function getVisibleCards() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 992) return 2;
      return 3;
    }

    function updateCarousel() {
      const visibleCards = getVisibleCards();
      const maxSlide = Math.max(0, cards.length - visibleCards);
      currentSlide = Math.min(currentSlide, maxSlide);
      
      const cardWidth = cards[0].offsetWidth + 32; // card width + gap
      track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
    }

    prevBtn.addEventListener('click', () => {
      if (currentSlide > 0) {
        currentSlide--;
        updateCarousel();
      }
    });

    nextBtn.addEventListener('click', () => {
      const visibleCards = getVisibleCards();
      const maxSlide = Math.max(0, cards.length - visibleCards);
      if (currentSlide < maxSlide) {
        currentSlide++;
        updateCarousel();
      }
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextBtn.click();
        else prevBtn.click();
      }
    }, { passive: true });

    window.addEventListener('resize', updateCarousel);
  }

  // ---- Gallery Lightbox ----
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const galleryItems = document.querySelectorAll('[data-lightbox]');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // ---- FAQ Accordion ----
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      faqItems.forEach(other => {
        other.classList.remove('active');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });

      // Open clicked if wasn't active
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ---- Parallax Effect ----
  const parallaxElements = document.querySelectorAll('.hero-bg-image img, .about-image-badge');

  function handleParallax() {
    const scrollY = window.scrollY;
    parallaxElements.forEach(el => {
      const speed = 0.3;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const yPos = -(scrollY * speed * 0.5);
        el.style.transform = `translateY(${yPos}px)`;
      }
    });
  }
  window.addEventListener('scroll', handleParallax, { passive: true });

  // ---- Text Reveal Animation (Words) ----
  function splitTextIntoWords() {
    const heroH1 = document.querySelector('.hero-text h1');
    if (!heroH1 || heroH1.dataset.split) return;
    
    heroH1.dataset.split = 'true';
    const html = heroH1.innerHTML;
    const words = html.split(/(\s+|<[^>]+>)/);
    
    let wordIndex = 0;
    heroH1.innerHTML = words.map(word => {
      if (word.startsWith('<') || /^\s+$/.test(word)) return word;
      wordIndex++;
      return `<span class="word-reveal" style="animation-delay: ${wordIndex * 0.08}s">${word}</span>`;
    }).join(' ');
  }

  // Hero text animation on load
  setTimeout(() => {
    splitTextIntoWords();
    document.querySelectorAll('.word-reveal').forEach(w => w.classList.add('animate'));
  }, 2200);

  // ---- Word Reveal CSS (injected) ----
  const style = document.createElement('style');
  style.textContent = `
    .word-reveal {
      display: inline-block;
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .word-reveal.animate {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  // ---- Booking Form Submission ----
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = bookingForm.querySelector('.btn-book');
      const originalText = btn.textContent;
      btn.textContent = '✓ Booking Request Sent!';
      btn.style.background = 'var(--secondary)';
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        bookingForm.reset();
      }, 3000);
    });
  }

  // ---- Contact Form Submission ----
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.btn-contact');
      const originalText = btn.textContent;
      btn.textContent = '✓ Message Sent!';
      btn.style.background = 'var(--secondary)';
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        contactForm.reset();
      }, 3000);
    });
  }

  // ---- Newsletter Form ----
  const newsletterBtn = document.querySelector('.btn-newsletter');
  if (newsletterBtn) {
    newsletterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const input = document.querySelector('.footer-newsletter input');
      if (input && input.value.includes('@')) {
        const originalText = newsletterBtn.textContent;
        newsletterBtn.textContent = '✓ Subscribed!';
        input.value = '';
        setTimeout(() => { newsletterBtn.textContent = originalText; }, 3000);
      }
    });
  }

  // ---- Set min date for booking ----
  const dateInput = document.getElementById('bookDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

});
