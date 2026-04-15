/* =============================================
   VKGold — Product Detail Page JS
   Gallery, SKU switching, accordion, animations
   ============================================= */

// ─── Product Data ───
const PRODUCTS = {
  'wutai-dragon': {
    title: 'Wutai Dragon \u00b7 God of Wealth',
    subtitle: '99.9% Pure Gold Phone Blessing',
    badge: 'Pure Gold',
    badge2: 'Wealth & Prosperity',
    price: '$29.90',
    breadcrumb: 'Wutai Dragon',
    category: 'Prosperity',
    images: [
      'assets/products/phone-sticker-2.jpg',
      'assets/products/phone-charm-2.jpg',
      'assets/products/phone-sticker-1.jpg',
      'assets/products/phone-charm.jpg',
    ],
    wa: 'https://wa.me/65XXXXXXXX?text=Hi%2C%20I%27m%20interested%20in%20the%20Wutai%20Dragon%20Gold%20Blessing',
    desc: 'Invoke the Dragon King of Wutai Mountain \u2014 the most revered wealth deity in Chinese Buddhism. 99.9% pure gold on PVD silver foil, UV-sealed for lasting brilliance.',
  },
  'wudang-wenchang': {
    title: 'Wudang Wenchang \u00b7 Wisdom',
    subtitle: '99.9% Pure Gold Phone Blessing',
    badge: 'Pure Gold',
    badge2: 'Wisdom & Career',
    price: '$29.90',
    breadcrumb: 'Wudang Wenchang',
    category: 'Wisdom',
    images: [
      'assets/products/phone-sticker-1.jpg',
      'assets/products/phone-charm.jpg',
      'assets/products/phone-sticker-2.jpg',
      'assets/products/phone-charm-2.jpg',
    ],
    wa: 'https://wa.me/65XXXXXXXX?text=Hi%2C%20I%27m%20interested%20in%20the%20Wudang%20Wenchang%20Gold%20Blessing',
    desc: 'Channel Wenchang Dijun \u2014 celestial patron of literature and examinations from the sacred Wudang Mountains. 99.9% pure gold on PVD silver foil, UV-sealed for enduring protection.',
  },
  'zaki-ram': {
    title: 'Zaki Ram \u00b7 Love & Protection',
    subtitle: '99.9% Pure Gold Phone Blessing',
    badge: 'Pure Gold',
    badge2: 'Love & Protection',
    price: '$29.90',
    breadcrumb: 'Zaki Ram',
    category: 'Love',
    images: [
      'assets/products/zjlm-1.jpg',
      'assets/products/zjlm-2.jpg',
      'assets/products/zjlm-3.jpg',
      'assets/products/zjlm-4.jpg',
      'assets/products/zjlm-5.jpg',
    ],
    wa: 'https://wa.me/65XXXXXXXX?text=Hi%2C%20I%27m%20interested%20in%20the%20Zaki%20Ram%20Gold%20Blessing',
    desc: 'Embrace Zaki Ram (Tashi Lhamo) \u2014 the only female wealth deity in Tibetan Buddhism, fierce guardian of love, beauty, and protection. 99.9% pure gold on PVD silver foil, UV-sealed.',
  },
};

const SKU_KEYS = Object.keys(PRODUCTS);

// ─── Read SKU from URL ───
function getCurrentSku() {
  const params = new URLSearchParams(window.location.search);
  const sku = params.get('sku');
  return PRODUCTS[sku] ? sku : 'wutai-dragon';
}

