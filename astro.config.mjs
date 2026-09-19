// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Change `site` to the production domain before deploying (used for canonical
// URLs, Open Graph, hreflang and the sitemap).
export default defineConfig({
  site: 'https://example.com',
  trailingSlash: 'always',
  i18n: {
    locales: ['km', 'en', 'zh'],
    defaultLocale: 'km',
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  integrations: [
    sitemap({ i18n: { defaultLocale: 'km', locales: { en: 'en', zh: 'zh-CN', km: 'km' } } }),
  ],
  vite: { plugins: [tailwindcss()] },
});
