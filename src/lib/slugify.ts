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
 *   "Größe"          -> "groesse"
 */

/**
 * German expands its umlauts rather than dropping the diaeresis: the
 * conventional transliteration of "Größe" is "groesse", not "grosse" and
 * certainly not the "gro-e" the generic path below produced (ß survives NFKD
 * intact, so it fell through to the non-alphanumeric replacement).
 *
 * Applied only to these five letters. Everything else still takes the NFKD
 * route, so "Café" stays "cafe" rather than becoming "cafee".
 */
const GERMAN_TRANSLITERATIONS: ReadonlyArray<readonly [RegExp, string]> = [
  [/ä/g, 'ae'],
  [/ö/g, 'oe'],
  [/ü/g, 'ue'],
  [/Ä/g, 'Ae'],
  [/Ö/g, 'Oe'],
  [/Ü/g, 'Ue'],
  [/ß/g, 'ss'],
];

export function slugify(value: string): string {
  // Compose first: the same ä can arrive as one code point or as "a" plus a
  // combining diaeresis, and only the composed form matches the table above.
  let result = value.normalize('NFC');

  for (const [pattern, replacement] of GERMAN_TRANSLITERATIONS) {
    result = result.replace(pattern, replacement);
  }

  return result
    .normalize('NFKD')
    // Strip the combining marks that NFKD split off, so accented letters
    // become their ASCII base rather than being dropped entirely.
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
