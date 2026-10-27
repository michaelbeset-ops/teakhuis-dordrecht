// Twee HTML-mails bij een offerteaanvraag: mailHtml voor Teakhuis (per meubel foto, keuzes, knop en link, plus de
// klantgegevens) en bevestigingHtml voor de klant (wat hij aanvroeg en hoe het verder gaat). Alles met inline stijlen en
// tabellen, want mailprogramma's (Outlook, Gmail) negeren stylesheets. Invoer van de bezoeker wordt altijd ge-escaped.
import type { Regel } from './offerte';

export interface Klant { naam: string; email: string; telefoon: string; plaats: string; bericht: string }
export interface Contact { tel: string; telHref: string; wa: string; mail: string }

const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const absoluut = (pad: string) => new URL(pad, location.href).href;

const INKT = '#17201b', GRIJS = '#55605a', GROEN = '#6aab35', DIEP = '#36641a', ZAND = '#f1eee7', LIJN = '#e3ddd1';
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
    ? `<a href="${esc(link)}"><img src="${esc(absoluut(r.foto))}" width="96" height="96" alt="${esc(r.titel)}" style="display:block;width:96px;height:96px;object-fit:contain;background:#ffffff;border-radius:6px;border:1px solid ${LIJN}"></a>`
    : `<div style="width:96px;height:96px;background:${ZAND};border-radius:6px"></div>`;
  return `
  <tr><td style="padding:20px 0;border-top:${i ? `1px solid ${LIJN}` : '0'}">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
      <td width="96" style="vertical-align:top;padding-right:18px">${foto}</td>
      <td style="vertical-align:top">
        <p style="${FONT}margin:0 0 8px;font-size:17px;line-height:1.3;font-weight:700;color:${INKT}">${r.aantal > 1 ? `<span style="color:${DIEP}">${r.aantal}&times;</span> ` : ''}${esc(r.titel)}</p>
        <table role="presentation" cellpadding="0" cellspacing="0">${rijen}</table>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:14px"><tr><td style="background:${GROEN};border-radius:6px">
          <a href="${esc(link)}" style="${FONT}display:inline-block;padding:10px 18px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none">Bekijk op de site &rarr;</a>
        </td></tr></table>
        <p style="${FONT}margin:8px 0 0;font-size:12px;line-height:1.4;word-break:break-all"><a href="${esc(link)}" style="color:${GRIJS}">${esc(link)}</a></p>
      </td>
    </tr></table>
  </td></tr>`;
}

const label = (t: string, boven = 26) => `<p style="${FONT}margin:${boven}px 0 8px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${GRIJS}">${t}</p>`;
const meubels = (regels: Regel[], kop: string) => (regels.length ? `${label(kop)}<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${regels.map(regelHtml).join('')}</table>` : '');
const bericht = (k: Klant, kop: string) => (k.bericht ? `${label(kop, 22)}<div style="${FONT}background:${ZAND};border-radius:8px;padding:14px 16px;font-size:15px;line-height:1.55;color:${INKT};white-space:pre-wrap">${esc(k.bericht)}</div>` : '');

// De vaste omlijsting: logo en ondertitel boven een witte kaart, met een regel uitleg eronder.
function omhulsel(logo: string, sub: string, inhoud: string, voet: string) {
  return `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${ZAND}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${ZAND}"><tr><td align="center" style="padding:24px 12px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">
    <tr><td style="padding:0 4px 16px">
      <table role="presentation" cellpadding="0" cellspacing="0"><tr>
        ${logo ? `<td style="padding-right:12px"><img src="${esc(logo)}" width="44" height="44" alt="Teakhuis" style="display:block;width:44px;height:44px;border-radius:3px"></td>` : ''}
        <td style="${FONT}"><span style="display:block;font-size:17px;font-weight:800;color:${INKT}">Teakhuis</span><span style="display:block;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${DIEP}">${sub}</span></td>
      </tr></table>
    </td></tr>
    <tr><td style="background:#ffffff;border-radius:10px;padding:28px 24px">${inhoud}</td></tr>
    <tr><td style="padding:14px 4px 0;${FONT}font-size:12px;line-height:1.5;color:${GRIJS}">${voet}</td></tr>
  </table>
</td></tr></table>
</body></html>`;
}

