// Crawlt teakhuis.nl (binnen domein), bewaart html + platte tekst en lijst van afbeeldingen.
import fs from 'node:fs';
const B = 'https://teakhuis.nl/';
const uit = 'bron/web/site';
fs.mkdirSync(uit, { recursive: true });
const gezien = new Set(); const rij = [''];
const imgs = new Map();
const tekst = (h) => h.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|h\d|li|tr|a)>/gi, '\n').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&euro;/g, '€').replace(/&ndash;/g, '-').replace(/&#39;/g, "'").replace(/&eacute;/g,'é').replace(/&euml;/g,'ë').replace(/&hellip;/g,'…').replace(/[ \t\r]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim();
const max = +process.argv[2] || 600;
while (rij.length && gezien.size < max) {
  const pad = rij.shift(); const key = pad.toLowerCase(); if (gezien.has(key)) continue; gezien.add(key);
  let h; try { const r = await fetch(B + pad, { headers: { 'user-agent': 'Mozilla/5.0' } }); if (!r.ok) { console.log(r.status, pad); continue; } h = await r.text(); } catch (e) { console.log('ERR', pad); continue; }
  const naam = (pad || 'home').replace(/[^a-z0-9]+/gi, '_').slice(0, 150);
  fs.writeFileSync(`${uit}/${naam}.html`, h);
  const body = h.replace(/[\s\S]*?<body/i, '<body');
  fs.writeFileSync(`${uit}/${naam}.txt`, pad + '\n' + tekst(body));
  for (const m of h.matchAll(/(?:src|href|data-src)="([^"]+\.(?:jpe?g|png|gif|webp))[^"]*"/gi)) { const u = new URL(m[1].replace(/&amp;/g, '&'), B + pad).href; if (!imgs.has(u)) imgs.set(u, pad); }
  for (const m of h.matchAll(/href="([^"#]+)"/gi)) {
    let u = m[1].replace(/&amp;/g, '&'); if (u.startsWith('//') || /^(mailto|javascript|tel)/i.test(u)) continue;
    try { const abs = new URL(u, B + pad); if (abs.host !== 'teakhuis.nl') continue; if (/\.(css|js|ico|jpe?g|png|gif|pdf)$/i.test(abs.pathname) || abs.pathname.startsWith('/-fg') || abs.pathname.startsWith('/winkelmand') || abs.pathname.startsWith('/_')) continue;
      const rel = (abs.pathname.replace(/^\//, '') + abs.search); if (!gezien.has(rel.toLowerCase())) rij.push(rel); } catch {}
  }
}
fs.writeFileSync('bron/web/imgs.txt', [...imgs].map(([u, p]) => u + '\t' + p).join('\n'));
fs.writeFileSync('bron/web/paginas.txt', [...gezien].join('\n'));
console.log('paginas', gezien.size, 'imgs', imgs.size, 'rest', rij.length);
