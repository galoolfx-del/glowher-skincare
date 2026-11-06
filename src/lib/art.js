// Procedural SVG artwork: product illustrations, article covers, icons.
// No external images, so the site stays fast, free and free of third-party rights issues.

const shapes = {
  jar: (id) => `
    <ellipse cx="300" cy="568" rx="150" ry="20" fill="#2b1d3a" opacity=".12"/>
    <rect x="170" y="360" width="260" height="200" rx="46" fill="url(#g${id})"/>
    <rect x="160" y="300" width="280" height="76" rx="26" fill="url(#c${id})"/>
    <rect x="196" y="392" width="208" height="110" rx="22" fill="#fff" opacity=".55"/>
    <rect x="196" y="418" width="120" height="10" rx="5" fill="url(#c${id})" opacity=".7"/>
    <rect x="196" y="440" width="80" height="8" rx="4" fill="#2b1d3a" opacity=".18"/>
    <rect x="190" y="372" width="18" height="176" rx="9" fill="#fff" opacity=".4"/>`,
  tube: (id) => `
    <ellipse cx="300" cy="586" rx="120" ry="16" fill="#2b1d3a" opacity=".12"/>
    <path d="M200 160 H400 L388 520 Q386 560 350 560 H250 Q214 560 212 520 Z" fill="url(#g${id})"/>
    <rect x="236" y="96" width="128" height="72" rx="14" fill="url(#c${id})"/>
    <rect x="244" y="540" width="112" height="28" rx="8" fill="url(#c${id})" opacity=".85"/>
    <rect x="230" y="240" width="140" height="170" rx="22" fill="#fff" opacity=".55"/>
    <rect x="248" y="270" width="84" height="10" rx="5" fill="url(#c${id})" opacity=".7"/>
    <rect x="248" y="294" width="60" height="8" rx="4" fill="#2b1d3a" opacity=".18"/>
    <rect x="216" y="180" width="14" height="320" rx="7" fill="#fff" opacity=".4"/>`,
  dropper: (id) => `
    <ellipse cx="300" cy="586" rx="120" ry="16" fill="#2b1d3a" opacity=".12"/>
    <rect x="190" y="290" width="220" height="280" rx="40" fill="url(#g${id})"/>
    <rect x="244" y="250" width="112" height="52" rx="12" fill="url(#c${id})"/>
    <rect x="262" y="136" width="76" height="120" rx="38" fill="url(#c${id})" opacity=".92"/>
    <rect x="288" y="82" width="24" height="64" rx="12" fill="url(#c${id})"/>
    <rect x="214" y="350" width="172" height="150" rx="20" fill="#fff" opacity=".55"/>
    <rect x="236" y="382" width="100" height="10" rx="5" fill="url(#c${id})" opacity=".7"/>
    <rect x="236" y="406" width="70" height="8" rx="4" fill="#2b1d3a" opacity=".18"/>
    <rect x="204" y="310" width="16" height="240" rx="8" fill="#fff" opacity=".4"/>`,
  pump: (id) => `
    <ellipse cx="300" cy="586" rx="120" ry="16" fill="#2b1d3a" opacity=".12"/>
    <rect x="190" y="230" width="220" height="340" rx="44" fill="url(#g${id})"/>
    <rect x="262" y="190" width="76" height="48" rx="10" fill="url(#c${id})"/>
    <rect x="286" y="120" width="28" height="76" rx="8" fill="url(#c${id})"/>
    <path d="M286 120 H380 Q400 120 400 140 V152 H314 V132 Z" fill="url(#c${id})"/>
    <rect x="214" y="320" width="172" height="170" rx="22" fill="#fff" opacity=".55"/>
    <rect x="236" y="354" width="104" height="10" rx="5" fill="url(#c${id})" opacity=".7"/>
    <rect x="236" y="378" width="70" height="8" rx="4" fill="#2b1d3a" opacity=".18"/>
    <rect x="204" y="250" width="16" height="300" rx="8" fill="#fff" opacity=".4"/>`,
  bottle: (id) => `
    <ellipse cx="300" cy="586" rx="110" ry="16" fill="#2b1d3a" opacity=".12"/>
    <path d="M240 200 H360 V250 Q410 280 410 340 V520 Q410 570 360 570 H240 Q190 570 190 520 V340 Q190 280 240 250 Z" fill="url(#g${id})"/>
    <rect x="254" y="120" width="92" height="88" rx="14" fill="url(#c${id})"/>
    <rect x="214" y="350" width="172" height="150" rx="22" fill="#fff" opacity=".55"/>
    <rect x="236" y="384" width="100" height="10" rx="5" fill="url(#c${id})" opacity=".7"/>
    <rect x="236" y="408" width="70" height="8" rx="4" fill="#2b1d3a" opacity=".18"/>
    <rect x="204" y="320" width="16" height="220" rx="8" fill="#fff" opacity=".4"/>`,
};

