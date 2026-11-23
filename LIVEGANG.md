# Livegang teakhuis.nl: checklist

Opgesteld 23 november 2026. Doel: de nieuwe site vervangt de oude op teakhuis.nl, zonder dat er iets verloren gaat:
geen mail, geen vindbaarheid in Google, geen aanvragen van klanten. Per punt staat wie het doet:
**C** = Claude (automatisch), **M** = Michael (handmatig), **H** = Han (aanleveren of beslissen).

## Uitslag controle Claude (23 november 2026, productie-build met `SITE_URL=https://teakhuis.nl`)

| # | Uitslag |
| --- | --- |
| B1 | **Groen na reparatie.** Oude site doorlopen: 625 oude adressen (517 uit de sitemap, 108 erbuiten: blog, landingspagina's als "teak-meubelen-utrecht", winkels, juridisch). Eerst gaven 195 een foutpagina (producten en categorieen die Han verborg of verwijderde, en alle pagina's buiten de webshop). Nu: 418 bestaan rechtstreeks, 206 verwijzen door naar de best passende pagina (lijst in `src/data/oude-adressen.json`, regels in `src/pages/[...oud].astro`). Alleen een winkelmand-sessielink niet. |
| B2 | Groen: 456 pagina's, 0 kapotte interne links. |
| B3 | Groen: 15 paginatypes op 320, 375, 390, 414, 440, 768, 1024 en 1440: geen horizontale scroll, niets buiten beeld, geen js-fouten. Een te klein label (11 px) op home vergroot. |
| B4 | Lighthouse mobiel: home 91/100/100/100, categorie 97/100/100/100, product 98/100/100/100, maatwerk 97/100/100/100, offerte 99/100/100/66 (offertepagina staat bewust op noindex). |
| B5 | Groen: een h1 per pagina, canonical naar teakhuis.nl, lang="nl", robots.txt goed. Gerepareerd: doorverwijspagina's stonden in de sitemap (138), nu niet meer (454 echte pagina's). Dubbel: "Ladekast Brindisi" staat twee keer in de catalogus (nachtkastjes en kleinmeubelen), zelfde titel en tekst: Han laten kiezen. |
| B6 | Groen: geen verwijzingen meer naar github.io of /teakhuis-dordrecht/ (behalve de reponaam in het beheer, die klopt). |
| B7 | Groen tot het versturen: maat en kleur zetten de prijs goed (toeslag 12,5% klopt), offertelijst bewaart product, maat en kleur; zoeken werkt. Versturen pas te testen na EmailJS (A1). |
| B8 | Groen: geen `[[AANLEVEREN`, geen em-dashes, geen standaard Tailwind-kleuren. |
| B9 | Groen: 0 cookies, geen verzoeken naar andere partijen. Geen cookiemelding nodig; privacyverklaring klopt. |
| B10 | Groen: Lighthouse toegankelijkheid 100 op alle geteste pagina's. |

Tweede ronde (zelfde dag), extra:
- Productgegevens (400 zichtbare producten): allemaal foto, omschrijving en prijs. Gerepareerd: bij 16 producten was een maat
  goedkoper dan de getoonde "vanaf"-prijs; de vanaf-prijs is nu altijd de laagste.
- Gestructureerde gegevens: 400 Product, 452 BreadcrumbList, Organization, FAQ: geldige JSON, prijzen als getal, geen
  testadres. Elke pagina een bestaande og-afbeelding.
- Bediening: mobiel menu (open, Escape, links), megamenu, sorteren op prijs, filterpaneel, fotogalerij, "toon alle maten",
  WhatsApp- en belnummer, toetsenbord (skiplink, zichtbare focus), 404 met status 404: alles werkt, geen js-fouten.
  Gerepareerd: een filterkeuze met 0 producten was aan te vinken en gaf een lege lijst; nu uitgeschakeld.
- Hele pagina's op 390 breed bekeken (home, product, over ons, maatwerk): geen opmaakfouten.

Nog open uit deze controle:
- **Bedrijfsnaam en KvK.** De site zegt "Teakhuis B.V.", Han tekent met "Teakhuis Dordrecht B.V.". Gevonden (niet officieel
  bevestigd): KvK 24419768, "Teakhuis Dordrecht", opgericht 15-08-2007, ingeschreven op Arenberglaan 268, 4824 RE Breda
  (bron: liza.nl). Nakijken op kvk.nl; daarna naam, KvK en adres invullen in het beheer (Instellingen > Contactgegevens).
