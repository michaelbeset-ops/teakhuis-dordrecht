// Productcatalogus uit de content collections (src/content/producten en src/content/categorieen), beheerd via /admin.
// Hier alleen ordenen, koppelen en formatteren.
import { getCollection } from 'astro:content';
import { marked } from 'marked';
import sharp from 'sharp';
import { url } from './site';

export interface Categorie { slug: string; naam: string; hoofd: string; volgorde: number; intro: string; foto?: ImageMetadata; oudeId?: string }
export interface Maat { label: string; prijs: number | null }
export interface Product {
  slug: string; titel: string; categorie: Categorie; hoofd?: Categorie;
  prijsVanaf: number | null; prijsTonen: boolean; omschrijving: string;
  fotos: ImageMetadata[]; maten: Maat[]; houtkleuren: boolean; uitvoeringen: string[];
  maatwerk: boolean; uitgelicht: boolean; volgorde: number;
  seoTitel?: string; seoOmschrijving?: string; oudeUrl?: string;
}

export const hoofdletter = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);
// Titels uit de oude webshop staan soms in kapitalen ("EETTAFEL CASTLE") of beginnen klein; alleen de weergave rechtzetten.
// Woorden met cijfers (typenummers als JSWD 345) blijven zoals ze zijn.
const netteTitel = (t: string) => hoofdletter(t.trim().replace(/\b\p{Lu}{3,}\b/gu, (w) => (/^(?:BA|JS|SVLK|XL|XXL)$/.test(w) ? w : w[0] + w.slice(1).toLowerCase())));
const nl = new Intl.Collator('nl', { numeric: true });

const ruweCats = await getCollection('categorieen');
export const categorieen: Categorie[] = ruweCats
  .map((c) => ({ slug: c.id, ...c.data }))
  .sort((a, b) => a.volgorde - b.volgorde || nl.compare(a.naam, b.naam));
const catOpSlug = new Map(categorieen.map((c) => [c.slug, c]));

// Een product met een categorie die (nog) niet bestaat valt onder "Overig", zodat een verwijderde categorie de site niet breekt.
const overig: Categorie = { slug: 'overig', naam: 'Overig', hoofd: '', volgorde: 999, intro: '' };

const ruweProducten = await getCollection('producten');
export const producten: Product[] = ruweProducten
  .filter((p) => p.data.zichtbaar)
  .map((p) => {
    const d = p.data;
    const cat = catOpSlug.get(d.categorie) ?? overig;
    const hoofd = cat.hoofd ? catOpSlug.get(cat.hoofd) : undefined;
    // "Vanaf"-prijs: ingevuld veld, anders de laagste maatprijs.
    const maatPrijzen = d.maten.map((m) => m.prijs).filter((x): x is number => typeof x === 'number' && x > 0);
    const prijsVanaf = d.prijsVanaf && d.prijsVanaf > 0 ? d.prijsVanaf : maatPrijzen.length ? Math.min(...maatPrijzen) : null;
    return { ...d, slug: p.id, titel: netteTitel(d.titel), categorie: cat, hoofd, prijsVanaf, maten: d.maten.map((m) => ({ label: m.label, prijs: m.prijs ?? null })) };
  })
  .sort((a, b) => a.volgorde - b.volgorde || nl.compare(a.titel, b.titel));

if (producten.some((p) => p.categorie === overig)) categorieen.push(overig);
export const categorie = (slug: string) => catOpSlug.get(slug) ?? overig;

// Prijzen als "€ 1.149,-" of "€ 12,95".
export const euro = (n: number) => {
  const heel = Math.round(n * 100) % 100 === 0;
  const [e, c] = n.toFixed(2).split('.');
  return `€ ${e.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${heel ? '-' : c}`;
};
export const toonPrijs = (p: Product) => p.prijsTonen && p.prijsVanaf !== null;
export const prijsTekst = (p: Product) => (toonPrijs(p) ? `v.a. ${euro(p.prijsVanaf!)}` : 'Prijs op aanvraag');

