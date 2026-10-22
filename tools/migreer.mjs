// Eenmalig: de webshop-import (tools/webshop-import/producten.json, categorieen.json) omzetten naar losse bestanden per product en
// per categorie in src/content/, zodat het beheersysteem ze een voor een kan toevoegen, wijzigen en verwijderen.
// Draai: node tools/migreer.mjs  (overschrijft src/content/producten en src/content/categorieen)
import fs from 'node:fs';

const ruw = JSON.parse(fs.readFileSync('tools/webshop-import/producten.json', 'utf8'));
const cats = JSON.parse(fs.readFileSync('tools/webshop-import/categorieen.json', 'utf8'));
const stuur = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/g;
const netjes = (s) => s.replace(stuur, '').replace(/\s+/g, ' ').trim();
const hoofdletter = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const getal = (s) => Number(String(s).replace(/\./g, '').replace(',-', '').replace(',', '.'));

// Hun HTML-omschrijving naar eenvoudige markdown (alinea's, regelovergangen, vet).
function md(html) {
  if (!html) return '';
  const paras = [];
  let cur = '', vet = false;
  const breek = () => {
    if (vet) { cur += '**'; vet = false; }
    const t = cur.replace(/\*\*\s*\*\*/g, '').replace(/^[\s\n]+|[\s\n]+$/g, '').replace(/ *\n */g, '\n');
    if (t.replace(/[*\s]|&nbsp;/g, '')) paras.push(t);
    cur = '';
  };
  for (const d of html.replace(stuur, '').split(/(<[^>]*>)/)) {
    if (d.startsWith('<')) {
      const m = d.match(/^<\s*(\/?)\s*([a-z0-9]+)/i);
      if (!m) continue;
      const tag = m[2].toLowerCase();
      if (tag === 'p' || tag === 'div') breek();
      else if (tag === 'br') cur += '\n';
      else if (tag === 'strong' || tag === 'b') {
        if (m[1] && vet) { cur = cur.replace(/\s+$/, '') + '** '; vet = false; }
        else if (!m[1] && !vet) { cur += '**'; vet = true; }
      }
    } else {
      d.split(/\n/).forEach((r, i) => { if (i) breek(); cur += r.replace(/\s+/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&'); });
    }
  }
  breek();
  return paras.join('\n\n').replace(/\*\* +\*\*/g, ' ').replace(/ +\n/g, '\n');
}

// Hun vier standaard houtkleuren, in allerlei schrijfwijzen in de webshop.
const standaard = { blankteak: 'Blank teak', theekleur: 'Thee kleur', theekleurteak: 'Thee kleur', kolonialekleur: 'Koloniale kleur', koloniaal: 'Koloniale kleur', wit: 'Wit' };
const sleutel = (s) => s.toLowerCase().replace(/[^a-z]/g, '');

// Categorieen: hoofdcategorie volgt uit het kruimelpad van de producten.
const hoofdVan = new Map();
for (const p of ruw) if (p.kruimel.length > 1) hoofdVan.set(p.kruimel[1].id, p.kruimel[0].id);
const naamFix = { '189': 'Gesloten kasten', '184': 'Cd-kasten', '181': "Bureau's", '174': 'Teak tv-kasten', '177': 'Teak banken', '251': 'Mangohouten tafels' };
// Subcategorieen in de volgorde waarin ze in de webshop voorkwamen.
const eersteKeer = new Map();
ruw.forEach((p, i) => p.kruimel.forEach((k) => { if (!eersteKeer.has(k.id)) eersteKeer.set(k.id, i); }));
const menuVolgorde = ['228', '229', '230', '232', '235', '206', '212', '221', '187', '190'];
const catSlug = new Map(cats.map((c) => [c.id, c.slug]));
const gebruikt = new Set(ruw.flatMap((p) => p.kruimel.map((k) => k.id)));

fs.rmSync('src/content/categorieen', { recursive: true, force: true });
fs.rmSync('src/content/producten', { recursive: true, force: true });
fs.mkdirSync('src/content/categorieen', { recursive: true });
fs.mkdirSync('src/content/producten', { recursive: true });

for (const c of cats) {
  if (!gebruikt.has(c.id)) continue;
  const h = hoofdVan.get(c.id);
  const pos = menuVolgorde.indexOf(c.id);
  const uit = {
    naam: naamFix[c.id] ?? hoofdletter(netjes(c.naam)),
    hoofd: h ? catSlug.get(h) : '',
    volgorde: pos < 0 ? 100 + eersteKeer.get(c.id) : pos + 1,
    intro: '',
    oudeId: c.id,
  };
  fs.writeFileSync(`src/content/categorieen/${c.slug}.json`, JSON.stringify(uit, null, 2) + '\n');
}

// Producten op de oude homepage: uitgelicht op de nieuwe.
const uitgelicht = new Set(['28682', '29731', '14400', '32694', '29728', '3777', '29725', '32717']);
const geenMeubel = new Set(['212', '221', '190', '211']);
const slugTel = {};
for (const p of ruw) slugTel[p.slug] = (slugTel[p.slug] ?? 0) + 1;

let i = 0;
for (const p of ruw) {
  const kleuren = (p.kleuren ?? []).map(netjes);
  const alleStandaard = kleuren.length > 0 && kleuren.every((k) => standaard[sleutel(k)]);
  const isMeubel = !p.kruimel.some((k) => geenMeubel.has(k.id));
  // Per maat de laagste prijs (houtkleur maakt in de webshop soms een paar procent verschil; de offerte geeft de echte prijs).
  const maten = (p.maten ?? []).map((m) => {
    const label = netjes(m).replace(/\s*exclusief verzendkosten\s*$/i, '');
    const prijzen = (p.varianten ?? []).filter((v) => v.maat && netjes(v.maat) === netjes(m)).map((v) => v.prijs);
    return prijzen.length ? { label, prijs: Math.min(...prijzen) } : { label };
  }).filter((m, j, a) => a.findIndex((x) => x.label === m.label) === j);
  const prijsVanaf = getal(p.prijsVanaf);
  const uit = {
    titel: netjes(p.titel),
    categorie: catSlug.get(p.categorieId),
    prijsVanaf: Number.isFinite(prijsVanaf) && prijsVanaf > 0 ? prijsVanaf : null,
    prijsTonen: true,
    omschrijving: md(p.omschrijving),
    fotos: (p.fotos ?? []).map((f) => `../../assets/producten/${f}`),
    maten,
    houtkleuren: alleStandaard,
    uitvoeringen: alleStandaard ? [] : [...new Set(kleuren.map(hoofdletter))],
    maatwerk: isMeubel,
    uitgelicht: uitgelicht.has(p.id),
    zichtbaar: true,
    volgorde: ++i,
    oudeUrl: new URL(p.url).pathname,
  };
  const slug = slugTel[p.slug] > 1 ? `${p.slug}-${p.id}` : p.slug;
  fs.writeFileSync(`src/content/producten/${slug}.json`, JSON.stringify(uit, null, 2) + '\n');
}
console.log('producten', fs.readdirSync('src/content/producten').length, 'categorieen', fs.readdirSync('src/content/categorieen').length);
