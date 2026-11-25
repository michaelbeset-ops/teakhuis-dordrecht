// Twee HTML-mails bij een offerteaanvraag: mailHtml voor Teakhuis (per meubel foto, keuzes, knop en link, plus de
// klantgegevens) en bevestigingHtml voor de klant (wat hij aanvroeg en hoe het verder gaat). Alles met inline stijlen en
// tabellen, want mailprogramma's (Outlook, Gmail) negeren stylesheets. Invoer van de bezoeker wordt altijd ge-escaped.
import type { Regel } from './offerte';

export interface Klant { naam: string; email: string; telefoon: string; plaats: string; bericht: string }
export interface Contact { tel: string; telHref: string; wa: string; mail: string }

const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const absoluut = (pad: string) => new URL(pad, location.href).href;

const INKT = '#17201b', GRIJS = '#55605a', DIEP = '#36641a', ZAND = '#f1eee7', LIJN = '#e3ddd1';
const FONT = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;";

function regelHtml(r: Regel, i: number) {
  const link = absoluut(r.href);
  const details: [string, string | undefined][] = [
    ['Maat', r.eigenMaat ? `${r.eigenMaat} (eigen maat)` : r.maat],
    ['Kleur', r.kleur],
    ['Extra', r.extra?.join(', ')],
    ['Wens', r.opmerking],
    ['Indicatie', r.indicatie],
  ];
  const rijen = details.filter(([, v]) => v).map(([k, v]) =>
    `<tr><td style="${FONT}font-size:14px;color:${GRIJS};padding:2px 14px 2px 0;vertical-align:top;white-space:nowrap">${k}</td><td style="${FONT}font-size:14px;color:${INKT};padding:2px 0;font-weight:600">${esc(v)}</td></tr>`).join('');
  const foto = r.foto
    ? `<a href="${esc(link)}"><img src="${esc(absoluut(r.foto))}" width="96" height="96" alt="${esc(r.titel)}" style="display:block;width:96px;height:96px;object-fit:contain;background:#ffffff;border:1px solid ${LIJN}"></a>`
    : `<div style="width:96px;height:96px;background:${ZAND}"></div>`;
  return `
  <tr><td style="padding:20px 0;border-top:${i ? `1px solid ${LIJN}` : '0'}">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="96" style="vertical-align:top;padding-right:18px">${foto}</td>
      <td style="vertical-align:top">
        <p style="${FONT}margin:0 0 6px;font-size:16px;line-height:1.3;font-weight:700;color:${INKT}">${r.aantal > 1 ? `<span style="color:${DIEP}">${r.aantal}&times;</span> ` : ''}${esc(r.titel)}</p>
        <table role="presentation" cellpadding="0" cellspacing="0">${rijen}</table>
        <p style="${FONT}margin:10px 0 0;font-size:14px"><a href="${esc(link)}" style="color:${DIEP};font-weight:600">Bekijk op de site</a></p>
      </td>
    </tr></table>
  </td></tr>`;
}

const label = (t: string, boven = 26) => `<p style="${FONT}margin:${boven}px 0 6px;font-size:15px;font-weight:700;color:${INKT}">${t}</p>`;
const meubels = (regels: Regel[], kop: string) => (regels.length ? `${label(kop)}<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${regels.map(regelHtml).join('')}</table>` : '');
const bericht = (k: Klant, kop: string) => (k.bericht ? `${label(kop, 22)}<div style="${FONT}border-left:3px solid ${LIJN};padding:2px 0 2px 14px;font-size:15px;line-height:1.55;color:${INKT};white-space:pre-wrap">${esc(k.bericht)}</div>` : '');

// De vaste omlijsting: logo en ondertitel boven een witte kaart, met een regel uitleg eronder.
function omhulsel(logo: string, sub: string, inhoud: string, voet: string) {
  return `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff"><tr><td align="center" style="padding:24px 16px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">
    <tr><td style="padding:0 0 20px;border-bottom:1px solid ${LIJN}">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        ${logo ? `<td style="padding-right:12px"><img src="${esc(logo)}" width="40" height="40" alt="Teakhuis" style="display:block;width:40px;height:40px"></td>` : ''}
        <td style="${FONT}"><span style="display:block;font-size:17px;font-weight:700;color:${INKT}">Teakhuis</span>${sub ? `<span style="display:block;font-size:13px;color:${GRIJS}">${sub}</span>` : ''}</td>
      </tr></table>
    </td></tr>
    <tr><td style="padding:24px 0">${inhoud}</td></tr>
    <tr><td style="padding:14px 0 0;border-top:1px solid ${LIJN};${FONT}font-size:12px;line-height:1.5;color:${GRIJS}">${voet}</td></tr>
  </table>
</td></tr></table>
</body></html>`;
}

