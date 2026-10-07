import { localeMeta, type Lang } from '../i18n/config';

/**
 * The site's one date formatter.
 *
 * `lang` is required rather than defaulted: a default would let a call site
 * silently render "August 16, 2026" in the middle of a German page, which is
 * exactly the class of bug that has no visible symptom in an English test pass.
 */
export function formatDate(
  date: Date,
  lang: Lang,
  month: 'short' | 'long' = 'long'
): string {
  return date.toLocaleDateString(localeMeta[lang].dateLocale, {
    year: 'numeric',
    month,
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Month and year only, for the "Last updated" line on the privacy policy: a
 * policy is revised in a given month, and a to-the-day date invites the reader
 * to wonder what changed that Tuesday.
 */
export function formatMonthYear(date: Date, lang: Lang): string {
  return date.toLocaleDateString(localeMeta[lang].dateLocale, {
    year: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  });
}
