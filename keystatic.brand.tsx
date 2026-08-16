/**
 * The mark shown beside the brand name in the Keystatic sidebar.
 *
 * Keystatic renders `ui.brand.mark` as a plain element in the sidebar header —
 * it is not already wrapped in a link — so making it an anchor gives the admin
 * UI the one thing it otherwise has no room for: a way back to the site. There
 * is no config option for an arbitrary nav link, and `ui.navigation` only
 * accepts collection and singleton keys.
 *
 * It opens in a new tab so an entry with unsaved changes is never navigated
 * away from, which is the same reason Keystatic's own Preview action does.
 *
 * One of the project's two React components, with keystatic.add-tag.tsx. The
 * rule against them is about site markup; the CMS chrome is React, so an
 * .astro file cannot be used here.
 */
export function BrandMark() {
  return (
    <a
      href="/"
      target="_blank"
      rel="noopener noreferrer"
      title="Open the site in a new tab"
      aria-label="Open the site in a new tab"
      // `color: inherit` picks up the sidebar heading colour Keystatic sets on
      // the surrounding stack, so the mark matches the brand name in both
      // colour schemes without reading the `colorScheme` prop.
      style={{ display: 'flex', color: 'inherit' }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2.5 11.5 12 3.5l9.5 8" />
        <path d="M5 10v10.5h14V10" />
        <path d="M10 20.5v-6h4v6" />
      </svg>
    </a>
  );
}
