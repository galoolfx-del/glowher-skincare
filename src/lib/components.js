// Reusable HTML components (plain template strings, zero dependencies).
const site = require('../data/site');
const { icon, logoMark } = require('./art');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const prefix = (depth) => '../'.repeat(depth);
const fmtDate = (d) => new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const catBySlug = (slug) => site.categories.find((c) => c.slug === slug);

/* ---------- Layout ---------- */
function header(depth, active) {
  const r = prefix(depth);
  const link = (href, label, key) =>
    `<li><a href="${r}${href}"${active === key ? ' aria-current="page"' : ''}>${label}</a></li>`;
  const menu = site.categories
    .map((c) => `<li><a href="${r}category/${c.slug}.html"><span class="menu-ico">${icon(c.icon)}</span><span><strong>${esc(c.name)}</strong><small>${esc(c.blurb)}</small></span></a></li>`)
    .join('');
  return `<header class="site-header" id="site-header">
  <div class="container header__inner">
    <a class="logo" href="${r}index.html" aria-label="${esc(site.name)} home">${logoMark}<span class="logo__text">${esc(site.short)}<em>Skincare</em></span></a>
    <nav class="nav" id="primary-nav" aria-label="Primary">
      <ul class="nav__list">
        ${link('index.html', 'Home', 'home')}
        <li class="has-menu">
          <a href="${r}shop.html"${active === 'shop' ? ' aria-current="page"' : ''}>Shop</a>
          <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="shop-menu" aria-label="Show shop categories">${icon('chevron')}</button>
          <div class="mega glass" id="shop-menu"><ul>${menu}</ul>
            <a class="mega__all" href="${r}shop.html">Browse all products ${icon('arrow')}</a></div>
        </li>
        ${link('blog/index.html', 'Journal', 'blog')}
        ${link('about.html', 'About', 'about')}
        ${link('contact.html', 'Contact', 'contact')}
      </ul>
    </nav>
    <div class="header__actions">
      <button class="icon-btn" type="button" id="open-search" aria-label="Search the site" aria-haspopup="dialog">${icon('search')}</button>
      <button class="icon-btn nav-toggle" type="button" id="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="primary-nav">${icon('menu')}</button>
    </div>
  </div>
</header>`;
}

function footer(depth) {
  const r = prefix(depth);
  const cats = site.categories.map((c) => `<li><a href="${r}category/${c.slug}.html">${esc(c.name)}</a></li>`).join('');
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer__top">
      <div class="footer__brand">
        <a class="logo logo--light" href="${r}index.html">${logoMark}<span class="logo__text">${esc(site.short)}<em>Skincare</em></span></a>
        <p>${esc(site.description)}</p>
        <p class="footer__markets">Guides for readers in the ${site.markets.slice(0, -1).join(', ')} and ${site.markets.slice(-1)}.</p>
      </div>
      <nav aria-label="Shop categories"><h2 class="footer__h">Shop</h2><ul>${cats}</ul></nav>
      <nav aria-label="Learn"><h2 class="footer__h">Learn</h2><ul>
        <li><a href="${r}blog/index.html">Skincare journal</a></li>
        <li><a href="${r}blog/index.html?cat=Routines">Routines</a></li>
        <li><a href="${r}blog/index.html?cat=Ingredients">Ingredients</a></li>
        <li><a href="${r}blog/index.html?cat=Sun%20Care">Sun care</a></li>
        <li><a href="${r}search.html">Search</a></li></ul></nav>
      <nav aria-label="Company"><h2 class="footer__h">Company</h2><ul>
        <li><a href="${r}about.html">About us</a></li>
        <li><a href="${r}contact.html">Contact</a></li>
        <li><a href="${r}affiliate-disclosure.html">Affiliate disclosure</a></li>
        <li><a href="${r}privacy-policy.html">Privacy policy</a></li></ul></nav>
    </div>
    <p class="footer__disclosure">${icon('info')}<span><strong>Affiliate disclosure:</strong> some links on this site may become affiliate links, which means we could earn a commission at no extra cost to you. See our <a href="${r}affiliate-disclosure.html">full disclosure</a>. Content is educational and is not medical advice.</span></p>
    <div class="footer__bottom">
      <p>&copy; ${site.year} ${esc(site.name)}. All rights reserved. Not affiliated with any skincare brand unless stated.</p>
      <a class="to-top" href="#top">Back to top ${icon('arrow', 'rot')}</a>
    </div>
  </div>
</footer>`;
}

const searchOverlay = (depth) => `<div class="search-overlay" id="search-overlay" hidden>
  <div class="search-overlay__panel glass" role="dialog" aria-modal="true" aria-label="Search the site">
    <form class="search-form" role="search" action="${prefix(depth)}search.html" method="get">
      ${icon('search')}
      <label class="sr-only" for="overlay-q">Search products and articles</label>
      <input id="overlay-q" name="q" type="search" placeholder="Search serums, niacinamide, sunscreen..." autocomplete="off">
      <button type="button" class="icon-btn" id="close-search" aria-label="Close search">${icon('close')}</button>
    </form>
    <div class="search-live" id="search-live" aria-live="polite"></div>
    <p class="search-hint">Press <kbd>Enter</kbd> for all results, <kbd>Esc</kbd> to close.</p>
  </div>
</div>`;

/* ---------- Page shell ---------- */
function page({ depth = 0, file, title, desc, active = '', body, og = '', jsonld = [], scripts = [], bodyClass = '', noindex = false }) {
  const r = prefix(depth);
  const fullTitle = title.includes(site.short) ? title : `${title} | ${site.name}`;
  const canonical = `${site.url}/${file}`;
  const ogImg = og ? `${site.url}/${og}` : `${site.url}/assets/img/og-default.svg`;
  const ld = jsonld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
${noindex ? '<meta name="robots" content="noindex">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
<meta name="theme-color" content="#7c3aed">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="website"><meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(fullTitle)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(canonical)}"><meta property="og:image" content="${esc(ogImg)}">
<meta name="twitter:card" content="summary_large_image">
<script>document.documentElement.classList.add("js")</script>
<link rel="icon" href="${r}assets/img/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="${r}assets/css/styles.css">
${ld}
</head>
<body class="${bodyClass}" data-root="${r}" id="top">
<a class="skip-link" href="#main">Skip to main content</a>
${header(depth, active)}
<main id="main" tabindex="-1">
${body}
</main>
${footer(depth)}
${searchOverlay(depth)}
<script src="${r}assets/js/search-index.js" defer></script>
<script src="${r}assets/js/main.js" defer></script>
${scripts.map((s) => `<script src="${r}assets/js/${s}" defer></script>`).join('\n')}
</body>
</html>`;
}

