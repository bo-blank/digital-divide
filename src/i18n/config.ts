/**
 * The locale table.
 *
 * Deliberately free of any `astro:content` or `astro:*` import so that
 * src/content.config.ts, keystatic.config.ts and plain .ts utilities can all
 * pull from it without a circular import — the same reason slugify.ts sits in
 * its own module.
 */

export const locales = ['en', 'de'] as const;

export type Lang = (typeof locales)[number];

/**
 * English is unprefixed (`/essays`); German is prefixed (`/de/essays`). This
 * has to agree with `i18n.routing.prefixDefaultLocale: false` in
 * astro.config.mjs — see localePath() in ./routing.ts, which is the only place
 * that encodes the rule.
 */
export const defaultLocale: Lang = 'en';

interface LocaleMeta {
  /** Shown in the language switcher, in the language itself. */
  label: string;
  /** <html lang>. */
  htmlLang: string;
  /** og:locale, which wants the underscored form. */
  ogLocale: string;
  /** BCP-47 tag for toLocaleDateString / toLocaleString / localeCompare. */
  dateLocale: string;
  /** RSS <language>, which wants the lowercased hyphenated form. */
  rssLanguage: string;
  /**
   * Reading-speed divisor. German prose runs slower than English — longer
   * compounds, more characters per word — so a shared 200 would understate
   * every German essay.
   */
  wordsPerMinute: number;
}

export const localeMeta = {
  en: {
    label: 'English',
    htmlLang: 'en',
    ogLocale: 'en_US',
    dateLocale: 'en-US',
    rssLanguage: 'en-us',
    wordsPerMinute: 200,
  },
  de: {
    label: 'Deutsch',
    htmlLang: 'de',
    ogLocale: 'de_DE',
    dateLocale: 'de-DE',
    rssLanguage: 'de-de',
    wordsPerMinute: 180,
  },
} as const satisfies Record<Lang, LocaleMeta>;

/** Narrowing helper for values that arrive as plain strings (URL segments). */
export function isLang(value: string): value is Lang {
  return (locales as readonly string[]).includes(value);
}