- **Leveringsvoorwaarden.** De oude site had een pagina leveringsvoorwaarden; de nieuwe niet (oud adres verwijst nu naar
  Contact). Han vragen of hij die terug wil.
- **Blog.** Vier artikelen van de oude site (eettafel kiezen, boomstamtafel, thuiswerkplek, natuurlijke look) verwijzen nu
  door naar de passende categorie. Later voor SEO eventueel nieuwe artikelen schrijven.

## A. Blokkers: eerst geregeld, anders niet live

| # | Punt | Wie | Stand nu |
| --- | --- | --- | --- |
| A1 | **Formulieren versturen echt.** Offerte en maatwerkaanvraag hebben geen verzenddienst: ze openen nu het mailprogramma van de bezoeker (op veel telefoons en werkcomputers gebeurt er dan niets). EmailJS instellen (service, template Han, template klant, public key; zie BEHEER.md) en met een echte aanvraag testen, ook met foto's bij maatwerk. | M | Leeg in `src/data/instellingen.json` |
| A2 | **KvK-nummer en vestigingsadres.** Wettelijk verplicht op de site van een bedrijf, en nodig in de privacyverklaring en de voet. Adres mag een postadres zijn als Han geen bezoekadres wil tonen. | H | Leeg |
| A3 | **Mail van info@teakhuis.nl blijft werken.** Bij de DNS-wissel alleen de website-records aanpassen (A-records en `www`), de MX-records en mailrecords (SPF/DKIM) niet aanraken. Vooraf noteren hoe ze nu staan. teakhuis.nl draait nu op 37.97.191.31 (Apache; waarschijnlijk TransIP). | M | Nog niet bekeken (vanuit Claude geen DNS-toegang) |
| A4 | **Hostingpakket van de oude site niet opzeggen** voordat zeker is waar de mail draait. Draait de mail op hetzelfde pakket, dan blijft dat pakket nodig (of eerst de mail verhuizen). | M + H | Onbekend |
| A5 | **Toegang tot de DNS.** Wie heeft de inlog van de registrar (waarschijnlijk Han)? Inloggen samen, of Han zet de records met onze instructie. | H | Onbekend |
| A6 | **Han kan inloggen op teakhuis.nl/admin.** De inlog wordt per adres in de browser bewaard: na de wissel moet Han opnieuw inloggen met zijn toegangstoken. Vooraf nagaan of hij dat token nog heeft (anders een nieuw maken). | M + H | Te doen |
| A7 | **Akkoord en datum van Han.** Een rustig moment, liefst doordeweeks overdag, zodat we problemen direct zien. | H | Gevraagd per mail |

## B. Claude: automatische controle (op de productie-build)

