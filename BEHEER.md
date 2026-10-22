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
   - **Foto's**: klik op de groene knop **Bladeren** en kies een foto op je computer. De eerste is de hoofdfoto.
   - **Prijs vanaf**: alleen het getal, bijvoorbeeld *899*. Leeg laten = "prijs op aanvraag".
   - **Omschrijving**: gewoon typen.
   - **Maten**: klik op *Toevoegen* voor elke maat. De prijs mag leeg blijven.
3. Klik op **Opslaan**.

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
  4. *Account > General*: noteer de **Public Key**. Zet onder *Security* de toegestane domeinen op teakhuis.nl en
     michaelbeset-ops.github.io.
  5. Vul de drie waarden in bij `emailjs` in `src/data/instellingen.json` en push.
  Zonder EmailJS valt het formulier terug op Web3Forms (`web3formsKey`, platte tekst) en anders op het mailprogramma.
  Testen zonder te versturen: `node tools/mailtest.mjs` (bewaart de mail als `shots/mail.html`).
- `tools/migreer.mjs` was de eenmalige omzetting van de oude webshop; niet opnieuw draaien, dat overschrijft wijzigingen uit het beheer.
