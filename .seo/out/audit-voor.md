# SEO-audit https://teakhuis.nl

Pagina's: 1129 (indexeerbaar 570), sitemap-URL's: 571, strategie: ai, landelijk
Schema-types: AggregateOffer, Answer, Article, Brand, BreadcrumbList, ContactPage, ContactPoint, Country, FAQPage, ItemList, ListItem, Offer, Organization, Product, Question, SearchAction, Service, WebSite

**Totaalscore: 84/100**  (Kritiek 0, Hoog 581, Middel 579, Laag 1099, Info 2)

| Categorie | Score |
|---|---|
| Techniek | 83 |
| On-page | 55 |
| Links | 100 |
| Structured data | 96 |
| Lokaal | 80 |
| AI-gereedheid | 97 |
| Content | 80 |

## Hoog

- [Content] Dienstpagina uit seo.config.json bestaat niet: /webshop (Alle teakhouten meubels)  
  (6 varianten, o.a. op /)
  Fix: Eén sterke pagina per dienst is de basis van lokale zichtbaarheid.
- [Lokaal] Naam in JSON-LD "Teakhuis B.V." wijkt af van "Teakhuis".  
  Pagina: /, /collecties/, /collecties/adrianne/, /collecties/badalona/, /collecties/bayakayu/, /collecties/brindisi/ (+566)
- [On-page] Geen meta description.  
  Pagina: /admin/
- [On-page] Geen H1.  
  Pagina: /admin/
- [Techniek] Pagina staat op noindex maar niet in ignorePaths. Bewust?  
  Pagina: /admin/
  Fix: Haal noindex weg, of zet het pad in ignorePaths in seo.config.json.

## Middel

- [On-page] 14 afbeelding(en) zonder alt-attribuut.  
  (49 varianten, o.a. op /, /collecties/, /collecties/adrianne/, /collecties/badalona/, /collecties/bayakayu/, /collecties/brindisi/ ...)
  Fix: Beschrijvende alt, of alt="" voor decoratie.
- [On-page] Open Graph mist: og:title, og:description, og:image.  
  Pagina: /admin/
- [On-page] Title is 63 tekens (wordt afgekapt na ~60): "Collectie Edge line: teakhouten meubels in één stijl | Teakhuis"  
  (4 varianten, o.a. op /collecties/edge-line/, /duurzaam/, /maatwerk/, /webshop/etxFAX7uScLCTSM6mcUYWX/213/badkamer-hangende-modellen/)
- [Structured data] Article mist 'image'.  
  Pagina: /duurzaam/
- [Techniek] 15 afbeelding(en) > 400 KB: _astro/1.B1VSnq5x_1Mymhx.webp (545 KB), _astro/1.KWlAGzoI_27K5Xg.webp (484 KB), _astro/1.B1VSnq5x_3NQFQ.webp (463 KB), _astro/2.Cw9ZVwwd_2bgaKf.webp (469 KB)  
  Pagina: /
  Fix: Zet bronfoto's in src/assets en gebruik <Image>/<Picture> (avif/webp).

## Laag

- [AI-gereedheid] Entiteit zonder description: geef in één zin wie, wat, waar.  
  Pagina: /, /collecties/, /collecties/adrianne/, /collecties/badalona/, /collecties/bayakayu/, /collecties/brindisi/ (+566)
- [AI-gereedheid] Geen /llms.txt (optioneel, geen rankingfactor, wel handig voor AI-agents).  
  Pagina: /
- [On-page] Meta description 180 tekens (afgekapt na ~155).  
  (7 varianten, o.a. op /, /maatwerk/, /over-ons/, /webshop/, /webshop/etxFAX7uScLCTSM6mcUYWX/171/teak-computerkasten/, /webshop/etxFAX7uScLCTSM6mcUYWX/172/teak-buffetkasten/ ...)
- [On-page] Meta description kort (41 tekens).  
  (2 varianten, o.a. op /privacy/, /webshop/etxFAX7uScLCTSM6mcUYWX/182/teak-bedden/, /webshop/etxFAX7uScLCTSM6mcUYWX/230/teak-zitmeubelen/)
- [On-page] Title is kort (17 tekens): "Beheer | Teakhuis"  
  (2 varianten, o.a. op /admin/, /contact/)
  Fix: Dienst + plaats + merk, bijv. 'Tuinaanleg in Dordrecht | Bedrijfsnaam'.
- [On-page] Geen twitter:card.  
  Pagina: /admin/
- [Techniek] HTML is 294 KB (inline CSS/JS of SVG?).  
  (2 varianten, o.a. op /webshop/etxFAX7uScLCTSM6mcUYWX/228/tafels/, /webshop/etxFAX7uScLCTSM6mcUYWX/229/kasten/)
- [Techniek] 1 afbeelding(en) zonder width/height (CLS-risico).  
  Pagina: /offerte/, /webshop/etxFAX7uScLCTSM6mcUYWX/164/121/teak-eettafels/eettafel-model-lorenzo/, /webshop/etxFAX7uScLCTSM6mcUYWX/164/12861/teak-eettafels/eettafel-kasma/, /webshop/etxFAX7uScLCTSM6mcUYWX/164/12863/teak-eettafels/semarang-eettafel-yukon/, /webshop/etxFAX7uScLCTSM6mcUYWX/164/12869/teak-eettafels/semarang-eettafel-tigris/, /webshop/etxFAX7uScLCTSM6mcUYWX/164/132/teak-eettafels/eettafel-model-klooster/ (+502)
  Fix: Gebruik <Image> uit astro:assets.

## Info

- [Structured data] FAQPage-markup: geen rich result meer sinds mei 2026. Mag blijven als de vragen zichtbaar op de pagina staan.  
  Pagina: /duurzaam/, /maatwerk/

