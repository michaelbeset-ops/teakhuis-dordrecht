// robots.txt met het juiste sitemapadres, ook als de site (nog) in een submap draait.
import type { APIRoute } from 'astro';
import { absoluut, site } from '../data/site';

export const GET: APIRoute = () => {
  const regels = site.voorstel
    ? ['User-agent: *', 'Disallow: /']
    : ['User-agent: *', 'Allow: /', `Disallow: ${import.meta.env.BASE_URL.replace(/\/$/, '')}/admin/`, '', `Sitemap: ${absoluut('sitemap-index.xml')}`];
  return new Response(regels.join('\n') + '\n', { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
