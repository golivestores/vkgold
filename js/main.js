/* =============================================
   Fluid Glass Clone — Main JS
   Uses original site's scroll architecture:
   body/html fixed + .scroll container
   ============================================= */

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

// ─── Scroll Setup: .scroll is the scroll container (matches original site) ───
const wrapper = document.querySelector('.scroll');
const content = wrapper ? wrapper.querySelector('.content') : null;

const lenis = new Lenis({
  wrapper: wrapper || window,
  content: content || document.documentElement,
});

// Connect Lenis → ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// Tell ScrollTrigger to use .scroll as the scroller
if (wrapper) {
  ScrollTrigger.scrollerProxy(wrapper, {
    scrollTop(value) {
      if (arguments.length) {
        wrapper.scrollTop = value;
      }
      return wrapper.scrollTop;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    pinType: 'transform'
  });

  ScrollTrigger.defaults({ scroller: wrapper });
}

const isMobile = () => window.innerWidth < 1024;

// ─── Init ───
document.addEventListener('DOMContentLoaded', () => {
  document.fonts.ready.then(() => {
    initIntro();
    initBaseHeadings();
    initHeroParallax();
    initProductCollection();
    initBannerShowroom();
    initFeaturedProjects();
    initReviews();
    initTikTokUGC();
    initBannerCTA();
    initFooter();
    initWhoWeServe();
    initOurCraft();
    initDesignCap();
    initSiteNav();
    initBestsellers();
    ScrollTrigger.refresh();
  });
});

/* ─── 0. INTRO ─── */
function initIntro() {
  const intro = document.querySelector('.intro');
  if (!intro) return;

  const overlay = intro.querySelector('.overlay');
  const logo = intro.querySelector('.logo');
  const brandmark = intro.querySelector('.brandmark');
  const cube = intro.querySelector('.cube');
  const shape = intro.querySelector('.shape');
  const wordmarkSvg = intro.querySelector('.wordmark-svg');
  const wordmarkPaths = wordmarkSvg ? wordmarkSvg.querySelectorAll('path') : [];
  const main = document.querySelector('main');

  lenis.stop();

  const tl = gsap.timeline({
    onComplete: () => {
      intro.style.display = 'none';
      lenis.start();
      ScrollTrigger.refresh();
    }
  });

  // Logo is the parent of brandmark+wordmark. Animate logo, not brandmark.
  tl.set(wordmarkPaths, { yPercent: 150 })
    .set(logo, { xPercent: 41, autoAlpha: 1 })
    .add(() => { if (cube) cube.classList.add('rotate'); }, 0);

  tl.fromTo(cube,
    { yPercent: 100, scale: 0 },
    { yPercent: 0, scale: 0.95, duration: 1.5, ease: 'power3.inOut' }
  )
  .add(() => { if (logo) logo.classList.add('mask'); }, 1.5);

  tl.to(logo, { xPercent: 0, duration: 1, ease: 'power3.inOut' }, 1.3)
    .to(cube, { xPercent: 100, yPercent: 50, duration: 1, ease: 'power3.inOut' }, '<')
    .to(wordmarkPaths, { yPercent: 0, stagger: 0.05, duration: 1, ease: 'power3.out' }, '<');

  tl.set(intro, { zIndex: 0 }, 2.2)
    .to(overlay, { opacity: 0.5, duration: 1.2, ease: 'power3.inOut' }, 2.2)
    .fromTo(main, { yPercent: 100 }, { yPercent: 0, duration: 1.2, ease: 'power3.inOut' }, 2.2);

  tl.to(logo, {
    y: -(window.innerHeight / 3), autoAlpha: 0,
    duration: 1.2, ease: 'power3.inOut'
  }, 2.3);

  const firstChild = main ? main.firstElementChild : null;
  if (firstChild) {
    tl.fromTo(firstChild,
      { scale: 1.1 },
      { scale: 1, duration: 1.2, ease: 'power3.inOut', willChange: 'transform' },
      2.6
    );
  }
  if (main) {
    tl.fromTo(main,
      { scale: isMobile() ? 0.9 : 0.8, rotate: 0.01 },
      { scale: 1, duration: 1.2, ease: 'power3.inOut', willChange: 'transform', clearProps: 'all' },
      '<'
    );
  }
}

/* ─── BaseHeading — SplitText Line Reveal ─── */
function initBaseHeadings() {
  const headings = document.querySelectorAll('.base-heading');
  headings.forEach((el, i) => {
    const split = new SplitText(el, {
      type: 'lines',
      linesClass: 'line',
      mask: 'lines'
    });

    gsap.set(split.lines, { yPercent: 200 });

    const delay = i === 0 ? 3 : 0;

    gsap.to(split.lines, {
      yPercent: 0,
      stagger: 0.1,
      duration: 1.5,
      delay: delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
      }
    });
  });
}

