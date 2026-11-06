/* Product filtering, sorting and URL state for shop + category pages. */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var shop = $('.shop'); if (!shop) return;
  var fixedCat = shop.getAttribute('data-category') || '';
  var grid = $('#product-grid'), cards = $$('.pcard', grid);
  var form = $('#filters'), qIn = $('#filter-q'), sortSel = $('#sort');
  var countEl = $('#result-count'), emptyEl = $('#empty-state'), activeEl = $('#active-filters'), badge = $('#filter-badge');
  var side = $('.shop__side'), openBtn = $('#filters-open');
  var GROUPS = ['cat', 'skin', 'concern', 'price', 'time'];
  var labels = {};
  $$('input[type=checkbox]', form).forEach(function (c) { labels[c.name + ':' + c.value] = c.parentNode.textContent.trim(); });

  /* Read state from URL */
  var params = new URLSearchParams(location.search);
  GROUPS.forEach(function (g) {
    var v = params.get(g); if (!v) return;
    v.split(',').forEach(function (x) { var el = $('input[name="' + g + '"][value="' + x + '"]', form); if (el) el.checked = true; });
  });
  if (params.get('q')) qIn.value = params.get('q');
  if (params.get('sort') && $('option[value="' + params.get('sort') + '"]', sortSel)) sortSel.value = params.get('sort');

  var state = function () {
    var s = { q: qIn.value.trim().toLowerCase(), sort: sortSel.value };
    GROUPS.forEach(function (g) { s[g] = $$('input[name="' + g + '"]:checked', form).map(function (i) { return i.value; }); });
    return s;
  };
  var has = function (str, v) { return (' ' + str + ' ').indexOf(' ' + v + ' ') > -1; };

  function matches(card, s) {
    var d = card.dataset;
    if (fixedCat && d.cat !== fixedCat) return false;
    if (s.cat.length && s.cat.indexOf(d.cat) < 0) return false;
    if (s.skin.length && !(has(d.skin, 'all') || s.skin.some(function (x) { return has(d.skin, x); }))) return false;
    if (s.concern.length && !s.concern.some(function (x) { return has(d.concern, x); })) return false;
    if (s.price.length && s.price.indexOf(d.price) < 0) return false;
    if (s.time.length && !(d.time === 'both' || s.time.indexOf(d.time) > -1)) return false;
    if (s.q) { var t = card.textContent.toLowerCase(); if (!s.q.split(/\s+/).every(function (w) { return t.indexOf(w) > -1; })) return false; }
    return true;
  }

  var sorters = {
    featured: function (a, b) { return a.dataset.order - b.dataset.order; },
    newest: function (a, b) { return b.dataset.date.localeCompare(a.dataset.date) || a.dataset.order - b.dataset.order; },
    'name-asc': function (a, b) { return a.dataset.name.localeCompare(b.dataset.name); },
    'price-asc': function (a, b) { return a.dataset.price - b.dataset.price || a.dataset.order - b.dataset.order; },
    'price-desc': function (a, b) { return b.dataset.price - a.dataset.price || a.dataset.order - b.dataset.order; },
  };

  function render(pushUrl) {
    var s = state(), shown = 0;
    cards.slice().sort(sorters[s.sort]).forEach(function (c) { grid.appendChild(c); });
    cards.forEach(function (c) {
      var ok = matches(c, s); c.hidden = !ok;
      if (ok) { shown++; c.classList.add('is-visible'); }
    });
    var scope = fixedCat ? 'in this category' : 'in total';
    countEl.textContent = shown + ' product' + (shown === 1 ? '' : 's') + ' ' + (shown === cards.length && !s.q ? scope : 'found');
    emptyEl.hidden = shown > 0; grid.hidden = shown === 0;

    /* Active filter chips */
    activeEl.innerHTML = '';
    var n = 0;
    GROUPS.forEach(function (g) { s[g].forEach(function (v) {
      n++; var b = document.createElement('button'); b.type = 'button'; b.className = 'afilter';
      b.setAttribute('aria-label', 'Remove filter ' + labels[g + ':' + v]);
      b.innerHTML = labels[g + ':' + v].replace(/[<>&]/g, '') + ' <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
      b.addEventListener('click', function () { var el = $('input[name="' + g + '"][value="' + v + '"]', form); el.checked = false; render(true); });
      activeEl.appendChild(b);
    }); });
    if (s.q) n++;
    badge.hidden = n === 0; badge.textContent = n;

    if (pushUrl) {
      var p = new URLSearchParams();
      GROUPS.forEach(function (g) { if (s[g].length) p.set(g, s[g].join(',')); });
      if (s.q) p.set('q', s.q);
      if (s.sort !== 'featured') p.set('sort', s.sort);
      var qs = p.toString();
      history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
    }
  }

  function clearAll() { $$('input[type=checkbox]', form).forEach(function (c) { c.checked = false; }); qIn.value = ''; render(true); }
  form.addEventListener('change', function () { render(true); });
  qIn.addEventListener('input', function () { render(true); });
  sortSel.addEventListener('change', function () { render(true); });
  $('#clear-filters').addEventListener('click', clearAll);
  $('#empty-clear').addEventListener('click', clearAll);

  /* Mobile filter drawer */
  function drawer(open) {
    side.classList.toggle('is-open', open); openBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) qIn.focus(); else openBtn.focus();
  }
  openBtn.addEventListener('click', function () { drawer(true); });
  $('#filters-close').addEventListener('click', function () { drawer(false); });
  side.addEventListener('click', function (e) { if (e.target === side) drawer(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && side.classList.contains('is-open')) drawer(false); });

  render(false);
})();
