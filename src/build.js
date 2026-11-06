#!/usr/bin/env node
// Static site generator: `node src/build.js` writes the finished website to /dist.
const fs = require('fs');
const path = require('path');
const site = require('./data/site');
const products = require('./data/products');
const articles = require('./data/articles');
const art = require('./lib/art');
const C = require('./lib/components');
const { esc, icon, page, breadcrumbs, breadcrumbLd, chips, productCard, articleCard, categoryCard, filterPanel, shopToolbar, sectionHead, pageHero, fmtDate, catBySlug } = C;

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const written = [];

const write = (rel, content) => {
  const f = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, content);
  written.push(rel);
};
const copyDir = (from, to) => {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const s = path.join(from, e.name), d = path.join(to, e.name);
    e.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
};

/* ---------- Prepare data ---------- */
[...products].sort((a, b) => (b.featured - a.featured) || b.added.localeCompare(a.added)).forEach((p, i) => (p.__order = i));
const byOrder = [...products].sort((a, b) => a.__order - b.__order);
const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]));
const articlesNewest = [...articles].sort((a, b) => b.date.localeCompare(a.date));
const countIn = (slug) => products.filter((p) => p.category === slug).length;

fs.rmSync(DIST, { recursive: true, force: true });
copyDir(path.join(__dirname, 'assets'), path.join(DIST, 'assets'));

/* ---------- Generated artwork ---------- */
products.forEach((p) => write(`assets/img/products/${p.slug}.svg`, art.productSvg(p)));
articles.forEach((a) => write(`assets/img/articles/${a.slug}.svg`, art.articleSvg(a)));
write('assets/img/favicon.svg', art.faviconSvg);
write('assets/img/og-default.svg', art.articleSvg({ palette: ['#ffd3e2', '#a98cff', '#76d7c4'], motif: 'drop', category: 'GlowHer' }));

/* ---------- Search index ---------- */
const index = [
  ...products.map((p) => ({ t: 'Product', title: p.name, url: `products/${p.slug}.html`, img: `assets/img/products/${p.slug}.svg`,
    sub: catBySlug(p.category).name,
    text: [p.summary, catBySlug(p.category).name, p.skinTypes.map((s) => site.skinTypes[s]).join(' '), p.concerns.map((c) => site.concerns[c]).join(' '), p.lookFor.map((l) => l[0]).join(' ')].join(' ') })),
  ...articles.map((a) => ({ t: 'Article', title: a.title, url: `blog/${a.slug}.html`, img: `assets/img/articles/${a.slug}.svg`, sub: a.category,
    text: `${a.excerpt} ${a.category} ${a.body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 900)}` })),
  ...site.categories.map((c) => ({ t: 'Category', title: c.name, url: `category/${c.slug}.html`, sub: 'Shop category', text: c.blurb })),
  { t: 'Page', title: 'About us', url: 'about.html', sub: 'Company', text: 'about mission editorial standards team' },
  { t: 'Page', title: 'Contact', url: 'contact.html', sub: 'Company', text: 'contact email message support partnership' },
  { t: 'Page', title: 'Affiliate disclosure', url: 'affiliate-disclosure.html', sub: 'Legal', text: 'affiliate commission links disclosure FTC transparency' },
  { t: 'Page', title: 'Privacy policy', url: 'privacy-policy.html', sub: 'Legal', text: 'privacy data cookies GDPR rights' },
];
write('assets/js/search-index.js', `window.GLOW_INDEX=${JSON.stringify(index)};`);

/* ---------- Home ---------- */
const heroImgs = ['niacinamide-clarifying-serum', 'ceramide-barrier-cream', 'daily-fluid-sunscreen-spf50'].map((s) => bySlug[s]);
const concernPicks = ['dryness', 'excess-oil', 'blemishes', 'dullness', 'uneven-tone', 'fine-lines', 'sensitivity', 'sun-protection'];
const skinPicks = ['dry', 'oily', 'combination', 'normal', 'sensitive'];
const ingredientSpots = [
  ['Niacinamide', 'Oil balance & tone', 'niacinamide-explained', '#e4d9ff', '#a98cff'],
  ['Vitamin C', 'Radiance & antioxidant care', 'vitamin-c-serum-guide', '#ffe6d1', '#ffb27a'],
  ['Retinol', 'Texture & fine lines', 'retinol-for-beginners', '#d6ecff', '#6d9bf0'],
  ['Ceramides', 'Barrier comfort', 'skin-barrier-ceramides-and-hydration', '#ffd3e2', '#ff8fb5'],
  ['Sunscreen', 'Daily protection', 'sunscreen-101-spf-explained', '#fff0b8', '#ffc94d'],
];