// ─── Render Product ───
function renderProduct(sku) {
  const p = PRODUCTS[sku];
  if (!p) return;

  // Update page title
  document.title = p.title + ' \u2014 VKGold';

  // Breadcrumb
  const bc = document.getElementById('pdpBreadcrumbCurrent');
  if (bc) bc.textContent = p.breadcrumb;

  // Product info
  const badge = document.getElementById('pdpBadge');
  const title = document.getElementById('pdpTitle');
  const subtitle = document.getElementById('pdpSubtitle');
  const price = document.getElementById('pdpPrice');
  const waBtn = document.getElementById('pdpWhatsApp');

  if (badge) {
    badge.textContent = p.badge;
    // Add badge2 if exists
    var existingBadge2 = document.getElementById('pdpBadge2');
    if (existingBadge2) existingBadge2.remove();
    if (p.badge2) {
      var b2 = document.createElement('div');
      b2.className = 'pdp-badge pdp-badge2';
      b2.id = 'pdpBadge2';
      b2.textContent = p.badge2;
      badge.parentNode.insertBefore(b2, badge.nextSibling);
    }
  }
  if (title) title.textContent = p.title;
  if (subtitle) subtitle.textContent = p.subtitle;
  if (price) price.textContent = p.price;
  if (waBtn) waBtn.href = p.wa;
  var descEl = document.getElementById('pdpDesc');
  if (descEl) descEl.textContent = p.desc;

  // Gallery
  renderGallery(p.images, p.title);

  // Design selector
  renderDesignSelector(sku);

  // Recommendations
  renderRecommendations(sku);
}

// ─── Gallery ───
let currentImageIndex = 0;

function renderGallery(images, alt) {
  const thumbsContainer = document.getElementById('pdpThumbs');
  const mainPhoto = document.getElementById('pdpMainPhoto');
  if (!thumbsContainer || !mainPhoto) return;

  thumbsContainer.innerHTML = '';
  currentImageIndex = 0;

  images.forEach(function(src, i) {
    var thumb = document.createElement('div');
    thumb.className = 'pdp-thumb' + (i === 0 ? ' is-active' : '');
    thumb.innerHTML = '<img src="' + src + '" alt="' + alt + ' view ' + (i + 1) + '" loading="lazy">';
    thumb.addEventListener('click', function() {
      setMainImage(i, images, alt);
    });
    thumbsContainer.appendChild(thumb);
  });

  mainPhoto.src = images[0];
  mainPhoto.alt = alt;
}

function setMainImage(index, images, alt) {
  var mainPhoto = document.getElementById('pdpMainPhoto');
  var thumbs = document.querySelectorAll('.pdp-thumb');
  if (!mainPhoto) return;

  currentImageIndex = index;

  // Fade transition
  mainPhoto.style.opacity = '0';
  setTimeout(function() {
    mainPhoto.src = images[index];
    mainPhoto.alt = alt + ' view ' + (index + 1);
    mainPhoto.style.opacity = '1';
  }, 200);

  thumbs.forEach(function(t, i) {
    t.classList.toggle('is-active', i === index);
  });
}

// ─── Zoom Modal ───
function initZoom() {
  var mainImg = document.getElementById('pdpMainImg');
  var zoom = document.getElementById('pdpZoom');
  var zoomImg = document.getElementById('pdpZoomImg');
  var closeBtn = zoom ? zoom.querySelector('.pdp-zoom-close') : null;
  if (!mainImg || !zoom || !zoomImg) return;

  mainImg.addEventListener('click', function() {
    var photo = document.getElementById('pdpMainPhoto');
    if (!photo) return;
    zoomImg.src = photo.src;
    zoomImg.alt = photo.alt;
    zoom.classList.add('is-open');
    if (typeof lenis !== 'undefined' && lenis) lenis.stop();
  });

  function closeZoom() {
    zoom.classList.remove('is-open');
    if (typeof lenis !== 'undefined' && lenis) lenis.start();
  }

  zoom.addEventListener('click', function(e) {
    if (e.target === zoom || e.target === zoomImg) closeZoom();
  });
  if (closeBtn) closeBtn.addEventListener('click', closeZoom);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && zoom.classList.contains('is-open')) closeZoom();
  });
}

// ─── Design Selector ───
function renderDesignSelector(activeSku) {
  var container = document.getElementById('pdpDesigns');
  if (!container) return;
  container.innerHTML = '';

  SKU_KEYS.forEach(function(sku) {
    var p = PRODUCTS[sku];
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pdp-design-btn' + (sku === activeSku ? ' is-active' : '');
    btn.textContent = p.breadcrumb;
    btn.addEventListener('click', function() {
      window.location.href = 'product.html?sku=' + sku;
    });
    container.appendChild(btn);
  });
}

