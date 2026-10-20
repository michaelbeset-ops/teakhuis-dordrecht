// Snel: alleen eerste scherm (en optioneel een sectie-id) op 1440/390.
import { chromium } from 'playwright';
const id = process.argv[2] || ''; const b = await chromium.launch();
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
  await p.goto('http://localhost:4447/sitefront/teakhuis-dordrecht/', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.querySelectorAll('.rijs').forEach((e) => e.classList.add('in')));
  if (id) await p.evaluate((i) => document.getElementById(i).scrollIntoView(), id);
  await p.waitForTimeout(500);
  await p.screenshot({ path: `shots/_v-${id || 'top'}-${w}.png`, fullPage: false });
}
await b.close();
