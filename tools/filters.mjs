// Test van de filters op een collectiepagina, plus screenshots van het mobiele filterpaneel.
import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium' });
const fouten = [];
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
  p.on('pageerror', (e) => fouten.push(e.message));
  await p.goto('http://localhost:4447/collectie/tafels/', { waitUntil: 'networkidle' });
  const zicht = () => p.evaluate(() => [...document.querySelectorAll('[data-grid] > li')].filter((l) => !l.hidden).length);
  console.log(w, 'start', await p.textContent('[data-teller]'), 'zichtbaar', await zicht());
  if (w < 1000) { await p.click('[data-paneel-open]'); await p.waitForTimeout(400); await p.screenshot({ path: 'shots/filter-paneel-390.png' }); }
  await p.check('input[name="soort"][value="teak-eettafels"]');
  console.log(w, 'eettafels', await p.textContent('[data-teller]'), 'zichtbaar', await zicht());
  await p.check('input[name="breedte"][value="220-999"]');
  console.log(w, '+ 220 breed', await p.textContent('[data-teller]'));
  if (w < 1000) { await p.click('[data-paneel-dicht]'); await p.waitForTimeout(400); await p.screenshot({ path: 'shots/filter-na-390.png' }); }
  else await p.screenshot({ path: 'shots/filter-1440.png', fullPage: false });
  await p.evaluate(() => document.querySelector('form[data-filters]').reset()); await p.waitForTimeout(100);
  console.log(w, 'na wissen', await p.textContent('[data-teller]'), 'meer zichtbaar:', await p.isVisible('[data-meer]'));
  await p.click('[data-meer]'); console.log(w, 'na toon meer', await zicht());
}
console.log('fouten:', fouten.join(' | ') || 'geen');
await b.close();
