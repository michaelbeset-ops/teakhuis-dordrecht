// Downloadt originele productfoto's (max 3 per product) en meet de afmetingen.
import fs from 'node:fs'; import sharp from 'sharp';
const rows = JSON.parse(fs.readFileSync('bron/web/producten.json', 'utf8'));
const taken = []; for (const r of rows) for (const i of r.imgs.slice(0, 3)) taken.push([r, i]);
const uit = []; let k = 0;
async function werk() { while (k < taken.length) { const [r, i] = taken[k++]; const f = `bron/foto/shop/${r.id}_${i.replace(/[^a-z0-9.]+/gi, '_')}`;
  try { if (!fs.existsSync(f)) { const res = await fetch('https://teakhuis.nl/plugins/webshop/images/' + encodeURI(i).replace(/%25/g,'%'), { headers: { 'user-agent': 'Mozilla/5.0' } }); if (!res.ok) { uit.push([r.id, i, 'ERR' + res.status]); continue; } fs.writeFileSync(f, Buffer.from(await res.arrayBuffer())); }
    const m = await sharp(f).metadata(); uit.push([r.id, r.cat, r.t, r.prijs, f, m.width, m.height]); } catch (e) { uit.push([r.id, i, 'ERR ' + e.message]); } } }
await Promise.all(Array.from({ length: 12 }, werk));
fs.writeFileSync('bron/foto/shop/_maten.tsv', uit.map(x => x.join('\t')).join('\n'));
const groot = uit.filter(x => x[5] >= 1000); console.log('totaal', uit.length, '>=1000px', groot.length);
