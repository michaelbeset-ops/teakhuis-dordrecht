// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// SITE_URL en BASE_PATH komen uit de deploy-workflow: zolang het domein nog niet gekoppeld is draait de site als
// preview op https://michaelbeset-ops.github.io/teakhuis-dordrecht/, daarna op het eigen domein zonder submap.
const site = process.env.SITE_URL || 'https://teakhuis.nl';
const base = process.env.BASE_PATH || '/';

// Niet in de sitemap: beheer, de offertelijst (persoonlijk) en de doorverwijzingen van de oude webshop.
const uitSitemap = ['/admin', '/offerte', '/webshop', '/maatwerk/', '/404', '/referenties', '/leverbare-kleuren-teak'];

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'always' },
  integrations: [sitemap({
    filter: (page) => {
      const pad = new URL(page).pathname.slice(base.replace(/\/$/, '').length);
      return pad === '/maatwerk/' || !uitSitemap.some((u) => pad.startsWith(u));
    },
  })],
  vite: { plugins: [tailwindcss()] },
});
