# Beheer van de Teakhuis-website

Producten, categorieën en contactgegevens beheer je zelf via **/admin**, bijvoorbeeld `https://teakhuis.nl/admin/`.
Je hebt geen programmeerkennis nodig. Alles wat je opslaat staat binnen 2 tot 4 minuten live.

## Hoe het werkt

- De website is een snelle, statische site (Astro) op GitHub Pages: geen database, geen updates, niets om te hacken.
- Het beheersysteem (Sveltia CMS) slaat je wijzigingen op in de GitHub-repository `michaelbeset-ops/teakhuis-dordrecht`.
- Elke wijziging start automatisch een nieuwe build. Die zie je onder **Actions** in GitHub. Groen vinkje = live.

## Inloggen

Je hebt een GitHub-account nodig met schrijfrechten op de repository (Michael voegt je toe als *collaborator*).

**Optie 1, direct te gebruiken: inloggen met een toegangssleutel**

1. Ga op GitHub naar *Settings > Developer settings > Personal access tokens > Fine-grained tokens > Generate new token*.
2. Naam: `Teakhuis beheer`. Geldigheid: bijvoorbeeld 1 jaar.
3. *Repository access*: alleen `michaelbeset-ops/teakhuis-dordrecht`.
4. *Permissions > Repository permissions > Contents*: **Read and write**.
5. Kopieer de sleutel, open `/admin/`, kies **Sign In Using Access Token** (Inloggen met toegangssleutel) en plak hem.
   De browser onthoudt je daarna.

**Optie 2, netter: een knop "Inloggen met GitHub"**

Daarvoor is een kleine gratis inlogdienst nodig (Cloudflare Worker `sveltia-cms-auth`, zie
https://github.com/sveltia/sveltia-cms-auth). Zet daarna in `public/admin/config.yml` de regel `base_url:` aan met het
adres van die dienst. Michael kan dit eenmalig instellen.

## Een product toevoegen

1. Open **Producten** en klik op **Nieuw** (New).
2. Vul in:
   - **Naam**, bijvoorbeeld "Eettafel Viking". Het webadres wordt hier automatisch van gemaakt.
   - **Categorie**: kies de soort, bijvoorbeeld "Teak eettafels". De hoofdcategorie (Tafels) volgt vanzelf.
   - **Foto's**: sleep ze erin. De eerste foto is de hoofdfoto. Grote foto's zijn prima, de site maakt ze zelf klein en
     snel. Foto's op een witte achtergrond worden passend getoond, sfeerfoto's vullen het vlak.
   - **Vanaf-prijs** en **Prijs tonen**: zet "Prijs tonen" uit voor "Prijs op aanvraag".
   - **Omschrijving**: gewone tekst. Een Enter is een nieuwe regel, een lege regel een nieuwe alinea.
   - **Standaardmaten**: per maat een regel, bijvoorbeeld "B200 x D100 x H78" met eventueel een prijs.
   - **Ook op maat leverbaar**: toont op de productpagina de keuze "Andere maat", waar de klant eigen maten invult.
   - **Keuze uit de vier houtkleuren**: Blank teak, Thee kleur, Koloniale kleur en Wit, met staaltjes.
   - **Andere uitvoeringen**: alleen als er andere keuzes zijn dan de vier houtkleuren.
3. Klik op **Opslaan** (Save). Na een paar minuten staat het product op de site.

## Wijzigen, verbergen of verwijderen

- **Wijzigen**: open het product, pas aan, opslaan.
- **Tijdelijk weghalen**: zet **Zichtbaar op de site** uit. Het product blijft bewaard en kan later terug.
- **Definitief verwijderen**: open het product en kies **Verwijderen** (Delete).
- **Op de homepage zetten**: zet **Uitgelicht op de homepage** aan. De eerste krijgt de grote plek; kies er 7.
- **Volgorde** in een categorie: een lager getal staat eerder.

Handig in de lijst: filter op *Uitgelicht*, *Verborgen* of *Zonder prijs*, of groepeer op categorie.

## Categorieën

Onder **Categorieën** staan de hoofdcategorieën (zoals Tafels, leeg veld "Valt onder") en de soorten daaronder (zoals
Teak eettafels, "Valt onder: Tafels"). Een **introtekst** bovenaan de categoriepagina helpt bij Google.
Een categorie verwijderen terwijl er nog producten in zitten? Die producten komen dan onder "Overig" te staan.

## Instellingen

Onder **Instellingen > Contactgegevens en formulier**: telefoon, WhatsApp, e-mail, KvK, adres en de drie beloftes in de
bovenbalk.

**Offerteformulier**: aanvragen komen per mail binnen via Web3Forms. Maak gratis een sleutel aan op
https://web3forms.com met het adres waar de aanvragen heen moeten, en plak die bij **Web3Forms-sleutel**.
Zonder sleutel opent het formulier het mailprogramma van de bezoeker met de aanvraag erin.

## Hoe een offerteaanvraag eruitziet

De bezoeker kiest op een productpagina een maat (of vult een eigen maat in), een houtkleur, het aantal en eventueel een
wens, en zet het in zijn **offerteaanvraag**. Dat kan met meerdere meubels. Op `/offerte/` vult hij zijn gegevens in en
verstuurt alles in één keer. Je krijgt een mail met per meubel de keuzes en een link naar het product.

## Als er iets misgaat

Staat een wijziging na 10 minuten nog niet live? Kijk in GitHub onder **Actions**. Een rood kruisje betekent dat de
build een fout vond, bijvoorbeeld een product zonder categorie. De oude versie van de site blijft dan gewoon online.
Open het product, herstel het veld en sla opnieuw op, of vraag Michael om hulp.

## Voor Michael: technische zaken

- Lokaal: `npm ci`, `npm run dev` (poort 4447), `npm run build`.
- Data: `src/content/producten/*.json` en `src/content/categorieen/*.json` (schema in `src/content.config.ts`).
  Foto's in `src/assets/producten/`. Contactgegevens in `src/data/instellingen.json`.
- Deploy: `.github/workflows/deploy.yml` (GitHub Pages, bron: GitHub Actions).
  Zonder eigen domein draait de site op `https://michaelbeset-ops.github.io/teakhuis-dordrecht/`.
- Eigen domein koppelen:
  1. `public/CNAME` met daarin `teakhuis.nl` (of `www.teakhuis.nl`).
  2. In GitHub, *Settings > Secrets and variables > Actions > Variables*: `SITE_URL` = `https://teakhuis.nl`, `BASE_PATH` = `/`.
  3. DNS bij de registrar: A-records van `teakhuis.nl` naar 185.199.108.153, 185.199.109.153, 185.199.110.153 en
     185.199.111.153, en een CNAME `www` naar `michaelbeset-ops.github.io`. Daarna *Enforce HTTPS* aanzetten.
- Oude adressen van teakhuis.nl/webshop/... sturen automatisch door naar de nieuwe productpagina's (`src/pages/[...oud].astro`).
- `tools/migreer.mjs` was de eenmalige omzetting van de oude webshop; niet opnieuw draaien, dat overschrijft wijzigingen uit het beheer.
