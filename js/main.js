/**
 * KidHostels - Main JavaScript
 * Mobile navigation, scroll effects, and animations
 */

(function () {
  'use strict';

  // ========== MOBILE NAVIGATION ==========
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mainNav = document.getElementById('main-nav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isOpen);
      mainNav.classList.toggle('open');

      // Prevent body scroll when menu is open
      document.body.style.overflow = !isOpen ? 'hidden' : '';
    });

    // Close menu when a nav link is clicked
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('open');
        document.body.style.overflow = '';
        menuToggle.focus();
      }
    });
  }

  // ========== HEADER SCROLL EFFECT ==========
  var header = document.getElementById('site-header');
  var lastScrollY = 0;
  var ticking = false;

  function updateHeader() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    ticking = false;
  }

  if (header) {
    window.addEventListener('scroll', function () {
      lastScrollY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });
  }

  // ========== SCROLL ANIMATIONS ==========
  var animatedElements = document.querySelectorAll('[data-animate]');

  if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Add stagger delay based on index within parent
          var parent = entry.target.parentElement;
          var siblings = parent.querySelectorAll('[data-animate]');
          var index = Array.prototype.indexOf.call(siblings, entry.target);
          entry.target.style.transitionDelay = (index * 0.1) + 's';

          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    animatedElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerHeight = header ? header.offsetHeight : 0;
        var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========== FAQ ACCORDION (single open) ==========
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (this.open) {
        // Close other open FAQ items
        faqItems.forEach(function (otherItem) {
          if (otherItem !== item && otherItem.open) {
            otherItem.open = false;
          }
        });
      }
    });
  });

  // ========== LAZY LOADING FALLBACK ==========
  if (!('loading' in HTMLImageElement.prototype)) {
    var lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
      var imgObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            img.src = img.dataset.src || img.src;
            imgObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach(function (img) {
        imgObserver.observe(img);
      });
    }
  }

  // ========== HERO SCROLL INDICATOR FADE ==========
  var scrollIndicator = document.querySelector('.hero-scroll-indicator');

  if (scrollIndicator) {
    window.addEventListener('scroll', function () {
      var opacity = Math.max(0, 1 - (window.scrollY / 300));
      scrollIndicator.style.opacity = opacity;
    }, { passive: true });
  }

})();
