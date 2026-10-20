// public/og.jpg (1200x630): wit, kop in Arvo, hun live-edge-tafelblad rechts (gespiegeld zoals de hero).
import { chromium } from 'playwright'; import fs from 'node:fs'; import sharp from 'sharp';
const font = fs.readFileSync('node_modules/@fontsource/arvo/files/arvo-latin-700-normal.woff2').toString('base64');
const foto = (await sharp('src/assets/hero-trapezium-detail.jpg').resize(1400).jpeg({ quality: 82 }).toBuffer()).toString('base64');
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.setContent(`<style>@font-face{font-family:A;src:url(data:font/woff2;base64,${font}) format('woff2')}
body{margin:0;width:1200px;height:630px;background:#fff;color:#191a17;position:relative;overflow:hidden;font-family:system-ui}
.f{position:absolute;right:0;top:0;width:900px;height:600px;object-fit:contain;object-position:0 0;transform:scaleX(-1)}
.logo{position:absolute;left:72px;top:64px;width:72px;height:72px;background:#6aab35;color:#fff;font:800 15px/1.05 system-ui;display:flex;flex-direction:column;align-items:center;justify-content:center;letter-spacing:.02em}
h1{position:absolute;left:70px;top:220px;margin:0;font:700 74px/1.02 A;letter-spacing:-.02em}
p{position:absolute;left:72px;top:480px;margin:0;font-size:24px;color:#5a5b55}</style>
<img class=f src="data:image/jpeg;base64,${foto}"><div class=logo><span>TEAK</span><span>HUIS</span></div>
<h1>Maatwerk<br>zonder<br>meerprijs.</h1><p>Teakhouten meubels, online en op bestelling</p>`);
await p.waitForTimeout(400);
await p.screenshot({ path: 'public/og.jpg', type: 'jpeg', quality: 84 }); await b.close();
console.log(fs.statSync('public/og.jpg').size);