export const productHref = (p: Product) => url(`product/${p.slug}/`);
export const categorieHref = (c: Categorie) => url(`collectie/${c.slug}/`);

// Breedte lezen via .clone: direct img.width lezen laat Astro denken dat het origineel nodig is, en dan komen
// alle originele jpg's (70 MB) in dist naast de webp-versies.
export const breedte = (img: ImageMetadata) => ((img as any).clone ?? img).width as number;
export const hoogte = (img: ImageMetadata) => ((img as any).clone ?? img).height as number;
// Nooit groter maken dan het origineel.
export const breedtes = (img: ImageMetadata, wens: number[]) => {
  const b = breedte(img);
  const w = wens.filter((x) => x < b);
  return [...w, Math.min(b, Math.max(...wens))].filter((x, i, a) => a.indexOf(x) === i);
};
export const eersteFoto = (p: Product) => p.fotos[0];

// Staat de foto op een witte achtergrond (productfoto) of is het een sfeerfoto? Productfoto's tonen we passend met
// witruimte, sfeerfoto's vullen het vlak. Bepaald aan de randpixels, zodat nieuwe foto's uit het beheer vanzelf goed gaan.
const witCache = new Map<string, boolean>();
const pad = (img: ImageMetadata) => (img as any).fsPath as string | undefined;
async function bepaalWit(img: ImageMetadata) {
  const f = pad(img);
  if (!f || witCache.has(f)) return;
  try {
    const { data, info } = await sharp(f).resize(24, 24, { fit: 'fill' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    let licht = 0, rand = 0;
    for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
      if (x > 1 && y > 1 && x < info.width - 2 && y < info.height - 2) continue;
      const i = (y * info.width + x) * 3;
      rand++;
      if (data[i] > 232 && data[i + 1] > 232 && data[i + 2] > 232) licht++;
    }
    witCache.set(f, licht / rand > 0.6);
  } catch {
    witCache.set(f, true);
  }
}
await Promise.all([...producten.flatMap((p) => p.fotos), ...categorieen.map((c) => c.foto)].filter(Boolean).map((f) => bepaalWit(f!)));
export const opWit = (img: ImageMetadata) => witCache.get(pad(img) ?? '') ?? true;
// Klassen voor een foto in een vierkant of liggend vlak.
export const fotoKlas = (img: ImageMetadata, ruimte = 'p-3 sm:p-5') => (opWit(img) ? `object-contain ${ruimte}` : 'object-cover');

// Menu: hoofdcategorieen met hun subcategorieen en producten.
export interface Groep { hoofd: Categorie; subs: { cat: Categorie; producten: Product[] }[]; producten: Product[] }
export const groepen: Groep[] = (() => {
  const m = new Map<string, Groep>();
  const groep = (c: Categorie) => {
    if (!m.has(c.slug)) m.set(c.slug, { hoofd: c, subs: [], producten: [] });
    return m.get(c.slug)!;
  };
  for (const c of categorieen) if (!c.hoofd) groep(c);
  for (const p of producten) {
    const g = groep(p.hoofd ?? p.categorie);
    g.producten.push(p);
    if (p.hoofd) {
      let sub = g.subs.find((x) => x.cat.slug === p.categorie.slug);
      if (!sub) g.subs.push((sub = { cat: p.categorie, producten: [] }));
      sub.producten.push(p);
    }
  }
  for (const g of m.values()) {
    g.subs.sort((a, b) => a.cat.volgorde - b.cat.volgorde || nl.compare(a.cat.naam, b.cat.naam));
    // Op de hoofdcategoriepagina per soort, in de volgorde van de soorten (eettafels voor bijzettafels).
    const plek = new Map(g.subs.map((s, i) => [s.cat.slug, i]));
    g.producten.sort((a, b) => (plek.get(a.categorie.slug) ?? -1) - (plek.get(b.categorie.slug) ?? -1));
  }
  return [...m.values()].filter((g) => g.producten.length).sort((a, b) => a.hoofd.volgorde - b.hoofd.volgorde);
})();

// Elke pagina /collectie/<slug>/: hoofdcategorieen en subcategorieen.
export interface CatPagina { cat: Categorie; hoofd?: Categorie; subs: Categorie[]; producten: Product[] }
export const catPaginas: CatPagina[] = groepen.flatMap((g) => [
  { cat: g.hoofd, subs: g.subs.map((s) => s.cat), producten: g.producten },
  ...g.subs.map((s) => ({ cat: s.cat, hoofd: g.hoofd, subs: g.subs.map((x) => x.cat), producten: s.producten })),
]);

// Omschrijving: markdown uit het beheersysteem. Een enkele Enter is een nieuwe regel, zoals de eigenaar het typt.
// Ruwe HTML wordt niet doorgelaten.
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const omschrijvingHtml = (md: string) => (md ? (marked.parse(esc(md).replace(/&amp;(\w+;)/g, '&$1'), { breaks: true, async: false }) as string) : '');
export const platteTekst = (md: string) => md.replace(/[*_#>`]/g, '').replace(/\s+/g, ' ').trim();

// Houtkleuren en maatwerk horen bij meubels; foto's op wit krijgen mix-blend-multiply.
export const ookOpMaat = (p: Product) => p.maatwerk;

// Filtergegevens voor de collectiepagina's, afgeleid uit wat er al in het product staat (niets extra in te vullen).
// Breedte: het eerste getal van elk maatlabel ("B200 x D100", "br=120cm", "Ø 65 x H41").
export const breedtesVan = (p: Product) =>
  [...new Set(p.maten.map((m) => m.label.match(/^\s*(?:B|br\s*=|Ø|diameter)?\s*(\d{2,3})\b/i)?.[1]).filter(Boolean).map(Number))];
export const houtsoortVan = (p: Product) => {
  const t = `${p.titel} ${p.categorie.naam} ${p.omschrijving}`.toLowerCase();
  if (t.includes('mango')) return 'Mangohout';
  if (/gerecycl|oud teak|oud gerecycl/.test(t)) return 'Gerecycled teak';
  if (t.includes('teak')) return 'Teak';
  return 'Overig';
};

// Welke maattekening bij een product hoort (op soort), of geen bij lampen, accessoires en dergelijke.
const SOORTEN: [RegExp, 'tafel' | 'kast' | 'zit' | 'bed'][] = [
  [/wastafel/, 'kast'],
  [/bed/, 'bed'],
  [/stoel|bank|kruk|zit/, 'zit'],
  [/tafel|sidetable|bureau|tuinmeubel/, 'tafel'],
  [/kast|dressoir|kist|room|badkamermeubel|hangende|kleinmeubel/, 'kast'],
];
const GEEN = /spiegel|waskom|lamp|accessoire|onderhoud/;
export const maatSoort = (p: Product) => {
  if (GEEN.test(p.categorie.slug)) return null;
  const zoek = (s?: string) => (s ? SOORTEN.find(([re]) => re.test(s))?.[1] : undefined);
  // De naam zegt het vaakst wat het is ("Beaufort bank" staat bij tuinmeubelen); anders de categorie.
  const naam = p.titel.toLowerCase();
  const opNaam = /\b(?:bank|stoel|kruk)/.test(naam) ? 'zit' : /\bbed\b/.test(naam) ? 'bed' : /dressoir|kast\b|kast /.test(naam) ? 'kast' : /tafel/.test(naam) && !/wastafel/.test(naam) ? 'tafel' : undefined;
  return opNaam ?? zoek(p.categorie.slug) ?? zoek(p.hoofd?.slug) ?? null;
};
