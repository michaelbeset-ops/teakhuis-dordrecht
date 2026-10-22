// Vult een offerte, onderschept de EmailJS-aanroep (met nepsleutels) en bewaart de HTML-mail als shots/mail.html + png.
import { chromium } from 'playwright';
import fs from 'node:fs';
const base = process.env.BASE || 'http://localhost:4447/';
const b = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium' });
const p = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
await p.goto(base + 'product/eettafel-viking/', { waitUntil: 'networkidle' });
await p.check('input[name="maat"][value="B200 x D100 x H78"]', { force: true });
await p.click('text=Zet in offerteaanvraag');
await p.goto(base + 'product/beaufort-bank/', { waitUntil: 'networkidle' });
await p.click('text=Zet in offerteaanvraag');
await p.route('**/offerte/', async (r) => {
  const res = await r.fetch();
  const html = (await res.text()).replace('"emailjs":{"service":"","template":"","publicKey":""}', '"emailjs":{"service":"s","template":"t","publicKey":"k"}');
  r.fulfill({ response: res, body: html });
});
let params;
await p.route('https://api.emailjs.com/**', (r) => { params = r.request().postDataJSON(); r.fulfill({ status: 200, body: 'OK' }); });
await p.goto(base + 'offerte/', { waitUntil: 'networkidle' });
await p.fill('[name="naam"]', 'Jan de <b>Vries</b>');
await p.fill('[name="email"]', 'jan@example.com');
await p.fill('[name="telefoon"]', '06 12345678');
await p.fill('[name="plaats"]', 'Dordrecht');
await p.fill('[name="bericht"]', 'Kan de tafel ook 4 cm dik?\nGraag levering in maart.');
await p.click('text=Offerte aanvragen');
await p.waitForSelector('[data-bedankt]:not([hidden])');
fs.writeFileSync('shots/mail.html', params.template_params.inhoud);
console.log('onderwerp:', params.template_params.onderwerp, '| reply_to:', params.template_params.reply_to);
for (const w of [640, 375]) {
  const m = await (await b.newContext({ viewport: { width: w, height: 900 } })).newPage();
  await m.setContent(params.template_params.inhoud, { waitUntil: 'networkidle' });
  await m.screenshot({ path: `shots/mail-${w}.png`, fullPage: true });
}
await b.close();
