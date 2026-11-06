"""End-to-end checks + screenshots. Usage: python3 tests/browser-test.py  (needs playwright + Chrome)."""
import subprocess, time, sys, os, json
from playwright.sync_api import sync_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHOTS = os.path.join(ROOT, 'screenshots'); os.makedirs(SHOTS, exist_ok=True)
srv = subprocess.Popen([sys.executable, '-m', 'http.server', '8765', '--directory', os.path.join(ROOT, 'dist')], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1)
B = 'http://localhost:8765/'
fails, passes = [], 0
def check(name, cond, extra=''):
    global passes
    if cond: passes += 1; print('PASS', name)
    else: fails.append(name); print('FAIL', name, extra)
try:
    with sync_playwright() as p:
        br = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        errs = []
        def newpage(w=1440, h=900, mobile=False):
            ctx = br.new_context(viewport={'width': w, 'height': h}, is_mobile=mobile, has_touch=mobile, device_scale_factor=1)
            pg = ctx.new_page()
            pg.on('console', lambda m: errs.append((pg.url, m.text)) if m.type == 'error' else None)
            pg.on('pageerror', lambda e: errs.append((pg.url, str(e))))
            pg.on('requestfailed', lambda r: errs.append((pg.url, 'requestfailed ' + r.url)))
            return pg
        def reveal_all(pg):
            pg.evaluate("document.querySelectorAll('.reveal').forEach(e=>e.classList.add('is-visible'))"); pg.wait_for_timeout(900)
        def shot(pg, name, full=True):
            reveal_all(pg); pg.screenshot(path=os.path.join(SHOTS, name), full_page=full)

        d = newpage()
        # ---- Home
        d.goto(B + 'index.html'); d.wait_for_timeout(600)
        check('home title', 'GlowHer' in d.title())
        check('home has 6 category cards', d.locator('.ccard').count() == 6)
        shot(d, 'home-desktop.png')
        d.screenshot(path=os.path.join(SHOTS, 'home-hero-desktop.png'))
        # nav dropdown
        d.hover('.has-menu > a'); d.wait_for_timeout(400)
        check('mega menu visible on hover', d.locator('#shop-menu').is_visible())
        d.screenshot(path=os.path.join(SHOTS, 'nav-dropdown-desktop.png'))
        # ---- Shop filters
        d.goto(B + 'shop.html'); d.wait_for_timeout(500)
        total = d.locator('.pcard:not([hidden])').count()
        check('shop lists all 13 products', total == 13, total)
        d.check('input[name=skin][value=oily]'); d.wait_for_timeout(200)
        oily = d.locator('.pcard:not([hidden])').count()
        check('skin=oily filters', 0 < oily < 13, oily)
        d.check('input[name=price][value="1"]'); d.wait_for_timeout(200)
        n2 = d.locator('.pcard:not([hidden])').count()
        check('price tier narrows further', 0 < n2 <= oily, n2)
        check('URL state synced', 'skin=oily' in d.url and 'price=1' in d.url, d.url)
        check('active filter chips shown', d.locator('.afilter').count() == 2)
        d.select_option('#sort', 'price-desc'); d.wait_for_timeout(200)
        prices = d.eval_on_selector_all('.pcard:not([hidden])', 'els=>els.map(e=>+e.dataset.price)')
        check('sort price high->low', prices == sorted(prices, reverse=True), prices)
        d.select_option('#sort', 'name-asc'); d.wait_for_timeout(200)
        names = d.eval_on_selector_all('.pcard:not([hidden]) h3', 'els=>els.map(e=>e.textContent.trim())')
        check('sort name A-Z', names == sorted(names), names)
        d.fill('#filter-q', 'zzzzqq'); d.wait_for_timeout(200)
        check('empty state shown', d.locator('#empty-state').is_visible())
        d.click('#empty-clear'); d.wait_for_timeout(200)
        check('clear restores all', d.locator('.pcard:not([hidden])').count() == 13)
        d.goto(B + 'shop.html?concern=dryness&skin=sensitive'); d.wait_for_timeout(400)
        check('deep-link filters applied', d.locator('input[name=skin][value=sensitive]').is_checked() and d.locator('.pcard:not([hidden])').count() < 13)
        d.goto(B + 'shop.html'); d.wait_for_timeout(400)
        shot(d, 'shop-desktop.png', full=False)
        # ---- Category
        d.goto(B + 'category/serums.html'); d.wait_for_timeout(400)
        check('category shows only serums (3)', d.locator('.pcard:not([hidden])').count() == 3)
        shot(d, 'category-serums-desktop.png')
        # ---- Product
        d.goto(B + 'products/niacinamide-clarifying-serum.html'); d.wait_for_timeout(400)
        check('product h1', 'Niacinamide' in d.locator('h1').inner_text())
        d.click('[data-affiliate-placeholder]'); d.wait_for_timeout(200)
        check('affiliate placeholder note toggles', d.locator('.cta-note').is_visible())
        check('no fake affiliate link rendered', d.locator('a[rel*=sponsored]').count() == 0)
        shot(d, 'product-desktop.png')
        # ---- Blog
        d.goto(B + 'blog/index.html'); d.wait_for_timeout(400)
        check('blog lists 8 articles', d.locator('.acard:not([hidden])').count() == 8)
        d.click('.pill-btn[data-cat="Ingredients"]'); d.wait_for_timeout(200)
        check('blog topic filter', d.locator('.acard:not([hidden])').count() == 3, d.locator('.acard:not([hidden])').count())
        d.click('.pill-btn[data-cat="all"]'); shot(d, 'blog-desktop.png')
        d.goto(B + 'blog/sunscreen-101-spf-explained.html'); d.wait_for_timeout(400)
        check('article toc anchors', d.locator('.toc a').count() >= 3)
        shot(d, 'article-desktop.png')
        # ---- Search overlay + page
        d.goto(B + 'index.html'); d.wait_for_timeout(300)
        d.click('#open-search'); d.fill('#overlay-q', 'sunscreens'); d.wait_for_timeout(300)
        check('overlay live results (plural stemming)', d.locator('#search-live .hit').count() >= 2, d.locator('#search-live .hit').count())
        d.screenshot(path=os.path.join(SHOTS, 'search-overlay-desktop.png'))
        d.keyboard.press('Escape'); d.wait_for_timeout(200)
        check('Esc closes overlay', not d.locator('#search-overlay').is_visible())
        d.goto(B + 'search.html?q=niacinamide'); d.wait_for_timeout(300)
        check('search page results', d.locator('#search-results .hit').count() >= 2)
        d.goto(B + 'search.html?q=xyzxyz'); d.wait_for_timeout(300)
        check('search no-results message', 'No results' in d.locator('#search-status').inner_text())
        d.goto(B + 'search.html?q=retinol'); d.wait_for_timeout(300); shot(d, 'search-page-desktop.png', full=False)
        # ---- Static pages
        for pth, label in [('about.html', 'about'), ('contact.html', 'contact'), ('privacy-policy.html', 'privacy'), ('affiliate-disclosure.html', 'affiliate-disclosure')]:
            d.goto(B + pth); d.wait_for_timeout(300); shot(d, f'{label}-desktop.png')
        d.goto(B + 'contact.html'); d.click('#contact-form button[type=submit]'); d.wait_for_timeout(200)
        check('contact validation', 'complete' in d.locator('#form-status').inner_text().lower())
        d.goto(B + 'does-not-exist.html')
        # ---- Mobile
        m = newpage(390, 844, mobile=True)
        m.goto(B + 'index.html'); m.wait_for_timeout(600)
        sw = m.evaluate('document.documentElement.scrollWidth'); check('home: no horizontal scroll @390px', sw <= 391, sw)
        m.screenshot(path=os.path.join(SHOTS, 'home-hero-mobile.png'))
        shot(m, 'home-mobile.png')
        m.click('#nav-toggle'); m.wait_for_timeout(400)
        check('mobile menu opens', m.locator('#primary-nav').is_visible())
        nh = m.evaluate("document.getElementById('primary-nav').getBoundingClientRect().height")
        check('mobile menu fills screen (>500px)', nh > 500, nh)
        m.click('.has-menu .menu-toggle'); m.wait_for_timeout(300)
        m.screenshot(path=os.path.join(SHOTS, 'mobile-menu.png'))
        m.click('#nav-toggle'); m.wait_for_timeout(300)
        for pth in ['shop.html', 'products/ceramide-barrier-cream.html', 'blog/index.html', 'contact.html', 'about.html']:
            m.goto(B + pth); m.wait_for_timeout(400)
            sw = m.evaluate('document.documentElement.scrollWidth'); check(f'{pth}: no horizontal scroll @390px', sw <= 391, sw)
        m.goto(B + 'shop.html'); m.wait_for_timeout(400)
        m.click('#filters-open'); m.wait_for_timeout(400)
        check('mobile filter drawer opens', m.locator('.shop__side').is_visible())
        m.screenshot(path=os.path.join(SHOTS, 'shop-filters-mobile.png'))
        m.check('input[name=skin][value=dry]'); m.click('#filters-close'); m.wait_for_timeout(300)
        check('mobile filter applied + drawer closed', not m.locator('.shop__side').is_visible() and m.locator('.pcard:not([hidden])').count() < 13)
        shot(m, 'shop-mobile.png', full=False)
        m.goto(B + 'products/ceramide-barrier-cream.html'); m.wait_for_timeout(300); shot(m, 'product-mobile.png')
        # tablet
        t = newpage(820, 1100); t.goto(B + 'index.html'); t.wait_for_timeout(500)
        check('home: no horizontal scroll @820px', t.evaluate('document.documentElement.scrollWidth') <= 821)
        shot(t, 'home-tablet.png', full=False)
        # no-JS safety: content visible without JS
        ctx = br.new_context(java_script_enabled=False, viewport={'width': 1280, 'height': 800}); nj = ctx.new_page()
        nj.goto(B + 'shop.html'); check('no-JS: products still visible', nj.locator('.pcard').first.is_visible())
        br.close()
    real = [e for e in errs if '404.html' not in e[0] and 'does-not-exist' not in e[1] and 'favicon' not in e[1]]
    real = [e for e in real if 'Failed to load resource' not in e[1] or 'does-not-exist' not in e[0]]
    check('no console/network errors', not real, json.dumps(real[:5]))
finally:
    srv.terminate()
print(f'\n{passes} passed, {len(fails)} failed'); print('\n'.join(fails))
sys.exit(1 if fails else 0)