const homeBody = `
<section class="hero">
  <div class="blob blob--a"></div><div class="blob blob--b"></div><div class="blob blob--c"></div>
  <div class="container hero__grid">
    <div class="hero__copy">
      <p class="eyebrow eyebrow--glass">${icon('sparkle')} Independent skincare guidance</p>
      <h1>Skincare that makes sense, <span class="grad-text">for the skin you have.</span></h1>
      <p class="lead">Clear routines, honest ingredient guides and a curated discovery hub, so you can build a routine you actually enjoy, without the hype or the guesswork.</p>
      <div class="hero__cta">
        <a class="btn btn--primary btn--lg" href="shop.html">Explore products ${icon('arrow')}</a>
        <a class="btn btn--glass btn--lg" href="blog/simple-skincare-routine-for-beginners.html">Start with the basics</a>
      </div>
      <ul class="hero__trust" aria-label="Why readers trust us">
        <li>${icon('shield')} Transparent about affiliates</li>
        <li>${icon('leaf')} Ingredient-first</li>
        <li>${icon('heart')} Beginner friendly</li>
      </ul>
    </div>
    <div class="hero__visual" aria-hidden="true">
      <div class="hero__frame glass">
        <img class="hv hv--1" src="assets/img/products/${heroImgs[0].slug}.svg" alt="" width="600" height="700">
        <img class="hv hv--2" src="assets/img/products/${heroImgs[1].slug}.svg" alt="" width="600" height="700">
        <img class="hv hv--3" src="assets/img/products/${heroImgs[2].slug}.svg" alt="" width="600" height="700">
      </div>
      <div class="float-card glass float-card--a">${icon('sun')}<span><strong>AM</strong> Cleanse · Moisturize · SPF</span></div>
      <div class="float-card glass float-card--b">${icon('sparkle')}<span><strong>PM</strong> Cleanse · Treat · Moisturize</span></div>
    </div>
  </div>
</section>

<section class="strip"><div class="container strip__inner">
  <p><strong>${products.length}</strong> sample product listings</p><p><strong>${articles.length}</strong> in-depth guides</p>
  <p><strong>${site.categories.length}</strong> skincare categories</p><p><strong>0</strong> paid placements</p>
</div></section>

<section class="section"><div class="container">
  ${sectionHead({ eyebrow: 'Shop by category', title: 'Find your next <span class="grad-text">favourite step</span>', text: 'Six focused categories that mirror a real routine, from the first cleanse to the final layer of SPF.' })}
  <div class="grid grid--cats">${site.categories.map((c) => categoryCard(c, 0, countIn(c.slug))).join('')}</div>
</div></section>

<section class="section section--tint"><div class="container">
  ${sectionHead({ eyebrow: 'Featured picks', title: 'Editor\'s <span class="grad-text">product discovery</span>', text: 'Sample listings showing the kinds of products we compare. Real brands and links are added only as partnerships are confirmed.' })}
  <div class="grid grid--products">${byOrder.filter((p) => p.featured).slice(0, 4).map((p) => productCard(p, 0)).join('')}</div>
  <p class="center reveal"><a class="btn btn--primary" href="shop.html">View all ${products.length} listings ${icon('arrow')}</a></p>
</div></section>

<section class="section"><div class="container">
  ${sectionHead({ eyebrow: 'Find your match', title: 'Start with <span class="grad-text">you</span>', text: 'Pick your skin type or your main concern and we will filter the shop for you.', center: true })}
  <div class="picker glass reveal">
    <div><h3>Skin type</h3><ul class="pick-list">${skinPicks.map((s) => `<li><a class="pick" href="shop.html?skin=${s}">${site.skinTypes[s]}</a></li>`).join('')}</ul></div>
    <div><h3>Main concern</h3><ul class="pick-list">${concernPicks.map((s) => `<li><a class="pick pick--alt" href="shop.html?concern=${s}">${site.concerns[s]}</a></li>`).join('')}</ul></div>
  </div>
</div></section>

<section class="section section--dark"><div class="container">
  ${sectionHead({ eyebrow: 'Routine builder', title: 'A routine in <span class="grad-text grad-text--light">three simple steps</span>', text: 'You do not need ten products. You need the right few, used consistently.' })}
  <div class="routine">
    <div class="routine__col glass-dark reveal"><h3>${icon('sun')} Morning</h3>
      <ol><li><a href="category/cleansers.html"><b>Cleanse</b><span>Gentle rinse-off cleanser</span></a></li>
      <li><a href="category/moisturizers.html"><b>Moisturize</b><span>Hydrate and comfort</span></a></li>
      <li><a href="category/sunscreen.html"><b>Protect</b><span>Broad-spectrum SPF 30+</span></a></li></ol></div>
    <div class="routine__col glass-dark reveal"><h3>${icon('sparkle')} Evening</h3>
      <ol><li><a href="category/cleansers.html"><b>Cleanse</b><span>Remove SPF and the day</span></a></li>
      <li><a href="category/exfoliants-treatments.html"><b>Treat</b><span>Retinol or acids, a few nights a week</span></a></li>
      <li><a href="category/moisturizers.html"><b>Moisturize</b><span>Lock it all in</span></a></li></ol></div>
  </div>
  <p class="center reveal"><a class="btn btn--glass" href="blog/how-to-layer-skincare-products.html">How to layer products ${icon('arrow')}</a></p>
</div></section>

<section class="section"><div class="container">
  ${sectionHead({ eyebrow: 'Ingredient spotlight', title: 'Learn what is <span class="grad-text">actually in the bottle</span>' })}
  <ul class="spot-list">${ingredientSpots.map(([n, s, slug, c1, c2]) => `<li class="reveal"><a class="spot" href="blog/${slug}.html" style="--c1:${c1};--c2:${c2}"><span class="spot__name">${n}</span><span class="spot__sub">${s}</span><span class="spot__go">${icon('arrow')}</span></a></li>`).join('')}</ul>
</div></section>

<section class="section section--tint"><div class="container">
  ${sectionHead({ eyebrow: 'From the journal', title: 'Latest <span class="grad-text">skincare guides</span>' })}
  <div class="grid grid--articles">${articlesNewest.slice(0, 3).map((a) => articleCard(a, 0)).join('')}</div>
  <p class="center reveal"><a class="btn btn--soft" href="blog/index.html">Browse the journal ${icon('arrow')}</a></p>
</div></section>

<section class="section"><div class="container">
  ${sectionHead({ eyebrow: 'Our promise', title: 'Honest by <span class="grad-text">design</span>', center: true })}
  <div class="grid grid--trust">
    <div class="tcard reveal">${icon('shield')}<h3>Affiliate transparent</h3><p>Where affiliate links exist, they are labelled and explained. Placeholders are marked until they are real.</p></div>
    <div class="tcard reveal">${icon('leaf')}<h3>Ingredient first</h3><p>We explain what ingredients do and what the evidence supports, instead of repeating marketing claims.</p></div>
    <div class="tcard reveal">${icon('heart')}<h3>Skin-kind advice</h3><p>Gentle, patient routines. We tell you when to slow down or see a professional.</p></div>
    <div class="tcard reveal">${icon('check')}<h3>No fake reviews</h3><p>We do not invent ratings, testimonials or brand partnerships. Ever.</p></div>
  </div>
</div></section>

<section class="cta"><div class="container cta__inner glass reveal">
  <h2>Not sure where to begin?</h2><p>Our beginner guide takes six minutes and gives you a routine you can start tonight.</p>
  <a class="btn btn--primary btn--lg" href="blog/simple-skincare-routine-for-beginners.html">Read the beginner guide ${icon('arrow')}</a>
</div></section>`;

