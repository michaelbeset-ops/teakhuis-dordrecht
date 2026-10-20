// Productcatalogus: alle producten en categorieen uit hun webshop (import van teakhuis.nl, tools/import-shop.mjs).
// Hier alleen ordenen, opschonen en formatteren; er wordt niets aan toegevoegd.
import ruweProducten from './producten.json';
import ruweCategorieen from './categorieen.json';
import { url } from './site';

export interface Variant { kleur: string | null; maat: string | null; prijs: number }
export interface Product {
  id: string; titel: string; slug: string; url: string; categorieId: string; categorieSlug: string;
  kruimel: { naam: string; id: string }[]; prijsVanaf: string; omschrijving: string;
  kleuren: string[]; maten: string[]; varianten: Variant[]; fotos: string[];
}
export interface Categorie { id: string; slug: string; naam: string }

// Onzichtbare stuurtekens uit de oude webshop (bijv. U+009D in een maatlabel) weghalen.
const stuur = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/g;
const netjes = (s: string) => s.replace(stuur, '').replace(/\s+/g, ' ').trim();
export const hoofdletter = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

export const producten: Product[] = (ruweProducten as any[]).map((p) => ({
  ...p,
  titel: netjes(p.titel),
  kleuren: (p.kleuren ?? []).map(netjes),
  maten: (p.maten ?? []).map(netjes),
  varianten: (p.varianten ?? []).map((v: Variant) => ({ kleur: v.kleur ? netjes(v.kleur) : null, maat: v.maat ? netjes(v.maat) : null, prijs: v.prijs })),
  fotos: p.fotos ?? [],
}));

// Namen in hun menu staan soms in kleine letters of aan elkaar; alleen de weergave rechtzetten.
const naamFix: Record<string, string> = { '189': 'Gesloten kasten', '184': 'Cd-kasten' };
export const categorieen: Categorie[] = (ruweCategorieen as Categorie[]).map((c) => ({ ...c, naam: naamFix[c.id] ?? hoofdletter(c.naam) }));
const catOpId = new Map(categorieen.map((c) => [c.id, c]));
export const categorie = (id: string) => catOpId.get(id)!;

// Prijzen: "629,-" uit de webshop naar een getal, en terug als "€ 1.149,-" of "€ 12,95".
export const naarGetal = (s: string) => Number(s.replace(/\./g, '').replace(',-', '').replace(',', '.'));
export const euro = (n: number) => {
  const heel = Math.round(n * 100) % 100 === 0;
  const [e, c] = n.toFixed(2).split('.');
  return `€ ${e.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${heel ? '-' : c}`;
};
export const vanaf = (p: Product) => naarGetal(p.prijsVanaf);

export const productHref = (p: Product) => url(`product/${p.slug}-${p.id}/`);
export const categorieHref = (c: Categorie) => url(`collectie/${c.slug}/`);

// Foto's: alle originelen in src/assets/producten, Astro maakt er webp van.
const fotoMods = import.meta.glob<{ default: ImageMetadata }>('../assets/producten/*/*.{jpg,png}', { eager: true });
export const fotosVan = (p: Product): ImageMetadata[] => p.fotos.map((f) => fotoMods[`../assets/producten/${f}`]?.default).filter(Boolean);
export const eersteFoto = (p: Product): ImageMetadata | undefined => fotosVan(p)[0];
// Breedte lezen via .clone: direct img.width lezen laat Astro denken dat het origineel nodig is, en dan komen
// alle 761 originele jpg's (70 MB) in dist naast de webp-versies.
export const breedte = (img: ImageMetadata) => ((img as any).clone ?? img).width as number;
// Nooit groter maken dan het origineel (max ~700px breed).
export const breedtes = (img: ImageMetadata, wens: number[]) => {
  const b = breedte(img);
  const w = wens.filter((x) => x < b);
  return [...w, Math.min(b, Math.max(...wens))].filter((x, i, a) => a.indexOf(x) === i);
};

