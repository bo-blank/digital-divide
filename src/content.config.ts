import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { slugify } from './lib/slugify';

/**
 * Keystatic clears an optional field by writing an explicit `null` (dates,
 * images) or an empty string (text) rather than dropping the key, and neither
 * survives a plain `.optional()`: `z.coerce.date()` in particular would
 * silently coerce `null` into 1970-01-01 and stamp every CMS-authored post
 * with a bogus "updated" date. Folding blanks back to `undefined` before
 * validation keeps CMS-authored and hand-written frontmatter interchangeable.
 */
const blankToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((value) => (value === null || value === '' ? undefined : value), schema);

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
    updatedDate: blankToUndefined(z.coerce.date().optional()),
    author: blankToUndefined(z.string().default('Anonymous')),
    draft: z.boolean().default(false),
    // Normalised at parse time so route generation, filtering and links all
    // agree. Previously tag matching was case-insensitive while route
    // generation was case-sensitive, so "Technology" and "technology" would
    // build two routes listing identical posts — duplicate content that also
    // collides on case-insensitive filesystems. Display casing is restored by
    // formatTagDisplay at render time.
    tags: z.array(z.string()).default([]).transform((tags) => tags.map(slugify)),
    series: blankToUndefined(z.string().optional()),
    // The slug of the English essay this one translates, set on translated
    // entries only. Locale itself comes from the directory (see entryLang in
    // lib/content-utils.ts); this is the separate question of *which* English
    // essay a German one corresponds to, which drives the language switcher and
    // the hreflang alternates. An untranslated essay simply omits it, and the
    // switcher falls back to the essays index in the other language.
    translationOf: blankToUndefined(z.string().optional()),
    // Keystatic always writes the whole object, using `src: null` to mean "no
    // cover". Every consumer treats a cover as all-or-nothing (`coverImage ?
    // ... : ...`), so an object without an image is folded away entirely
    // rather than reaching the templates as a half-populated record.
    coverImage: z.preprocess(
      (value) =>
        value && typeof value === 'object' && !(value as { src?: unknown }).src
          ? undefined
          : value,
      z.object({
        src: image(),
        alt: z.string(),
        caption: blankToUndefined(z.string().optional()),
        position: blankToUndefined(z.string().optional()),
      }).optional()
    ),
  }),
});

const notesCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: blankToUndefined(z.string().optional()),
    publishDate: z.coerce.date(),
    updatedDate: blankToUndefined(z.coerce.date().optional()),
    draft: z.boolean().default(false),
    // Normalised at parse time so route generation, filtering and links all
    // agree. Previously tag matching was case-insensitive while route
    // generation was case-sensitive, so "Technology" and "technology" would
    // build two routes listing identical posts — duplicate content that also
    // collides on case-insensitive filesystems. Display casing is restored by
    // formatTagDisplay at render time.
    tags: z.array(z.string()).default([]).transform((tags) => tags.map(slugify)),
    // See the note on the blog collection's field of the same name.
    translationOf: blankToUndefined(z.string().optional()),
    color: z.enum(['yellow', 'pink', 'blue', 'green', 'purple', 'orange']).default('yellow'),
  }),
});

/**
 * Prose for the standalone pages that aren't generated from a collection —
 * currently /about and /privacy. Each entry is written by a Keystatic
 * singleton, not a collection, because the routes are hand-written .astro
 * files: a CMS-created entry with no matching route would be content that
 * builds into nothing. The .astro file owns the layout and chrome, this owns
 * the words.
 */
const pagesCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    // Rendered as the page's h1 as well as the <title>.
    title: z.string(),
    description: z.string(),
    // Sits under the heading; only /about's banner uses one.
    tagline: blankToUndefined(z.string().optional()),
    // The opening paragraph, pulled out of the body so the template can give
    // it its own larger treatment.
    lead: blankToUndefined(z.string().optional()),
    // Drives the "Last updated" line on /privacy.
    updatedDate: blankToUndefined(z.coerce.date().optional()),
  }),
});

/**
 * The tag vocabulary, written by Keystatic to src/data/tags/*.yaml.
 *
 * Until now nothing read these files — they existed only to populate the CMS
 * dropdown, and every render site guessed a display label by title-casing the
 * slug. That guess cannot produce "Soziale Medien" from `social-media`, and it
 * could not produce "CMS" from `cms` either, so the vocabulary is now the
 * single source of display labels for both languages (see lib/tag-labels.ts).
 *
 * Tag *slugs* stay shared across locales: a German essay carries the same
 * `social-media` slug, so /tags/social-media and /de/tags/social-media are the
 * same topic and pair up for hreflang without a mapping. Only the label is
 * per-language.
 */
const tagsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{yaml,yml}', base: './src/data/tags' }),
  schema: z.object({
    // English, and the fallback for any locale with no label of its own.
    name: z.string(),
    // One field per non-default locale. Deliberately explicit rather than a
    // free-form map: Keystatic needs a real field to render an input for, and
    // the Zod schema is what keeps the two in lockstep.
    de: blankToUndefined(z.string().optional()),
  }),
});

export const collections = {
  blog: blogCollection,
  notes: notesCollection,
  pages: pagesCollection,
  tags: tagsCollection,
};