// Bevestiging voor de klant: bedankt, wat je aanvroeg, hoe het verder gaat en hoe je Han bereikt.
export function bevestigingHtml(regels: Regel[], k: Klant, logo: string, c: Contact) {
  const voornaam = k.naam.trim().split(/\s+/)[0] || '';
  const stappen = [
    ['Han neemt contact op', 'Hij bekijkt je aanvraag en belt of mailt je om je wensen, maten en kleur door te nemen.'],
    ['Schets en prijsopgave', 'Je krijgt een tekening met je maten en een prijs. Vrijblijvend, je zit nergens aan vast.'],
    ['Akkoord? Dan wordt hij gemaakt', 'Je betaalt 20% aan en je meubel wordt met de hand gemaakt en bij je thuis afgeleverd.'],
  ].map(([kop, tekst], i) => `<tr>
      <td width="40" style="vertical-align:top;padding:8px 0"><span style="${FONT}display:inline-block;width:28px;height:28px;border-radius:50%;background:${GROEN};color:${INKT};font-size:14px;font-weight:800;line-height:28px;text-align:center">${i + 1}</span></td>
      <td style="${FONT}vertical-align:top;padding:8px 0"><span style="display:block;font-size:15px;font-weight:700;color:${INKT}">${kop}</span><span style="display:block;margin-top:2px;font-size:14px;line-height:1.5;color:${GRIJS}">${tekst}</span></td>
    </tr>`).join('');
  const inhoud = `
      <h1 style="${FONT}margin:0;font-size:24px;line-height:1.25;color:${INKT}">Bedankt voor je aanvraag${voornaam ? `, ${esc(voornaam)}` : ''}!</h1>
      <p style="${FONT}margin:10px 0 0;font-size:15px;line-height:1.6;color:${GRIJS}">We hebben je aanvraag goed ontvangen. Han bekijkt hem persoonlijk en neemt contact met je op. Hieronder zie je wat je hebt aangevraagd.</p>
      ${meubels(regels, 'Je aanvraag')}
      ${bericht(k, 'Je vragen of wensen')}
      ${label('Zo gaat het verder')}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${stappen}</table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:22px;background:${ZAND};border-radius:8px"><tr><td style="padding:18px 18px 16px">
        <p style="${FONT}margin:0;font-size:15px;line-height:1.5;color:${INKT}"><strong>Vraag of iets vergeten?</strong> Bel of app Han, de eigenaar: <a href="${esc(c.telHref)}" style="color:${DIEP};font-weight:700;white-space:nowrap">${esc(c.tel)}</a></p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:14px"><tr>
          <td style="background:${GROEN};border-radius:6px"><a href="${esc(c.wa)}" style="${FONT}display:inline-block;padding:10px 18px;font-size:14px;font-weight:700;color:${INKT};text-decoration:none">WhatsApp Han</a></td>
          <td width="10"></td>
          <td style="border:1px solid ${INKT};border-radius:6px"><a href="${esc(c.telHref)}" style="${FONT}display:inline-block;padding:9px 18px;font-size:14px;font-weight:700;color:${INKT};text-decoration:none">Bellen</a></td>
        </tr></table>
      </td></tr></table>`;
  return omhulsel(logo, 'Je offerteaanvraag', inhoud, `Je ontvangt deze mail omdat je via de website van Teakhuis een offerte aanvroeg. Een antwoord op deze mail komt bij Teakhuis terecht (${esc(c.mail)}).`);
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
    `<td style="background:${INKT};border-radius:6px"><a href="mailto:${esc(k.email)}?subject=${encodeURIComponent('Je offerteaanvraag bij Teakhuis')}" style="${FONT}display:inline-block;padding:11px 18px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none">Beantwoorden</a></td>`,
    k.telefoon ? `<td width="10"></td><td style="border:1px solid ${INKT};border-radius:6px"><a href="tel:${esc(tel)}" style="${FONT}display:inline-block;padding:10px 18px;font-size:14px;font-weight:700;color:${INKT};text-decoration:none">Bellen</a></td>` : '',
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