/* ─── 2. HOME HEADER — Hero Parallax ─── */
function initHeroParallax() {
  const section = document.querySelector('.home-header');
  if (!section) return;

  const indicator = section.querySelector('.indicator');
  const asset = section.querySelector('.asset');

  gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      scrub: true,
      start: 'top top',
      end: 'bottom top',
      trigger: section,
    }
  })
  .fromTo(indicator, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.1 }, 0)
  .fromTo(asset, { yPercent: 0 }, { yPercent: 50 }, 0);
}

/* ─── 4. PRODUCT COLLECTION — Parallax + Hover ─── */
function initProductCollection() {
  const section = document.querySelector('.product-collection');
  if (!section || isMobile()) return;

  const blocks = section.querySelectorAll('.block');
  const blocksContainer = section.querySelector('.blocks');

  if (blocks.length >= 3) {
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        scrub: true,
        start: 'top bottom',
        end: 'bottom top',
        trigger: blocksContainer,
      }
    })
    .fromTo(blocks[1], { yPercent: 50 }, { yPercent: 0 }, 0)
    .fromTo(blocks[2], { yPercent: -50 }, { yPercent: 0 }, 0);
  }

  blocks.forEach((block) => {
    const img = block.querySelector('img');
    if (!img) return;
    block.addEventListener('mouseenter', () => {
      gsap.to(img, { scale: 1.1, duration: 1, ease: 'power3.out' });
    });
    block.addEventListener('mouseleave', () => {
      gsap.to(img, { scale: 1, duration: 2, ease: 'power3.out' });
    });
  });
}

/* ─── 5. BANNER SHOWROOM — Split Enter ─── */
function initBannerShowroom() {
  const section = document.querySelector('.banner-showroom');
  if (!section || isMobile()) return;

  const colOne = section.querySelector('.content .column:first-child');
  const colTwo = section.querySelector('.content .column:last-child');
  const border = section.querySelector('.border');
  const background = section.querySelector('.background');

  const scale = window.innerWidth / 1600;

  gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      scrub: true,
      start: 'top top',
      end: 'bottom bottom',
      trigger: section,
    }
  })
  .fromTo(colOne, { x: scale * 65 }, { x: 0 }, 0)
  .fromTo(colTwo, { x: -scale * 65 }, { x: 0 }, 0)
  .fromTo(border, { scaleX: 0 }, { scaleX: 1 }, 0)
  .fromTo(background, { opacity: 0.7, scale: 0.55 }, { opacity: 0.3, scale: 1 }, 0);
}

/* ─── 6. FEATURED PROJECTS — Hover ─── */
function initFeaturedProjects() {
  const section = document.querySelector('.featured-projects');
  if (!section) return;

  section.querySelectorAll('.project').forEach((project) => {
    const img = project.querySelector('.image img');
    if (!img) return;
    project.addEventListener('mouseenter', () => {
      gsap.fromTo(img, { scale: 1.1 }, { scale: 1, duration: 1, ease: 'power3.out' });
    });
  });
}

