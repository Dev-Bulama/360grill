/**
 * 360 GRILL — Luxury Micro-interactions
 * Lightweight vanilla JS for premium feel
 */
(function () {
  'use strict';

  /* -------------------------------------------------------------------------
     1. NAVBAR SCROLL EFFECT
     Adds .lux-scrolled when page scrolls past 60px
  ------------------------------------------------------------------------- */
  function initNavbarScroll() {
    var threshold = 60;
    var ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(function () {
          var sections = document.querySelectorAll(
            '.brz-mm-navbar-sticky, .brz-section:first-of-type'
          );
          var scrolled = window.scrollY > threshold;
          sections.forEach(function (el) {
            el.classList.toggle('lux-scrolled', scrolled);
          });
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on init
  }

  /* -------------------------------------------------------------------------
     2. SCROLL ENTRANCE ANIMATIONS
     IntersectionObserver adds .lux-visible to .lux-fade-up / .lux-fade-in
  ------------------------------------------------------------------------- */
  function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything immediately
      document.querySelectorAll('.lux-fade-up, .lux-fade-in').forEach(function (el) {
        el.classList.add('lux-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('lux-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.lux-fade-up, .lux-fade-in').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* -------------------------------------------------------------------------
     3. AUTO-APPLY ANIMATION CLASSES TO KEY SECTIONS
     Sprinkles .lux-fade-up on Brizy section children without touching HTML
  ------------------------------------------------------------------------- */
  function applyAnimationClasses() {
    // Animate section wrappers
    var wrappers = document.querySelectorAll(
      '.brz .brz-wrapper, .brz .brz-column > .brz-column__items'
    );
    var seen = 0;
    wrappers.forEach(function (el) {
      // Don't animate nav or first hero-area elements
      if (el.closest('.brz-mm-navbar-sticky')) return;
      if (seen > 120) return; // cap to avoid too many observers
      el.classList.add('lux-fade-up');
      seen++;
    });

    // Rich text blocks
    document.querySelectorAll('.brz .brz-rich-text').forEach(function (el) {
      if (!el.closest('.brz-mm-navbar-sticky')) {
        el.classList.add('lux-fade-in');
      }
    });
  }

  /* -------------------------------------------------------------------------
     4. SMOOTH HOVER LIFT ON IMAGE PARENTS
     Adds CSS class for transform lift instead of relying only on CSS
  ------------------------------------------------------------------------- */
  function initImageHover() {
    var images = document.querySelectorAll('.brz .brz-image--withHover');
    images.forEach(function (img) {
      img.addEventListener('mouseenter', function () {
        this.style.willChange = 'transform, box-shadow';
      });
      img.addEventListener('mouseleave', function () {
        this.style.willChange = '';
      });
    });
  }

  /* -------------------------------------------------------------------------
     5. NAV SECTION DARK BACKGROUND ENFORCEMENT
     Finds the first Brizy section (navbar) and forces dark background
  ------------------------------------------------------------------------- */
  function enforceNavDark() {
    // The sticky nav section bg-color div
    var navBgColors = document.querySelectorAll(
      '.brz-mm-navbar-sticky .brz-bg-color, .brz-mm-navbar-sticky .brz-bg'
    );
    navBgColors.forEach(function (el) {
      el.style.backgroundColor = '#0a0a0a';
    });

    // All sections that CONTAIN the nav menu container
    var menuContainers = document.querySelectorAll('.brz-css-d-menu-menu-container');
    menuContainers.forEach(function (mc) {
      var section = mc.closest('.brz-section');
      if (section) {
        var bgColor = section.querySelector('.brz-bg-color');
        if (bgColor) {
          bgColor.style.backgroundColor = 'rgba(10,10,10,0.97)';
        }
      }
    });
  }

  /* -------------------------------------------------------------------------
     6. ACTIVE NAV LINK HIGHLIGHT
     Checks current URL and marks matching nav item
  ------------------------------------------------------------------------- */
  function markActiveNavItem() {
    var currentPath = window.location.pathname.replace(/\/$/, '') || '/';
    var navLinks = document.querySelectorAll('.brz .brz-menu__ul .brz-menu__item .brz-a');
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var linkPath = href.replace(/\/$/, '');
      if (linkPath === currentPath || (currentPath === '/' && linkPath === '')) {
        link.closest('.brz-menu__item').classList.add('brz-menu__item--current');
      }
    });
  }

  /* -------------------------------------------------------------------------
     7. BUTTON RIPPLE EFFECT
     Adds a luxury ripple on button click
  ------------------------------------------------------------------------- */
  function initButtonRipple() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.brz-btn');
      if (!btn) return;

      var ripple = document.createElement('span');
      var rect = btn.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height) * 2;
      var x = e.clientX - rect.left - size / 2;
      var y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = [
        'position:absolute',
        'width:' + size + 'px',
        'height:' + size + 'px',
        'left:' + x + 'px',
        'top:' + y + 'px',
        'background:rgba(255,255,255,0.22)',
        'border-radius:50%',
        'transform:scale(0)',
        'animation:lux-ripple 0.55s ease-out',
        'pointer-events:none',
        'z-index:9'
      ].join(';');

      // Ensure button has relative positioning
      if (getComputedStyle(btn).position === 'static') {
        btn.style.position = 'relative';
      }
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);

      ripple.addEventListener('animationend', function () {
        ripple.remove();
      });
    });

    // Inject ripple keyframe
    if (!document.getElementById('lux-ripple-style')) {
      var style = document.createElement('style');
      style.id = 'lux-ripple-style';
      style.textContent = '@keyframes lux-ripple{to{transform:scale(1);opacity:0}}';
      document.head.appendChild(style);
    }
  }

  /* -------------------------------------------------------------------------
     8. SECTION FADE-IN NAVBAR TRIGGER
     When sticky nav section becomes sticky, add glass effect
  ------------------------------------------------------------------------- */
  function initStickyNavObserver() {
    var stickyNav = document.querySelector('.brz-mm-navbar-sticky');
    if (!stickyNav) return;

    // Use scroll position instead of IntersectionObserver for sticky
    window.addEventListener('scroll', function () {
      if (window.scrollY > 80) {
        stickyNav.classList.add('lux-scrolled');
      } else {
        stickyNav.classList.remove('lux-scrolled');
      }
    }, { passive: true });
  }

  /* -------------------------------------------------------------------------
     9. MOBILE MENU SMOOTHNESS
     Ensures mobile menu has smooth open/close transition
  ------------------------------------------------------------------------- */
  function initMobileMenuSmooth() {
    var menuBtn = document.querySelector('.brz-mm-menu__icon');
    if (menuBtn) {
      menuBtn.addEventListener('click', function () {
        document.body.style.transition = 'margin-left 0.3s ease';
      });
    }
  }

  /* -------------------------------------------------------------------------
     INIT — Run on DOMContentLoaded
  ------------------------------------------------------------------------- */
  function init() {
    initNavbarScroll();
    enforceNavDark();
    markActiveNavItem();
    applyAnimationClasses();
    initScrollAnimations();
    initImageHover();
    initButtonRipple();
    initStickyNavObserver();
    initMobileMenuSmooth();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-run animation observer after Brizy lazy-loads content
  window.addEventListener('load', function () {
    applyAnimationClasses();
    initScrollAnimations();
    enforceNavDark();
    initNewsletterPopup();
    enhanceMegaMenu();
    enhanceFloatingButton();
    enforceFooterDark();
  });

  /* -------------------------------------------------------------------------
     10. NEWSLETTER POPUP — SMART TIMING
     Shows popup after 8s (not immediately), respects session dismissal
  ------------------------------------------------------------------------- */
  function initNewsletterPopup() {
    var DISMISS_KEY = 'lux_newsletter_dismissed';
    var dismissed = sessionStorage.getItem(DISMISS_KEY);

    // If already dismissed this session, don't show
    if (dismissed) return;

    // Watch for Brizy to show the popup and apply our dark theme
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType === 1) {
            var popup = node.classList && node.classList.contains('brz-popup2__open')
              ? node
              : node.querySelector && node.querySelector('.brz-popup2__open');
            if (popup) {
              applyPopupDark(popup);
            }
          }
        });

        // Also check class changes on existing popups
        if (mutation.target && mutation.target.classList &&
            mutation.target.classList.contains('brz-popup2__open')) {
          applyPopupDark(mutation.target);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });

    // Close button adds session flag
    document.addEventListener('click', function (e) {
      if (e.target.closest('.brz-popup2__close')) {
        sessionStorage.setItem(DISMISS_KEY, '1');
      }
    });

    function applyPopupDark(el) {
      el.querySelectorAll('.newsletter-container, .newsletter-title, .newsletter-subtitle').forEach(function (item) {
        item.style.opacity = '1'; // ensure visible after animation
      });
    }
  }

  /* -------------------------------------------------------------------------
     11. MEGA MENU — ENHANCED BEHAVIOR
     Adds keyboard accessibility and smooth hover timing
  ------------------------------------------------------------------------- */
  function enhanceMegaMenu() {
    var megaMenuItems = document.querySelectorAll(
      '.brz-menu__item-dropdown, .brz-menu__item-mega-menu'
    );

    megaMenuItems.forEach(function (item) {
      var leaveTimer;

      item.addEventListener('mouseenter', function () {
        clearTimeout(leaveTimer);
        var dropdown = item.querySelector('.brz-menu__sub-menu, .brz-mega-menu__portal, .brz-mega-menu');
        if (dropdown) {
          dropdown.style.pointerEvents = 'auto';
          dropdown.style.visibility = 'visible';
        }
      });

      item.addEventListener('mouseleave', function () {
        leaveTimer = setTimeout(function () {
          var dropdown = item.querySelector('.brz-menu__sub-menu, .brz-mega-menu__portal, .brz-mega-menu');
          if (dropdown) {
            dropdown.style.pointerEvents = '';
          }
        }, 150);
      });
    });

    // Apply luxury class to all mega menu containers
    document.querySelectorAll('.brz-mega-menu, .brz-css-d-sectionmegamenu-section').forEach(function (mm) {
      mm.classList.add('lux-mega-menu');
    });

    // Style the mega menu buttons row for visual balance
    document.querySelectorAll('.brz-mega-menu .brz-container').forEach(function (container) {
      container.style.display = 'flex';
      container.style.alignItems = 'center';
      container.style.gap = '12px';
      container.style.padding = '24px 32px';
    });
  }

  /* -------------------------------------------------------------------------
     12. FLOATING ORDER NOW BUTTON — ENHANCE
     Removes old empty button element, enhances the anchor
  ------------------------------------------------------------------------- */
  function enhanceFloatingButton() {
    // Remove the empty <button class="floating-button"> (only the <a> should show)
    var emptyBtn = document.querySelector('button.floating-button');
    if (emptyBtn) emptyBtn.remove();

    var orderLink = document.querySelector('a.floating-button');
    if (!orderLink) return;

    // Ensure text content is clean
    var rawText = orderLink.textContent.trim();
    if (!rawText) {
      orderLink.textContent = 'Order Now';
    }

    // Add entrance animation delay
    orderLink.style.opacity = '0';
    orderLink.style.transform = 'translateX(20px)';
    setTimeout(function () {
      orderLink.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      orderLink.style.opacity = '1';
      orderLink.style.transform = 'translateX(0)';
    }, 1200);
  }

  /* -------------------------------------------------------------------------
     13. FOOTER DARK ENFORCEMENT
     Ensures footer sections always have dark backgrounds
  ------------------------------------------------------------------------- */
  function enforceFooterDark() {
    // Target footer sections by their Brizy class or id
    var footerSelectors = [
      '#sqOsAROgMJQM_sqOsAROgMJQM',
      '#x4ECJIGasRMR_x4ECJIGasRMR',
      '.brz-section.brz-css-17grw8k',
      '.brz-section.brz-css-46hh1n'
    ];

    footerSelectors.forEach(function (sel) {
      var el = document.querySelector(sel);
      if (!el) return;

      var bgColors = el.querySelectorAll('.brz-bg-color, .brz-bg');
      bgColors.forEach(function (bg) {
        if (sel.includes('46hh1n') || sel.includes('x4ECJIGasRMR')) {
          bg.style.backgroundColor = '#0a0a0a';
        } else {
          bg.style.backgroundColor = '#1a1a1a';
        }
      });
    });
  }
})();
