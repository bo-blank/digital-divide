/**
 * Turn a stored tag slug back into display casing.
 *
 * Tags are slugified at parse time (see src/content.config.ts) so routing and
 * filtering agree on one form, which means every render site has to undo it.
 * This lived in three files — Header.astro, tags/index.astro and
 * tags/[tag].astro — while the post cards showed the raw slug instead.
 *
 * Deliberately not locale-aware, unlike the other formatters. The tag
 * vocabulary in src/data/tags is shared across both languages — a German essay
 * carries the same `social-media` slug as an English one — so there is nothing
 * per-locale to decide here. Title case happens to be right for both: English
 * title-cases tag labels by convention, and German capitalises nouns anyway.
 * Translating the labels themselves would mean a second vocabulary, which is a
 * data change, not a change to this function.
 */
export function formatTagDisplay(tag: string): string {
  return tag
    .split(/[_-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