/* ─── TIKTOK UGC — Scroll Animations + Arrow Nav ─── */
function initTikTokUGC() {
  const sec = document.querySelector('.tiktok-ugc');
  if (!sec) return;

  const rail = sec.querySelector('.tu-rail');
  const prevBtn = sec.querySelector('.tu-arrow.is-prev');
  const nextBtn = sec.querySelector('.tu-arrow.is-next');

  // Arrow scroll
  const scrollRail = (dir) => {
    if (!rail) return;
    const card = rail.querySelector('.tu-card');
    if (!card) return;
    const cardW = card.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(rail).gap) || 40;
    rail.scrollBy({ left: dir * (cardW + gap), behavior: 'smooth' });
  };
  if (prevBtn) prevBtn.addEventListener('click', () => scrollRail(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => scrollRail(1));

  const updateArrows = () => {
    if (!rail || !prevBtn || !nextBtn) return;
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    prevBtn.disabled = rail.scrollLeft <= 2;
    nextBtn.disabled = rail.scrollLeft >= maxScroll - 2;
  };
  if (rail) rail.addEventListener('scroll', updateArrows, { passive: true });
  requestAnimationFrame(updateArrows);

  // Entry animations
  const head = sec.querySelector('.tu-head');
  const stats = sec.querySelector('.tu-stats');
  const cards = sec.querySelectorAll('.tu-card');
  if (head) {
    gsap.set(head, { opacity: 0, y: 40 });
    gsap.to(head, { opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: sec, start: 'top 75%' } });
  }
  if (stats) {
    gsap.set(stats, { opacity: 0, y: 20 });
    gsap.to(stats, { opacity: 1, y: 0, duration: 1, delay: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: stats, start: 'top 85%' } });
  }
  if (cards.length) {
    gsap.set(cards, { opacity: 0, y: 50, scale: 0.96 });
    gsap.to(cards, { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: rail, start: 'top 82%' } });
  }
}

/* ─── 8. REVIEWS — Carousel with SplitText ─── */
function initReviews() {
  const section = document.querySelector('.reviews');
  if (!section) return;

  const blocks = section.querySelectorAll('.block');
  const blockquotes = section.querySelectorAll('.blockquote');
  const blocksContainer = section.querySelector('.blocks');
  const indicator = section.querySelector('.indicator');

  // Buttons are inside .arrow-nav — first button = prev, second = next
  const arrowNav = section.querySelector('.arrow-nav');
  const navButtons = arrowNav ? arrowNav.querySelectorAll('.button') : [];
  const prevBtn = navButtons[0] || null;
  const nextBtn = navButtons[1] || null;

  if (blocks.length === 0) return;

  // SplitText all blockquotes
  const splits = [];
  blockquotes.forEach((bq) => {
    splits.push(new SplitText(bq, { type: 'lines', linesClass: 'line', mask: 'lines' }));
  });

  // Calculate max height — temporarily make all blocks visible to measure
  blocks.forEach(b => { b.style.visibility = 'visible'; b.style.position = 'relative'; });
  let maxH = 0;
  blocks.forEach((b) => { if (b.offsetHeight > maxH) maxH = b.offsetHeight; });
  // Reset — only active block stays visible
  blocks.forEach((b, i) => {
    b.style.position = 'absolute';
    if (i === 0) {
      b.classList.add('is-active');
      b.style.visibility = 'inherit';
    } else {
      b.classList.remove('is-active');
      b.style.visibility = 'hidden';
    }
  });
  if (blocksContainer && maxH > 0) {
    blocksContainer.style.height = maxH + 'px';
    blocksContainer.style.position = 'relative';
  }

  let current = 0, animating = false;
  const total = blocks.length;

  const updateIndicator = () => {
    if (indicator) indicator.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
  };

  const goTo = (dir) => {
    if (animating) return;
    animating = true;
    const prev = current;
    current += dir;
    if (current < 0) current = total - 1;
    if (current >= total) current = 0;
    updateIndicator();

    // Show new block before animating
    blocks[current].style.visibility = 'inherit';

    gsap.fromTo(blocks[prev], { autoAlpha: 1 }, { autoAlpha: 0, ease: 'power3.inOut', onComplete: () => {
      blocks[prev].classList.remove('is-active');
      blocks[prev].style.visibility = 'hidden';
    }});

    blocks[current].classList.add('is-active');
    gsap.fromTo(blocks[current], { autoAlpha: 0 }, { autoAlpha: 1, ease: 'power3.inOut' });

    if (splits[current]) {
      gsap.fromTo(splits[current].lines,
        { yPercent: dir === 1 ? 200 : -200 },
        { yPercent: 0, stagger: dir === 1 ? 0.1 : -0.1, duration: 1.5, ease: 'power3.out',
          onComplete: () => { animating = false; }
        }
      );
    } else { animating = false; }
  };

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(1));
  updateIndicator();
}

