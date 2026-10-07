import { defaultLocale, isLang, locales, type Lang } from './config';

/**
 * URL construction for the two locales.
 *
 * Nothing outside this module may hardcode `/de`. Every href in the templates
 * goes through localePath(), which is also what makes the English output
 * provably unchanged: for the default locale it returns its argument
 * byte-for-byte, trailing slash and all.
 */

/**
 * Prefix a locale-free, root-relative path for `lang`.
 *
 *   localePath('en', '/essays')  -> '/essays'
 *   localePath('de', '/essays')  -> '/de/essays'
 *   localePath('de', '/')        -> '/de/'
 *
 * Callers keep owning their own trailing slash — some routes link with one
 * (`/essays/the-tell/`) and some without, and this must not quietly normalise
 * either into the other.
 */
export function localePath(lang: Lang, path: string): string {
  if (lang === defaultLocale) return path;
  // '/' would otherwise produce '/de' and cost a redirect hop to '/de/'.
  return path === '/' ? `/${lang}/` : `/${lang}${path}`;
}

/**
 * The locale a pathname belongs to, from its first segment.
 *
 * Used as BaseLayout's default so a page that forgets to pass `lang` still
 * renders in the right language rather than silently falling back to English.
 */
export function langFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return first && isLang(first) ? first : defaultLocale;
}

/**
 * Strip the locale prefix, giving the path in the form localePath() takes.
 * The inverse of localePath(), so `localePath(l, stripLocale(p))` re-homes any
 * path into any locale — which is exactly what the language switcher needs.
 */
export function stripLocale(pathname: string): string {
  const [, first, ...rest] = pathname.split('/');
  if (first && isLang(first) && first !== defaultLocale) {
    return `/${rest.join('/')}`;
  }
  return pathname;
}

export interface Alternate {
  lang: Lang;
  path: string;
}

/**
 * The `<link rel="alternate" hreflang>` set for a page that exists in every
 * locale at the same locale-free path — every route except the content ones,
 * where a translation may or may not exist and the caller passes its own list.
 *
 * Strips the locale before re-prefixing, so it is safe to hand it a live
 * `Astro.url.pathname` (which carries the prefix on a German page) as well as
 * an already-bare path. Without that it silently produced garbage on exactly
 * one class of page: on /de/about it returned "en → /de/about" — the language
 * switcher pointing at the page it was already on — and "de → /de/de/about".
 * Both are ordinary-looking URLs, which is why nothing downstream complained.
 */
export function alternatesForPath(path: string): Alternate[] {
  const bare = stripLocale(path);
  return locales.map((lang) => ({ lang, path: localePath(lang, bare) }));
}
