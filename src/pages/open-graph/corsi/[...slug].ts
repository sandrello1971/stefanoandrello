export const prerender = true;

import { OGImageRoute } from 'astro-og-canvas';
import { getCollection } from 'astro:content';

const corsi = await getCollection('corsi');

const pages = Object.fromEntries(corsi.map((c) => [c.data.slug, c.data]));

const route = await OGImageRoute({
  param: 'slug',
  pages,
  getImageOptions: (_path, page: (typeof pages)[string]) => ({
    title: `${page.name} · ${page.latinName}`,
    description: 'Stefano Andrello — Formazione AI per PMI italiane',
    bgGradient: [
      [11, 31, 58],
      [11, 31, 58],
    ],
    border: {
      color: [200, 146, 61],
      width: 12,
      side: 'inline-start',
    },
    padding: 80,
    font: {
      title: {
        color: [245, 240, 230],
        weight: 'Bold',
        size: 72,
        lineHeight: 1.15,
      },
      description: {
        color: [200, 146, 61],
        size: 28,
        lineHeight: 1.4,
      },
    },
    format: 'PNG',
  }),
});

export const getStaticPaths = route.getStaticPaths;
export const GET = route.GET;