/* ─── 9. BANNER CTA — SVG DrawSVG ─── */
function initBannerCTA() {
  const section = document.querySelector('.banner-cta');
  if (!section || isMobile()) return;

  const svgPaths = section.querySelectorAll('.banner-cta-svg .draw-path');
  if (svgPaths.length === 0) return;

  gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      scrub: true,
      start: 'top bottom',
      end: 'bottom top',
      trigger: section,
    }
  })
  .fromTo(svgPaths, { drawSVG: '0%' }, { drawSVG: '-100%' })
  .fromTo(svgPaths, { drawSVG: '100%' }, { drawSVG: '0%' });
}

/* ─── 10. FOOTER — Parallax + Scale ─── */
function initFooter() {
  const footer = document.querySelector('.footer');
  if (!footer) return;

  const container = footer.querySelector('.container');
  const bgImage = footer.querySelector('.background img');
  const logo = footer.querySelector('.logo');
  const wordmark = footer.querySelector('.wordmark');

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      scrub: true,
      start: 'top bottom',
      end: 'bottom bottom',
      trigger: footer,
      onEnter: () => document.body.classList.add('is-footer'),
      onLeaveBack: () => document.body.classList.remove('is-footer'),
    }
  });

  if (container) tl.fromTo(container, { yPercent: -50 }, { yPercent: 0, duration: 1 }, 0);
  if (bgImage) tl.fromTo(bgImage, { scale: 1 }, { scale: isMobile() ? 2 : 1.1, duration: 1 }, 0);
  if (logo) tl.fromTo(logo, { opacity: 0, pointerEvents: 'none' }, { opacity: 1, duration: 0.05, pointerEvents: 'all' }, 0.95);
  if (isMobile() && wordmark) tl.fromTo(wordmark, { maskPosition: '0% 50%' }, { duration: 1, maskPosition: '80% 50%' }, 0);
}

