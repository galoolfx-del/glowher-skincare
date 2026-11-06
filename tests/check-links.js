// Verifies every internal link, image, script, stylesheet and #anchor in /dist resolves.
const fs = require('fs'), path = require('path');
const DIST = path.join(__dirname, '..', 'dist');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const htmlFiles = walk(DIST).filter((f) => f.endsWith('.html'));
let checked = 0; const errors = []; const seoIssues = [];
const ids = {};
for (const f of htmlFiles) ids[f] = new Set([...fs.readFileSync(f, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
for (const f of htmlFiles) {
  const html = fs.readFileSync(f, 'utf8'); const rel = path.relative(DIST, f);
  const is404 = rel === '404.html';
  for (const m of html.matchAll(/(?:href|src)="([^"]*)"/g)) {
    let url = m[1];
    if (!url || /^(https?:|mailto:|tel:|data:|javascript:)/.test(url)) continue;
    const [p, hash] = url.split('#'); const [pathOnly] = p.split('?');
    let target = pathOnly === '' ? f : (pathOnly.startsWith('/') ? path.join(DIST, pathOnly) : path.resolve(path.dirname(f), pathOnly));
    checked++;
    if (!fs.existsSync(target)) { errors.push(`${rel}: missing ${url}`); continue; }
    if (hash && target.endsWith('.html') && !ids[target].has(hash)) errors.push(`${rel}: missing anchor #${hash} in ${path.relative(DIST, target)}`);
  }
  if (!is404) {
    if (!/<title>[^<]{10,}/.test(html)) seoIssues.push(`${rel}: weak title`);
    if (!/<meta name="description" content="[^"]{50,}/.test(html)) seoIssues.push(`${rel}: description short/missing`);
    if ((html.match(/<h1[ >]/g) || []).length !== 1) seoIssues.push(`${rel}: expected exactly one h1`);
    for (const m of html.matchAll(/<img\b[^>]*>/g)) if (!/\salt="/.test(m[0]) || !/\swidth=/.test(m[0])) seoIssues.push(`${rel}: img missing alt/width`);
  }
}
console.log(`Pages: ${htmlFiles.length}, references checked: ${checked}`);
console.log(errors.length ? `BROKEN (${errors.length}):\n${errors.join('\n')}` : 'Links: all OK');
console.log(seoIssues.length ? `SEO/a11y issues (${seoIssues.length}):\n${seoIssues.join('\n')}` : 'SEO/a11y basics: all OK');
process.exit(errors.length || seoIssues.length ? 1 : 0);
