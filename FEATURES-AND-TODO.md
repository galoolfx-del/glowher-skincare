# Completed features
1. Premium homepage: animated gradient hero, trust strip, category cards, featured products, skin-type/concern picker, dark routine builder, ingredient spotlight, journal teaser, trust section, CTA
2. Navigation: sticky glass header, Shop mega-menu (hover/click/keyboard), mobile full-screen menu, skip link, breadcrumbs
3. Six skincare categories with their own pages and related guides
4. Product discovery: featured picks, pick-by-skin-type/concern deep links, related products
5. 13 product detail pages: facts, what to look for, how to use, pros/cons, affiliate placeholder, related guides and products
6. Journal: 8 original articles, topic filter, table of contents, related products, Article schema
7. Search: live overlay (press `/` or Ctrl/Cmd+K), results page, plural handling, keyboard navigation
8. Filtering and sorting: category, skin type, concern, price tier, routine time, text; sort by featured/newest/name/price; URL-shareable state; active-filter chips; mobile drawer
9. About, Contact (validated form, mailto handoff, FAQ)
10. Privacy Policy (US/UK/EU/Canada), Affiliate Disclosure (FTC/ASA/CMA/Competition Bureau/EU)
11. Responsive footer with disclosure notice
12. SEO: titles, descriptions, canonical, Open Graph, JSON-LD, sitemap.xml, robots.txt, 404
13. Accessibility: landmarks, focus states, focus-trapped dialog, aria-live, reduced-motion support
14. Tests: 2,125 link/asset/anchor checks + 38 browser tests (filters, sort, search, mobile menu, overflow at 390/820 px, no-JS, no console errors)

# Remaining tasks (before launch)
- Replace placeholders in `src/data/site.js`: domain, email, legal name, address. Final brand name and logo.
- Join affiliate programmes, then add real brands/products and `affiliateUrl` values (the site intentionally has none).
- Replace the illustrated product art with licensed or brand-supplied photos once real products are added.
- Have the Privacy Policy and Affiliate Disclosure reviewed by a qualified professional; add retailer-required wording.
- Add a cookie banner if analytics or ad/affiliate scripts are added (UK/EU consent).
- Connect a real contact-form service (Formspree, Netlify Forms) instead of mailto.
- Verify live product prices/availability per market; consider market-specific retailer links (US/UK/CA/EU) and a country switcher.
- Add analytics (privacy-friendly), Search Console, and a newsletter if desired.
- Have a qualified reviewer fact-check the health/ingredient articles; add more articles regularly.

# Known limitations / bugs
- Phase 3 blueprint was not available in the workspace, so structure follows the Phase 4 brief; align page list and naming if the blueprint differs.
- Product pages use generated illustrations, not photos; prices are indicative tiers only, with no ratings.
- Contact form relies on the visitor's email app (mailto).
- Search is client-side over a small index: no typo tolerance.
- Fonts are system fonts (fastest and free), so typography varies slightly by OS.
- Canonical/sitemap URLs use the placeholder domain until `site.url` is set.
- Tested in Chromium only (desktop 1440, tablet 820, mobile 390); Safari/Firefox not run.
- Fixed during testing: mobile menu collapsing (header backdrop-filter containing block), filter legends overlapping dividers, search overlay transparency.
