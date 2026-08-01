/**
 * Turn a stored tag slug back into display casing.
 *
 * Tags are slugified at parse time (see src/content.config.ts) so routing and
 * filtering agree on one form, which means every render site has to undo it.
 * This lived in three files — Header.astro, tags/index.astro and
 * tags/[tag].astro — while the post cards showed the raw slug instead.
 */
export function formatTagDisplay(tag: string): string {
  return tag
    .split(/[_-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
