// Central site configuration. Edit the PLACEHOLDER values before launch.
module.exports = {
  name: 'GlowHer Skincare',            // temporary brand name
  short: 'GlowHer',
  tagline: 'Ingredient-first skincare guidance',
  description:
    'Independent skincare guides, routines and ingredient explainers, plus a curated product discovery hub. Clear, honest and affiliate-transparent.',
  url: 'https://www.glowher.example',   // PLACEHOLDER: replace with the real domain
  email: 'hello@glowher.example',       // PLACEHOLDER: replace with a real inbox
  legalName: '[Your legal business name]', // PLACEHOLDER
  address: '[Your business address]',      // PLACEHOLDER
  updated: '1 November 2026',
  year: 2026,
  markets: ['United States', 'United Kingdom', 'Canada', 'Europe'],

  categories: [
    { slug: 'cleansers', name: 'Cleansers', icon: 'drop', hue: ['#ffd3e2', '#ffb7d0', '#ff8fb5'],
      blurb: 'Gentle first steps that clean without stripping.' },
    { slug: 'serums', name: 'Serums', icon: 'sparkle', hue: ['#e4d9ff', '#c9b6ff', '#a98cff'],
      blurb: 'Targeted, lightweight formulas for specific goals.' },
    { slug: 'moisturizers', name: 'Moisturizers', icon: 'jar', hue: ['#ffe6d1', '#ffcfa6', '#ffb27a'],
      blurb: 'Comfort, hydration and a stronger skin barrier.' },
    { slug: 'sunscreen', name: 'Sunscreen', icon: 'sun', hue: ['#fff0b8', '#ffe28a', '#ffc94d'],
      blurb: 'Daily protection that is a joy to wear.' },
    { slug: 'exfoliants-treatments', name: 'Exfoliants & Treatments', icon: 'flask', hue: ['#cdf3ea', '#a4e6d6', '#76d7c4'],
      blurb: 'Acids and retinoids for texture, clarity and tone.' },
    { slug: 'masks-eye-care', name: 'Masks & Eye Care', icon: 'eye', hue: ['#d6ecff', '#b3dbff', '#86c3f5'],
      blurb: 'Treat-yourself steps for comfort and radiance.' },
  ],

  skinTypes: { all: 'All skin types', dry: 'Dry', oily: 'Oily', combination: 'Combination', normal: 'Normal', sensitive: 'Sensitive' },
  concerns: {
    dryness: 'Dryness', dehydration: 'Dehydration', 'excess-oil': 'Excess oil', blemishes: 'Blemishes',
    pores: 'Visible pores', dullness: 'Dullness', 'uneven-tone': 'Uneven tone', 'fine-lines': 'Fine lines',
    sensitivity: 'Sensitivity', 'sun-protection': 'Sun protection',
  },
  priceTiers: { 1: '$ Budget-friendly', 2: '$$ Mid-range', 3: '$$$ Premium' },
  times: { am: 'Morning', pm: 'Evening', both: 'Morning & evening' },
};
