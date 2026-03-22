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
    initAssetsDuo();
    initReviews();
    initBannerCTA();
    initFooter();
    initWhoWeServe();
    initDesignCap();
    initMenu();
    initLangToggle();
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

/* ─── 7. ASSETS DUO — Parallax ─── */
function initAssetsDuo() {
  const section = document.querySelector('.assets-duo');
  if (!section || isMobile()) return;

  const container = section.querySelector('.container');
  const images = section.querySelectorAll('.block img');

  const setup = () => {
    images.forEach((img) => {
      if (img.clientHeight < container.clientHeight) {
        const diff = container.clientHeight - img.clientHeight;
        gsap.fromTo(img.parentElement,
          { y: 0 },
          {
            y: diff, ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            }
          }
        );
      }
    });
  };

  const allLoaded = Array.from(images).every(img => img.complete);
  if (allLoaded) { setup(); }
  else {
    let loaded = 0;
    images.forEach(img => {
      if (img.complete) { loaded++; }
      else { img.addEventListener('load', () => { loaded++; if (loaded >= images.length) setup(); }, { once: true }); }
    });
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

  const svgPaths = section.querySelectorAll('.banner-cta-svg path');
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
function initMenu() {
  const app = document.querySelector('.app');
  const burger = document.querySelector('.burger');
  const closeBtn = document.querySelector('.close');
  const menu = document.querySelector('.menu');
  const menuBg = menu ? menu.querySelector('.background') : null;
  const menuMasks = menu ? menu.querySelectorAll('.mask') : [];
  const menuButton = menu ? menu.querySelector('.base-button') : null;

  if (!app || !burger || !menu) return;

  let isOpen = false;

  const openMenu = () => {
    if (isOpen) return;
    isOpen = true;
    app.classList.add('is-overlay', 'is-menu');
    burger.parentElement.classList.add('menu-open');
    menu.style.visibility = 'visible';
    menu.style.pointerEvents = 'auto';
    lenis.stop();

    // Animate in
    gsap.fromTo(menuBg, { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: 'power3.inOut' });
    gsap.fromTo(menuMasks, { yPercent: 100 }, { yPercent: 0, stagger: 0.05, duration: 0.6, delay: 0.2, ease: 'power3.out' });
    if (menuButton) gsap.fromTo(menuButton, { yPercent: 100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6, delay: 0.4, ease: 'power3.out' });

    // Show close button, hide burger
    if (closeBtn) closeBtn.style.visibility = 'visible';
    burger.style.visibility = 'hidden';
  };

  const closeMenu = () => {
    if (!isOpen) return;
    isOpen = false;

    gsap.to(menuBg, { scaleY: 0, duration: 0.4, ease: 'power3.inOut', onComplete: () => {
      app.classList.remove('is-overlay', 'is-menu');
      burger.parentElement.classList.remove('menu-open');
      menu.style.visibility = 'hidden';
      menu.style.pointerEvents = 'none';
      if (closeBtn) closeBtn.style.visibility = 'hidden';
      burger.style.visibility = 'visible';
      lenis.start();
    }});
  };

  burger.addEventListener('click', (e) => { e.stopPropagation(); openMenu(); });
  if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeMenu(); });

  // Close when clicking outside menu
  app.addEventListener('click', (e) => {
    if (isOpen && !menu.contains(e.target) && !burger.contains(e.target)) {
      closeMenu();
    }
  });
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

