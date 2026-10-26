// Vult een offerte, onderschept de EmailJS-aanroepen (met nepsleutels) en bewaart beide mails: shots/mail.html (voor
// Teakhuis) en shots/bevestiging.html (voor de klant), plus screenshots op 640 en 375 px.
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
  const html = (await res.text()).replace(/"emailjs":\{[^}]*\}/, '"emailjs":{"service":"s","template":"t","templateKlant":"tk","publicKey":"k"}');
  r.fulfill({ response: res, body: html });
});
const verzonden = {};
await p.route('https://api.emailjs.com/**', (r) => { const d = r.request().postDataJSON(); verzonden[d.template_id] = d; r.fulfill({ status: 200, body: 'OK' }); });
await p.goto(base + 'offerte/', { waitUntil: 'networkidle' });
await p.fill('[name="naam"]', 'Jan de <b>Vries</b>');
await p.fill('[name="email"]', 'jan@example.com');
await p.fill('[name="telefoon"]', '06 12345678');
await p.fill('[name="plaats"]', 'Dordrecht');
await p.fill('[name="bericht"]', 'Kan de tafel ook 4 cm dik?\nGraag levering in maart.');
await p.click('text=Offerte aanvragen');
await p.waitForSelector('[data-bedankt]:not([hidden])');
await p.waitForTimeout(500);
const params = verzonden.t, klant = verzonden.tk;
fs.writeFileSync('shots/bevestiging.html', klant.template_params.inhoud);
console.log('klantmail aan:', klant.template_params.to_email, '| reply_to:', klant.template_params.reply_to);
fs.writeFileSync('shots/mail.html', params.template_params.inhoud);
console.log('onderwerp:', params.template_params.onderwerp, '| reply_to:', params.template_params.reply_to);
for (const [naam, html] of [['mail', params.template_params.inhoud], ['bevestiging', klant.template_params.inhoud]]) for (const w of [640, 375]) {
  const m = await (await b.newContext({ viewport: { width: w, height: 900 } })).newPage();
  await m.route('**/logo.png', (r) => r.fulfill({ path: 'public/logo.png', contentType: 'image/png' }));
  await m.route('**/_astro/**', (r) => r.fulfill({ path: 'dist' + new URL(r.request().url()).pathname.replace(/^\/teakhuis-dordrecht/, ''), contentType: 'image/jpeg' }));
  await m.setContent(html, { waitUntil: 'networkidle' });
  await m.screenshot({ path: `shots/${naam}-${w}.png`, fullPage: true });
}
await b.close();
