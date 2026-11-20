// Kleine foto's voor de sleeppagina in het beheer (public/admin/volgorde.html): { slug: url } voor producten,
// { 'cat:slug': url } voor menu's en { 'col:slug': url } voor collecties. Zonder eigen foto: de eerste productfoto.
// Ook verborgen producten, want die staan in die lijst ook. Een nieuw item krijgt zijn foto na de volgende build.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getImage } from 'astro:assets';

const klein = async (f: ImageMetadata) => (await getImage({ src: f, width: 104, quality: 60, format: 'webp' })).src;

export const GET: APIRoute = async () => {
  const uit: Record<string, string> = {};
  const producten = await getCollection('producten');
  const cats = await getCollection('categorieen');
  const eerste = (filter: (p: (typeof producten)[number]) => boolean) => producten.find((p) => filter(p) && p.data.fotos[0])?.data.fotos[0];
  for (const p of producten) if (p.data.fotos[0]) uit[p.id] = await klein(p.data.fotos[0]);
  for (const c of cats) {
    const subs = new Set([c.id, ...cats.filter((x) => x.data.hoofd === c.id).map((x) => x.id)]);
    const f = c.data.foto ?? eerste((p) => subs.has(p.data.categorie));
    if (f) uit['cat:' + c.id] = await klein(f);
  }
  for (const c of await getCollection('collecties')) {
    const f = c.data.foto ?? eerste((p) => p.data.collectie === c.id);
    if (f) uit['col:' + c.id] = await klein(f);
  }
  return new Response(JSON.stringify(uit), { headers: { 'content-type': 'application/json' } });
};
