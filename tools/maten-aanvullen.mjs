// Eenmalig (nov 2026): maten aanvullen voor producten die op de oude teakhuis.nl één vaste maat hadden. De oude site
// toont die niet in een keuzelijst maar als "Afmeting: <strong>...</strong>" met een verborgen veld subproduct; het
// importscript (import-shop.mjs) las alleen keuzelijsten uit, waardoor deze producten zonder maat binnenkwamen.
// Gebruik: node tools/maten-aanvullen.mjs [--droog]   (alleen producten zonder maten worden aangepast)
import fs from 'node:fs';
import path from 'node:path';

const MAP = 'src/content/producten';
const droog = process.argv.includes('--droog');
const ent = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');

const bestanden = fs.readdirSync(MAP).filter((f) => f.endsWith('.json'));
const taken = bestanden.map((f) => ({ f, d: JSON.parse(fs.readFileSync(path.join(MAP, f), 'utf8')) })).filter(({ d }) => !d.maten?.length && d.oudeUrl);
console.log('producten zonder maat:', taken.length);

const log = { aangevuld: [], geenMaat: [], fout: [] };
let i = 0;
async function werk() {
  while (i < taken.length) {
    const { f, d } = taken[i++];
    try {
      const r = await fetch(`https://teakhuis.nl${d.oudeUrl}`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const h = await r.text();
      const verborgen = h.match(/<input type="hidden" name="subproduct" value="([^"]*)"/i)?.[1];
      const zichtbaar = h.match(/Afmeting:\s*<strong>([^<]*)<\/strong>/i)?.[1];
      const label = ent((zichtbaar || verborgen || '').trim()).replace(/\s+/g, ' ');
      // Alleen echte afmetingen ("h55 x b45 x d40", "210x76x45cm", "Ø 30 cm"). In dit veld stond soms ook een naam of
      // opmerking ("barkruk java", "per stuk exclusief verzendkosten"); die producten blijven zonder maat.
      const isMaat = /\d\s*(x|×|cm|=)|Ø|=\s*\d|\bx\s*\d/i.test(label);
      if (!label || !isMaat) { log.geenMaat.push(`${f}${label ? `: ${label}` : ''}`); continue; }
      // Prijs van deze maat uit 'var data' (sleutel = maat + kleurcode); de laagste als er meerdere kleuren zijn.
      const sleutel = ent(verborgen ?? label);
      const prijzen = [...h.matchAll(/"([^"]*)":\s*\{\s*id:\s*\d+,\s*price:\s*([\d.]+)/g)].filter((m) => ent(m[1]).startsWith(sleutel)).map((m) => +m[2]);
      const maat = { label, ...(prijzen.length ? { prijs: Math.min(...prijzen) } : {}) };
      d.maten = [maat];
      if (!droog) fs.writeFileSync(path.join(MAP, f), JSON.stringify(d, null, 2) + '\n');
      log.aangevuld.push(`${f}: ${label}${maat.prijs ? ` (${maat.prijs})` : ''}`);
    } catch (e) {
      log.fout.push(`${f}: ${e.message}`);
    }
  }
}
await Promise.all(Array.from({ length: 4 }, werk));
console.log('aangevuld:', log.aangevuld.length, 'geen maat op oude site:', log.geenMaat.length, 'fout:', log.fout.length);
fs.writeFileSync(path.join(process.env.TMPDIR || '/tmp', 'maten-aanvullen.log.json'), JSON.stringify(log, null, 2));