/* ─── LANGUAGE TOGGLE — EN / 中 ─── */
const i18n = {
  cta_button: { en: 'Get in touch', cn: '联系我们' },
  hero_heading: { en: 'Acoustic elegance for spaces that inspire.', cn: '为每一个空间注入声学之美。' },
  hero_title: { en: 'Acoustic specialists', cn: '声学装饰专家' },
  hero_text: { en: 'We design, engineer and deliver integrated acoustic solutions for ambitious architectural projects. Every surface reflects our commitment to clarity, craft, and performance.', cn: '我们为高标准建筑项目提供从设计到落地的一站式声学解决方案。每一个界面都体现我们对品质、工艺与性能的极致追求。' },
  hero_scroll: { en: 'Scroll to explore', cn: '向下滚动探索' },
  about_title: { en: 'About NAAYA', cn: '关于 NAAYA' },
  about_heading: { en: 'We bring spaces to life through sound and design. Trusted by architects who demand precision, beauty, and acoustic excellence.', cn: '以声学赋予空间生命，以设计成就听觉美感。深受追求精准、美学与卓越声学表现的建筑师信赖。' },
  about_button: { en: 'Who we are', cn: '了解我们' },
  product_title: { en: 'Product collection', cn: '产品系列' },
  product_button: { en: 'Product overview', cn: '查看产品' },
  product_1: { en: 'Grooved Panel', cn: '槽孔吸音板' },
  product_2: { en: 'Uniseam Ceiling', cn: '无缝声学天花' },
  product_3: { en: 'Micro Panel', cn: '微穿孔吸音板' },
  product_4: { en: 'Perforated Panel', cn: '穿孔吸音板' },
  factory_title: { en: 'Factory', cn: '工厂' },
  factory_heading: { en: 'Where precision engineering meets acoustic innovation.', cn: '精密工程与声学创新的交汇之地。' },
  factory_label: { en: 'Location', cn: '地址' },
  factory_address: { en: 'Guangzhou, China', cn: '中国广州' },
  factory_button: { en: 'Our factory', cn: '参观工厂' },
  projects_title: { en: 'Featured projects', cn: '精选项目' },
  projects_heading: { en: 'Each project tells its own story of acoustic design and spatial harmony.', cn: '每一个项目都诉说着声学设计与空间和谐的独特故事。' },
  projects_button: { en: 'View projects', cn: '查看项目' },
  wws_title: { en: 'Who we serve', cn: '我们的客户' },
  wws_heading: { en: 'From concept to completion, we partner with every voice in the built environment.', cn: '从概念到落地，我们与建筑环境中的每一个角色携手共创。' },
  wws_1_title: { en: 'Property Owners', cn: '业主方' },
  wws_1_desc: { en: 'Visionaries who commission exceptional spaces', cn: '委托打造卓越空间的远见者' },
  wws_2_title: { en: 'Architects', cn: '建筑设计师' },
  wws_2_desc: { en: 'Design partners who shape the acoustic blueprint', cn: '塑造声学蓝图的设计伙伴' },
  wws_3_title: { en: 'MEP Consultants', cn: '机电顾问' },
  wws_3_desc: { en: 'Engineering allies ensuring seamless integration', cn: '确保无缝集成的工程盟友' },
  wws_4_title: { en: 'Acoustic Consultants', cn: '声学顾问' },
  wws_4_desc: { en: 'Specialists who define the sound of a space', cn: '定义空间之声的专业力量' },
  wws_5_title: { en: 'Interior Designers', cn: '室内设计师' },
  wws_5_desc: { en: 'Creatives who demand beauty and performance', cn: '追求美感与性能并重的创意伙伴' },
  wws_6_title: { en: 'General Contractors', cn: '建筑工程公司' },
  wws_6_desc: { en: 'Builders who deliver complex projects on time', cn: '按时交付复杂项目的建设者' },
  wws_7_title: { en: 'Fit-out Companies', cn: '装饰装修公司' },
  wws_7_desc: { en: 'Specialists in precision acoustic installation', cn: '精密声学安装的专业团队' },
  wws_8_title: { en: 'Acoustic Distributors', cn: '声学材料商' },
  wws_8_desc: { en: 'Partners extending our global reach', cn: '拓展全球市场的合作伙伴' },
  reviews_title: { en: 'Client stories', cn: '客户故事' },
  cta_title: { en: 'Where sound meets design', cn: '声学与设计的交汇' },
  cta_heading: { en: 'Every great space begins with listening', cn: '每一个伟大的空间都始于倾听' },
  cta_button_1: { en: 'Our approach', cn: '我们的方法' },
  dc_title: { en: 'Design capability', cn: '设计实力' },
  dc_heading: { en: 'A team built on decades of acoustic expertise, powered by world-class tools.', cn: '十余年声学经验沉淀，世界级工具赋能的专业团队。' },
};

let currentLang = 'en';

function initLangToggle() {
  const btn = document.querySelector('.lang-toggle');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentLang = currentLang === 'en' ? 'cn' : 'en';
    btn.textContent = currentLang === 'en' ? 'EN' : '中';
    applyLang();
  });
}

function applyLang() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[key] && i18n[key][currentLang]) {
      el.textContent = i18n[key][currentLang];
    }
  });
}