/* ─── MENU — Hamburger Open/Close ─── */
/* ─── SITE NAV — E-commerce Mega Menu + Sticky + Mobile Drawer ─── */
function initSiteNav() {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;

  // Coordinated fade-in with intro timeline (intro wraps ~3.4s)
  gsap.fromTo(nav,
    { opacity: 0, y: -20 },
    {
      opacity: 1, y: 0, duration: 1.1, delay: 2.8, ease: 'power3.out',
      clearProps: 'y,transform',
      onComplete: () => nav.classList.add('is-ready')
    }
  );

  // Scroll-hide + sticky — hide on scroll down, reveal on scroll up
  let lastScrollY = 0;
  let ticking = false;
  const updateNav = (scrollY) => {
    const delta = scrollY - lastScrollY;

    // Sticky background
    nav.classList.toggle('is-sticky', scrollY > 80);

    // Don't hide when mega or drawer is open
    if (nav.classList.contains('is-mega-open') || nav.classList.contains('is-drawer-open')) {
      nav.classList.remove('is-hidden');
    } else if (scrollY > 220 && delta > 6) {
      nav.classList.add('is-hidden');
    } else if (delta < -6 || scrollY < 120) {
      nav.classList.remove('is-hidden');
    }

    lastScrollY = scrollY;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => updateNav(window.scrollY || 0));
      ticking = true;
    }
  }, { passive: true });

  if (typeof lenis !== 'undefined' && lenis && lenis.on) {
    lenis.on('scroll', ({ scroll }) => updateNav(scroll));
  }

  // Mega menu hover (desktop)
  const items = nav.querySelectorAll('.sn-item[data-mega]');
  let openTimer = null, closeTimer = null, activeItem = null;

  const closeMega = () => {
    if (!activeItem) { nav.classList.remove('is-mega-open'); return; }
    activeItem.classList.remove('is-open');
    const panel = nav.querySelector('.sn-mega[data-mega-panel="' + activeItem.dataset.mega + '"]');
    if (panel) panel.classList.remove('is-open');
    activeItem = null;
    nav.classList.remove('is-mega-open');
  };

  const openMega = (item) => {
    clearTimeout(closeTimer);
    if (activeItem && activeItem !== item) {
      activeItem.classList.remove('is-open');
      const prev = nav.querySelector('.sn-mega[data-mega-panel="' + activeItem.dataset.mega + '"]');
      if (prev) prev.classList.remove('is-open');
    }
    item.classList.add('is-open');
    const panel = nav.querySelector('.sn-mega[data-mega-panel="' + item.dataset.mega + '"]');
    if (panel) panel.classList.add('is-open');
    activeItem = item;
    nav.classList.add('is-mega-open');
  };

  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      clearTimeout(closeTimer);
      openTimer = setTimeout(() => openMega(item), 70);
    });
    item.addEventListener('mouseleave', () => {
      clearTimeout(openTimer);
      closeTimer = setTimeout(closeMega, 220);
    });
    // Also open on focus (keyboard)
    const btn = item.querySelector('.sn-link');
    if (btn) {
      btn.addEventListener('focus', () => openMega(item));
    }
  });

  // Keep mega open while hovering the panel
  nav.querySelectorAll('.sn-mega').forEach(panel => {
    panel.addEventListener('mouseenter', () => clearTimeout(closeTimer));
    panel.addEventListener('mouseleave', () => {
      clearTimeout(openTimer);
      closeTimer = setTimeout(closeMega, 220);
    });
  });

  // Close mega on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMega();
  });

  // Mobile drawer toggle
  const burger = nav.querySelector('.sn-burger');
  if (burger) {
    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-drawer-open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (typeof lenis !== 'undefined' && lenis) {
        if (isOpen) lenis.stop(); else lenis.start();
      }
    });
  }

  // Drawer accordion
  nav.querySelectorAll('.sn-drawer-item > .sn-drawer-head').forEach(head => {
    // Only wire up accordion toggles for heads that have a body sibling
    const item = head.parentElement;
    const body = item.querySelector('.sn-drawer-body');
    if (!body) return;
    head.addEventListener('click', (e) => {
      e.preventDefault();
      const willOpen = !item.classList.contains('is-open');
      nav.querySelectorAll('.sn-drawer-item.is-open').forEach(i => i.classList.remove('is-open'));
      if (willOpen) item.classList.add('is-open');
    });
  });
}

