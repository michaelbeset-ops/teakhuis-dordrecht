// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// SITE_URL en BASE_PATH komen uit de deploy-workflow: zolang het domein nog niet gekoppeld is draait de site als
// preview op https://michaelbeset-ops.github.io/teakhuis-dordrecht/, daarna op het eigen domein zonder submap.
const site = process.env.SITE_URL || 'https://teakhuis.nl';
const base = process.env.BASE_PATH || '/';

// Niet in de sitemap: beheer, de offertelijst (persoonlijk) en de doorverwijzingen (zie src/pages/[...oud].astro).
// De webshop staat er wel in: die heeft dezelfde adressen als op de oude site.
const uitSitemap = ['/admin', '/offerte', '/404', '/referenties', '/leverbare-kleuren-teak', '/collectie/', '/product/', '/maatwerk/kledingkast', '/maatwerk/tv-meubel', '/maatwerk/voorbeelden', '/maatwerk/het-proces', '/webshop/etxFAX7uScLCTSM6mcUYWX/186/', '/webshop/etxFAX7uScLCTSM6mcUYWX/231/', '/webshop/etxFAX7uScLCTSM6mcUYWX/244/'];

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'always' },
  integrations: [sitemap({
    filter: (page) => {
      const pad = new URL(page).pathname.slice(base.replace(/\/$/, '').length);
      return !uitSitemap.some((u) => pad.startsWith(u));
    },
  })],
  vite: { plugins: [tailwindcss()] },
});
