// Titles en meta descriptions van de categoriepagina's, gericht op waar mensen op zoeken ("teak kast", "teakhouten tafel
// op maat", "teak tv-meubel"). Per categorie een eigen titel en openingszin; de rest (aantal, vanaf-prijs, maatwerk) komt
// uit de catalogus, zodat de tekst altijd klopt met wat op de pagina staat. Geen eigen regel = het standaardsjabloon.
import { euro, toonPrijs, type Categorie, type Product } from './catalogus';

const eigen: Record<string, { titel: string; zin: string }> = {
  'tafels': { titel: 'Teakhouten tafel op maat laten maken', zin: 'Teakhouten tafels: eettafels, salontafels, sidetables, bartafels en bureaus, in elke maat.' },
  'teak-eettafels': { titel: 'Teak eettafel kopen, ook rond of op maat', zin: 'Teakhouten eettafels, rechthoekig, ovaal of rond, in de maat die bij je ruimte past.' },
  'teak-salontafels': { titel: 'Teak salontafel, ook op maat', zin: 'Salontafels van teakhout, van strak tot met houtsnijwerk.' },
  'sidetables': { titel: 'Teak sidetable, ook op maat', zin: 'Sidetables van teakhout voor de hal, achter de bank of in de woonkamer.' },
  'kasten': { titel: 'Teak kast kopen: kasten van teakhout op maat', zin: 'Teakhouten kasten: dressoirs, tv-meubels, buffetkasten, boekenkasten en vitrinekasten.' },
  'teak-tv-kasten': { titel: 'Teak tv-meubel en tv-kast, ook op maat', zin: 'Teakhouten tv-meubels en lowboards, in elke breedte en met de indeling die jij wilt.' },
  'dressoirs': { titel: 'Teak dressoir, ook op maat', zin: 'Dressoirs van teakhout, laag of hoog, met deuren, lades of open vakken.' },
  'teak-buffetkasten': { titel: 'Teak buffetkast, ook op maat', zin: 'Buffetkasten van teakhout voor servies en glaswerk.' },
  'teak-boekenkasten': { titel: 'Teak boekenkast, ook op maat', zin: 'Boekenkasten van teakhout, open of met deuren, ook passend in een nis.' },
  'vitrinekasten': { titel: 'Teakhouten vitrinekast, ook op maat', zin: 'Vitrinekasten van teakhout met glazen deuren.' },
  'badkamermeubelen': { titel: 'Teak badkamermeubel, ook op maat', zin: 'Teakhouten badkamermeubels: wastafelmeubels, hangende modellen en spiegels. Teak kan goed tegen vocht.' },
  'wastafelmeubels': { titel: 'Teak wastafelmeubel, ook op maat', zin: 'Wastafelmeubels van teakhout, staand of hangend, enkel of dubbel.' },
  'badkamer-hangende-modellen': { titel: 'Hangend teak badkamermeubel, op maat', zin: 'Hangende badkamermeubels van teakhout.' },
  'badkamer-spiegels': { titel: 'Teakhouten badkamerspiegel', zin: 'Spiegels met een lijst van teakhout, passend bij je badkamermeubel.' },
  'slaapkamermeubels': { titel: 'Teakhouten slaapkamermeubels, ook op maat', zin: 'Bedden en nachtkastjes van teakhout.' },
  'teak-bedden': { titel: 'Teakhouten bed, ook op maat', zin: 'Bedden van teakhout, ook in een afwijkende lengte, breedte of hoogte.' },
  'teak-zitmeubelen': { titel: 'Teak stoelen en banken', zin: 'Stoelen, banken en barkrukken van teakhout.' },
  'tuinmeubelen': { titel: 'Teakhouten tuinmeubelen', zin: 'Tuintafels, tuinbanken en stoelen van teakhout, dat van nature tegen weer en wind kan.' },
  'mangohout-salon-tafels': { titel: 'Mangohouten salontafels', zin: 'Salontafels en bijzettafels van mangohout, ook met een stalen onderstel.' },
  'onderhoudsmiddelen': { titel: 'Onderhoudsmiddelen voor teakhout', zin: 'Teakfinish, was, polish en verzorging voor leer en textiel, om je meubels mooi te houden.' },
  'natuurstenen-waskommen': { titel: 'Natuurstenen waskommen', zin: 'Waskommen van natuursteen, voor op een teakhouten wastafelmeubel.' },
  'lampen': { titel: 'Wandlampen en staande lampen', zin: 'Wandlampen en staande lampen die passen bij teakhouten meubels.' },
  'accessoires': { titel: 'Woonaccessoires', zin: 'Accessoires die passen bij teakhouten meubels.' },
};

export function categorieSeo(cat: Categorie, producten: Product[]) {
  const n = producten.length;
  const opMaat = producten.some((p) => p.maatwerk);
  const e = eigen[cat.slug];
  const naam = cat.naam.charAt(0).toUpperCase() + cat.naam.slice(1);
  const titel = `${e?.titel ?? `${naam}${/teak/i.test(naam) ? '' : ' van teakhout'}${opMaat ? ', ook op maat' : ''}`} | Teakhuis`;
  const prijzen = producten.filter(toonPrijs).map((p) => p.prijsVanaf!);
  const vanaf = prijzen.length ? `, vanaf ${euro(Math.min(...prijzen))}` : '';
  const zin = e?.zin ?? `${naam} van teakhout bij Teakhuis.`;
  const feiten = `${n} ${n === 1 ? 'ontwerp' : 'ontwerpen'}${vanaf}, met de hand gemaakt${opMaat ? ', op maat zonder meerprijs' : ''}.`;
  const lang = `${zin} ${feiten} Vraag vrijblijvend een offerte aan.`;
  const omschrijving = lang.length <= 158 ? lang : `${zin} ${feiten}`.length <= 158 ? `${zin} ${feiten}` : `${zin} ${feiten.replace(', met de hand gemaakt', '')}`;
  return { titel, omschrijving };
}
