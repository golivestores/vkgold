/* =============================================
   VKGold — Blog JS
   Category filtering, nav setup
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {
  // Nav: show immediately
  var nav = document.querySelector('.site-nav');
  if (nav) { nav.classList.add('is-sticky','is-ready'); nav.style.opacity = '1'; }

  // ─── Category tabs (blog listing) ───
  var tabs = document.querySelectorAll('.bl-tab');
  var cards = document.querySelectorAll('.bl-card[data-category]');
  var featured = document.querySelector('.bl-featured[data-category]');

  if (tabs.length && cards.length) {
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        var cat = tab.dataset.category;
        tabs.forEach(function(t) { t.classList.remove('is-active'); });
        tab.classList.add('is-active');

        // Filter grid cards
        cards.forEach(function(card) {
          if (cat === 'all' || card.dataset.category === cat) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });

        // Show/hide featured
        if (featured) {
          if (cat === 'all' || featured.dataset.category === cat) {
            featured.style.display = '';
          } else {
            featured.style.display = 'none';
          }
        }
      });
    });
  }
});
