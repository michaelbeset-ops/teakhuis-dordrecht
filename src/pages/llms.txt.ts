// /llms.txt: korte Markdown-samenvatting van Teakhuis voor AI-agents en -tools (helpt noch schaadt in Google).
// Inhoud komt uit seo.config.json (sitefront-seo); lege velden worden weggelaten. Uitzetten: dit bestand verwijderen.
import type { APIRoute } from 'astro';
import seo from '../../seo.config.json';
import { absoluut, site } from '../data/site';

type Item = { name: string; path: string; summary?: string };

export const GET: APIRoute = () => {
  const text = (s: string) => new Response(s, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  if (site.voorstel) return text('# Ontwerpvoorstel\n\nDit is geen officiële website.\n');
  const b = seo.business;
  const lines = [`# ${b.name}`, '', `> ${b.description}`, ''];
  const feiten: [string, string][] = [
    ['Website', absoluut('')],
    ['Telefoon en WhatsApp', b.phoneDisplay],
    ['E-mail', b.email],
    ['Levert in', b.areaServed.join(', ')],
    ['Sinds', b.foundingYear],
    ['KvK', b.kvk],
    ['Bezoekadres', 'geen, Teakhuis heeft geen showroom meer en levert uitsluitend op bestelling'],
  ];
  feiten.filter(([, v]) => v).forEach(([k, v]) => lines.push(`- ${k}: ${v}`));
  lines.push('');
  const lijst = (kop: string, items: Item[]) => {
    if (!items.length) return;
    lines.push(`## ${kop}`, '');
    items.forEach((s) => lines.push(`- [${s.name}](${absoluut(s.path)})${s.summary ? `: ${s.summary}` : ''}`));
    lines.push('');
  };
  lijst('Producten en diensten', seo.services);
  lijst("Belangrijke pagina's", seo.llmsPages);
  if (b.sameAs.length) lines.push('## Profielen', '', ...b.sameAs.map((u) => `- ${u}`), '');
  return text(lines.join('\n'));
};
