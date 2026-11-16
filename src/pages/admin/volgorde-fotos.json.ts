// Kleine foto per product voor de sleeppagina in het beheer (public/admin/volgorde.html): { slug: url }.
// Ook verborgen producten, want die staan in die lijst ook. Een nieuw product krijgt zijn foto na de volgende build.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getImage } from 'astro:assets';

export const GET: APIRoute = async () => {
  const uit: Record<string, string> = {};
  for (const p of await getCollection('producten')) {
    const f = p.data.fotos[0];
    if (f) uit[p.id] = (await getImage({ src: f, width: 104, quality: 60, format: 'webp' })).src;
  }
  return new Response(JSON.stringify(uit), { headers: { 'content-type': 'application/json' } });
};
