// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://stefanoandrello.me',
  output: 'server',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        !page.includes('/private/') &&
        !page.includes('/draft/') &&
        !page.includes('/open-graph/') &&
        !page.includes('/privacy') &&
        !page.includes('/cookie'),
      serialize(item) {
        const url = new URL(item.url);
        const p = url.pathname;
        if (p === '/' || p === '') {
          item.priority = 1.0;
          item.changefreq = 'monthly';
        } else if (p.startsWith('/blog')) {
          item.priority = 0.7;
          item.changefreq = 'weekly';
        } else if (p === '/glitch/' || p === '/glitch') {
          item.priority = 0.6;
          item.changefreq = 'monthly';
        } else {
          // chi-sono, libri, contatti, agentica (future), ecc.
          item.priority = 0.8;
          item.changefreq = 'monthly';
        }
        return item;
      },
    }),
  ],

  adapter: vercel(),
});