// ─── Quantity ───
function initQuantity() {
  var input = document.getElementById('pdpQtyInput');
  var minus = document.getElementById('pdpQtyMinus');
  var plus = document.getElementById('pdpQtyPlus');
  if (!input || !minus || !plus) return;

  minus.addEventListener('click', function() {
    var val = parseInt(input.value) || 1;
    if (val > 1) input.value = val - 1;
  });
  plus.addEventListener('click', function() {
    var val = parseInt(input.value) || 1;
    if (val < 99) input.value = val + 1;
  });
}

// ─── Accordion ───
function initAccordion() {
  document.querySelectorAll('.pdp-acc-head').forEach(function(head) {
    head.addEventListener('click', function() {
      var item = head.parentElement;
      var wasOpen = item.classList.contains('is-open');
      // Close all
      document.querySelectorAll('.pdp-acc-item.is-open').forEach(function(i) {
        i.classList.remove('is-open');
      });
      // Toggle clicked
      if (!wasOpen) item.classList.add('is-open');
    });
  });
}

// ─── Recommendations ───
var RECO_EXTRAS = [
  { title: 'Five Directional Wealth Deities', category: 'Wealth Deity', sub: 'Thangka', badge: '24K Gold', price: '$1,800', img: 'assets/products/thangka-gold.jpg', desc: 'Five wealth gods united in one consecrated painting \u2014 prosperity drawn from every direction.', href: 'index.html#projects' },
  { title: 'White Tara', category: 'Compassion', sub: 'Thangka', badge: '24K Gold', price: '$1,800', img: 'assets/products/thangka-green.jpg', desc: 'The mother of all Buddhas \u2014 bestows longevity, healing and fearless compassion.', href: 'index.html#projects' },
  { title: 'Yellow Jambhala', category: 'Wealth Deity', sub: 'Thangka', badge: '24K Gold', price: '$1,800', img: 'assets/products/thangka-color.jpg', desc: 'Lord of wealth in Tibetan Buddhism \u2014 clutching a mongoose that spits gems.', href: 'index.html#projects' },
  { title: 'Four-Armed Avalokiteshvara', category: 'Protector', sub: 'Thangka', badge: '24K Gold', price: '$1,800', img: 'assets/products/bodhisattva-1.jpg', desc: 'Embodiment of infinite compassion with four arms embracing all beings.', href: 'index.html#projects' },
];

function buildCard(item) {
  var card = document.createElement('a');
  card.className = 'bs-card';
  card.href = item.href;
  card.innerHTML =
    '<div class="bs-card-media">' +
      '<img src="' + item.img + '" alt="' + item.title + '" loading="lazy">' +
      '<div class="bs-badge">' + item.badge + '</div>' +
    '</div>' +
    '<div class="bs-card-body">' +
      '<div class="bs-card-meta"><span>' + item.category + '</span><span class="bs-card-dot">\u00b7</span><span class="bs-card-sub">' + item.sub + '</span></div>' +
      '<h3 class="bs-card-name">' + item.title + '</h3>' +
      '<p class="bs-card-desc">' + item.desc + '</p>' +
      '<div class="bs-card-foot">' +
        '<div class="bs-card-price">From <strong>' + item.price + '</strong></div>' +
        '<span class="bs-card-cta">Shop Now \u2192</span>' +
      '</div>' +
    '</div>';
  return card;
}

function renderRecommendations(activeSku) {
  var rail = document.getElementById('pdpRecoRail');
  if (!rail) return;
  rail.innerHTML = '';

  // Other blessings first
  SKU_KEYS.forEach(function(sku) {
    if (sku === activeSku) return;
    var p = PRODUCTS[sku];
    rail.appendChild(buildCard({
      title: p.title, category: p.category, sub: 'Phone Sticker',
      badge: p.badge, price: p.price, img: p.images[0], desc: p.desc,
      href: 'product.html?sku=' + sku
    }));
  });

  // Then thangka products
  RECO_EXTRAS.forEach(function(item) {
    rail.appendChild(buildCard(item));
  });
}

