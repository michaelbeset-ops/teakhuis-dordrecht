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
  emailjs: { service: '', template: '', templateKlant: '', publicKey: '', ...inst.emailjs },
  statistiek: { plausible: '', goatcounter: '', ...inst.statistiek },
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
  // Op het tijdelijke github.io-adres niet indexeren: anders concurreert de testversie straks met teakhuis.nl.
  testadres: String(import.meta.env.SITE ?? '').includes('github.io'),
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

// Het maatwerktraject zoals Han het beschrijft (tekst nov 2026).
export const stappen = [
  ['Jouw idee', 'Een omschrijving, een foto van een bestaand meubel, een schets of een inspiratiefoto: alles is goed. Via de website, mail, telefoon of WhatsApp.'],
  ['Vrijblijvend voorstel', 'We stellen waar nodig wat vragen en werken het ontwerp samen uit tot alles klopt. Voor grotere projecten kan ook een afspraak.'],
  ['Definitief voorstel en prijs', 'Zijn alle details duidelijk, dan krijg je een definitief voorstel met prijsopgave.'],
  ['Akkoord en 20% aanbetaling', 'Wij maken de tekening voor de meubelmakers. Wil je die eerst zelf zien? Dan krijg je hem ter controle.'],
  ['Gemaakt in Indonesië', 'Onze vaste meubelmakers maken je meubel met de hand, van duurzaam teak.'],
  ['Per container naar Nederland', 'Wij regelen het transport en de inklaring, en bellen je om een leverafspraak te maken.'],
  ['Bezorgen of afhalen', 'We bezorgen bij je thuis (de kosten hoor je vooraf) of je haalt hem af in Breda. Het restbedrag betaal je voor of bij levering.'],
];

export const url = (p = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${p.replace(/^\//, '')}`;
export const absoluut = (p = '') => new URL(url(p), import.meta.env.SITE).href;
export const waMet = (tekst: string) => `${site.wa}?text=${encodeURIComponent(tekst)}`;
export const waHoi = waMet('Hallo Teakhuis, ik heb een vraag over een teakhouten meubel.');
