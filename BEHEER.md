# Beheer van de Teakhuis-website

Zo pas je zelf je producten aan. Je hoeft niets van computers te weten.

## Inloggen

1. Ga naar **teakhuis.nl/admin** (bewaar dit als favoriet).
2. Je bent meestal al ingelogd. Zo niet: bel Michael.

## Een prijs, tekst of foto aanpassen

1. Klik links op **Producten**.
2. Typ de naam van het product in het zoekveld bovenaan, of klik het aan in de lijst.
3. Pas aan wat je wilt. Rechts zie je meteen hoe het op de site eruitziet.
4. Klik rechtsboven op **Opslaan**.

Na ongeveer 3 minuten staat het op de site.

## Een nieuw product toevoegen

1. Klik op **Producten** en dan op **Nieuw product**.
2. Vul in:
   - **Naam**: bijvoorbeeld *Eettafel Viking*.
   - **Categorie**: kies uit de lijst.
   - **Foto's**: klik op **Foto's kiezen** en kies een foto op je computer. De eerste is de hoofdfoto.
   - **Prijs vanaf**: alleen het getal, bijvoorbeeld *899*. Leeg laten = "prijs op aanvraag".
   - **Omschrijving**: gewoon typen.
   - **Maten**: klik op *Toevoegen* voor elke maat. De prijs mag leeg blijven.
3. Klik op **Opslaan**.

## Collecties

Een collectie is een serie meubels in één stijl, zoals Venice of Semarang. Bij een product kies je bij **Collectie**
de serie. Onder **Collecties** pas je per serie de naam, een korte tekst en een sfeerfoto aan.

## Een product weghalen

- **Even niet laten zien**: zet **Zichtbaar op de site** uit en klik op Opslaan.
- **Voor altijd weg**: open het product en klik op **Verwijderen**.

## Telefoonnummer of e-mail veranderen

Klik links op **Instellingen** en dan op **Contactgegevens**. Aanpassen en Opslaan.

## Hulp nodig?

Bel of app Michael. Er kan niets kapotgaan: een fout zet de site nooit offline, en elke wijziging kan worden
teruggedraaid.

---

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
- Beheer bewust minimaal gehouden: technische velden (SEO, volgorde, maatwerk, oude URL's, sociale media,
  formuliersleutels) zijn `widget: hidden` in `public/admin/config.yml`. Ze blijven bewaard bij opslaan; aanpassen
  doe je in de JSON-bestanden.
- Inloggen voor Han: maak eenmalig op zijn computer een fine-grained token (alleen deze repository, *Contents: Read and
  write*, 1 jaar geldig), kies op /admin **Sign In Using Access Token** en plak hem. De browser onthoudt het.
  Netter alternatief: een inlogknop via de Cloudflare Worker `sveltia-cms-auth` en `base_url:` in de config.
- Offertemail (opgemaakt, met foto, knop en link per meubel; de opmaak staat in `src/scripts/mail.ts`):
  1. Maak een gratis account op https://www.emailjs.com (200 mails per maand).
  2. *Email Services > Add New Service*: koppel de mailbox die verstuurt (bijv. Gmail). Noteer de **Service ID**.
  3. *Email Templates > Create New Template*:
     - *Subject*: `{{onderwerp}}`
     - *To Email*: `info@teakhuis.nl`, *Reply To*: `{{reply_to}}`, *From Name*: `Website Teakhuis`
     - *Content*: klik op *Edit Content > Code Editor* en zet daar alleen `{{{inhoud}}}` (drie accolades).
     Noteer de **Template ID**.
  4. Bevestiging voor de klant: maak een tweede template met *Subject* `{{onderwerp}}`, *To Email* `{{to_email}}`,
     *Reply To* `{{reply_to}}`, *From Name* `Teakhuis` en als *Content* alleen `{{{inhoud}}}`. Noteer de **Template ID**
     als `templateKlant` (leeg laten = geen bevestiging).
  5. *Account > General*: noteer de **Public Key**. Zet onder *Security* de toegestane domeinen op teakhuis.nl en
     michaelbeset-ops.github.io.
  6. Vul de waarden in bij `emailjs` in `src/data/instellingen.json` en push.
  Zonder EmailJS valt het formulier terug op Web3Forms (`web3formsKey`, platte tekst) en anders op het mailprogramma.
  Testen zonder te versturen: `node tools/mailtest.mjs` (bewaart de mail als `shots/mail.html`).
- Statistiek (zonder cookies, dus zonder cookiemelding): vul in `src/data/instellingen.json` bij `statistiek` óf
  `plausible` (het domein, bijv. `teakhuis.nl`, account op plausible.io) óf `goatcounter` (de code van je account op
  goatcounter.com) in. De site telt dan ook "In offerte", "Offerte verstuurd", "Offerte via mailprogramma", "WhatsApp"
  en "Bellen". De privacyverklaring past zich automatisch aan.
- `tools/migreer.mjs` was de eenmalige omzetting van de oude webshop; niet opnieuw draaien, dat overschrijft wijzigingen uit het beheer.
