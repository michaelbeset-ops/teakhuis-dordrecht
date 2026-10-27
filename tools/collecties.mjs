// Eenmalig: maakt de collecties (series) aan en koppelt producten op hun naam ("Semarang dressoir Hudson" -> Semarang).
// Daarna beheert Han ze in /admin. Bestaande koppelingen worden niet overschreven; opnieuw draaien is veilig.
import fs from 'node:fs';
const series = [
  ['venice', 'Venice', /\bvenice\b/i], ['semarang', 'Semarang', /\bsemarang\b/i], ['milaan', 'Milaan', /\bmilaan\b/i],
  ['brindisi', 'Brindisi', /\bbrindisi\b/i], ['viking', 'Viking', /\bviking\b/i], ['bayakayu', 'Bayakayu', /\bbayakayu\b/i],
  ['provence', 'Provence', /\bprovence\b/i], ['edge-line', 'Edge line', /\bedge\b/i], ['napels', 'Napels', /\bnapels\b/i],
  ['caprice', 'Caprice', /\bcaprice\b/i], ['torino', 'Torino', /\btorino\b/i], ['opium', 'Opium', /\bopium\b/i],
  ['badalona', 'Badalona', /\bbadalona\b/i], ['le-matin', 'Le Matin', /\bmatin\b/i], ['serene', 'Serene', /\bserene\b/i],
  ['adrianne', 'Adrianne', /\badrianne\b/i], ['valencia', 'Valencia', /\bvalencia\b/i],
];
const dir = 'src/content/producten/';
const tel = new Map();
for (const f of fs.readdirSync(dir)) {
  const p = JSON.parse(fs.readFileSync(dir + f, 'utf8'));
  if (p.collectie) { tel.set(p.collectie, (tel.get(p.collectie) ?? 0) + 1); continue; }
  const s = series.find(([, , re]) => re.test(p.titel));
  if (!s) continue;
  p.collectie = s[0];
  fs.writeFileSync(dir + f, JSON.stringify(p, null, 2) + '\n');
  tel.set(s[0], (tel.get(s[0]) ?? 0) + 1);
}
fs.mkdirSync('src/content/collecties', { recursive: true });
series.forEach(([slug, naam], i) => {
  const f = `src/content/collecties/${slug}.json`;
  if (!fs.existsSync(f)) fs.writeFileSync(f, JSON.stringify({ naam, intro: '', volgorde: (i + 1) * 10 }, null, 2) + '\n');
});
console.log([...tel].map(([k, n]) => `${k} ${n}`).join(', '));
