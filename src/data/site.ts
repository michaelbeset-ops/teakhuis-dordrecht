// Feiten (bekeken 7 oktober 2026), bronnen in bron/:
// - teakhuis.nl home: "Teakhuis heeft geen showroom meer. Wij leveren uitsluitend op bestelling", e-mail info@teakhuis.nl,
//   telefonisch 06-40220897; USP's "Maatwerk zonder meerprijs", "Authentieke handgemaakte meubels", "Alleen duurzaam hout",
//   "Groot en divers assortiment".
// - Over ons: eerste vestiging 2007 Dordrecht; SVLK-hout; lokale producenten in Indonesie maken elk meubel met de hand;
//   "In 2018 en 2019 hebben we besloten de showrooms te sluiten en alleen online verder te gaan. ... onze adviseur kan per klant
//   meer aandacht geven en we kunnen nog voordeliger werken omdat de kosten veel lager zijn. Alle maatwerk is nog steeds mogelijk!"
//   Team: "Han, Adviseur Nederland, bezorger, service medewerker". Blog 15-07-2017: adviseur Han Rietdijk.
// - Maatwerk/het-proces: 5 stappen (gesprek, schetsen + prijsopgave, definitieve schets + 20% aanbetaling, producenten in
//   Indonesie, thuis geleverd). Maatwerkformulier: soort, afmetingen, speciale materialen (metaal, glas, wielen), wensen.
// - Leverbare kleuren: Blank teak, Thee kleur teak, Koloniale kleur, Wit.
// - Leveringsvoorwaarden: Teakhuis B.V.  Facebook-intro: "Maatwerk zonder meerprijs gemaakt uit eerste klas teakhout!!"
export const site = {
  naam: 'Teakhuis',
  bv: 'Teakhuis B.V.',
  tel: '06 40 22 08 97',
  telHref: 'tel:+31640220897',
  wa: 'https://wa.me/31640220897',
  mail: 'info@teakhuis.nl',
  shop: 'https://teakhuis.nl/webshop',
  facebook: 'https://www.facebook.com/teakhuis/',
  instagram: 'https://www.instagram.com/teakhuis/',
  pinterest: 'https://www.pinterest.com/teakhuisnl/',
  themeColor: '#ffffff',
  voorstel: import.meta.env.PUBLIC_VOORSTEL === '1',
};

const ws = (p: string) => `https://teakhuis.nl/webshop/etxFAX7uScLCTSM6mcUYWX/${p}`;

// Hun eigen webshopcategorieen (hoofdmenu teakhuis.nl).
export const categorieen: [string, string][] = [
  ['Tafels', ws('228/tafels')],
  ['Kasten', ws('229/kasten')],
  ['Zitmeubelen', ws('230/teak-zitmeubelen')],
  ['Slaapkamer', ws('232/slaapkamermeubels')],
  ['Badkamer', ws('235/badkamermeubelen')],
  ['Tuin', ws('206/tuinmeubelen')],
  ['Lampen', ws('212/lampen')],
  ['Accessoires', ws('221/accessoires')],
];

// Echte producten uit de webshop. Naam, prijs ("v.a." zoals in hun categorieoverzichten) en maten letterlijk van de
// productpagina, stand 7 oktober 2026.
export const producten = [
  { id: 'eettafel-viking', naam: 'Eettafel Viking', soort: 'Eettafel', prijs: 'v.a. € 899,-', regel: 'Oud gerecycled teakhout en staal. Van B160 tot B280.', href: ws('164/28682/teak-eettafels/eettafel-viking') },
  { id: 'dressoir-bayakayu', naam: 'Dressoir Bayakayu', soort: 'Dressoir', prijs: 'v.a. € 1.349,-', regel: 'Rustiek teak met donkergrijs staal. B200 x D45 x H90.', href: ws('246/29731/dressoirs/dressoir-bayakayu') },
  { id: 'eettafel-japura', naam: 'Robuuste Eettafel Japura', soort: 'Eettafel', prijs: 'v.a. € 1.589,-', regel: '5 cm massief blad op een stalen V-poot.', href: ws('164/14400/teak-eettafels/robuuste-eettafel-japura') },
  { id: 'tuintafel-trapezium', naam: 'Tuintafel trapezium', soort: 'Tuintafel', prijs: 'v.a. € 899,-', regel: 'Live edge top van gerecycled teak, mat zwarte poten.', href: ws('206/32694/tuinmeubelen/tuintafel-trapezium') },
  { id: 'tv-dressoir-bayakayu', naam: 'Tv dressoir Bayakayu', soort: 'Tv-meubel', prijs: 'v.a. € 849,-', regel: 'Vier deuren, een lade en een open vak. B180.', href: ws('174/29728/teak-tv-kasten/tv-dressoir-bayakayu') },
  { id: 'buffetkast-bonaparte', naam: 'Buffetkast Bonaparte', soort: 'Buffetkast', prijs: 'v.a. € 1.979,-', regel: 'Onbehandeld oud teakhout. H220 x B162.', href: ws('172/3777/teak-buffetkasten/buffetkast-bonaparte') },
  { id: 'salontafel-bayakayu', naam: 'Salontafel Bayakayu', soort: 'Salontafel', prijs: 'v.a. € 629,-', regel: 'Vier lades op metalen geleiderails. B120 x D70.', href: ws('165/29725/teak-salontafels/salontafel-bayakayu') },
  { id: 'tuintafel-viking', naam: 'Tuintafel Viking', soort: 'Tuintafel', prijs: 'v.a. € 1.029,-', regel: 'Volledig massief 3 cm gerecycled teak.', href: ws('206/32717/tuinmeubelen/tuintafel-viking') },
];

// Wow: alleen meubels en afwerkingen die Teakhuis zelf noemt (maatwerkpagina's, webshopcategorieen, leverbare kleuren).
export const maatwerk = {
  meubels: ['kledingkast', 'tv-meubel', 'eettafel', 'dressoir', 'buffetkast', 'boekenkast', 'vitrinekast', 'bureau', 'salontafel', 'badkamermeubel', 'tuintafel'],
  kleuren: ['Blank teak', 'Thee kleur', 'Koloniale kleur', 'Wit', 'Weet ik nog niet'],
  extra: ['metaal', 'glas', 'wielen'],
};

// Letterlijk van hun eigen referentiepagina (teakhuis.nl/referenties) en Google (5 sterren). Ingekort met "…".
export const reviews = [
  { tekst: 'We willen anderen ook laten weten dat maatwerk betaalbaar en mooi is. Dat heeft het Teakhuis bewezen!', naam: 'Peter en Majo A.', bron: 'teakhuis.nl, over hun badkamermeubel' },
  { tekst: 'Een compliment voor de service en uw chauffeurs. … daarna hebben ze alles zeer zorgvuldig op zijn plek gezet.', naam: 'Gert-Jan H.', bron: 'teakhuis.nl' },
  { tekst: 'Meubels zijn naar eigen wens aan te passen omdat alles maatwerk is, personeel kan daardoor ook meedenken/ helpen met je keuze.', naam: 'Marco B.', bron: 'Google review' },
  { tekst: 'Vanmiddag hebben we onze meubels bezorgd gekregen. Ze zijn meer dan het wachten waard geweest.', naam: 'Jeanette v.d. S.', bron: 'teakhuis.nl' },
];

export const url = (p = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${p.replace(/^\//, '')}`;
export const waMet = (tekst: string) => `${site.wa}?text=${encodeURIComponent(tekst)}`;
export const waHoi = waMet('Hallo Teakhuis, ik heb een vraag over een teakhouten meubel.');
