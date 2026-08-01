import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { slugify } from './lib/slugify';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  // Function form so `image()` is in scope: cover images are local assets under
  // src/assets/covers, which lets Astro resize and re-encode them. They used to
  // be hotlinked Unsplash URLs — unoptimisable, uncached, and a reader-IP leak
  // to a third party on every page view.
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Anonymous'),
    draft: z.boolean().default(false),
    // Normalised at parse time so route generation, filtering and links all
    // agree. Previously tag matching was case-insensitive while route
    // generation was case-sensitive, so "Technology" and "technology" would
    // build two routes listing identical posts — duplicate content that also
    // collides on case-insensitive filesystems. Display casing is restored by
    // formatTagDisplay at render time.
    tags: z.array(z.string()).default([]).transform((tags) => tags.map(slugify)),
    series: z.string().optional(),
    category: z.string().optional(),
    coverImage: z.object({
      src: image(),
      alt: z.string(),
      caption: z.string().optional(),
      position: z.string().optional(),
    }).optional(),
  }),
});

const notesCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: z.string().optional(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    // Normalised at parse time so route generation, filtering and links all
    // agree. Previously tag matching was case-insensitive while route
    // generation was case-sensitive, so "Technology" and "technology" would
    // build two routes listing identical posts — duplicate content that also
    // collides on case-insensitive filesystems. Display casing is restored by
    // formatTagDisplay at render time.
    tags: z.array(z.string()).default([]).transform((tags) => tags.map(slugify)),
    color: z.enum(['yellow', 'pink', 'blue', 'green', 'purple', 'orange']).default('yellow'),
  }),
});

export const collections = {
  blog: blogCollection,
  notes: notesCollection,
};
