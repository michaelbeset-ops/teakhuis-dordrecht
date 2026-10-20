// Leest alle gecrawlde productpagina's: naam, prijs, categorie, afbeeldingen, url.
import fs from 'node:fs';
const dir = 'bron/web/site';
const rows = [];
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.txt'))) {
  const pad = fs.readFileSync(`${dir}/${f}`, 'utf8').split('\n')[0];
  const m = pad.match(/^webshop\/etxFAX7uScLCTSM6mcUYWX\/(\d+)\/(\d+)\/([^/]+)\/(.+)$/); if (!m) continue;
  const h = fs.readFileSync(`${dir}/${f.replace(/\.txt$/, '.html')}`, 'utf8');
  const t = h.match(/id="form-subject">([\s\S]*?)<\/h2>/i)?.[1].replace(/<[^>]+>/g, '').trim();
  const prijs = h.match(/class="pricing">([^<]*)</)?.[1] || '';
  const imgs = [...new Set([...h.matchAll(/plugins\/webshop\/images\/(\d+)_(\d+)_([^"'\s)]+)/g)].map(x => x[3]))];
  rows.push({ cat: m[3], catId: m[1], id: m[2], t, prijs, url: 'https://teakhuis.nl/' + pad, imgs });
}
rows.sort((a, b) => a.cat.localeCompare(b.cat));
fs.writeFileSync('bron/web/producten.json', JSON.stringify(rows, null, 1));
for (const r of rows) console.log([r.cat, r.id, r.t, r.prijs, r.imgs.length, r.imgs[0]].join(' | '));
console.log(rows.length);