/* ─── BESTSELLERS — Tabbed Carousel ─── */
function initBestsellers() {
  const sec = document.querySelector('.bestsellers');
  if (!sec) return;

  const tabs = sec.querySelectorAll('.bs-tab');
  const rails = sec.querySelectorAll('.bs-rail');
  const prevBtn = sec.querySelector('.bs-arrow.is-prev');
  const nextBtn = sec.querySelector('.bs-arrow.is-next');

  // Tab switching
  const switchTab = (target) => {
    const oldRail = sec.querySelector('.bs-rail.is-active');
    const newRail = sec.querySelector('.bs-rail[data-rail="' + target + '"]');
    if (!newRail || oldRail === newRail) return;

    tabs.forEach(t => t.classList.toggle('is-active', t.dataset.tab === target));

    gsap.to(oldRail, { opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: () => {
      oldRail.classList.remove('is-active');
      newRail.classList.add('is-active');
      newRail.scrollLeft = 0;
      updateArrows();
      gsap.fromTo(newRail, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'power2.out' });
      gsap.fromTo(newRail.querySelectorAll('.bs-card'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.06, duration: 0.7, ease: 'power3.out' });
    }});
  };
  tabs.forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));

  // Arrow scroll
  const getActiveRail = () => sec.querySelector('.bs-rail.is-active');
  const scrollRail = (dir) => {
    const rail = getActiveRail();
    if (!rail) return;
    const card = rail.querySelector('.bs-card');
    if (!card) return;
    const cardW = card.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(rail).gap) || 40;
    rail.scrollBy({ left: dir * (cardW + gap), behavior: 'smooth' });
  };
  if (prevBtn) prevBtn.addEventListener('click', () => scrollRail(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => scrollRail(1));

  // Arrow disabled state
  const updateArrows = () => {
    const rail = getActiveRail();
    if (!rail || !prevBtn || !nextBtn) return;
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    prevBtn.disabled = rail.scrollLeft <= 2;
    nextBtn.disabled = rail.scrollLeft >= maxScroll - 2;
  };
  rails.forEach(r => r.addEventListener('scroll', updateArrows, { passive: true }));
  requestAnimationFrame(updateArrows);

  // Entry animation
  const heading = sec.querySelector('.bs-head');
  const toolbar = sec.querySelector('.bs-toolbar');
  if (heading) {
    gsap.set(heading, { opacity: 0, y: 40 });
    gsap.to(heading, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: sec, start: 'top 78%' }
    });
  }
  if (toolbar) {
    gsap.set(toolbar, { opacity: 0, y: 20 });
    gsap.to(toolbar, {
      opacity: 1, y: 0, duration: 1, delay: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: sec, start: 'top 78%' }
    });
  }
  const firstRail = sec.querySelector('.bs-rail.is-active');
  if (firstRail) {
    const cards = firstRail.querySelectorAll('.bs-card');
    gsap.set(cards, { opacity: 0, y: 50 });
    gsap.to(cards, {
      opacity: 1, y: 0, stagger: 0.08, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: firstRail, start: 'top 82%' }
    });
  }
}

/* ─── WHO WE SERVE — Client Personas Grid ─── */
function initWhoWeServe() {
  const section = document.querySelector('.who-we-serve');
  if (!section) return;

  const heading = section.querySelector('.wws-heading');
  const cards = section.querySelectorAll('.wws-card');

  // Heading fade in
  if (heading) {
    gsap.set(heading, { opacity: 0, y: 40 });
    gsap.to(heading, {
      opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: heading, start: 'top 85%' }
    });
  }

  // Cards stagger fade in
  if (cards.length > 0) {
    gsap.set(cards, { opacity: 0, y: 40 });
    gsap.to(cards, {
      opacity: 1, y: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: section.querySelector('.wws-grid'), start: 'top 85%' }
    });
  }
}

/* ─── OUR CRAFT — Horizontal Timeline (pin + translate) ─── */
function initOurCraft() {
  const section = document.querySelector('.our-craft');
  if (!section) return;

  const heading = section.querySelector('.oc-heading');
  const pin = section.querySelector('.oc-pin');
  const strip = section.querySelector('.oc-strip');
  const dots = section.querySelectorAll('.oc-dot');

  // Heading fade in
  if (heading) {
    gsap.set(heading, { opacity: 0, y: 40 });
    gsap.to(heading, {
      opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: heading, start: 'top 85%' }
    });
  }

  if (!pin || !strip) return;

  // Calculate how far to scroll horizontally
  const getScrollAmount = () => strip.scrollWidth - pin.offsetWidth;

  // Main horizontal scroll with pin
  const tl = gsap.to(strip, {
    x: () => -getScrollAmount(),
    ease: 'none',
    scrollTrigger: {
      trigger: pin,
      start: 'top 10%',
      end: () => '+=' + getScrollAmount(),
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true
    }
  });

  // Dots pop in as they enter viewport
  dots.forEach(dot => {
    gsap.set(dot, { scale: 0 });
    gsap.to(dot, {
      scale: 1, duration: 0.4, ease: 'back.out(2)',
      scrollTrigger: {
        trigger: dot,
        containerAnimation: tl,
        start: 'left 80%',
        toggleActions: 'play none none none'
      }
    });
  });
}