write('index.html', page({
  file: 'index.html', title: `${site.name} | Ingredient-first skincare guides & product discovery`, active: 'home',
  desc: 'Honest skincare routines, ingredient guides and a curated product discovery hub for the US, UK, Canada and Europe.',
  body: homeBody, og: 'assets/img/og-default.svg', bodyClass: 'home',
  jsonld: [{ '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: site.url,
    potentialAction: { '@type': 'SearchAction', target: `${site.url}/search.html?q={search_term_string}`, 'query-input': 'required name=search_term_string' } },
  { '@context': 'https://schema.org', '@type': 'Organization', name: site.name, url: site.url }],
}));

/* ---------- Shop + categories ---------- */
const shopLayout = (list, { fixedCategory = '' } = {}) => `
<div class="container shop" data-category="${fixedCategory}">
  <aside class="shop__side" aria-label="Filters">${filterPanel({ fixedCategory })}<button class="btn btn--primary filters-apply" type="button" id="filters-close">Show results</button></aside>
  <div class="shop__main">
    ${shopToolbar()}
    <div class="grid grid--products grid--shop" id="product-grid">${list.map((p, i) => productCard(p, fixedCategory ? 1 : 0, { eager: i < 3 })).join('')}</div>
    <div class="empty" id="empty-state" hidden>${icon('search')}<h3>No products match those filters</h3><p>Try removing a filter or two.</p><button class="btn btn--soft" type="button" id="empty-clear">Clear all filters</button></div>
  </div>
</div>`;

write('shop.html', page({
  file: 'shop.html', title: 'Shop skincare by category, skin type & concern', active: 'shop',
  desc: 'Browse and filter skincare product listings by category, skin type, concern, price tier and routine time.',
  scripts: ['shop.js'], bodyClass: 'is-shop',
  body: pageHero({ eyebrow: 'Product discovery', title: 'Shop <span class="grad-text">all skincare</span>',
    text: 'Filter by skin type, concern and price tier. These are sample product-type listings. Brands and retailer links are added once partnerships are confirmed.',
    crumbs: breadcrumbs(0, [{ name: 'Shop' }]) }) + shopLayout(byOrder),
  jsonld: [breadcrumbLd([{ name: 'Shop' }])],
}));

