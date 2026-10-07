import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/config';
import { formatTagDisplay } from './format-tag';

/**
 * How a tag slug is rendered to a reader, in one language.
 *
 * Tags are stored as slugs (`social-media`) so routing and filtering agree on
 * one form, which means every render site has to turn them back into words.
 * That used to be done by title-casing the slug, which is wrong in two ways:
 * it cannot produce "CMS" from `cms`, and it cannot produce "Soziale Medien"
 * from `social-media` at all. The labels now come from the vocabulary in
 * src/data/tags/*.yaml, which Keystatic already maintains.
 */

type TagEntry = CollectionEntry<'tags'>;

function labelFor(data: TagEntry['data'], lang: Lang): string {
  // Adding a third language means adding a field here and in the two schemas.
  // Explicit beats clever: it is three lines, and it keeps the CMS able to
  // offer a labelled input for each language.
  if (lang === 'de') return data.de ?? data.name;
  return data.name;
}

/**
 * Build a synchronous tag → label lookup for one locale.
 *
 * Async so it can read the collection, but it returns a plain function: the
 * callers are `.map()` bodies inside templates, where an await is not
 * available. Call it once in a component's frontmatter and use the result in
 * the markup. `getCollection` is cached per build, so calling this from
 * several components costs one read.
 */
export async function getTagLabeller(lang: Lang): Promise<(tag: string) => string> {
  const vocabulary = await getCollection('tags');

  const labels = new Map<string, string>(
    vocabulary.map((entry) => [entry.id, labelFor(entry.data, lang)])
  );

  // A tag with no vocabulary entry still has to render — a hand-written post
  // can carry any slug, and multiRelationship validates "array of strings",
  // not "known slugs". Falling back to the old title-cased guess keeps those
  // readable instead of showing a raw slug.
  return (tag: string) => labels.get(tag) ?? formatTagDisplay(tag);
}