| # | Controle |
| --- | --- |
| B1 | **Elk oud adres werkt nog.** Alle adressen uit de sitemap van de oude site (`teakhuis.nl/sitemap.xml`, webshop en overige pagina's) bestaan op de nieuwe site of verwijzen door naar de juiste pagina. Dit is het belangrijkste punt voor Google. |
| B2 | Geen kapotte interne links, ankers of afbeeldingen (alle pagina's gecrawld). |
| B3 | Mobiel kritisch nalopen (afgesproken met Han): screenshots van elk paginatype (home, categorie, product, collectie, maatwerk, aanvragen, offerte, over ons, duurzaam, contact, privacy, 404) op 320, 375, 390, 414 en 440 breed, plus tablet (768, 1024) en desktop (1440). Geen horizontale scroll, niets onder de balk Bellen/WhatsApp, menu en zoeken werken. |
| B4 | Lighthouse mobiel (prestaties, toegankelijkheid, best practices, SEO) op home, een categorie, een product, maatwerk en offerte. |
| B5 | SEO-techniek: per pagina een unieke title en description, een h1, canonical naar `https://teakhuis.nl/...`, JSON-LD geldig (alleen echte gegevens), sitemap compleet, robots.txt laat alles toe (geen `noindex` op het domein), og-afbeelding, `lang="nl"`. |
| B6 | Bouwen met de echte instellingen (`SITE_URL=https://teakhuis.nl`, `BASE_PATH=/`): geen links die nog naar `/teakhuis-dordrecht/` of github.io wijzen; beheer (`/admin`, sleeppagina, foto's) werkt op het nieuwe pad. |
| B7 | Klantreis in de browser: product kiezen, maat en kleur (toeslag klopt), in de offertelijst, versturen; maatwerkaanvraag met foto; zoeken; filters; WhatsApp- en bellinks; offertelijst blijft bewaard. |
| B8 | Inhoud: geen `[[AANLEVEREN`, geen em-dashes, geen standaard Tailwind-kleuren, geen verzonnen feiten; prijzen steekproefsgewijs gelijk aan de oude webshop. |
| B9 | Privacy en cookies: nagaan wat de site plaatst (nu: geen cookies, fonts lokaal, geen embeds), privacyverklaring klopt daarmee. Bij statistiek: alleen een cookievrije dienst. |
| B10 | Toegankelijkheid: zichtbare focus, contrast (ook het nieuwe groen), alt-teksten, toetsenbordbediening van menu en formulieren. |

## C. Michael: handmatige controle (echte toestellen)

| # | Controle |
| --- | --- |
| C1 | iPhone (groot en klein), Android, iPad, laptop in Chrome, Safari en Firefox: home, menu, een categorie, een product, maatwerk, contact. |
| C2 | Zelf een offerte aanvragen en een maatwerkaanvraag (met foto) doen als klant: komt de mail bij Han binnen, en de bevestiging bij de klant? Ziet die er goed uit in Gmail en Outlook? |
| C3 | Teksten lezen op typefouten en vreemde zinnen, vooral home, maatwerk, over ons, duurzaam. |
| C4 | Steekproef van 10 producten: foto's, prijzen, maten en omschrijving zoals Han ze heeft bedoeld. |
| C5 | Bellen- en WhatsApp-knop op de telefoon proberen: gaat naar het goede nummer. |
| C6 | Met Han: een product aanpassen in het beheer en de volgorde slepen, op de live site nakijken. |

## D. De livegang zelf (in deze volgorde)

1. Een dag vooraf: TTL van de DNS-records van teakhuis.nl en www verlagen (bijv. 300 seconden), zodat de wissel snel gaat en
   terugdraaien ook. Huidige records (A, www, MX, TXT) vastleggen in een schermafbeelding.
2. `public/CNAME` met `teakhuis.nl` toevoegen. In GitHub bij *Settings > Secrets and variables > Actions > Variables*:
   `SITE_URL` = `https://teakhuis.nl` en `BASE_PATH` = `/`. Bij *Settings > Pages*: custom domain `teakhuis.nl`.
3. DNS bij de registrar: A-records van `teakhuis.nl` naar 185.199.108.153, 185.199.109.153, 185.199.110.153 en
   185.199.111.153 (en de AAAA-records van GitHub, als de registrar die ondersteunt), `www` als CNAME naar
   `michaelbeset-ops.github.io`. MX en mailrecords niet aanraken.
4. Wachten tot GitHub het certificaat heeft gemaakt, dan *Enforce HTTPS* aanzetten.
5. Controle direct na de wissel: `https://teakhuis.nl`, `https://www.teakhuis.nl` en `http://` komen op de nieuwe site;
   het oude github.io-adres verwijst door; een testmail naar info@teakhuis.nl komt binnen; Han logt in op `/admin`.
6. Terugvaloptie: de oude A-record terugzetten (37.97.191.31). Zolang het oude pakket niet is opgezegd, staat de oude site
   binnen enkele minuten weer online.

## E. Direct na de livegang (start SEO)

1. Google Search Console: domein verifieren (TXT-record), sitemap `https://teakhuis.nl/sitemap-index.xml` indienen,
   de belangrijkste pagina's laten indexeren. Hetzelfde in Bing Webmaster Tools.
2. Twee weken lang de rapporten volgen op 404-fouten en niet-geindexeerde pagina's, en ontbrekende doorverwijzingen
   toevoegen.
3. Google Bedrijfsprofiel: staat op "Permanent gesloten" (Dordrecht). Met Han bespreken: omzetten naar een bedrijf zonder
   bezoekadres (servicegebied) met de nieuwe site als link, of een nieuw profiel.
4. Links naar de site bijwerken: Facebook, Instagram, Pinterest, mailhandtekening van Han.
5. Statistiek (cookievrij, bijv. Plausible of GoatCounter) aanzetten om bezoek en aanvragen te volgen.
