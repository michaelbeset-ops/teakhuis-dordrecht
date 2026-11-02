// Oude webshop-id's naar de pagina, voor de 404-pagina: een oud productadres met een andere schrijfwijze dan in de
// import (bijv. een oudere categorienaam) komt zo toch bij het juiste product. id = het nummer uit het oude adres.
import type { APIRoute } from 'astro';
import { producten, categorieen, productHref, categorieHref, productPad } from '../../data/catalogus';

export const GET: APIRoute = () => {
  const p: Record<string, string> = {};
  for (const x of producten) { const id = productPad(x).split('/')[3]; if (/^\d+$/.test(id)) p[id] = productHref(x); }
  const c: Record<string, string> = {};
  for (const x of categorieen) if (x.oudeId) c[x.oudeId] = categorieHref(x);
  return new Response(JSON.stringify({ p, c }), { headers: { 'content-type': 'application/json' } });
};
