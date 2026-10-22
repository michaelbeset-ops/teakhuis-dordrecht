// Bedrijfsgegevens komen uit src/data/instellingen.json, zodat de eigenaar ze in het beheersysteem kan aanpassen.
// Feiten (bekeken 7 oktober 2026 op teakhuis.nl):
// - "Teakhuis heeft geen showroom meer. Wij leveren uitsluitend op bestelling"; USP's "Maatwerk zonder meerprijs",
//   "Authentieke handgemaakte meubels", "Alleen duurzaam hout".
// - Over ons: eerste vestiging 2007 Dordrecht; SVLK-hout; lokale producenten in Indonesie maken elk meubel met de hand;
//   showrooms gesloten in 2018-2019, sindsdien online: meer aandacht per klant, voordeliger. Alle maatwerk mogelijk.
//   Team: "Han, Adviseur Nederland, bezorger, service medewerker". Blog 15-07-2017: adviseur Han Rietdijk.
// - Maatwerk/het-proces: 5 stappen (gesprek, schetsen + prijsopgave, definitieve schets + 20% aanbetaling, producenten in
//   Indonesie, thuis geleverd). Maatwerkformulier: soort, afmetingen, speciale materialen (metaal, glas, wielen), wensen.
// - Leverbare kleuren: Blank teak, Thee kleur teak, Koloniale kleur, Wit.
import inst from './instellingen.json';

const cijfers = inst.telefoon.replace(/\D/g, '');
export const site = {
  naam: 'Teakhuis',
  bv: 'Teakhuis B.V.',
  tel: inst.telefoon,
  telHref: `tel:+31${cijfers.replace(/^0/, '')}`,
  wa: `https://wa.me/${inst.whatsapp.replace(/\D/g, '')}`,
  mail: inst.email,
  web3formsKey: inst.web3formsKey,
  emailjs: { service: '', template: '', publicKey: '', ...inst.emailjs },
  facebook: inst.facebook,
  instagram: inst.instagram,
  pinterest: inst.pinterest,
  kvk: inst.kvk,
  adres: inst.adres,
  usps: inst.usps,
  // Google-bedrijfsprofiel (reviews). Zoeklink, zodat hij ook werkt als de profiel-URL verandert.
  google: inst.google || 'https://www.google.com/maps/search/?api=1&query=Teakhuis+Dordrecht',
  themeColor: '#f6f3ed',
  voorstel: import.meta.env.PUBLIC_VOORSTEL === '1',
};

// Leverbare houtkleuren (hun pagina "leverbare kleuren teak"), met staaltje.
import kleurBlank from '../assets/kleur-blank.jpg';
import kleurThee from '../assets/kleur-thee.jpg';
import kleurKoloniaal from '../assets/kleur-koloniaal.jpg';
import kleurWit from '../assets/kleur-wit.jpg';
export const houtkleuren = [
  { naam: 'Blank teak', img: kleurBlank },
  { naam: 'Thee kleur', img: kleurThee },
  { naam: 'Koloniale kleur', img: kleurKoloniaal },
  { naam: 'Wit', img: kleurWit },
];

export const maatwerkExtra = ['metaal', 'glas', 'wielen'];

// Reviews staan in src/data/reviews.json (beheer: Instellingen > Reviews). Bron "google" = een echte Google-review;
// "referentie" = een reactie van hun eigen referentiepagina. Alleen echte Google-reviews krijgen het Google-label.
import reviewData from './reviews.json';
export interface Review { naam: string; tekst: string; bron: 'google' | 'referentie'; sterren?: number | null; over?: string }
export const reviews: Review[] = (reviewData.reviews as Review[]).filter((r) => r.naam && r.tekst);

export const stappen = [
  ['Een goed gesprek', 'We beginnen altijd met je wensen: wat zoek je, welke maten, welke stijl vind je mooi?'],
  ['Schets en prijsopgave', 'Je krijgt de schetsen digitaal, samen met een prijsopgave. Geen verrassingen achteraf.'],
  ['De definitieve tekening', 'Klopt alles, dan gaat de tekening naar onze producenten. Je betaalt dan 20% aan.'],
  ['Gemaakt in Indonesië', 'Met de hand gemaakt, direct bij onze producenten, zonder tussenpersonen of groothandels.'],
  ['Thuis geleverd', 'Je meubel wordt bij je thuis afgeleverd.'],
];

export const url = (p = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${p.replace(/^\//, '')}`;
export const absoluut = (p = '') => new URL(url(p), import.meta.env.SITE).href;
export const waMet = (tekst: string) => `${site.wa}?text=${encodeURIComponent(tekst)}`;
export const waHoi = waMet('Hallo Teakhuis, ik heb een vraag over een teakhouten meubel.');
