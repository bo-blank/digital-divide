const WORDS_PER_MINUTE = 200;

/**
 * Count words in text, cleaning MDX/HTML content first.
 */
function countWords(text: string): number {
  // Remove MDX/JSX components and HTML tags
  const cleanText = text
    .replace(/<[^>]*>/g, '')
    .replace(/import\s+.*?from\s+['"].*?['"]/g, '')
    .replace(/export\s+.*?;/g, '');

  // Count words
  const words = cleanText
    .split(/\s+/)
    .filter((word) => word.length > 0);

  return words.length;
}

/**
 * Calculate reading time for a given text.
 * Returns both the number of minutes and a formatted string.
 */
export function calculateReadingTime(text: string): {
  minutes: number;
  text: string;
} {
  const wordCount = countWords(text);
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);

  return {
    minutes,
    text: minutes === 1 ? '1 min read' : `${minutes} min read`,
  };
}

/**
 * Get reading time from raw markdown/MDX content.
 */
export function getReadingTime(content: string): string {
  return calculateReadingTime(content).text;
}

/**
 * Get word count rounded to nearest 100, formatted as string.
 */
export function getWordCount(content: string): string {
  const wordCount = countWords(content);
  const rounded = Math.round(wordCount / 100) * 100;

  if (rounded === 0) {
    return `${wordCount} words`;
  }

  return `${rounded.toLocaleString()} words`;
}
