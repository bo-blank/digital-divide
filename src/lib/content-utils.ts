import { getCollection, type CollectionEntry } from 'astro:content';
import { defaultLocale, isLang, type Lang } from '../i18n/config';
import { slugify } from './slugify';

type BlogPost = CollectionEntry<'blog'>;
type Note = CollectionEntry<'notes'>;

/**
 * Locale is carried by the content file's directory, not by a frontmatter
 * field: German entries live in `src/content/<collection>/de/`, English ones
 * stay flat at the collection root where they have always been.
 *
 * The glob loaders already use `**` patterns, so the subdirectory needed no
 * new collection — which is what keeps `CollectionEntry<'blog'>` a single type
 * and leaves every component prop signature alone. The cost is that an entry's
 * `id` now carries the prefix (`de/der-hinweis`), and the two helpers below are
 * the only sanctioned way to read it.
 */
export function entryLang(id: string): Lang {
  const [first] = id.split('/');
  return first && isLang(first) ? first : defaultLocale;
}

/**
 * The entry's URL segment, with any locale directory stripped.
 *
 * **This, never `entry.id`, is what belongs in an href or a getStaticPaths
 * param.** Using the raw id builds `/de/essays/de/der-hinweis`, which still
 * renders — it just 404s from every link on the site.
 */
export function entrySlug(id: string): string {
  const lang = entryLang(id);
  return lang === defaultLocale ? id : id.slice(lang.length + 1);
}

/**
 * The inverse of entrySlug: the collection id a given slug has in a given
 * locale. Used by the standalone pages, which look their entry up by name
 * (`about`, `privacy`) rather than receiving it from a route param.
 */
export function localeEntryId(lang: Lang, slug: string): string {
  return lang === defaultLocale ? slug : `${lang}/${slug}`;
}

/**
 * Get all published blog posts for one locale, sorted by publish date
 * (newest first). Filters out drafts in production and future-dated posts.
 */
export async function getPublishedPosts(lang: Lang): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data, id }) => {
    const isPublished = !data.draft || import.meta.env.DEV;
    const isNotFuture = data.publishDate <= new Date();
    return entryLang(id) === lang && isPublished && isNotFuture;
  });

  return posts.sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
  );
}

/**
 * Get all published notes for one locale, sorted by publish date (newest
 * first). Filters out drafts in production and future-dated posts.
 */
export async function getPublishedNotes(lang: Lang): Promise<Note[]> {
  const notes = await getCollection('notes', ({ data, id }) => {
    const isPublished = !data.draft || import.meta.env.DEV;
    const isNotFuture = data.publishDate <= new Date();
    return entryLang(id) === lang && isPublished && isNotFuture;
  });

  return notes.sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
  );
}

/**
 * Get posts filtered by tag.
 */
export async function getPostsByTag(lang: Lang, tag: string): Promise<BlogPost[]> {
  const posts = await getPublishedPosts(lang);
  return posts.filter((post) =>
    post.data.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

/**
 * Get posts filtered by series slug.
 *
 * Matches on the slug rather than the raw frontmatter string: series names
 * are free text ("Future of Work"), and using them directly as route params
 * produced URLs containing literal spaces.
 */
export async function getPostsBySeries(
  lang: Lang,
  seriesSlug: string
): Promise<BlogPost[]> {
  const posts = await getPublishedPosts(lang);
  return posts.filter(
    (post) => post.data.series && slugify(post.data.series) === seriesSlug
  );
}

/**
 * Get all unique tags from published posts in one locale.
 */
export async function getAllTags(lang: Lang): Promise<string[]> {
  const posts = await getPublishedPosts(lang);
  const tagSet = new Set<string>();

  posts.forEach((post) => {
    post.data.tags.forEach((tag) => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
}

/**
 * Get all unique series from published posts in one locale.
 */
export async function getAllSeries(lang: Lang): Promise<string[]> {
  const posts = await getPublishedPosts(lang);
  const seriesSet = new Set<string>();

  posts.forEach((post) => {
    if (post.data.series) {
      seriesSet.add(post.data.series);
    }
  });

  return Array.from(seriesSet).sort();
}

/**
 * The counterpart of `entry` in the other locale, or null if it has no
 * translation yet.
 *
 * The link is declared once, on the translated entry, via `translationOf` in
 * its frontmatter — so this looks in whichever direction the entry sits:
 * a German entry names its English source, an English entry is found by the
 * German one that names it.
 */
export function findTranslation<T extends { id: string; data: { translationOf?: string } }>(
  entry: T,
  candidates: T[]
): T | null {
  const lang = entryLang(entry.id);
  const slug = entrySlug(entry.id);

  if (lang === defaultLocale) {
    return candidates.find((c) => c.data.translationOf === slug) ?? null;
  }

  const source = entry.data.translationOf;
  return source ? (candidates.find((c) => entrySlug(c.id) === source) ?? null) : null;
}
