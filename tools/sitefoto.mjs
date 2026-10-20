// Downloadt de redactionele afbeeldingen van teakhuis.nl (files/_thumbnail/<id>/<hash>_<naam>), één per id.
import fs from 'node:fs'; import sharp from 'sharp';
const regels = fs.readFileSync('bron/web/imgs.txt', 'utf8').split('\n');
const per = new Map();
for (const r of regels) { const [u, pag] = r.split('\t'); const m = u.match(/files\/_thumbnail\/(\d+)\/[0-9a-f]+_(.+)$/); if (m && !per.has(m[1])) per.set(m[1], [u, m[2], pag]); }
const uit = [];
for (const [id, [u, naam, pag]] of per) { const f = `bron/foto/site/${id}_${naam.replace(/[^a-z0-9.]+/gi, '_')}`;
  try { if (!fs.existsSync(f)) { const r = await fetch(u, { headers: { 'user-agent': 'Mozilla/5.0' } }); fs.writeFileSync(f, Buffer.from(await r.arrayBuffer())); }
  const m = await sharp(f).metadata(); uit.push([id, f, m.width, m.height, pag].join('\t')); } catch (e) { uit.push([id, naam, 'ERR'].join('\t')); } }
fs.writeFileSync('bron/foto/site/_maten.tsv', uit.join('\n')); console.log(uit.length);