// Menu zoals op teakhuis.nl: hoofdcategorie (kruimel[0]) met subcategorieen eronder.
const menuVolgorde = ['228', '229', '230', '232', '235', '206', '212', '221', '187', '190'];
export interface Groep { hoofd: Categorie; subs: { cat: Categorie; producten: Product[] }[]; producten: Product[] }
export const groepen: Groep[] = (() => {
  const m = new Map<string, Groep>();
  for (const p of producten) {
    const [h, s] = p.kruimel;
    if (!m.has(h.id)) m.set(h.id, { hoofd: categorie(h.id), subs: [], producten: [] });
    const g = m.get(h.id)!;
    g.producten.push(p);
    if (s) {
      let sub = g.subs.find((x) => x.cat.id === s.id);
      if (!sub) g.subs.push((sub = { cat: categorie(s.id), producten: [] }));
      sub.producten.push(p);
    }
  }
  const pos = (id: string) => { const i = menuVolgorde.indexOf(id); return i < 0 ? 99 : i; };
  return [...m.values()].sort((a, b) => pos(a.hoofd.id) - pos(b.hoofd.id));
})();

// Elke pagina /collectie/<slug>/: hoofdcategorieen en subcategorieen.
export interface CatPagina { cat: Categorie; hoofd?: Categorie; subs: Categorie[]; producten: Product[] }
export const catPaginas: CatPagina[] = groepen.flatMap((g) => [
  { cat: g.hoofd, subs: g.subs.map((s) => s.cat), producten: g.producten },
  ...g.subs.map((s) => ({ cat: s.cat, hoofd: g.hoofd, subs: g.subs.map((x) => x.cat), producten: s.producten })),
]);

// Omschrijving: hun HTML (soms niet gesloten <p>) opnieuw opbouwen met alleen <p>, <br> en <strong>.
export function schoon(html: string): string {
  if (!html) return '';
  const esc = (s: string) => s.replace(/&(?!(?:[a-z]+|#\d+);)/gi, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const paras: string[] = [];
  let cur = '';
  let vet = false;
  const breek = () => {
    if (vet) { cur += '</strong>'; vet = false; }
    const t = cur.replace(/^(?:\s|<br>)+|(?:\s|<br>)+$/g, '').replace(/<strong>\s*<\/strong>/g, '');
    if (t.replace(/<\/?strong>|<br>|&nbsp;|\s/g, '')) paras.push(t);
    cur = '';
  };
  for (const d of html.replace(stuur, '').split(/(<[^>]*>)/)) {
    if (d.startsWith('<')) {
      const m = d.match(/^<\s*(\/?)\s*([a-z0-9]+)/i);
      if (!m) continue;
      const tag = m[2].toLowerCase();
      if (tag === 'p' || tag === 'div') breek();
      else if (tag === 'br') cur += '<br>';
      else if (tag === 'strong' || tag === 'b') {
        if (m[1] && vet) { cur += '</strong>'; vet = false; }
        else if (!m[1] && !vet) { cur += '<strong>'; vet = true; }
      }
    } else {
      // Een harde regelovergang in hun tekst is een nieuwe alinea.
      d.split(/\n/).forEach((r, i) => { if (i) breek(); cur += esc(r.replace(/\s+/g, ' ')); });
    }
  }
  breek();
  return paras.map((t) => `<p>${t}</p>`).join('');
}
export const platteTekst = (html: string) => schoon(html).replace(/<br>/g, ' ').replace(/<\/p><p>/g, ' ').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

// Producten van de oude homepage-links (teakhuis.nl url) terugvinden.
export const productVanUrl = (href: string) => producten.find((p) => p.url === href);
// Webshoplink van een categorie (…/<catId>/<slug>) naar de eigen categoriepagina.
export const categorieVanUrl = (href: string) => {
  const id = href.split('/').at(-2) ?? '';
  const c = catOpId.get(id);
  return c ? categorieHref(c) : href;
};

// Categorieen waar "maatwerk zonder meerprijs" en de houtkleuren bij horen (geen lampen, accessoires, onderhoud, natuursteen).
const geenMeubel = new Set(['212', '221', '190', '211']);
export const isMeubel = (p: Product) => !p.kruimel.some((k) => geenMeubel.has(k.id));
