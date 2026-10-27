# Wensen van Han (Teakhuis)

Eerste reactie van Han Rietdijk op de testversie, 26 oktober 2026. Status per punt.

| Wens | Wie | Status |
| --- | --- | --- |
| Layout en sfeer gaan voor: de homepage werkt met sfeerfoto's, zoals op de huidige site | Han levert foto's, Michael bouwt | Deels: tegels kiezen nu sfeerfoto's; hero en betere foto's wachten op Han |
| Voorbeelden van de gewenste sfeer: Het Teakmagazijn en Koloniaal Teakhuis | Michael | Bekeken (27 okt): grote sfeerfoto bovenaan, tegels met sfeerfoto's, collecties overgenomen |
| Nieuw logo (het logo is onderweg veranderd) | Han levert aan | Wacht op logo |
| Indeling zoals de huidige webshop: Producten (per soort) en Collecties (per serie) | Michael | Gedaan: menu Producten + Collecties, 17 collecties (Venice, Semarang, Milaan, ...), per product in te stellen |
| Maatwerkpagina: tekeningen met het eindresultaat | Han levert aan | Wacht op beeld |
| Teksten voor de pagina's, ook over duurzaamheid | Han levert aan | Wacht op teksten |
| Catalogus en weergave van de producten aanpassen | Han, daarna Michael | Han duikt er nog in |
| Verhaal met foto's over soorten teak, afwerkingen en kleuren | Han levert aan, Michael maakt er een pagina van | Wacht op verhaal en foto's |

## Wat al klaarstaat voor zijn materiaal

- Categoriefoto's: elke categorie heeft in het beheer een veld "Foto". Een sfeerfoto daar vervangt de productfoto
  op de homepage, in het megamenu en op de collectiepagina.
- Maatwerkvoorbeelden: de tabbladen tekening/resultaat op de homepage en de maatwerkpagina komen uit één lijst
  (src/components/MaatwerkProjecten.astro, foto's als src/assets/mw-<naam>-tekening.jpg en -meubel.jpg).
- Collecties: in het beheer onder "Collecties" (naam, tekst, sfeerfoto). Bij een product kies je de collectie.
  Een collectie met een eigen sfeerfoto verschijnt ook op de homepage.
- Kleurstaaltjes: src/assets/kleur-*.jpg (één bestand per kleur, vervangen = klaar).

## Wat we Han vragen bij foto's

- Liggend (breder dan hoog), minstens 2000 pixels breed, het origineel van de camera of telefoon (niet via WhatsApp,
  dat maakt ze klein).
- Meubels in een echt interieur, bij daglicht. Bij klanten thuis: met hun toestemming.
- Logo bij voorkeur als SVG of PDF, anders een PNG met doorzichtige achtergrond.
