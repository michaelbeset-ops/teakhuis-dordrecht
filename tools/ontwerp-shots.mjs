// Screenshots van de hero-ontwerpen (src/pages/ontwerp/) op 390 breed. Draait tegen de dev-server op poort 4448.
import { chromium } from 'playwright';
const b = await chromium.launch();
for (const v of ['a', 'b', 'c']) {
  const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(`http://localhost:4448/ontwerp/hero-${v}/`, { waitUntil: 'networkidle', timeout: 120000 });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `shots/ontwerp-${v}.png` });
  console.log(v, await p.evaluate(() => document.documentElement.scrollWidth), errs.join('|'));
}
await b.close();
