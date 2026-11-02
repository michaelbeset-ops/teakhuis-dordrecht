// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// SITE_URL en BASE_PATH komen uit de deploy-workflow: zolang het domein nog niet gekoppeld is draait de site als
// preview op https://michaelbeset-ops.github.io/teakhuis-dordrecht/, daarna op het eigen domein zonder submap.
const site = process.env.SITE_URL || 'https://teakhuis.nl';
const base = process.env.BASE_PATH || '/';

// In de sitemap komt elke pagina die geïndexeerd mag worden. Pagina's met noindex (beheer, offertelijst, privacy, 404 en
// alle doorverwijzingen uit src/pages/[...oud].astro) laat het filter weg door het gebouwde bestand te lezen, zodat
// noindex en sitemap nooit uit elkaar lopen.
const dist = fileURLToPath(new URL('./dist/', import.meta.url));
const indexeerbaar = (page) => {
  const pad = decodeURIComponent(new URL(page).pathname).slice(base.replace(/\/$/, '').length).replace(/^\/|\/$/g, '');
  try {
    return !/<meta name="robots" content="noindex/.test(readFileSync(`${dist}${pad || 'index'}.html`, 'utf8'));
  } catch {
    return false;
  }
};

export default defineConfig({
  site,
  base,
  // Zelfde adressen als de oude teakhuis.nl: zonder slash aan het eind. format 'file' maakt per pagina een .html-bestand;
  // GitHub Pages serveert /pad dan direct (200), zonder doorverwijzing naar /pad/.
  trailingSlash: 'never',
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'always', format: 'file' },
  integrations: [sitemap({ filter: indexeerbaar })],
  vite: { plugins: [tailwindcss()] },
});
