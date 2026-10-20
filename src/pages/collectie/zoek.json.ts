// Kleine zoekindex voor /collectie/: naam, link, thumbnail, prijs en categorie per product.
import type { APIRoute } from 'astro';
import { getImage } from 'astro:assets';
import { producten, productHref, eersteFoto, breedte, euro, vanaf, categorie } from '../../data/catalogus';

export const GET: APIRoute = async () => {
  const rij = await Promise.all(producten.map(async (p) => {
    const f = eersteFoto(p);
    const t = f ? await getImage({ src: f, width: Math.min(160, breedte(f)), quality: 60, format: 'webp' }) : null;
    return { n: p.titel, u: productHref(p), f: t?.src ?? '', p: euro(vanaf(p)), c: categorie(p.categorieId).naam };
  }));
  return new Response(JSON.stringify(rij), { headers: { 'content-type': 'application/json' } });
};