/* ---------- Building blocks ---------- */
const breadcrumbs = (depth, trail) => {
  const r = prefix(depth);
  const items = [{ name: 'Home', href: 'index.html' }, ...trail];
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${items
    .map((it, i) => (i === items.length - 1 ? `<li aria-current="page">${esc(it.name)}</li>` : `<li><a href="${r}${it.href}">${esc(it.name)}</a></li>`))
    .join('')}</ol></nav>`;
};
const breadcrumbLd = (trail) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'Home', href: 'index.html' }, ...trail].map((t, i) => ({
    '@type': 'ListItem', position: i + 1, name: t.name, item: t.href ? `${site.url}/${t.href}` : undefined })),
});

const chips = (list, cls = '') => `<ul class="chips ${cls}">${list.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>`;

function productCard(p, depth, { eager = false } = {}) {
  const r = prefix(depth);
  const cat = catBySlug(p.category);
  const skin = p.skinTypes.map((s) => site.skinTypes[s]).slice(0, 3);
  return `<article class="pcard reveal" data-name="${esc(p.name.toLowerCase())}" data-cat="${p.category}" data-skin="${p.skinTypes.join(' ')}" data-concern="${p.concerns.join(' ')}" data-price="${p.price}" data-time="${p.time}" data-date="${p.added}" data-order="${p.__order}">
  <a class="pcard__media" href="${r}products/${p.slug}.html" tabindex="-1" aria-hidden="true">
    <img src="${r}assets/img/products/${p.slug}.svg" alt="" width="600" height="700" ${eager ? '' : 'loading="lazy"'} decoding="async">
    <span class="pcard__tag glass-chip">Sample listing</span>
  </a>
  <div class="pcard__body">
    <p class="pcard__cat">${esc(cat.name)}</p>
    <h3 class="pcard__title"><a href="${r}products/${p.slug}.html">${esc(p.name)}</a></h3>
    <p class="pcard__text">${esc(p.summary)}</p>
    ${chips(skin, 'chips--sm')}
    <div class="pcard__foot">
      <span class="price" title="Typical price tier (indicative)">${esc(site.priceTiers[p.price])}</span>
      <a class="btn btn--soft btn--sm" href="${r}products/${p.slug}.html">View details ${icon('arrow')}</a>
    </div>
  </div>
</article>`;
}

function articleCard(a, depth, { featured = false } = {}) {
  const r = prefix(depth);
  return `<article class="acard${featured ? ' acard--feature' : ''} reveal" data-cat="${esc(a.category)}">
  <a class="acard__media" href="${r}blog/${a.slug}.html" tabindex="-1" aria-hidden="true"><img src="${r}assets/img/articles/${a.slug}.svg" alt="" width="1200" height="630" loading="lazy" decoding="async"></a>
  <div class="acard__body">
    <p class="acard__meta"><span class="pill">${esc(a.category)}</span><span>${icon('clock')} ${a.readMins} min read</span></p>
    <h3 class="acard__title"><a href="${r}blog/${a.slug}.html">${esc(a.title)}</a></h3>
    <p>${esc(a.excerpt)}</p>
    <a class="link-arrow" href="${r}blog/${a.slug}.html">Read the guide ${icon('arrow')}</a>
  </div>
</article>`;
}

function categoryCard(c, depth, count) {
  const r = prefix(depth);
  return `<a class="ccard reveal" href="${r}category/${c.slug}.html" style="--c1:${c.hue[0]};--c2:${c.hue[1]};--c3:${c.hue[2]}">
  <span class="ccard__ico">${icon(c.icon)}</span>
  <span class="ccard__name">${esc(c.name)}</span>
  <span class="ccard__blurb">${esc(c.blurb)}</span>
  <span class="ccard__count">${count} sample ${count === 1 ? 'listing' : 'listings'} ${icon('arrow')}</span>
</a>`;
}

function filterPanel({ fixedCategory } = {}) {
  const grp = (name, label, entries, extra = '') => `<fieldset class="filter-group"${extra}><legend>${label}</legend>${entries
    .map(([v, l]) => `<label class="check"><input type="checkbox" name="${name}" value="${v}"><span>${esc(l)}</span></label>`).join('')}</fieldset>`;
  const skin = Object.entries(site.skinTypes).filter(([k]) => k !== 'all');
  const concerns = Object.entries(site.concerns);
  const prices = Object.entries(site.priceTiers);
  const times = [['am', 'Morning'], ['pm', 'Evening']];
  return `<form class="filters" id="filters" aria-label="Product filters" onsubmit="return false">
  <div class="filters__head"><h2>${icon('filter')} Filters</h2><button type="button" class="link-btn" id="clear-filters">Clear all</button></div>
  <div class="filter-group"><label class="filter-label" for="filter-q">Search in results</label>
    <input class="input" id="filter-q" type="search" placeholder="e.g. niacinamide" autocomplete="off"></div>
  ${fixedCategory ? '' : grp('cat', 'Category', site.categories.map((c) => [c.slug, c.name]))}
  ${grp('skin', 'Skin type', skin)}
  ${grp('concern', 'Concern', concerns)}
  ${grp('price', 'Price tier', prices)}
  ${grp('time', 'Routine time', times)}
</form>`;
}

function shopToolbar() {
  return `<div class="toolbar">
  <button class="btn btn--soft btn--sm filters-open" type="button" id="filters-open" aria-controls="filters" aria-expanded="false">${icon('filter')} Filters <span class="badge" id="filter-badge" hidden>0</span></button>
  <p class="toolbar__count" id="result-count" role="status" aria-live="polite"></p>
  <label class="toolbar__sort"><span>Sort by</span>
    <select id="sort" class="input input--select">
      <option value="featured">Featured</option><option value="newest">Newest</option>
      <option value="name-asc">Name A-Z</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option>
    </select></label>
</div>
<div class="active-filters" id="active-filters" aria-label="Active filters"></div>`;
}

const sectionHead = ({ eyebrow, title, text, center = false }) => `<div class="section-head${center ? ' section-head--center' : ''} reveal">
  ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}<h2>${title}</h2>${text ? `<p class="lead">${text}</p>` : ''}</div>`;

const pageHero = ({ eyebrow, title, text, crumbs = '' }) => `<section class="page-hero"><div class="blob blob--a"></div><div class="blob blob--b"></div>
  <div class="container">${crumbs}${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}<h1>${title}</h1>${text ? `<p class="lead">${text}</p>` : ''}</div></section>`;

module.exports = {
  esc, prefix, fmtDate, catBySlug, page, breadcrumbs, breadcrumbLd, chips, productCard, articleCard,
  categoryCard, filterPanel, shopToolbar, sectionHead, pageHero, icon,
};
