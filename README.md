# GlowHer Skincare (Website A)

A premium, fast, dependency-free skincare affiliate website. Source is data-driven; `node src/build.js` generates 36 static HTML pages into `dist/`, which can be hosted free on Netlify, Cloudflare Pages, GitHub Pages or Vercel.

> Brand name `GlowHer Skincare` is temporary. Change it in `src/data/site.js`.

## Quick start
```bash
node src/build.js                              # build to dist/
python3 -m http.server 8080 --directory dist   # preview at http://localhost:8080
npm test                                       # build + link check + browser tests (needs Playwright + Chrome)
```
Requires Node 18+. There are **no npm dependencies**.

## Project structure
```
src/
  build.js              static site generator (all page templates)
  data/site.js          brand, URLs, email, categories, filter labels   <- edit placeholders here
  data/products.js      13 sample product listings                       <- add real products here
  data/articles.js      8 original articles
  lib/components.js     reusable components (header, footer, cards, filters, breadcrumbs)
  lib/art.js            procedural SVG product art, article covers, icons, logo
  assets/css/styles.css design system (tokens, glass, gradients, responsive)
  assets/js/main.js     nav, search, reveal animations, blog filter, contact form
  assets/js/shop.js     product filtering, sorting, URL state, mobile drawer
tests/                  link/SEO checker + Playwright end-to-end tests
screenshots/            captured by the browser test
dist/                   generated website (deploy this folder)
```

## Pages (36)
Home, Shop (filter + sort), 6 category pages, 13 product pages, Journal index, 8 articles, Search, About, Contact, Privacy Policy, Affiliate Disclosure, 404, plus `sitemap.xml` and `robots.txt`.

## Adding real affiliate links (only after you are accepted to a programme)
In `src/data/products.js`, for a product set:
```js
brand: 'Real Brand', name: 'Real Product Name', affiliateUrl: 'https://your-tracking-link'
```
The button then changes from a "Retailer link coming soon" placeholder to a real `rel="sponsored nofollow noopener"` link with an affiliate note. Update `src/data/site.js` `url`, `email`, `legalName`, `address`, then `node src/build.js`. Where a programme requires wording (e.g. Amazon Associates), add it to `affiliate-disclosure.html` in `build.js` and to the footer.

## Adding content
- **Product:** copy an entry in `products.js` (unique `slug`; art is generated from `shape` + `palette`, or replace the SVG in `dist` build by editing `art.js`). To use real photos, put them in `src/assets/img/` and update the card/product templates (only use images you have rights to).
- **Article:** add an entry in `articles.js` (body is HTML). Search index, sitemap, blog filters and related links update automatically.

## Design and tech notes
Gradient palette (rose, violet, teal), serif display headings, glass panels, animated hero, scroll reveals (disabled for `prefers-reduced-motion`), mobile drawer navigation and filters. Images are lightweight inline-generated SVGs (about 3 KB each) with explicit dimensions and lazy loading. Semantic landmarks, skip link, keyboard-accessible menus/dialog with focus trap, ARIA live regions, visible focus, canonical URLs, Open Graph tags, JSON-LD (WebSite, Organization, Article, BreadcrumbList). Site works without JavaScript for browsing (filters/search need JS).

## Honesty safeguards
No real brands, prices, ratings, reviews or partnerships are invented. Every product is labelled "Sample listing". Health content is general education with professional-advice notes.