function productSvg(p) {
  const [a, b, c] = p.palette;
  const id = p.slug.replace(/[^a-z0-9]/g, '').slice(0, 10);
  const body = (shapes[p.shape] || shapes.jar)(id);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 700" role="img" aria-label="${p.name} illustration">
  <defs>
    <linearGradient id="bg${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="#fff7f4"/></linearGradient>
    <linearGradient id="g${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${c}" stop-opacity=".9"/></linearGradient>
    <linearGradient id="c${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient>
    <radialGradient id="r${id}" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="600" height="700" fill="url(#bg${id})"/>
  <circle cx="110" cy="110" r="140" fill="${b}" opacity=".25"/>
  <circle cx="520" cy="620" r="170" fill="${c}" opacity=".16"/>
  <circle cx="300" cy="330" r="260" fill="url(#r${id})"/>
  <circle cx="470" cy="150" r="9" fill="#fff" opacity=".9"/><circle cx="130" cy="520" r="6" fill="#fff" opacity=".9"/><circle cx="505" cy="400" r="5" fill="#fff" opacity=".8"/>
  ${body}
</svg>`;
}

const motifs = {
  sun: `<circle cx="960" cy="200" r="90" fill="#fff" opacity=".55"/><circle cx="960" cy="200" r="150" fill="none" stroke="#fff" stroke-width="4" opacity=".4"/><circle cx="960" cy="200" r="210" fill="none" stroke="#fff" stroke-width="2" opacity=".3"/>`,
  drop: `<path d="M960 90 C1040 210 1070 260 1070 320 A110 110 0 0 1 850 320 C850 260 880 210 960 90 Z" fill="#fff" opacity=".5"/><path d="M1080 380 C1115 430 1128 450 1128 478 A48 48 0 0 1 1032 478 C1032 450 1045 430 1080 380 Z" fill="#fff" opacity=".4"/>`,
  molecule: `<g stroke="#fff" stroke-width="6" opacity=".6"><line x1="860" y1="420" x2="960" y2="300"/><line x1="960" y1="300" x2="1080" y2="340"/><line x1="1080" y1="340" x2="1130" y2="220"/><line x1="960" y1="300" x2="930" y2="170"/></g><g fill="#fff" opacity=".75"><circle cx="860" cy="420" r="30"/><circle cx="960" cy="300" r="44"/><circle cx="1080" cy="340" r="26"/><circle cx="1130" cy="220" r="34"/><circle cx="930" cy="170" r="22"/></g>`,
  layers: `<g fill="#fff"><rect x="820" y="130" width="300" height="80" rx="40" opacity=".35"/><rect x="860" y="230" width="300" height="80" rx="40" opacity=".5"/><rect x="900" y="330" width="260" height="80" rx="40" opacity=".65"/></g>`,
};

function articleSvg(a) {
  const [c1, c2, c3] = a.palette;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" role="img" aria-label="${a.category} article cover">
  <defs>
    <linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset=".55" stop-color="${c2}"/><stop offset="1" stop-color="${c3}"/></linearGradient>
    <radialGradient id="b" cx=".2" cy=".15" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#a)"/><rect width="1200" height="630" fill="url(#b)"/>
  <circle cx="150" cy="560" r="180" fill="#fff" opacity=".18"/><circle cx="640" cy="40" r="110" fill="#fff" opacity=".14"/>
  ${motifs[a.motif] || motifs.sun}
</svg>`;
}

const icons = {
  drop: '<path d="M12 3c3.5 4.3 6 7.3 6 10.5A6 6 0 0 1 6 13.5C6 10.3 8.5 7.3 12 3Z"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/>',
  jar: '<rect x="4" y="10" width="16" height="10" rx="3"/><rect x="5" y="5" width="14" height="5" rx="2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  flask: '<path d="M9 3h6M10 3v6L5 19a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 19l-5-10V3"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z"/><path d="m9 12 2 2 4-4"/>',
  leaf: '<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19c3-5 6-7 10-9"/>',
  heart: '<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11Z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
};

const icon = (name, cls = '') =>
  `<svg class="icon ${cls}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${icons[name] || ''}</svg>`;

const logoMark = `<svg class="logo__mark" viewBox="0 0 40 40" aria-hidden="true" focusable="false"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff7aa8"/><stop offset=".55" stop-color="#a35bf0"/><stop offset="1" stop-color="#4cc3d9"/></linearGradient></defs><rect width="40" height="40" rx="13" fill="url(#lg)"/><path d="M20 8c5 6 8 9.6 8 13.6A8 8 0 0 1 12 21.6C12 17.6 15 14 20 8Z" fill="#fff" opacity=".95"/><circle cx="26.5" cy="12" r="2.2" fill="#fff" opacity=".85"/></svg>`;

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff7aa8"/><stop offset=".55" stop-color="#a35bf0"/><stop offset="1" stop-color="#4cc3d9"/></linearGradient></defs><rect width="40" height="40" rx="11" fill="url(#lg)"/><path d="M20 8c5 6 8 9.6 8 13.6A8 8 0 0 1 12 21.6C12 17.6 15 14 20 8Z" fill="#fff"/></svg>`;

module.exports = { productSvg, articleSvg, icon, logoMark, faviconSvg };
