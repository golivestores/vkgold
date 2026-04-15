/* =============================================
   VKGold — Collection Page JS
   Product data, rendering, filter & sort
   ============================================= */

var PRODUCTS = [
  { id:'wutai-dragon', name:'Wutai Dragon \u00b7 God of Wealth', category:'blessing', price:29.90, priceLabel:'$29.90', theme:'wealth', material:'pure-gold-foil', badge:'Pure Gold', spec:'Phone Sticker \u00b7 99.9% Pure Gold', img:'assets/products/phone-sticker-2.jpg', hover:'assets/products/phone-charm-2.jpg', order:1 },
  { id:'wudang-wenchang', name:'Wudang Wenchang \u00b7 Wisdom', category:'blessing', price:29.90, priceLabel:'$29.90', theme:'wisdom', material:'pure-gold-foil', badge:'Pure Gold', spec:'Phone Sticker \u00b7 99.9% Pure Gold', img:'assets/products/phone-sticker-1.jpg', hover:'assets/products/phone-charm.jpg', order:2 },
  { id:'zaki-ram', name:'Zaki Ram \u00b7 Love & Protection', category:'blessing', price:29.90, priceLabel:'$29.90', theme:'compassion', material:'pure-gold-foil', badge:'Pure Gold', spec:'Phone Sticker \u00b7 99.9% Pure Gold', img:'assets/products/zjlm-1.jpg', hover:'assets/products/zjlm-4.jpg', order:3 },
  { id:'eight-horse', name:'Eight Horse Wealth Deity', category:'thangka', price:1800, priceLabel:'$1,800', theme:'wealth', material:'24k-gold-leaf', badge:'24K Gold', spec:'Large \u00b7 Hand-painted \u00b7 24K Gold Leaf', img:'assets/products/thangka-gold.jpg', hover:'assets/products/thangka-color.jpg', order:4 },
  { id:'yellow-jambhala', name:'Yellow Jambhala', category:'thangka', price:1800, priceLabel:'$1,800', theme:'wealth', material:'24k-gold-leaf', badge:'24K Gold', spec:'Large \u00b7 Hand-painted \u00b7 24K Gold Leaf', img:'assets/products/thangka-color.jpg', hover:'assets/products/thangka-gold.jpg', order:5 },
  { id:'five-wealth', name:'Five Directional Wealth Deities', category:'thangka', price:1800, priceLabel:'$1,800', theme:'wealth', material:'24k-gold-leaf', badge:'24K Gold', spec:'Large \u00b7 Hand-painted \u00b7 24K Gold Leaf', img:'assets/products/thangka-gold.jpg', hover:'assets/products/thangka-image3.jpg', order:6 },
  { id:'white-tara', name:'White Tara', category:'thangka', price:1800, priceLabel:'$1,800', theme:'compassion', material:'mineral-pigment', badge:'UNESCO Heritage', spec:'Large \u00b7 Hand-painted \u00b7 Natural Mineral Pigment', img:'assets/products/thangka-green.jpg', hover:'assets/products/thangka-image6.jpg', order:7 },
  { id:'manjushri', name:'Manjushri', category:'thangka', price:1800, priceLabel:'$1,800', theme:'wisdom', material:'24k-gold-leaf', badge:'24K Gold', spec:'Large \u00b7 Hand-painted \u00b7 24K Gold Leaf', img:'assets/products/thangka-image3.jpg', hover:'assets/products/thangka-gold.jpg', order:8 },
  { id:'samantabhadra', name:'Samantabhadra', category:'thangka', price:1800, priceLabel:'$1,800', theme:'wisdom', material:'mineral-pigment', badge:'UNESCO Heritage', spec:'Large \u00b7 Hand-painted \u00b7 Natural Mineral Pigment', img:'assets/products/thangka-image6.jpg', hover:'assets/products/thangka-green.jpg', order:9 },
  { id:'akasagarbha', name:'Akasagarbha', category:'thangka', price:1800, priceLabel:'$1,800', theme:'wisdom', material:'24k-gold-leaf', badge:'24K Gold', spec:'Large \u00b7 Hand-painted \u00b7 24K Gold Leaf', img:'assets/products/thangka-gold.jpg', hover:'assets/products/thangka-color.jpg', order:10 },
  { id:'acala', name:'Acala', category:'thangka', price:1800, priceLabel:'$1,800', theme:'protection', material:'mineral-pigment', badge:'UNESCO Heritage', spec:'Large \u00b7 Hand-painted \u00b7 Natural Mineral Pigment', img:'assets/products/thangka-color.jpg', hover:'assets/products/thangka-image3.jpg', order:11 },
  { id:'avalokiteshvara', name:'Four-Armed Avalokiteshvara', category:'thangka', price:1800, priceLabel:'$1,800', theme:'protection', material:'24k-gold-leaf', badge:'24K Gold', spec:'Large \u00b7 Hand-painted \u00b7 24K Gold Leaf', img:'assets/products/bodhisattva-1.jpg', hover:'assets/products/thangka-gold.jpg', order:12 },
  { id:'corp-buddhist', name:'Tibetan Buddhism Gift Set', category:'corporate', price:500, priceLabel:'$500', theme:'wealth', material:'24k-gold-leaf', badge:'B2B', spec:'Corporate \u00b7 Custom Precious Metal', img:'assets/project-1.jpg', hover:'assets/project-2.jpg', order:13 },
  { id:'corp-museum', name:'Museum Gift Collection', category:'corporate', price:800, priceLabel:'$800', theme:'wisdom', material:'pure-gold-foil', badge:'B2B', spec:'Corporate \u00b7 Custom Precious Metal', img:'assets/project-3.jpg', hover:'assets/project-4.jpg', order:14 },
];

