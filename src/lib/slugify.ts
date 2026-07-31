/**
 * Convert arbitrary frontmatter text into a URL-safe slug.
 *
 * Kept in its own module (rather than content-utils.ts) so that
 * src/content.config.ts can import it without pulling in `astro:content`,
 * which would be a circular import.
 *
 *   "Future of Work" -> "future-of-work"
 *   "remote_work"    -> "remote-work"
 *   "Café Culture"   -> "cafe-culture"
 */
export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    // Strip the combining marks that NFKD split off, so accented letters
    // become their ASCII base rather than being dropped entirely.
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
