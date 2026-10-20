// Importeert de complete webshop van teakhuis.nl: alle categorieen, producten, varianten (maat x kleur + prijs),
// omschrijving en alle foto's (grootste beschikbare versie). Uitvoer:
//   src/data/producten.json   (alle productdata)
//   src/data/categorieen.json (categorieboom zoals in hun menu)
//   import/foto/<productId>/<n>.jpg (originele foto's, nog niet geoptimaliseerd)
// Gebruik: node tools/import-shop.mjs        (hervat: al gedownloade pagina's/foto's worden overgeslagen)
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'https://teakhuis.nl';
const KEY = 'etxFAX7uScLCTSM6mcUYWX';
const CACHE = 'import/html';
const FOTO = 'import/foto';
fs.mkdirSync(CACHE, { recursive: true });
fs.mkdirSync(FOTO, { recursive: true });
fs.mkdirSync('src/data', { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function haal(url, bin = false) {
  for (let poging = 0; poging < 3; poging++) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (Sitefront import)' } });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return bin ? Buffer.from(await res.arrayBuffer()) : await res.text();
    } catch (e) { await sleep(1000 * (poging + 1)); }
  }
  return null;
}
const cacheNaam = u => path.join(CACHE, u.replace(/^https?:\/\/[^/]+\//, '').replace(/[^a-z0-9]+/gi, '_').slice(0, 180) + '.html');
async function pagina(u) {
  const f = cacheNaam(u);
  if (fs.existsSync(f)) return fs.readFileSync(f, 'utf8');
  const h = await haal(u);
  if (h) fs.writeFileSync(f, h);
  await sleep(150);
  return h;
}
const ent = s => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&euro;/g, '€').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));
const tekst = s => ent(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

// 1. Categorieen en productlinks verzamelen (alle categoriepagina's, ook subcategorieen en paginering).
const catRe = new RegExp(`/webshop/${KEY}/(\\d+)/([a-z0-9-]+)(?:\\?[^"']*)?["']`, 'gi');
const prodRe = new RegExp(`/webshop/${KEY}/(\\d+)/(\\d+)/([a-z0-9-]+)/([a-z0-9-]+)`, 'gi');
const catNamen = {};
const teBezoeken = [BASE + '/webshop'];
const gezien = new Set();
const producten = new Map(); // productId -> {url, catId}
while (teBezoeken.length) {
  const u = teBezoeken.shift();
  if (gezien.has(u)) continue;
  gezien.add(u);
  const h = await pagina(u);
  if (!h) continue;
  for (const m of h.matchAll(new RegExp(`<a[^>]*href="(/webshop/${KEY}/(\\d+)/([a-z0-9-]+))"[^>]*>([\\s\\S]*?)</a>`, 'gi'))) {
    const naam = tekst(m[4]);
    if (naam && !catNamen[m[2]]) catNamen[m[2]] = { id: m[2], slug: m[3], naam };
  }
  for (const m of h.matchAll(catRe)) {
    const cu = `${BASE}/webshop/${KEY}/${m[1]}/${m[2]}`;
    if (!gezien.has(cu)) teBezoeken.push(cu);
  }
  for (const m of h.matchAll(/href="([^"]*[?&]page=\d+[^"]*)"/gi)) {
    const pu = new URL(ent(m[1]), BASE).href;
    if (pu.includes('/webshop/') && !gezien.has(pu)) teBezoeken.push(pu);
  }
  for (const m of h.matchAll(prodRe)) {
    if (!producten.has(m[2])) producten.set(m[2], { url: `${BASE}/webshop/${KEY}/${m[1]}/${m[2]}/${m[3]}/${m[4]}`, catId: m[1], catSlug: m[3], slug: m[4] });
  }
}
console.log('categoriepagina\'s:', gezien.size, 'producten gevonden:', producten.size);

// 2. Elke productpagina uitlezen.
const rijen = [];
let i = 0;
for (const [id, p] of producten) {
  i++;
  const h = await pagina(p.url);
  if (!h) { console.log('ONTBREEKT', id, p.url); continue; }
  const titel = tekst(h.match(/<h2 id="form-subject">([\s\S]*?)<\/h2>/i)?.[1] || '');
  if (!titel) { console.log('GEEN TITEL', id); continue; }
  const prijs = tekst(h.match(/class="pricing">([^<]*)</)?.[1] || '');
  const kruimel = [...(h.match(/<div class="breadcrumb">([\s\S]*?)<\/div>/i)?.[1] || '').matchAll(/<a href="([^"]+)">([^<]*)<\/a>/g)]
    .map(m => ({ naam: tekst(m[2]), id: m[1].match(new RegExp(`${KEY}/(\\d+)`))?.[1] || null })).filter(x => x.id);
  // Omschrijving: eenvoudige HTML behouden (p, br, ul/ol/li, strong/b, em/i), rest weg.
  let oms = h.match(/<div class="description">\s*<h3>[^<]*<\/h3>([\s\S]*?)<\/div>/i)?.[1] || '';
  oms = oms.replace(/<(?!\/?(p|br|ul|ol|li|strong|b|em|i)\b)[^>]+>/gi, '').replace(/\s(style|class|id)="[^"]*"/gi, '')
    .replace(/<p>\s*(&nbsp;)?\s*<\/p>/gi, '').replace(/\n\s*\n+/g, '\n').trim();
  oms = ent(oms);
  // Varianten: kleur/uitvoering (select variant) x maat (select subproduct), prijzen uit 'var data'.
  const eersteBlok = h.slice(h.indexOf('class="product_overview"'), h.indexOf('class="detail_description"') > 0 ? h.indexOf('class="detail_description"') : undefined);
  const opties = naam => [...(eersteBlok.match(new RegExp(`<select name="${naam}">([\\s\\S]*?)</select>`, 'i'))?.[1] || '').matchAll(/<option value="([^"]*)"[^>]*>([^<]*)<\/option>/g)]
    .map(m => ({ waarde: ent(m[1]), label: tekst(m[2]) }));
  const kleuren = opties('variant');
  const maten = opties('subproduct');
  const prijzen = {};
  const dataBlok = eersteBlok.match(/var data = \{([\s\S]*?)\};/)?.[1] || '';
  for (const m of dataBlok.matchAll(/"([^"]*)":\s*\{\s*id:\s*(\d+),\s*price:\s*([\d.]+)/g)) if (!(m[1] in prijzen)) prijzen[m[1]] = +m[3];
  const varianten = [];
  if (kleuren.length || maten.length) {
    for (const k of (kleuren.length ? kleuren : [{ waarde: '', label: '' }]))
      for (const mt of (maten.length ? maten : [{ waarde: '', label: '' }])) {
        const sleutel = mt.waarde + k.waarde;
        if (sleutel in prijzen) varianten.push({ kleur: k.label || null, maat: mt.label || null, prijs: prijzen[sleutel] });
      }
  }
  // Foto's: grootste versie = zonder breedte_hoogte-prefix.
  const fotoDeel = h.slice(h.indexOf('class="detail_box"'), h.indexOf('class="product_overview"'));
  const fotos = [...new Set([...fotoDeel.matchAll(/plugins\/webshop\/images\/\d+_\d+_(\d+_[^"']+)["']/g)].map(m => m[1]))];
  rijen.push({
    id, titel, slug: p.slug, url: p.url, categorieId: p.catId, categorieSlug: p.catSlug,
    kruimel, prijsVanaf: prijs, omschrijving: oms, kleuren: kleuren.map(k => k.label), maten: maten.map(m => m.label),
    varianten, fotosBron: fotos, fotos: [],
  });
  if (i % 50 === 0) console.log(i, '/', producten.size);
}

// 3. Foto's downloaden (4 tegelijk).
const taken = [];
for (const r of rijen) r.fotosBron.forEach((f, n) => taken.push([r, f, n]));
let k = 0, ok = 0, fout = 0;
async function werker() {
  while (k < taken.length) {
    const [r, f, n] = taken[k++];
    const ext = (path.extname(f).toLowerCase().match(/^\.(jpe?g|png|gif|webp)$/) ? path.extname(f).toLowerCase() : '.jpg').replace('.jpeg', '.jpg');
    const doel = path.join(FOTO, r.id, `${n + 1}${ext}`);
    fs.mkdirSync(path.dirname(doel), { recursive: true });
    if (!fs.existsSync(doel)) {
      const b = await haal(BASE + '/plugins/webshop/images/' + encodeURIComponent(f).replace(/%2F/g, '/'), true);
      if (!b || b.length < 500) { fout++; continue; }
      fs.writeFileSync(doel, b);
      await sleep(80);
    }
    r.fotos[n] = `${r.id}/${n + 1}${ext}`;
    ok++;
  }
}
await Promise.all([werker(), werker(), werker(), werker()]);
for (const r of rijen) r.fotos = r.fotos.filter(Boolean);

fs.writeFileSync('src/data/producten.json', JSON.stringify(rijen, null, 1));
fs.writeFileSync('src/data/categorieen.json', JSON.stringify(Object.values(catNamen), null, 1));
console.log('KLAAR producten:', rijen.length, 'foto\'s ok:', ok, 'mislukt:', fout,
  'zonder foto:', rijen.filter(r => !r.fotos.length).length, 'met varianten:', rijen.filter(r => r.varianten.length).length);