var activeFilters = { category:[], price:[], theme:[], material:[] };
var activeSort = 'featured';

function matchPrice(price, range) {
  if (range === 'under50') return price < 50;
  if (range === '50-500') return price >= 50 && price < 500;
  if (range === '500-1000') return price >= 500 && price < 1000;
  if (range === '1000plus') return price >= 1000;
  return false;
}

function getFilteredProducts() {
  var filtered = PRODUCTS.filter(function(p) {
    if (activeFilters.category.length && activeFilters.category.indexOf(p.category) === -1) return false;
    if (activeFilters.price.length) {
      var match = false;
      for (var i = 0; i < activeFilters.price.length; i++) { if (matchPrice(p.price, activeFilters.price[i])) { match = true; break; } }
      if (!match) return false;
    }
    if (activeFilters.theme.length && activeFilters.theme.indexOf(p.theme) === -1) return false;
    if (activeFilters.material.length && activeFilters.material.indexOf(p.material) === -1) return false;
    return true;
  });
  var sorted = filtered.slice();
  if (activeSort === 'price-asc') sorted.sort(function(a,b){ return a.price - b.price; });
  else if (activeSort === 'price-desc') sorted.sort(function(a,b){ return b.price - a.price; });
  else if (activeSort === 'newest') sorted.sort(function(a,b){ return b.order - a.order; });
  return sorted;
}

function renderGrid() {
  var grid = document.getElementById('clGrid');
  if (!grid) return;
  var products = getFilteredProducts();
  grid.innerHTML = '';

  if (products.length === 0) {
    grid.innerHTML = '<div class="cl-empty">No products match your filters.</div>';
  } else {
    products.forEach(function(p) {
      var card = document.createElement('div');
      card.className = 'bs-card';
      card.innerHTML =
        '<div class="bs-card-media">' +
          '<img class="bs-primary" src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
          '<img class="bs-hover" src="' + p.hover + '" alt="' + p.name + '" loading="lazy">' +
          '<div class="bs-badge">' + p.badge + '</div>' +
        '</div>' +
        '<div class="bs-card-body">' +
          '<div class="bs-card-price">From <strong>' + p.priceLabel + '</strong></div>' +
          '<h3 class="bs-card-name">' + p.name + '</h3>' +
          '<p class="bs-card-desc">' + p.spec + '</p>' +
        '</div>';
      grid.appendChild(card);
    });
  }

  var countEl = document.getElementById('clCount');
  if (countEl) countEl.textContent = products.length + ' product' + (products.length !== 1 ? 's' : '');

  var resetBtn = document.getElementById('clReset');
  var hasFilters = activeFilters.category.length || activeFilters.price.length || activeFilters.theme.length || activeFilters.material.length;
  if (resetBtn) resetBtn.classList.toggle('is-visible', hasFilters);
}