// ─── GSAP Animations ───
function initPdpAnimations() {
  if (typeof gsap === 'undefined') return;

  // Hero entry — immediate, no scroll trigger
  gsap.fromTo('.pdp-breadcrumb', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' });
  gsap.fromTo('.pdp-gallery', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: 'power3.out' });
  gsap.fromTo('.pdp-info', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, delay: 0.45, ease: 'power3.out' });

  // Accordion — stagger on scroll
  gsap.set('.pdp-acc-item', { opacity: 0, y: 20 });
  gsap.to('.pdp-acc-item', {
    opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '.pdp-accordion', start: 'top 80%' }
  });

  // Brand story
  var storyHeading = document.querySelector('.pdp-story-heading');
  if (storyHeading && typeof SplitText !== 'undefined') {
    var split = new SplitText(storyHeading, { type: 'lines', linesClass: 'line', mask: 'lines' });
    gsap.set(split.lines, { yPercent: 200 });
    gsap.to(split.lines, {
      yPercent: 0, stagger: 0.1, duration: 1.5, ease: 'power3.out',
      scrollTrigger: { trigger: '.pdp-story', start: 'top 75%' }
    });
  }

  gsap.set('.pdp-story-eyebrow', { opacity: 0, y: 20 });
  gsap.to('.pdp-story-eyebrow', {
    opacity: 1, y: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.pdp-story', start: 'top 80%' }
  });

  var storyImgs = document.querySelectorAll('.pdp-story-images img');
  if (storyImgs.length) {
    gsap.set(storyImgs, { opacity: 0, y: 40, scale: 0.96 });
    gsap.to(storyImgs, {
      opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.pdp-story-images', start: 'top 80%' }
    });
  }

  gsap.set('.pdp-story-text', { opacity: 0, y: 20 });
  gsap.to('.pdp-story-text', {
    opacity: 1, y: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.pdp-story-text', start: 'top 85%' }
  });

  // Meanings parallax
  document.querySelectorAll('.pdp-meaning-card').forEach(function(card, i) {
    var img = card.querySelector('img');
    var body = card.querySelector('.pdp-meaning-body');
    var tag = card.querySelector('.pdp-meaning-tag');
    var name = card.querySelector('.pdp-meaning-name');
    var desc = card.querySelector('.pdp-meaning-desc');
    var isEven = i % 2 === 1;

    if (img) {
      // Image parallax: slides up slower than scroll
      gsap.fromTo(img,
        { yPercent: 20, scale: 1.08 },
        { yPercent: -10, scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1 }
        }
      );
      // Image fade in
      gsap.fromTo(img,
        { opacity: 0, x: isEven ? 60 : -60 },
        { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 85%' }
        }
      );
    }

    // Text content stagger
    if (tag) {
      gsap.fromTo(tag,
        { opacity: 0, x: isEven ? -30 : 30 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 80%' }
        }
      );
    }
    if (name) {
      gsap.fromTo(name,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 80%' }
        }
      );
    }
    if (desc) {
      gsap.fromTo(desc,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 80%' }
        }
      );
    }
  });

  // Recommendations
  var recoCards = document.querySelectorAll('.pdp-reco-rail .bs-card');
  if (recoCards.length) {
    gsap.set(recoCards, { opacity: 0, y: 40 });
    gsap.to(recoCards, {
      opacity: 1, y: 0, stagger: 0.1, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.pdp-reco-rail', start: 'top 82%' }
    });
  }

  gsap.set('.pdp-reco-head', { opacity: 0, y: 30 });
  gsap.to('.pdp-reco-head', {
    opacity: 1, y: 0, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.pdp-reco', start: 'top 80%' }
  });
}

// ─── Video Cards — click to play/pause ───
function initVideoCards() {
  document.querySelectorAll('[data-video]').forEach(function(card) {
    var video = card.querySelector('video');
    if (!video) return;
    // Start muted so poster shows, unmute on first click
    video.muted = true;
    card.addEventListener('click', function() {
      if (video.paused) {
        video.muted = false;
        video.play();
        card.classList.add('is-playing');
      } else {
        video.pause();
        card.classList.remove('is-playing');
      }
    });
  });
}

// ─── Init ───
document.addEventListener('DOMContentLoaded', function() {
  // Product page: nav always opaque (no dark hero behind it)
  var nav = document.querySelector('.site-nav');
  if (nav) nav.classList.add('is-sticky');

  var sku = getCurrentSku();
  renderProduct(sku);
  initZoom();
  initQuantity();
  initAccordion();
  initVideoCards();

  document.fonts.ready.then(function() {
    initPdpAnimations();
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });
});
