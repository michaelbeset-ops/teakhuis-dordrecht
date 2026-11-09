// Eenmalig (nov 2026): de overzichtsfoto's van categorieen en collecties van de oude teakhuis.nl overnemen, op verzoek van
// Han. Categorieen: de foto's van /webshop en van elke hoofdcategoriepagina (origineel = zonder "400_350_"-voorvoegsel).
// Collecties: de foto's van /collecties-overzicht (de oude site heeft die maar klein, max. ca. 320 px).
// Zet het veld "foto" in src/content/categorieen/<slug>.json en src/content/collecties/<slug>.json.
// Gebruik (in een cloudsessie via de proxy): NODE_USE_ENV_PROXY=1 node tools/oude-overzichtsfotos.mjs
import fs from 'node:fs';

const BASE = 'https://teakhuis.nl';
const KEY = 'etxFAX7uScLCTSM6mcUYWX';
const haal = async (u) => { const r = await fetch(u); if (!r.ok) throw new Error(`${r.status} ${u}`); return r; };
const html = async (p) => (await haal(BASE + p)).text();
const bewaar = async (urls, doel) => {
  for (const u of urls) {
    try {
      const r = await haal(BASE + u);
      if (!(r.headers.get('content-type') || '').startsWith('image/')) continue;
      fs.writeFileSync(doel, Buffer.from(await r.arrayBuffer()));
      return u;
    } catch {}
  }
  return null;
};
const zetFoto = (map, slug, pad) => {
  const f = `src/content/${map}/${slug}.json`;
  if (!fs.existsSync(f)) return false;
  const d = JSON.parse(fs.readFileSync(f, 'utf8'));
  d.foto = pad;
  fs.writeFileSync(f, JSON.stringify(d, null, 2) + '\n');
  return true;
};
const log = [];

// 1. Categorieen: oude id -> onze slug (via oudeId).
const cats = Object.fromEntries(fs.readdirSync('src/content/categorieen').map((f) => [JSON.parse(fs.readFileSync(`src/content/categorieen/${f}`, 'utf8')).oudeId, f.replace('.json', '')]));
const tegels = (h) => [...h.matchAll(new RegExp(`<a[^>]+href="[^"]*${KEY}/(\\d+)/[^/"]+"[^>]*>\\s*(?:<[^>]+>\\s*)*<img src="([^"]+)" alt="([^"]*)"`, 'g'))].map((m) => ({ id: m[1], img: m[2] }));
const hoofd = tegels(await html('/webshop'));
const alle = [...hoofd];
for (const t of hoofd) alle.push(...tegels(await html(`/webshop/${KEY}/${t.id}/x`)).filter((s) => s.id !== t.id));
fs.mkdirSync('src/assets/categorieen', { recursive: true });
for (const { id, img } of alle) {
  const slug = cats[id];
  if (!slug) { log.push(`categorie ${id}: niet in de nieuwe catalogus`); continue; }
  const ext = (img.match(/\.(jpe?g|png)$/i)?.[1] || 'jpg').toLowerCase().replace('jpeg', 'jpg');
  const naam = `oud-${slug}.${ext}`;
  const gelukt = await bewaar([img.replace(/\/\d+_\d+_(?=[^/]+$)/, '/'), img], `src/assets/categorieen/${naam}`);
  if (gelukt && zetFoto('categorieen', slug, `../../assets/categorieen/${naam}`)) log.push(`categorie ${slug}: ${gelukt}`);
}

// 2. Collecties: naam -> slug.
const slugVan = (n) => ({ 'the edge': 'edge-line' })[n.toLowerCase()] ?? n.toLowerCase().replace(/\s+/g, '-');
// Alle 18 collecties van de oude site staan in src/content/collecties (ook die zonder producten, zoals India en Big Boy).
fs.mkdirSync('src/assets/collecties', { recursive: true });
for (const m of (await html('/collecties-overzicht')).matchAll(/<img[^>]*src="(\/files\/_thumbnail\/(\d+)\/[^"]+)"[^>]*alt="([^"]*)"/g)) {
  const [, thumb, id, naam] = m;
  const slug = slugVan(naam);
  if (!fs.existsSync(`src/content/collecties/${slug}.json`)) { log.push(`collectie ${naam}: niet in de nieuwe catalogus`); continue; }
  const doel = `oud-${slug}.jpg`;
  const gelukt = await bewaar([`/-fg-file?id=${id}`, thumb], `src/assets/collecties/${doel}`);
  if (gelukt && zetFoto('collecties', slug, `../../assets/collecties/${doel}`)) log.push(`collectie ${slug}: ${gelukt}`);
}
console.log(log.join('\n'));