document.addEventListener('DOMContentLoaded', function() {
  // Nav: show immediately, no waiting for intro
  var nav = document.querySelector('.site-nav');
  if (nav) { nav.classList.add('is-sticky','is-ready'); nav.style.opacity = '1'; }

  renderGrid();

  // Category scroll bar
  var catBtns = document.querySelectorAll('.cl-cat');
  catBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var cat = btn.dataset.category;
      catBtns.forEach(function(b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      activeFilters.category = (cat === 'all') ? [] : [cat];
      document.querySelectorAll('.cl-fg-checkbox[data-filter-key="category"]').forEach(function(cb) {
        cb.classList.toggle('is-checked', activeFilters.category.indexOf(cb.dataset.filterVal) !== -1);
      });
      renderGrid();
    });
  });

  // Filter checkboxes
  document.querySelectorAll('.cl-fg-checkbox').forEach(function(cb) {
    cb.addEventListener('click', function() {
      var key = cb.dataset.filterKey, val = cb.dataset.filterVal;
      cb.classList.toggle('is-checked');
      var idx = activeFilters[key].indexOf(val);
      if (idx === -1) activeFilters[key].push(val); else activeFilters[key].splice(idx, 1);
      if (key === 'category') {
        catBtns.forEach(function(b) {
          if (activeFilters.category.length === 0) b.classList.toggle('is-active', b.dataset.category === 'all');
          else if (activeFilters.category.length === 1) b.classList.toggle('is-active', b.dataset.category === activeFilters.category[0]);
          else b.classList.remove('is-active');
        });
      }
      renderGrid();
    });
  });

  // Filter accordion
  document.querySelectorAll('.cl-fg-head').forEach(function(head) {
    head.addEventListener('click', function() { head.parentElement.classList.toggle('is-open'); });
  });

  // FAQ accordion
  document.querySelectorAll('.cl-faq-q').forEach(function(q) {
    q.addEventListener('click', function() {
      var item = q.parentElement;
      var wasOpen = item.classList.contains('is-open');
      document.querySelectorAll('.cl-faq-item.is-open').forEach(function(i) { i.classList.remove('is-open'); });
      if (!wasOpen) item.classList.add('is-open');
    });
  });

  // Sort dropdown
  var sortWrap = document.getElementById('clSortWrap');
  var sortBtn = document.getElementById('clSortBtn');
  if (sortBtn && sortWrap) {
    sortBtn.addEventListener('click', function() { sortWrap.classList.toggle('is-open'); });
    document.addEventListener('click', function(e) { if (!sortWrap.contains(e.target)) sortWrap.classList.remove('is-open'); });
  }
  document.querySelectorAll('.cl-sort-option').forEach(function(opt) {
    opt.addEventListener('click', function() {
      activeSort = opt.dataset.sort;
      document.querySelectorAll('.cl-sort-option').forEach(function(o) { o.classList.toggle('is-active', o === opt); });
      if (sortWrap) sortWrap.classList.remove('is-open');
      renderGrid();
    });
  });

  // Reset all
  var resetBtn = document.getElementById('clReset');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      activeFilters = { category:[], price:[], theme:[], material:[] };
      document.querySelectorAll('.cl-fg-checkbox').forEach(function(cb) { cb.classList.remove('is-checked'); });
      catBtns.forEach(function(b) { b.classList.toggle('is-active', b.dataset.category === 'all'); });
      renderGrid();
    });
  }

  // Mobile filter panel
  var filterPanel = document.getElementById('clFilters');
  var filterToggle = document.getElementById('clFilterToggle');
  var filterClose = document.getElementById('clFilterClose');
  var filterOverlay = document.getElementById('clFilterOverlay');
  function openFilters() { if (filterPanel) filterPanel.classList.add('is-open'); if (filterOverlay) filterOverlay.classList.add('is-visible'); document.body.style.overflow = 'hidden'; }
  function closeFilters() { if (filterPanel) filterPanel.classList.remove('is-open'); if (filterOverlay) filterOverlay.classList.remove('is-visible'); document.body.style.overflow = ''; }
  if (filterToggle) filterToggle.addEventListener('click', openFilters);
  if (filterClose) filterClose.addEventListener('click', closeFilters);
  if (filterOverlay) filterOverlay.addEventListener('click', closeFilters);
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && filterPanel && filterPanel.classList.contains('is-open')) closeFilters(); });
});
