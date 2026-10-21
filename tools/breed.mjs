// Welke elementen steken buiten de viewport? Args: pad breedte
import { chromium } from 'playwright';
const [pad = '', w = 390] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await (await b.newContext({ viewport: { width: +w, height: 800 } })).newPage();
await p.goto('http://localhost:4447/' + pad, { waitUntil: 'networkidle' });
console.log(await p.evaluate((W) => [...document.querySelectorAll('body *')].filter((e) => e.getBoundingClientRect().right > W + 1).slice(0, 12).map((e) => `${e.tagName}.${(e.className?.baseVal ?? e.className).toString().slice(0, 80)} r=${Math.round(e.getBoundingClientRect().right)}`).join('\n'), +w));
await b.close();
