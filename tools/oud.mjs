import { chromium } from 'playwright';
const b = await chromium.launch();
for (const [w, h, n, u] of [[1440, 900, 'oud-home-1440', ''], [390, 844, 'oud-home-390', ''], [1440, 900, 'oud-uitverkoop-1440', 'webshop/etxFAX7uScLCTSM6mcUYWX/244/uitverkoop-voorraad'], [1440, 900, 'oud-proces-1440', 'maatwerk/het-proces'], [390, 844, 'oud-product-390', 'webshop/etxFAX7uScLCTSM6mcUYWX/164/132/teak-eettafels/eettafel-model-klooster']]) {
  const p = await (await b.newContext({ viewport: { width: w, height: h }, isMobile: w < 500, hasTouch: w < 500 })).newPage();
  await p.goto('https://teakhuis.nl/' + u, { waitUntil: 'networkidle' }).catch(() => {});
  await p.screenshot({ path: `bron/web/${n}.png` });
  if (n === 'oud-home-1440') await p.screenshot({ path: `bron/web/oud-home-1440-full.png`, fullPage: true });
  console.log(n, await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, vp: document.querySelector('meta[name=viewport]')?.content || 'GEEN viewport', tel: document.querySelectorAll('a[href^="tel:"]').length, wa: document.querySelectorAll('a[href*="wa.me"],a[href*="whatsapp"]').length, h: document.documentElement.scrollHeight, title: document.title, https: location.protocol })));
}
await b.close();
