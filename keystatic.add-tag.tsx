import type { BasicFormField } from '@keystatic/core';

/**
 * A UI-only field: a link that opens the Tags collection's "new entry" form.
 *
 * The Tags field is a `multiRelationship`, so it can only offer tags that
 * already exist as entries in the `tags` collection. Without this, adding a
 * tag mid-entry means finding Tags in the sidebar and losing your place; this
 * puts the same destination directly under the field that needs it.
 *
 * It is a field rather than a piece of chrome because Keystatic has no hook
 * for injecting UI next to a field — but a field can render whatever it likes.
 * This one holds no data: `serialize` returns `undefined`, which Keystatic
 * treats as "don't write this key", so no frontmatter appears and
 * src/content.config.ts needs no counterpart. `parse` ignores whatever it is
 * given, so it cannot fail to load an existing entry either.
 *
 * The link opens in a new tab, like Preview and the brand mark, so an entry
 * with unsaved changes is never navigated away from. Note that the new tag
 * will not appear in this entry's dropdown until the page is reloaded:
 * Keystatic reads the file tree once per page load and never re-polls, so
 * save the entry first, then reload.
 */
export const newTagLink: BasicFormField<null> = {
  kind: 'form',
  label: 'Add a tag',

  Input() {
    return (
      <a
        // Absolute because Keystatic is mounted at /keystatic; `create` is the
        // route its own "new entry" button uses.
        href="/keystatic/collection/tags/create"
        target="_blank"
        rel="noopener noreferrer"
        // `color: inherit` rather than a fixed colour so the link reads
        // correctly in both of Keystatic's colour schemes, as in the brand mark.
        style={{
          alignSelf: 'start',
          color: 'inherit',
          fontSize: '0.75rem',
          opacity: 0.75,
          textDecoration: 'underline',
          textUnderlineOffset: '0.2em',
        }}
      >
        + New tag
      </a>
    );
  },

  defaultValue: () => null,
  parse: () => null,
  serialize: () => ({ value: undefined }),
  validate: (value) => value,
  reader: { parse: () => null },
};
