import { localeMeta, type Lang } from '../i18n/config';
import { useTranslations } from '../i18n/ui';

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
 *
 * The words-per-minute divisor is per-locale (see localeMeta): German prose
 * reads slower than English, so sharing one figure would understate every
 * German essay.
 */
export function calculateReadingTime(
  text: string,
  lang: Lang
): {
  minutes: number;
  text: string;
} {
  const { plural } = useTranslations(lang);
  const wordCount = countWords(text);
  const minutes = Math.ceil(wordCount / localeMeta[lang].wordsPerMinute);

  return {
    minutes,
    text: plural('readingTime.minutes', minutes),
  };
}

/**
 * Get reading time from raw markdown/MDX content.
 */
export function getReadingTime(content: string, lang: Lang): string {
  return calculateReadingTime(content, lang).text;
}

/**
 * Get word count rounded to nearest 100, formatted as string.
 */
export function getWordCount(content: string, lang: Lang): string {
  const { plural } = useTranslations(lang);
  const wordCount = countWords(content);
  const rounded = Math.round(wordCount / 100) * 100;

  if (rounded === 0) {
    return plural('readingTime.words', wordCount);
  }

  // Explicitly localised: bare toLocaleString() follows the build machine's
  // locale, so a German page could render "1,200 Wörter" with an English
  // thousands separator depending on where the build ran.
  return plural('readingTime.words', rounded, {
    count: rounded.toLocaleString(localeMeta[lang].dateLocale),
  });
}
