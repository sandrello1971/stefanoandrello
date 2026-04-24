import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Stefano Andrello'),
    tags: z.array(z.string()).default([]),
    category: z.enum([
      'EU AI Act',
      'AI Agentica',
      'MCP',
      'Formazione',
      'Casi studio',
    ]),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
    readingTime: z.number().optional(),
  }),
});

const corsi = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/corsi' }),
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    latinName: z.string(),
    tagline: z.string(),
    hours: z.number(),
    type: z.string(),
    certification: z.string().optional(),
    forWho: z.string(),
    fullDescription: z.string(),
    question: z.string(),
    modules: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        hours: z.number(),
      })
    ),
    order: z.number(),
  }),
});

export const collections = { blog, corsi };
