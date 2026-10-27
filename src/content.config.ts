// Producten en categorieen staan als losse JSON-bestanden in src/content/, zodat het beheersysteem (/admin) ze een voor
// een kan aanmaken, wijzigen en verwijderen. Het schema vangt fouten af voordat er iets live gaat: een kapotte invoer
// laat de build falen in plaats van een halve pagina te publiceren.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Het beheersysteem schrijft een leeg getalveld soms als "" of laat het weg.
const getal = z.preprocess((v) => (v === '' || v === undefined ? null : v), z.coerce.number().nonnegative().nullable());
// Lege velden kunnen als "" of null binnenkomen; behandel ze als niet ingevuld.
const leeg = (v: unknown) => (v === '' || v === null ? undefined : v);
const tekst = (std = '') => z.preprocess(leeg, z.string().default(std));
const vlag = (std: boolean) => z.preprocess(leeg, z.boolean().default(std));

const producten = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/producten' }),
  schema: ({ image }) => z.object({
    titel: z.string().min(1),
    categorie: z.string().min(1),
    prijsVanaf: getal.default(null),
    prijsTonen: vlag(true),
    omschrijving: tekst(),
    fotos: z.preprocess((v) => (Array.isArray(v) ? v.filter(Boolean) : []), z.array(image())),
    maten: z.preprocess((v) => v ?? [], z.array(z.object({ label: z.string().min(1), prijs: getal.default(null) }))),
    houtkleuren: vlag(false),
    uitvoeringen: z.preprocess((v) => (Array.isArray(v) ? v.filter(Boolean) : []), z.array(z.string())),
    maatwerk: vlag(true),
    uitgelicht: vlag(false),
    zichtbaar: vlag(true),
    volgorde: z.preprocess(leeg, z.coerce.number().default(999)),
    seoTitel: z.preprocess(leeg, z.string().optional()),
    seoOmschrijving: z.preprocess(leeg, z.string().optional()),
    oudeUrl: z.preprocess(leeg, z.string().optional()),
    // Serie waar het product bij hoort (Venice, Semarang, ...), leeg = geen.
    collectie: tekst(),
  }),
});

const categorieen = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/categorieen' }),
  schema: ({ image }) => z.object({
    naam: z.string().min(1),
    hoofd: tekst(),
    volgorde: z.preprocess(leeg, z.coerce.number().default(999)),
    intro: tekst(),
    foto: z.preprocess(leeg, image().optional()),
    oudeId: z.preprocess(leeg, z.string().optional()),
  }),
});

// Collecties: series die over categorieen heen lopen, zoals Venice of Semarang (dressoir, tv-meubel en tafel in één stijl).
const collecties = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/collecties' }),
  schema: ({ image }) => z.object({
    naam: z.string().min(1),
    intro: tekst(),
    volgorde: z.preprocess(leeg, z.coerce.number().default(999)),
    foto: z.preprocess(leeg, image().optional()),
  }),
});

export const collections = { producten, categorieen, collecties };
