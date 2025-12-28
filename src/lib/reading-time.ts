const WORDS_PER_MINUTE = 200;

/**
 * Calculate reading time for a given text.
 * Returns both the number of minutes and a formatted string.
 */
export function calculateReadingTime(text: string): {
  minutes: number;
  text: string;
} {
  // Remove MDX/JSX components and HTML tags
  const cleanText = text
    .replace(/<[^>]*>/g, '')
    .replace(/import\s+.*?from\s+['"].*?['"]/g, '')
    .replace(/export\s+.*?;/g, '');

  // Count words
  const words = cleanText
    .split(/\s+/)
    .filter((word) => word.length > 0);

  const wordCount = words.length;
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