// Bevestiging voor de klant: een gewone, persoonlijke mail van Han met wat de klant aanvroeg en hoe het verder gaat.
const p = (t: string, boven = 14) => `<p style="${FONT}margin:${boven}px 0 0;font-size:15px;line-height:1.6;color:${INKT}">${t}</p>`;
const groet = (c: Contact) => p(`Met vriendelijke groet,<br>Han<br><span style="color:${GRIJS}">Teakhuis &middot; <a href="${esc(c.telHref)}" style="color:${GRIJS};white-space:nowrap">${esc(c.tel)}</a></span>`, 24);
const aanhef = (naam: string) => { const v = naam.trim().split(/\s+/)[0] || ''; return p(v ? `Hoi ${esc(v)},` : 'Hallo,', 0); };

export function bevestigingHtml(regels: Regel[], k: Klant, logo: string, c: Contact) {
  const inhoud = `
      ${aanhef(k.naam)}
      ${p('Bedankt voor je offerteaanvraag. Ik heb hem goed ontvangen en kijk er zelf naar. Hieronder zie je nog even wat je hebt aangevraagd.')}
      ${meubels(regels, 'Je aanvraag')}
      ${bericht(k, 'Je vragen of wensen')}
      ${label('Hoe gaat het verder?')}
      ${p('Ik bel of mail je om je wensen, maten en kleur door te nemen. Daarna krijg je een tekening met je maten en een prijs. Dat is vrijblijvend, je zit nergens aan vast. Ga je akkoord, dan betaal je 20% aan en wordt je meubel met de hand gemaakt en bij je thuis afgeleverd.', 0)}
      ${p(`Vraag of iets vergeten? Bel me op <a href="${esc(c.telHref)}" style="color:${DIEP};font-weight:600;white-space:nowrap">${esc(c.tel)}</a> of stuur een <a href="${esc(c.wa)}" style="color:${DIEP};font-weight:600">WhatsApp</a>.`)}
      ${groet(c)}`;
  return omhulsel(logo, '', inhoud, `Je krijgt deze mail omdat je via teakhuis.nl een offerte aanvroeg. Antwoorden kan gewoon, dan komt je mail bij mij terecht (${esc(c.mail)}).`);
}

export function mailHtml(regels: Regel[], k: Klant, logo = '') {
  const stuks = regels.reduce((n, r) => n + r.aantal, 0);
  const tel = k.telefoon.replace(/[^\d+]/g, '');
  const contact: [string, string][] = [
    ['Naam', esc(k.naam)],
    ['E-mail', `<a href="mailto:${esc(k.email)}" style="color:${DIEP};font-weight:600">${esc(k.email)}</a>`],
    ['Telefoon', k.telefoon ? `<a href="tel:${esc(tel)}" style="color:${DIEP};font-weight:600">${esc(k.telefoon)}</a>` : '<span style="color:#8a938e">niet ingevuld</span>'],
    ['Woonplaats', k.plaats ? esc(k.plaats) : '<span style="color:#8a938e">niet ingevuld</span>'],
  ];
  const knoppen = [
    `<td style="background:${INKT};border-radius:4px"><a href="mailto:${esc(k.email)}?subject=${encodeURIComponent('Je offerteaanvraag bij Teakhuis')}" style="${FONT}display:inline-block;padding:11px 18px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none">Beantwoorden</a></td>`,
    k.telefoon ? `<td width="10"></td><td style="border:1px solid ${INKT};border-radius:4px"><a href="tel:${esc(tel)}" style="${FONT}display:inline-block;padding:10px 18px;font-size:14px;font-weight:700;color:${INKT};text-decoration:none">Bellen</a></td>` : '',
  ].join('');

  const inhoud = `
      <h1 style="${FONT}margin:0;font-size:24px;line-height:1.25;color:${INKT}">Nieuwe offerteaanvraag</h1>
      <p style="${FONT}margin:8px 0 0;font-size:15px;line-height:1.5;color:${GRIJS}">${esc(k.naam)} vraagt een offerte voor ${stuks ? `<strong style="color:${INKT}">${stuks} ${stuks === 1 ? 'meubel' : 'meubels'}</strong>` : 'maatwerk'}.</p>
      ${meubels(regels, 'Gekozen meubels')}
      ${bericht(k, 'Vragen of wensen')}
      ${label('Klantgegevens')}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${LIJN}">
        ${contact.map(([a, b]) => `<tr><td style="${FONT}font-size:14px;color:${GRIJS};padding:9px 12px 9px 0;border-bottom:1px solid ${LIJN};width:110px">${a}</td><td style="${FONT}font-size:15px;color:${INKT};padding:9px 0;border-bottom:1px solid ${LIJN}">${b}</td></tr>`).join('')}
      </table>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:20px"><tr>${knoppen}</tr></table>`;
  return omhulsel(logo, 'Aanvraag via de website', inhoud, `Op "Beantwoorden" drukken in je mailprogramma stuurt je antwoord direct naar ${esc(k.email)}.`);
}