/* ─── DESIGN CAPABILITY — Team + Stats + Marquees ─── */
function initDesignCap() {
  const section = document.querySelector('.design-cap');
  if (!section) return;

  const heading = section.querySelector('.dc-heading');
  const members = section.querySelectorAll('.dc-member');
  const stats = section.querySelectorAll('.dc-stat');
  const statNumbers = section.querySelectorAll('.dc-stat-number');

  // Heading fade in
  if (heading) {
    gsap.set(heading, { opacity: 0, y: 40 });
    gsap.to(heading, {
      opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: heading, start: 'top 85%' }
    });
  }

  // Team members stagger
  if (members.length > 0) {
    gsap.set(members, { opacity: 0, y: 30 });
    gsap.to(members, {
      opacity: 1, y: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: section.querySelector('.dc-team'), start: 'top 85%' }
    });
  }

  // Stats count up
  if (statNumbers.length > 0) {
    gsap.set(stats, { opacity: 0, y: 30 });
    ScrollTrigger.create({
      trigger: section.querySelector('.dc-stats'),
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(stats, { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' });
        statNumbers.forEach(el => {
          const target = parseInt(el.getAttribute('data-count'));
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target, duration: 2, ease: 'power2.out',
            onUpdate: () => { el.textContent = Math.round(obj.val) + '+'; }
          });
        });
      }
    });
  }
}

/* ─── i18n content dictionary (English only) ─── */
const i18n = {
  cta_button: { en: 'Chat on WhatsApp' },
  hero_heading: { en: 'Hand-painted Thangka masterpieces by Regong lineage artists. Each piece carries centuries of Buddhist tradition and the purest gold.' },
  hero_title: { en: 'Sacred Art, Crafted in Gold' },
  hero_text: { en: 'We design, craft and deliver museum-quality Thangka paintings and pure gold cultural products. Every piece reflects centuries of Buddhist tradition, handmade by master artists from Regong, Qinghai.' },
  about_title: { en: 'About VKGold' },
  about_heading: { en: 'Where ancient Buddhist artistry meets cutting-edge precious metal technology. From hand-painted Thangka scrolls by Regong lineage masters to silver foil crafted with PVD sputtering precision — born in Shenzhen, trusted across Southeast Asia.' },
  about_button: { en: 'Our Story' },
  product_title: { en: 'Our Collections' },
  product_button: { en: 'View All Products' },
  product_1: { en: 'Nine Bodhisattva Thangka' },
  product_2: { en: 'Wisdom & Success' },
  product_3: { en: 'Wealth & Prosperity' },
  product_4: { en: 'Love & Protection' },
  factory_title: { en: 'Handcrafted, Never Mass-Produced' },
  factory_heading: { en: 'Every piece is shaped entirely by hand — from sacred preparation rituals to grinding natural mineral pigments, laying 24K gold leaf stroke by stroke, and the revered eye-opening ceremony. Created by Regong masters Quzhi and Zhaxijiancuo, UNESCO Intangible Heritage lineage holders.' },
  factory_address: { en: 'Regong, Qinghai — UNESCO Intangible Heritage' },
  factory_button: { en: 'See the Process' },
  projects_title: { en: 'The Nine Bodhisattvas' },
  projects_heading: { en: 'Nine masterpieces by UNESCO-listed Regong masters Quzhi and Zhaxijiancuo. Each sacred scroll painting — or Thangka — carries a unique blessing of compassion, wisdom and protection. A rare union of art, devotion and heritage.' },
  projects_button: { en: 'Explore Full Collection' },
  wws_title: { en: 'Why VKGold' },
  wws_heading: { en: 'Sacred art deserves the highest standard — from the artist\'s hand to your home.' },
  reviews_title: { en: 'What Our Collectors Say' },
  cta_title: { en: 'For Business' },
  cta_heading: { en: 'Bespoke Cultural Gifts for Your Brand' },
  cta_button_1: { en: 'View Custom Projects' },
  dc_title: { en: 'Our Capability' },
  dc_heading: { en: 'A world-class factory with 60+ craftsmen, trusted by China\'s top brands and banks.' },
};
