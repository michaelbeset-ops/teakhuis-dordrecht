// Offertelijst: wat een bezoeker op productpagina's samenstelt, bewaard in de eigen browser (localStorage) tot de
// aanvraag verstuurd is. Er gaat niets naar een server voordat de bezoeker zelf op versturen drukt.
export interface Regel {
  id: string;
  slug: string;
  titel: string;
  href: string;
  foto?: string;
  maat?: string;          // standaardmaat uit de lijst
  eigenMaat?: string;     // zelf ingevulde maat, bijvoorbeeld "B 210 x D 95 x H 77 cm"
  kleur?: string;
  extra?: string[];
  aantal: number;
  opmerking?: string;
  indicatie?: string;     // "v.a. € 899,-" op het moment van toevoegen
}

const SLEUTEL = 'teakhuis-offerte-v1';
const EVENT = 'offerte-wijziging';

export function lijst(): Regel[] {
  try {
    const r = JSON.parse(localStorage.getItem(SLEUTEL) || '[]');
    return Array.isArray(r) ? r : [];
  } catch {
    return [];
  }
}

function bewaar(r: Regel[]) {
  try { localStorage.setItem(SLEUTEL, JSON.stringify(r)); } catch { /* privémodus: lijst leeft alleen in dit tabblad */ }
  dispatchEvent(new CustomEvent(EVENT));
}

export const aantal = () => lijst().reduce((n, r) => n + (r.aantal || 1), 0);

export function voegToe(r: Omit<Regel, 'id'>) {
  const l = lijst();
  // Precies dezelfde keuze nog eens: aantal ophogen in plaats van een dubbele regel.
  const zelfde = l.find((x) => x.slug === r.slug && x.maat === r.maat && x.eigenMaat === r.eigenMaat && x.kleur === r.kleur && (x.extra ?? []).join() === (r.extra ?? []).join() && (x.opmerking ?? '') === (r.opmerking ?? ''));
  if (zelfde) zelfde.aantal = Math.min(99, zelfde.aantal + r.aantal);
  else l.push({ ...r, id: Math.random().toString(36).slice(2, 10) });
  bewaar(l);
}

export const wijzig = (id: string, deel: Partial<Regel>) => bewaar(lijst().map((x) => (x.id === id ? { ...x, ...deel } : x)));
export const verwijder = (id: string) => bewaar(lijst().filter((x) => x.id !== id));
export const leeg = () => bewaar([]);

export function opWijziging(cb: () => void) {
  addEventListener(EVENT, cb);
  addEventListener('storage', (e) => { if (e.key === SLEUTEL) cb(); });
}

// Een regel als leesbare tekst, voor WhatsApp, mail en het formulier.
export function regelTekst(r: Regel, i?: number) {
  const delen = [
    `${i !== undefined ? `${i + 1}. ` : ''}${r.aantal > 1 ? `${r.aantal}x ` : ''}${r.titel}`,
    r.eigenMaat ? `   Maat: ${r.eigenMaat} (eigen maat)` : r.maat ? `   Maat: ${r.maat}` : '',
    r.kleur ? `   Kleur: ${r.kleur}` : '',
    r.extra?.length ? `   Extra: ${r.extra.join(', ')}` : '',
    r.opmerking ? `   Opmerking: ${r.opmerking}` : '',
    `   ${location.origin}${r.href}`,
  ];
  return delen.filter(Boolean).join('\n');
}
