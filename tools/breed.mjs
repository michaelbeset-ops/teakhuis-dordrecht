import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +(process.argv[2]||320), height: 640 } });
await p.goto('http://localhost:4447/sitefront/teakhuis-dordrecht/' + (process.argv[3]||''), { waitUntil: 'networkidle' });
console.log(await p.evaluate(() => { const W = document.documentElement.clientWidth; return [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > W + 1).slice(0, 8).map(e => e.tagName + '.' + (e.className?.toString?.() || '').slice(0, 60) + ' ' + Math.round(e.getBoundingClientRect().right) + ' ' + (e.textContent || '').trim().slice(0, 40)); }));
await b.close();
