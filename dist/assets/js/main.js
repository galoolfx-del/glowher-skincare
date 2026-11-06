/* Site-wide behaviour: header, nav, reveal, search, blog filter, contact form. No dependencies. */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var root = document.body.getAttribute('data-root') || '';
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* Header shadow on scroll */
  var header = $('#site-header');
  var onScroll = function () { header && header.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Mobile nav */
  var navBtn = $('#nav-toggle'), nav = $('#primary-nav');
  function setNav(open) {
    if (!navBtn || !nav) return;
    nav.classList.toggle('is-open', open);
    navBtn.setAttribute('aria-expanded', String(open));
    navBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  navBtn && navBtn.addEventListener('click', function () { setNav(!nav.classList.contains('is-open')); });
  $$('#primary-nav a').forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });

  /* Shop dropdown (touch + keyboard) */
  $$('.has-menu').forEach(function (li) {
    var btn = $('.menu-toggle', li);
    btn.addEventListener('click', function () {
      var open = !li.classList.contains('is-open');
      li.classList.toggle('is-open', open); btn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', function (e) { if (!li.contains(e.target)) { li.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); } });
  });

  /* Reveal on scroll */
  var rev = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    rev.forEach(function (el) { io.observe(el); });
  } else { rev.forEach(function (el) { el.classList.add('is-visible'); }); }

  /* ---------- Search ---------- */
  var INDEX = window.GLOW_INDEX || [];
  var stem = function (t) { return t.length > 3 && /s$/.test(t) && !/ss$/.test(t) ? t.slice(0, -1) : t; };
  function search(q) {
    var toks = q.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).map(stem);
    if (!toks.length) return [];
    return INDEX.map(function (it) {
      var title = it.title.toLowerCase(), text = (it.text + ' ' + it.sub).toLowerCase(), score = 0;
      for (var i = 0; i < toks.length; i++) {
        var t = toks[i], s = 0;
        if (title.indexOf(t) > -1) s += (title.indexOf(t) === 0 || title.indexOf(' ' + t) > -1) ? 6 : 4;
        if (text.indexOf(t) > -1) s += 2;
        if (!s) return null;
        score += s;
      }
      if (it.t === 'Product') score += 1;
      return { it: it, score: score };
    }).filter(Boolean).sort(function (a, b) { return b.score - a.score; }).map(function (x) { return x.it; });
  }
  var ph = '<span class="hit__ph"><svg class="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg></span>';
  function hit(it) {
    return '<a class="hit" href="' + root + esc(it.url) + '">' + (it.img ? '<img src="' + root + esc(it.img) + '" alt="" width="52" height="52" loading="lazy">' : ph) +
      '<span><span class="type-tag">' + esc(it.t) + '</span><strong>' + esc(it.title) + '</strong><small>' + esc(it.sub || '') + '</small></span></a>';
  }

  var overlay = $('#search-overlay'), openBtn = $('#open-search'), closeBtn = $('#close-search'), oq = $('#overlay-q'), live = $('#search-live');
  var lastFocus = null;
  function openSearch() { lastFocus = document.activeElement; overlay.hidden = false; document.body.style.overflow = 'hidden'; oq.focus(); renderLive(); }
  function closeSearch() { overlay.hidden = true; document.body.style.overflow = nav && nav.classList.contains('is-open') ? 'hidden' : ''; lastFocus && lastFocus.focus && lastFocus.focus(); }
  function renderLive() {
    var q = oq.value.trim();
    if (!q) { live.innerHTML = ''; return; }
    var r = search(q).slice(0, 6);
    live.innerHTML = r.length ? r.map(hit).join('') : '<p class="search-status">No matches yet. Try &ldquo;serum&rdquo; or &ldquo;SPF&rdquo;.</p>';
  }
  if (overlay) {
    openBtn.addEventListener('click', openSearch);
    closeBtn.addEventListener('click', closeSearch);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeSearch(); });
    oq.addEventListener('input', renderLive);
    document.addEventListener('keydown', function (e) {
      var typing = /INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '');
      if (e.key === 'Escape') { if (!overlay.hidden) closeSearch(); else setNav(false); }
      else if ((e.key === '/' && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) { e.preventDefault(); overlay.hidden ? openSearch() : oq.focus(); }
      else if (!overlay.hidden && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        var hits = $$('.hit', live); if (!hits.length) return; e.preventDefault();
        var i = hits.indexOf(document.activeElement); i = e.key === 'ArrowDown' ? i + 1 : i - 1;
        if (i < 0) oq.focus(); else hits[Math.min(i, hits.length - 1)].focus();
      }
    });
    overlay.addEventListener('keydown', function (e) {  // keep focus inside the dialog
      if (e.key !== 'Tab') return;
      var f = $$('input, button, a', overlay).filter(function (n) { return !n.disabled && n.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* Search results page */
  var results = $('#search-results');
  if (results) {
    var q = (new URLSearchParams(location.search).get('q') || '').trim();
    var pq = $('#page-q'), status = $('#search-status'), sug = $('#search-suggest');
    pq.value = q;
    if (q) {
      var r = search(q);
      status.textContent = r.length ? r.length + ' result' + (r.length === 1 ? '' : 's') + ' for “' + q + '”' : 'No results for “' + q + '”. Try a broader term such as “serum”, “sunscreen” or “dry skin”.';
      results.innerHTML = r.map(hit).join('');
      document.title = 'Search: ' + q + ' | GlowHer Skincare';
    } else { status.textContent = 'Type a product, ingredient or topic to begin.'; }
  }

  /* Affiliate placeholder buttons */
  $$('[data-affiliate-placeholder]').forEach(function (b) {
    b.addEventListener('click', function () {
      var note = document.getElementById(b.getAttribute('aria-controls'));
      var open = note.hidden; note.hidden = !open; b.setAttribute('aria-expanded', String(open));
    });
  });

  /* Blog topic filter */
  var bf = $('#blog-filter');
  if (bf) {
    var cards = $$('#blog-grid .acard'), empty = $('#blog-empty');
    var apply = function (cat) {
      var n = 0;
      cards.forEach(function (c) { var show = cat === 'all' || c.getAttribute('data-cat') === cat; c.hidden = !show; if (show) n++; });
      $$('.pill-btn', bf).forEach(function (b) { var on = b.getAttribute('data-cat') === cat; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); });
      empty.hidden = n > 0;
      cards.forEach(function (c) { c.classList.remove('acard--feature'); });
      var first = cards.filter(function (c) { return !c.hidden; })[0];
      if (first && cat === 'all') first.classList.add('acard--feature');
    };
    bf.addEventListener('click', function (e) { var b = e.target.closest('.pill-btn'); if (b) apply(b.getAttribute('data-cat')); });
    var initial = new URLSearchParams(location.search).get('cat');
    if (initial && $$('.pill-btn', bf).some(function (b) { return b.getAttribute('data-cat') === initial; })) apply(initial);
  }

  /* Contact form (opens the visitor's email app; swap for a form service later) */
  var form = $('#contact-form');
  if (form) {
    var st = $('#form-status');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements, bad = [];
      ['name', 'email', 'message'].forEach(function (n) { f[n].classList.remove('error'); if (!f[n].value.trim()) bad.push(f[n]); });
      if (f.email.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.value)) bad.push(f.email);
      if (bad.length) { bad.forEach(function (n) { n.classList.add('error'); }); bad[0].focus(); st.className = 'form-status is-error'; st.textContent = 'Please complete the highlighted fields with valid details.'; return; }
      var to = ($('.contact__side a[href^="mailto:"]') || {}).textContent || '';
      var body = 'Name: ' + f.name.value + '\nEmail: ' + f.email.value + '\n\n' + f.message.value;
      st.className = 'form-status is-ok'; st.textContent = 'Opening your email app...';
      location.href = 'mailto:' + to + '?subject=' + encodeURIComponent('[' + f.topic.value + '] Website enquiry') + '&body=' + encodeURIComponent(body);
    });
  }
})();