// Maatwerkaanvraag (formulier op maatwerk/aanvragen/): geen meubellijst, wel omschrijving, maten, adres en foto's.
export interface Maatwerk { naam: string; email: string; telefoon: string; adres: string; omschrijving: string; maten: string; fotos: number }

const blok = (kop: string, tekst: string, boven = 22) => (tekst ? `${label(kop, boven)}<div style="${FONT}border-left:3px solid ${LIJN};padding:2px 0 2px 14px;font-size:15px;line-height:1.55;color:${INKT};white-space:pre-wrap">${esc(tekst)}</div>` : '');
const fotoRegel = (n: number, jij: boolean) => (n ? `<p style="${FONT}margin:16px 0 0;font-size:14px;color:${INKT}"><strong>${n} ${n === 1 ? 'foto' : "foto's"}</strong> ${jij ? 'meegestuurd' : 'als bijlage bij deze mail'}.</p>` : '');

export function maatwerkHtml(m: Maatwerk, logo = '') {
  const tel = m.telefoon.replace(/[^\d+]/g, '');
  const leeg = '<span style="color:#8a938e">niet ingevuld</span>';
  const contact: [string, string][] = [
    ['Naam', esc(m.naam)],
    ['E-mail', `<a href="mailto:${esc(m.email)}" style="color:${DIEP};font-weight:600">${esc(m.email)}</a>`],
    ['Telefoon', m.telefoon ? `<a href="tel:${esc(tel)}" style="color:${DIEP};font-weight:600">${esc(m.telefoon)}</a>` : leeg],
    ['Adres', m.adres ? esc(m.adres) : leeg],
  ];
  const inhoud = `
      <h1 style="${FONT}margin:0;font-size:24px;line-height:1.25;color:${INKT}">Nieuwe maatwerkaanvraag</h1>
      <p style="${FONT}margin:8px 0 0;font-size:15px;line-height:1.5;color:${GRIJS}">${esc(m.naam)} wil graag een meubel op maat.</p>
      ${blok('Wensen', m.omschrijving)}
      ${blok('Afmetingen', m.maten)}
      ${fotoRegel(m.fotos, false)}
      ${label('Klantgegevens')}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${LIJN}">
        ${contact.map(([a, b]) => `<tr><td style="${FONT}font-size:14px;color:${GRIJS};padding:9px 12px 9px 0;border-bottom:1px solid ${LIJN};width:110px">${a}</td><td style="${FONT}font-size:15px;color:${INKT};padding:9px 0;border-bottom:1px solid ${LIJN}">${b}</td></tr>`).join('')}
      </table>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:20px"><tr>
        <td style="background:${INKT};border-radius:4px"><a href="mailto:${esc(m.email)}?subject=${encodeURIComponent('Je maatwerkaanvraag bij Teakhuis')}" style="${FONT}display:inline-block;padding:11px 18px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none">Beantwoorden</a></td>
        ${m.telefoon ? `<td width="10"></td><td style="border:1px solid ${INKT};border-radius:4px"><a href="tel:${esc(tel)}" style="${FONT}display:inline-block;padding:10px 18px;font-size:14px;font-weight:700;color:${INKT};text-decoration:none">Bellen</a></td>` : ''}
      </tr></table>`;
  return omhulsel(logo, 'Maatwerk via de website', inhoud, `Op "Beantwoorden" drukken in je mailprogramma stuurt je antwoord direct naar ${esc(m.email)}.`);
}

export function maatwerkBevestigingHtml(m: Maatwerk, logo: string, c: Contact) {
  const inhoud = `
      ${aanhef(m.naam)}
      ${p('Bedankt voor je maatwerkaanvraag. Ik heb hem goed ontvangen en kijk er zelf naar.')}
      ${blok('Je wensen', m.omschrijving)}
      ${blok('Afmetingen', m.maten)}
      ${fotoRegel(m.fotos, true)}
      ${label('Hoe gaat het verder?')}
      ${p('Ik bekijk je idee en stel waar nodig nog wat vragen. Samen werken we het ontwerp uit tot alles klopt, daarna krijg je een voorstel met prijs. Ga je akkoord, dan maken onze vakmensen je meubel na 20% aanbetaling. Meestal is hij binnen 3 tot 5 maanden klaar.', 0)}
      ${p(`Heb je nog een foto of schets? Stuur hem via <a href="${esc(c.wa)}" style="color:${DIEP};font-weight:600">WhatsApp</a>, of bel me op <a href="${esc(c.telHref)}" style="color:${DIEP};font-weight:600;white-space:nowrap">${esc(c.tel)}</a>.`)}
      ${groet(c)}`;
  return omhulsel(logo, '', inhoud, `Je krijgt deze mail omdat je via teakhuis.nl maatwerk aanvroeg. Antwoorden kan gewoon, dan komt je mail bij mij terecht (${esc(c.mail)}).`);
}
