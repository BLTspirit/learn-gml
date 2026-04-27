import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lessons' }),
  schema: z.object({
    chapter: z.number(),
    lesson: z.number(),
    title: z.string(),
    description: z.string(),
    draft: z.boolean().default(false),
  }),
});

const chapters = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/chapters' }),
  schema: z.object({
    chapter: z.number(),
    title: z.string(),
    description: z.string(),
  }),
});

export const collections = { lessons, chapters };