for (const c of site.categories) {
  const list = byOrder.filter((p) => p.category === c.slug);
  const relArt = articlesNewest.filter((a) => a.products.some((s) => bySlug[s] && bySlug[s].category === c.slug)).slice(0, 3);
  write(`category/${c.slug}.html`, page({
    depth: 1, file: `category/${c.slug}.html`, title: `${c.name}: product listings & guides`, active: 'shop',
    desc: `${c.blurb} Explore ${c.name.toLowerCase()} listings and guides, filtered by skin type, concern and price.`,
    scripts: ['shop.js'], bodyClass: 'is-shop',
    body: pageHero({ eyebrow: 'Category', title: `${esc(c.name)}`, text: esc(c.blurb),
      crumbs: breadcrumbs(1, [{ name: 'Shop', href: 'shop.html' }, { name: c.name }]) }) + shopLayout(list, { fixedCategory: c.slug }) +
      (relArt.length ? `<section class="section section--tint"><div class="container">${sectionHead({ eyebrow: 'Learn more', title: `Guides for <span class="grad-text">${esc(c.name.toLowerCase())}</span>` })}
      <div class="grid grid--articles">${relArt.map((a) => articleCard(a, 1)).join('')}</div></div></section>` : ''),
    jsonld: [breadcrumbLd([{ name: 'Shop', href: 'shop.html' }, { name: c.name }])],
  }));
}

/* ---------- Product detail pages ---------- */
for (const p of products) {
  const cat = catBySlug(p.category);
  const related = byOrder.filter((x) => x.slug !== p.slug && (x.category === p.category || x.concerns.some((c) => p.concerns.includes(c)))).slice(0, 3);
  const relArt = articlesNewest.filter((a) => a.products.includes(p.slug)).slice(0, 2);
  const cta = p.affiliateUrl
    ? `<a class="btn btn--primary btn--lg" href="${esc(p.affiliateUrl)}" target="_blank" rel="sponsored nofollow noopener">Check price at retailer ${icon('external')}</a>
       <p class="cta-note">${icon('info')} Affiliate link: we may earn a commission at no extra cost to you. <a href="../affiliate-disclosure.html">Learn more</a>.</p>`
    : `<button class="btn btn--primary btn--lg" type="button" data-affiliate-placeholder aria-controls="aff-${p.slug}" aria-expanded="false">Retailer link coming soon ${icon('external')}</button>
       <p class="cta-note" id="aff-${p.slug}" hidden>${icon('info')} <span><strong>Placeholder:</strong> no affiliate partnership is active for this listing yet. When one is, this button will link to the retailer and be marked as an affiliate link. <a href="../affiliate-disclosure.html">Affiliate disclosure</a>.</span></p>`;
  const body = `
<section class="product-top"><div class="container">
  ${breadcrumbs(1, [{ name: 'Shop', href: 'shop.html' }, { name: cat.name, href: `category/${cat.slug}.html` }, { name: p.name }])}
  <div class="product-grid">
    <div class="product-gallery glass reveal"><img src="../assets/img/products/${p.slug}.svg" alt="Illustration of a ${esc(p.name.toLowerCase())}" width="600" height="700">
      <span class="pcard__tag glass-chip">Sample listing</span></div>
    <div class="product-info">
      <p class="eyebrow"><a href="../category/${cat.slug}.html">${esc(cat.name)}</a></p>
      <h1>${esc(p.name)}</h1>
      <p class="product-brand">Brand: <em>${esc(p.brand)}</em></p>
      <p class="lead">${esc(p.summary)}</p>
      <dl class="facts">
        <div><dt>Best for</dt><dd>${p.skinTypes.map((s) => site.skinTypes[s]).join(', ')}</dd></div>
        <div><dt>Targets</dt><dd>${p.concerns.map((c) => site.concerns[c]).join(', ')}</dd></div>
        <div><dt>Use</dt><dd>${site.times[p.time]}</dd></div>
        <div><dt>Price tier</dt><dd>${esc(site.priceTiers[p.price])} <small>(indicative)</small></dd></div>
      </dl>
      <div class="cta-block">${cta}</div>
      <div class="status-box"><strong>Listing status:</strong> sample product-type listing. Brand, exact price and retailer will be added when confirmed. We do not claim any official affiliation with brands.</div>
    </div>
  </div>
</div></section>
<section class="section"><div class="container product-detail">
  <div class="prose">
    <h2>Overview</h2>${p.description.map((d) => `<p>${esc(d)}</p>`).join('')}
    <h2>Who it is for</h2><p>${esc(p.who)}</p>
    <h2>How to use</h2><ol>${p.howTo.map((h) => `<li>${esc(h)}</li>`).join('')}</ol>
  </div>
  <aside class="detail-side">
    <div class="panel glass reveal"><h3>What to look for</h3><dl class="ing">${p.lookFor.map(([n, d]) => `<div><dt>${esc(n)}</dt><dd>${esc(d)}</dd></div>`).join('')}</dl></div>
    <div class="panel panel--good reveal"><h3>${icon('check')} Good to know</h3><ul>${p.pros.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
    <div class="panel panel--warn reveal"><h3>${icon('info')} Things to consider</h3><ul>${p.cons.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
  </aside>
</div></section>
<section class="section section--tint"><div class="container"><p class="small-print">General information only, not medical advice. Patch test new products and speak with a doctor or dermatologist about skin concerns.</p>
  ${relArt.length ? `${sectionHead({ eyebrow: 'Read next', title: 'Related <span class="grad-text">guides</span>' })}<div class="grid grid--articles">${relArt.map((a) => articleCard(a, 1)).join('')}</div>` : ''}
  ${sectionHead({ eyebrow: 'Keep exploring', title: 'You might also <span class="grad-text">like</span>' })}
  <div class="grid grid--products">${related.map((x) => productCard(x, 1)).join('')}</div></div></section>`;
  write(`products/${p.slug}.html`, page({
    depth: 1, file: `products/${p.slug}.html`, title: `${p.name}: who it suits & how to use`, active: 'shop',
    desc: `${p.summary} Sample listing with ingredient notes, usage tips and things to consider.`,
    body, og: `assets/img/products/${p.slug}.svg`, scripts: [],
    jsonld: [breadcrumbLd([{ name: 'Shop', href: 'shop.html' }, { name: cat.name, href: `category/${cat.slug}.html` }, { name: p.name }])],
  }));
}

