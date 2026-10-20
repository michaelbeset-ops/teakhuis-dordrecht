// Screenshots 1440/390/320: view + full page, plus scrollWidth. Args: prefix [pad]
import { chromium } from 'playwright';
import sharp from 'sharp';
const pre = process.argv[2] || 'r1', pad = process.argv[3] || '';
const base = 'http://localhost:4447/sitefront/teakhuis-dordrecht/' + pad;
const b = await chromium.launch();
for (const [w, h] of [[1440, 900], [390, 844], [320, 640]]) {
  const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.goto(base, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `shots/${pre}-view-${w}.png` });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)); } });
  await p.waitForTimeout(1500);
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(400);
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  const delen = [];
  for (let y = 0; y < H; y += 4000) delen.push({ input: await p.screenshot({ fullPage: true, clip: { x: 0, y, width: w, height: Math.min(4000, H - y) } }), top: y, left: 0 });
  const full = `shots/${pre}-full-${w}.png`;
  await sharp({ create: { width: w, height: H, channels: 3, background: '#ffffff' } }).composite(delen).png().toFile(full);
  for (let i = 0, y = 0; y < H; y += 1800, i++) await sharp(full).extract({ left: 0, top: y, width: w, height: Math.min(1800, H - y) }).resize(w > 1000 ? 1000 : w).toFile(`shots/_${pre}-${w}-${i}.png`);
  console.log(w, 'H', H, 'scrollWidth', await p.evaluate(() => document.documentElement.scrollWidth), errs.join(' | '));
  await p.context().close();
}
await b.close();
