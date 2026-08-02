import type { CollectionEntry } from 'astro:content';
import { getPublishedPosts } from './content-utils';

type BlogPost = CollectionEntry<'blog'>;

interface ScoredPost {
  post: BlogPost;
  score: number;
}

/**
 * Minimum score for a post to count as genuinely related rather than filler.
 * A single shared tag (+3) clears it; the recency bonus alone (max +1) does not.
 */
const MIN_RELATED_SCORE = 3;

/**
 * Find related posts based on shared tags, same series, and recency.
 *
 * Scoring algorithm:
 * - Same series: +10 points
 * - Each shared tag: +3 points
 * - Recency bonus: Up to +1 point for posts within last 30 days
 *
 * Posts scoring below MIN_RELATED_SCORE are dropped rather than shown as
 * "related" — if too few posts clear the bar, the remaining slots are filled
 * with the most recent other posts instead.
 */
export async function getRelatedPosts(
  currentPost: BlogPost,
  limit: number = 3
): Promise<BlogPost[]> {
  const allPosts = await getPublishedPosts();

  // Filter out the current post
  const otherPosts = allPosts.filter(
    (post) => post.id !== currentPost.id
  );

  // Score each post
  const scoredPosts: ScoredPost[] = otherPosts.map((post) => {
    let score = 0;

    // Same series: +10 points
    if (
      currentPost.data.series &&
      post.data.series &&
      currentPost.data.series.toLowerCase() === post.data.series.toLowerCase()
    ) {
      score += 10;
    }

    // Shared tags: +3 points each
    const currentTags = new Set(
      currentPost.data.tags.map((t) => t.toLowerCase())
    );
    const sharedTags = post.data.tags.filter((t) =>
      currentTags.has(t.toLowerCase())
    );
    score += sharedTags.length * 3;

    // Recency bonus: Up to +1 point for posts within last 30 days
    const daysSincePublish = Math.floor(
      (Date.now() - post.data.publishDate.valueOf()) / (1000 * 60 * 60 * 24)
    );
    if (daysSincePublish <= 30) {
      score += 1 - daysSincePublish / 30;
    }

    return { post, score };
  });

  // Sort by score (descending), then by date (newest first)
  scoredPosts.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return (
      b.post.data.publishDate.valueOf() - a.post.data.publishDate.valueOf()
    );
  });

  const related = scoredPosts.filter((sp) => sp.score >= MIN_RELATED_SCORE);
  const fallback = scoredPosts.filter((sp) => sp.score < MIN_RELATED_SCORE);

  return [...related, ...fallback].slice(0, limit).map((sp) => sp.post);
}

/**
 * Get posts from the same series, ordered by publish date.
 */
export async function getSeriesPosts(
  series: string
): Promise<BlogPost[]> {
  const allPosts = await getPublishedPosts();

  return allPosts
    .filter(
      (post) =>
        post.data.series &&
        post.data.series.toLowerCase() === series.toLowerCase()
    )
    .sort(
      (a, b) =>
        a.data.publishDate.valueOf() - b.data.publishDate.valueOf()
    );
}

/**
 * Get adjacent posts in a series (previous and next).
 */
export async function getAdjacentSeriesPosts(
  currentPost: BlogPost
): Promise<{
  previous: BlogPost | null;
  next: BlogPost | null;
}> {
  if (!currentPost.data.series) {
    return { previous: null, next: null };
  }

  const seriesPosts = await getSeriesPosts(currentPost.data.series);
  const currentIndex = seriesPosts.findIndex(
    (post) => post.id === currentPost.id
  );

  return {
    previous: currentIndex > 0 ? seriesPosts[currentIndex - 1] : null,
    next:
      currentIndex < seriesPosts.length - 1
        ? seriesPosts[currentIndex + 1]
        : null,
  };
}
