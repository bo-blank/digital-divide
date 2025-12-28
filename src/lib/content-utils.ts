import { getCollection, type CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;
type Note = CollectionEntry<'notes'>;

/**
 * Get all published blog posts, sorted by publish date (newest first).
 * Filters out drafts in production and future-dated posts.
 */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data }) => {
    const isPublished = !data.draft || import.meta.env.DEV;
    const isNotFuture = data.publishDate <= new Date();
    return isPublished && isNotFuture;
  });

  return posts.sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
  );
}

/**
 * Get all published notes, sorted by publish date (newest first).
 * Filters out drafts in production and future-dated posts.
 */
export async function getPublishedNotes(): Promise<Note[]> {
  const notes = await getCollection('notes', ({ data }) => {
    const isPublished = !data.draft || import.meta.env.DEV;
    const isNotFuture = data.publishDate <= new Date();
    return isPublished && isNotFuture;
  });

  return notes.sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
  );
}

/**
 * Get posts filtered by tag.
 */
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getPublishedPosts();
  return posts.filter((post) =>
    post.data.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

/**
 * Get posts filtered by series.
 */
export async function getPostsBySeries(series: string): Promise<BlogPost[]> {
  const posts = await getPublishedPosts();
  return posts.filter(
    (post) => post.data.series?.toLowerCase() === series.toLowerCase()
  );
}

/**
 * Get posts filtered by category.
 */
export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const posts = await getPublishedPosts();
  return posts.filter(
    (post) => post.data.category?.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get all unique tags from published posts.
 */
export async function getAllTags(): Promise<string[]> {
  const posts = await getPublishedPosts();
  const tagSet = new Set<string>();

  posts.forEach((post) => {
    post.data.tags.forEach((tag) => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
}

/**
 * Get all unique series from published posts.
 */
export async function getAllSeries(): Promise<string[]> {
  const posts = await getPublishedPosts();
  const seriesSet = new Set<string>();

  posts.forEach((post) => {
    if (post.data.series) {
      seriesSet.add(post.data.series);
    }
  });

  return Array.from(seriesSet).sort();
}

/**
 * Get all unique categories from published posts.
 */
export async function getAllCategories(): Promise<string[]> {
  const posts = await getPublishedPosts();
  const categorySet = new Set<string>();

  posts.forEach((post) => {
    if (post.data.category) {
      categorySet.add(post.data.category);
    }
  });

  return Array.from(categorySet).sort();
}