/* ---------- Blog ---------- */
const blogCats = [...new Set(articles.map((a) => a.category))];
write('blog/index.html', page({
  depth: 1, file: 'blog/index.html', title: 'Skincare journal: routines, ingredients & sun care', active: 'blog',
  desc: 'Practical, evidence-aware skincare guides on routines, ingredients, sun care and skin basics.', scripts: [],
  body: pageHero({ eyebrow: 'The journal', title: 'Skincare, <span class="grad-text">explained</span>', text: 'Calm, practical guides to routines, ingredients and sun care.',
    crumbs: breadcrumbs(1, [{ name: 'Journal' }]) }) + `
<div class="container section">
  <div class="pill-filter reveal" role="group" aria-label="Filter articles by topic" id="blog-filter">
    <button type="button" class="pill-btn is-active" data-cat="all" aria-pressed="true">All</button>
    ${blogCats.map((c) => `<button type="button" class="pill-btn" data-cat="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join('')}
  </div>
  <div class="grid grid--articles grid--blog" id="blog-grid">${articlesNewest.map((a, i) => articleCard(a, 1, { featured: i === 0 })).join('')}</div>
  <div class="empty" id="blog-empty" hidden><h3>No articles in this topic yet</h3><p>Check back soon.</p></div>
</div>`,
  jsonld: [breadcrumbLd([{ name: 'Journal' }])],
}));

for (const a of articles) {
  const prods = a.products.map((s) => bySlug[s]).filter(Boolean);
  const more = articlesNewest.filter((x) => x.slug !== a.slug).slice(0, 3);
  const heads = [...a.body.matchAll(/<h2>(.*?)<\/h2>/g)].map((m) => m[1]);
  const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const bodyWithIds = a.body.replace(/<h2>(.*?)<\/h2>/g, (_, h) => `<h2 id="${slugify(h)}">${h}</h2>`);
  const body = `
<article class="article">
  <header class="article__head"><div class="blob blob--a"></div><div class="blob blob--b"></div><div class="container container--narrow">
    ${breadcrumbs(1, [{ name: 'Journal', href: 'blog/index.html' }, { name: a.title }])}
    <p class="acard__meta"><span class="pill">${esc(a.category)}</span><span>${icon('clock')} ${a.readMins} min read</span></p>
    <h1>${esc(a.title)}</h1>
    <p class="lead">${esc(a.excerpt)}</p>
    <p class="byline">By ${esc(a.author)} · <time datetime="${a.date}">${fmtDate(a.date)}</time></p>
  </div></header>
  <div class="container container--narrow">
    <img class="article__cover" src="../assets/img/articles/${a.slug}.svg" alt="" width="1200" height="630">
    <div class="note-box">${icon('info')}<p>Educational content only, not medical advice. Some pages may contain affiliate links. <a href="../affiliate-disclosure.html">Read our disclosure</a>.</p></div>
    ${heads.length > 2 ? `<nav class="toc glass" aria-label="In this article"><h2>In this article</h2><ol>${heads.map((h) => `<li><a href="#${slugify(h)}">${h}</a></li>`).join('')}</ol></nav>` : ''}
    <div class="prose">${bodyWithIds}</div>
  </div>
  ${prods.length ? `<section class="section section--tint"><div class="container">${sectionHead({ eyebrow: 'Related products', title: 'Products mentioned <span class="grad-text">in this guide</span>', text: 'Sample listings, not endorsements of specific brands.' })}
  <div class="grid grid--products">${prods.map((p) => productCard(p, 1)).join('')}</div></div></section>` : ''}
  <section class="section"><div class="container">${sectionHead({ eyebrow: 'Keep reading', title: 'More <span class="grad-text">guides</span>' })}
  <div class="grid grid--articles">${more.map((x) => articleCard(x, 1)).join('')}</div></div></section>
</article>`;
  write(`blog/${a.slug}.html`, page({
    depth: 1, file: `blog/${a.slug}.html`, title: a.title, desc: a.excerpt, active: 'blog', body, og: `assets/img/articles/${a.slug}.svg`,
    jsonld: [{ '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.excerpt, datePublished: a.date, dateModified: a.date,
      author: { '@type': 'Organization', name: site.name }, publisher: { '@type': 'Organization', name: site.name }, image: `${site.url}/assets/img/articles/${a.slug}.svg` },
    breadcrumbLd([{ name: 'Journal', href: 'blog/index.html' }, { name: a.title }])],
  }));
}

/* ---------- Search page ---------- */
write('search.html', page({
  file: 'search.html', title: 'Search', desc: 'Search skincare product listings, ingredient guides, routines and articles across the whole site.', noindex: true,
  body: pageHero({ eyebrow: 'Search', title: 'Find <span class="grad-text">anything</span>', text: 'Search products, ingredients, routines and guides.' }) + `
<div class="container section search-page">
  <form class="search-form search-form--page glass" role="search" action="search.html" method="get">
    ${icon('search')}<label class="sr-only" for="page-q">Search</label>
    <input id="page-q" name="q" type="search" placeholder="Try: niacinamide, SPF, dry skin..." autocomplete="off">
    <button class="btn btn--primary" type="submit">Search</button>
  </form>
  <p class="search-status" id="search-status" role="status" aria-live="polite"></p>
  <div id="search-results" class="results"></div>
  <div class="suggest" id="search-suggest"><h2>Popular searches</h2>
    <ul class="pick-list">${['niacinamide', 'sunscreen', 'retinol', 'dry skin', 'vitamin C', 'barrier', 'cleanser', 'sensitive'].map((s) => `<li><a class="pick" href="search.html?q=${encodeURIComponent(s)}">${s}</a></li>`).join('')}</ul></div>
</div>`,
}));

/* ---------- About ---------- */
write('about.html', page({
  file: 'about.html', title: 'About us', active: 'about',
  desc: `Meet ${site.name}: an independent skincare guidance and product discovery site built on honesty, ingredient knowledge and transparency.`,
  body: pageHero({ eyebrow: 'About us', title: 'Skincare guidance that <span class="grad-text">respects you</span>', text: `${esc(site.name)} exists to make skincare simpler, more honest and more enjoyable.`, crumbs: breadcrumbs(0, [{ name: 'About' }]) }) + `
<section class="section"><div class="container container--narrow prose">
  <h2>Our story</h2>
  <p>Skincare shopping can feel like a maze of exaggerated claims, endless steps and affiliate-driven hype. We started ${esc(site.name)} to be the calmer alternative: a place that explains what ingredients do, shows you how to build a routine you can stick to, and helps you discover products that fit your skin and budget.</p>
  <p>We are a new, independent project, so we are upfront about where we are. Our product pages are currently <strong>sample listings</strong> that show the kinds of products we compare. Real brands, prices and retailer links will appear as partnerships are confirmed, and every affiliate link will be clearly labelled.</p>
  <h2>What we stand for</h2>
</div>
<div class="container"><div class="grid grid--trust">
  <div class="tcard reveal">${icon('shield')}<h3>Transparency</h3><p>Affiliate relationships are disclosed on the page, in the footer and on a dedicated disclosure page.</p></div>
  <div class="tcard reveal">${icon('leaf')}<h3>Education first</h3><p>We would rather you understand an ingredient than buy it because of a trend.</p></div>
  <div class="tcard reveal">${icon('heart')}<h3>Skin-kind routines</h3><p>Simple, gentle, patient. Less is often more.</p></div>
  <div class="tcard reveal">${icon('check')}<h3>Accuracy</h3><p>We update guides when evidence or guidance changes and correct mistakes promptly.</p></div>
</div></div></section>
<section class="section section--tint"><div class="container container--narrow prose">
  <h2>Editorial standards</h2>
  <ul><li>Content is written by our editorial team for general education. We are not a medical provider.</li>
  <li>We do not fabricate reviews, ratings, testimonials or brand relationships.</li>
  <li>Commercial relationships never decide what we write about an ingredient or a skin concern.</li>
  <li>We encourage patch testing and sensible sun protection, and we point you to professionals when something needs medical attention.</li></ul>
  <h2>Who we serve</h2>
  <p>Our guides are written in English for readers in the ${site.markets.slice(0, -1).join(', ')} and ${site.markets.slice(-1)}. Product availability, regulations and sunscreen labelling vary by country, so always check the label of the product you buy locally.</p>
  <p><a class="btn btn--primary" href="contact.html">Get in touch ${icon('arrow')}</a></p>
</div></section>`,
  jsonld: [breadcrumbLd([{ name: 'About' }])],
}));

/* ---------- Contact ---------- */
write('contact.html', page({
  file: 'contact.html', title: 'Contact us', active: 'contact', scripts: [],
  desc: `Contact ${site.name} with questions, corrections or partnership enquiries.`,
  body: pageHero({ eyebrow: 'Contact', title: 'Let\'s <span class="grad-text">talk</span>', text: 'Questions, corrections or partnership ideas? We read every message.', crumbs: breadcrumbs(0, [{ name: 'Contact' }]) }) + `
<section class="section"><div class="container contact">
  <form class="contact__form glass" id="contact-form" novalidate>
    <div class="field"><label for="c-name">Your name</label><input class="input" id="c-name" name="name" type="text" autocomplete="name" required></div>
    <div class="field"><label for="c-email">Email address</label><input class="input" id="c-email" name="email" type="email" autocomplete="email" required></div>
    <div class="field"><label for="c-topic">Topic</label><select class="input input--select" id="c-topic" name="topic"><option>General question</option><option>Correction or feedback</option><option>Partnership or affiliate enquiry</option><option>Press</option></select></div>
    <div class="field"><label for="c-msg">Message</label><textarea class="input" id="c-msg" name="message" rows="6" required></textarea></div>
    <button class="btn btn--primary btn--lg" type="submit">Send message ${icon('mail')}</button>
    <p class="form-status" id="form-status" role="status" aria-live="polite"></p>
    <p class="small-print">This form opens your email app with the message ready to send. A hosted form service can be added later (see README).</p>
  </form>
  <aside class="contact__side">
    <div class="panel glass"><h3>${icon('mail')} Email</h3><p><a href="mailto:${site.email}">${site.email}</a></p><p class="small-print">Placeholder address. Replace in <code>src/data/site.js</code> before launch.</p></div>
    <div class="panel glass"><h3>${icon('clock')} Response time</h3><p>We aim to reply within three working days.</p></div>
    <div class="panel glass"><h3>${icon('info')} Medical questions</h3><p>We cannot give personal medical advice. Please see a doctor or dermatologist for skin concerns.</p></div>
  </aside>
</div></section>
<section class="section section--tint"><div class="container container--narrow">
  ${sectionHead({ eyebrow: 'FAQ', title: 'Quick <span class="grad-text">answers</span>' })}
  <div class="faq">
    <details><summary>Are you affiliated with the brands you list?</summary><p>No. Current listings are samples of product types. If a brand relationship becomes active, we will label it clearly. See the <a href="affiliate-disclosure.html">affiliate disclosure</a>.</p></details>
    <details><summary>Do you accept sponsored posts?</summary><p>Not at this time. If that changes, sponsored content will be clearly labelled and will not influence our editorial recommendations.</p></details>
    <details><summary>Can you recommend a product for my skin condition?</summary><p>We share general information only. For acne, eczema, rosacea or anything persistent, please see a qualified professional.</p></details>
    <details><summary>I found an error. How do I report it?</summary><p>Please email us from the form above. We investigate and correct inaccuracies promptly.</p></details>
  </div>
</div></section>`,
  jsonld: [breadcrumbLd([{ name: 'Contact' }])],
}));

/* ---------- Legal ---------- */
const legalPage = (file, title, desc, inner) => write(file, page({
  file, title, desc, body: pageHero({ eyebrow: 'Legal', title, text: `Last updated: ${site.updated}`, crumbs: breadcrumbs(0, [{ name: title }]) }) +
    `<section class="section"><div class="container container--narrow prose legal">${inner}</div></section>`,
  jsonld: [breadcrumbLd([{ name: title }])],
}));

legalPage('affiliate-disclosure.html', 'Affiliate Disclosure', 'How affiliate links work on this site, how we choose what to feature and your rights as a reader.', `
<div class="note-box">${icon('info')}<p><strong>Plain-English summary:</strong> some links on this site may earn us a commission if you buy through them. It never costs you extra and it does not change what we write.</p></div>
<h2>Current status</h2>
<p>${esc(site.name)} is a new project. At the time of writing, our product pages are <strong>sample listings</strong>, and <strong>we have no active affiliate relationships</strong>. Buttons that will link to retailers are clearly marked as placeholders. We do not claim any official partnership with any brand or retailer.</p>
<h2>How affiliate links will work</h2>
<ul><li>When we join an affiliate programme, links to that retailer may earn us a small commission on qualifying purchases.</li>
<li>Affiliate links are marked with <code>rel="sponsored"</code> and carry a visible note next to the button.</li>
<li>The price you pay is the same whether you use our link or not.</li></ul>
<h2>Editorial independence</h2>
<p>We choose topics and products based on usefulness to readers. Commissions, brand relationships and free samples (if we ever receive any) will not decide what we say, and any such relationship will be disclosed.</p>
<h2>Where this applies</h2>
<p>We aim to follow the endorsement and advertising rules that apply to our readers, including the US Federal Trade Commission (FTC) Endorsement Guides, the UK Advertising Standards Authority (ASA) and Competition and Markets Authority (CMA) guidance, the Canadian Competition Bureau's guidance on online endorsements, and the EU Unfair Commercial Practices framework.</p>
<h2>Retailer programme statements</h2>
<p>Some programmes (for example, Amazon Associates) require specific wording. Where we join a programme that requires a statement, we will add it here and in the footer.</p>
<h2>Prices and availability</h2>
<p>Product details, prices and availability change. Always confirm on the retailer's page before you buy.</p>
<h2>Health information</h2>
<p>Our content is for general education and is not medical advice. Always read product labels and consult a healthcare professional about skin conditions.</p>
<h2>Questions</h2>
<p>Email <a href="mailto:${site.email}">${site.email}</a> or use the <a href="contact.html">contact page</a>.</p>`);

legalPage('privacy-policy.html', 'Privacy Policy', `How ${site.name} handles personal information, cookies, affiliate links and your privacy rights.`, `
<div class="note-box">${icon('info')}<p><strong>Draft for launch:</strong> this policy matches how the site works today. Have it reviewed by a qualified professional for your jurisdiction and update it if you add analytics, newsletters or ad networks.</p></div>
<h2>Who we are</h2>
<p>${esc(site.name)} is operated by ${esc(site.legalName)}, ${esc(site.address)}. Contact: <a href="mailto:${site.email}">${site.email}</a>.</p>
<h2>What information we collect</h2>
<ul><li><strong>Messages you send us.</strong> The contact form opens your own email app, so we only receive what you choose to send. We use it to reply to you.</li>
<li><strong>Technical logs.</strong> Our hosting provider may keep standard server logs (IP address, browser type, pages requested) for security and reliability.</li>
<li><strong>Search.</strong> Site search runs entirely in your browser. Your search terms are not sent to us.</li></ul>
<h2>Cookies and tracking</h2>
<p>This site does not currently set advertising or analytics cookies. If we add analytics or similar tools in future, we will update this page and ask for consent where required (for example, in the UK and EU).</p>
<h2>Affiliate links and third parties</h2>
<p>If you click a link to a retailer, that retailer or an affiliate network may set cookies or collect data under its own privacy policy. We do not control that and recommend reading theirs.</p>
<h2>How we use information</h2>
<p>To respond to enquiries, keep the site secure and improve our content. Where the GDPR or UK GDPR applies, our legal bases are legitimate interests (running and securing the site) and, for your messages, taking steps at your request.</p>
<h2>Sharing and international transfers</h2>
<p>We do not sell personal information. We may share data with service providers (such as hosting and email) who process it on our behalf. Your data may be processed outside your country, with appropriate safeguards where the law requires.</p>
<h2>Retention</h2>
<p>We keep enquiries only as long as needed to handle them and meet legal obligations.</p>
<h2>Your rights</h2>
<ul><li><strong>EU / UK:</strong> access, correction, deletion, restriction, objection and portability, plus the right to complain to your data protection authority (for example, the ICO in the UK).</li>
<li><strong>California (CCPA/CPRA) and other US states:</strong> to know, delete and correct, and to opt out of sale or sharing. We do not sell or share personal information for advertising.</li>
<li><strong>Canada (PIPEDA):</strong> access and correction rights, and to challenge compliance with the Privacy Commissioner.</li></ul>
<p>To exercise a right, email <a href="mailto:${site.email}">${site.email}</a>.</p>
<h2>Children</h2>
<p>This site is not directed to children under 16 and we do not knowingly collect their data.</p>
<h2>Changes</h2>
<p>We will post any changes here with a new &ldquo;last updated&rdquo; date.</p>`);

/* ---------- 404, robots, sitemap ---------- */
write('404.html', page({
  file: '404.html', title: 'Page not found', desc: 'The page you are looking for could not be found.', noindex: true,
  body: `<section class="page-hero page-hero--center"><div class="blob blob--a"></div><div class="blob blob--b"></div><div class="container">
  <p class="eyebrow">Error 404</p><h1>This page <span class="grad-text">wandered off</span></h1>
  <p class="lead">The link may be old or mistyped. Try search or head back to the shop.</p>
  <p class="hero__cta hero__cta--center"><a class="btn btn--primary btn--lg" href="/index.html">Back home</a><a class="btn btn--soft btn--lg" href="/search.html">Search the site</a></p></div></section>`,
}).replace(/(href|src)="(\.\.\/)?(assets|index\.html|shop\.html|blog|about|contact|privacy|affiliate|category|search)/g, '$1="/$3'));

write('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
const urls = written.filter((f) => f.endsWith('.html') && !['404.html', 'search.html'].includes(f));
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${site.url}/${u}</loc></url>`).join('\n')}\n</urlset>\n`);

console.log(`Built ${written.length} files, ${written.filter((f) => f.endsWith('.html')).length} pages -> dist/`);
