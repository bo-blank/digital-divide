# Claude Code Instructions for Digital Divide

## Project Overview

Astro 7.x blog platform styled after The New Yorker. Uses Tailwind CSS 4.x, TypeScript strict mode, and MailerLite for newsletters.

## Key Files

- `ROADMAP.md` - Implementation phases and tasks
- `.claude/rules.md` - Detailed coding guidelines

## Quick Reference

### Tech Stack

- **Framework:** Astro 7.x (`^7.0.3`)
- **Styling:** Tailwind CSS 4.3.0 + Typography plugin + DaisyUI 5.x
- **Content:** Astro Content Collections (MDX) — config at `src/content.config.ts`
- **CMS:** Keystatic — config at `keystatic.config.ts`, admin at `/keystatic` (dev only)
- **Newsletter:** MailerLite API (not yet integrated)
- **Search:** Pagefind (not yet installed)

### Design Tokens

```text
Colors (light):
  bg: #FAFAF8 (warm off-white)
  text: #1A1A1A (charcoal)
  accent: #A8BCA1 (sage green)
  secondary: #D4A5A5 (dusty rose)
  tertiary: #B4C5E4 (periwinkle)

Fonts:
  headings: Fraunces (serif)
  body: Lora (serif)
  ui: Inter (sans)
```

## Implementation Rules

### Must Do

1. Use TypeScript strict mode - no `any` types
2. Use Astro Content Collections for all content
3. Include `alt` text on all images
4. Support dark mode using CSS custom properties
5. Make all interactive elements keyboard accessible
6. Run `npm run build` before committing - must pass

### Must Not Do

1. Don't use `client:load` unless truly needed
2. Don't hardcode colors - use design tokens
3. Don't skip error handling in API routes
4. Don't create React/Vue components - use Astro
5. Don't ignore TypeScript errors

### File Patterns

```text
Components:  src/components/PascalCase.astro
Layouts:     src/layouts/PascalCase.astro
Pages:       src/pages/kebab-case.astro
Utilities:   src/lib/kebab-case.ts
Content:     src/content/{collection}/*.mdx
Config:      src/content.config.ts  (not src/content/config.ts — Astro 7 moved it)
CMS:         keystatic.config.ts    (project root)
```

### Keystatic

The admin UI lives at `/keystatic` and edits `src/content/` in the working tree
(`storage: { kind: 'local' }`). Because those routes are server-rendered and the
site ships as a static build, `astro.config.mjs` loads the `react()` and
`keystatic()` integrations only under `astro dev`. Running the admin on the
deployed site would mean switching to GitHub storage and adding an adapter.

Collections cover `blog` and `notes`. The standalone pages `/about` and
`/privacy` are Keystatic **singletons** writing to `src/content/pages/*.mdx`,
read back through the `pages` collection — singletons rather than a collection
because those routes are hand-written `.astro` files, so a CMS-created third
page would have nowhere to render. The singleton `path` has no trailing slash,
which makes Keystatic write a flat `about.mdx` rather than `about/index.mdx`.
The `.astro` file keeps the layout, banner and hero image; only the prose,
title, tagline, lead and updated date come from the CMS.

Each collection and singleton sets `previewUrl` (site-relative, `{slug}` for
collections), which puts a "Preview" item in an entry's ⋯ menu that opens the
real page in a new tab. The sidebar brand mark is `keystatic.brand.tsx` — an
anchor back to the site, because Keystatic's chrome is React and
`ui.navigation` cannot hold an arbitrary link.

The essay and note lists show slug, title and publish date, newest first. Only
part of that is configurable: Keystatic builds the table as `[slug, ...columns]`
and hardcodes the initial sort to that slug column ascending, so `columns` can
only append — the slug column can't be moved, renamed or dropped, and there is
no `initialSort` option (checked against 0.6.5, the current release). The one
hook is `parseSlugForSort`, which replaces the value the slug column sorts on;
`byPublishDateDescending` in `keystatic.config.ts` feeds it negated publish
dates read out of the `.mdx` files with an eager `?raw` glob, because the table
runs in the browser knowing only each entry's slug. Reordering the columns
themselves would mean patching `@keystatic/core`'s dist bundle.

Tags are a `multiRelationship` over a `tags` collection in `src/data/tags/*.yaml`
— a picker instead of free text, so the vocabulary can't drift into near-duplicate
tag pages. That collection is Keystatic-only: nothing reads those files at build
time, `/tags` is still generated from the tags posts carry, and a tag with no
vocabulary entry still loads (multiRelationship validates "array of strings", not
"known slugs"). Adding a genuinely new tag means creating it under Tags first —
the "+ New tag" link under the field goes straight to that form.

That link is `keystatic.add-tag.tsx`, the project's second React component: a
field that stores nothing (`serialize` returns `undefined`, so no frontmatter
key is written and the Zod schema needs no counterpart) and renders a link
instead. Keystatic has no hook for putting UI beside a field, but a field can
render anything. A tag created there only reaches an open entry after a reload —
Keystatic fetches the file tree once per page load and never re-polls.

Type-ahead in that field does not work, and it is not fixable from this config:
every Keystatic combobox (`relationship`, `multiRelationship`) loses focus on the
first keystroke — `focusout` with a null `relatedTarget` — which reverts the
input, so only the dropdown is usable. Reproduced with stock field types and
ruled out as causes: React 19 vs 18, `entryLayout`, the `BrandMark`, and the
Astro dev toolbar. Don't re-litigate it by swapping field types; the fix has to
come from upstream (@keystatic/core 0.6.5 / @keystar/ui 0.9.3).

Every other field in `keystatic.config.ts` must have a counterpart in
`src/content.config.ts`. Keystatic clears an optional field by writing `null` or
`""` rather than dropping the key, so optional fields in the Zod schema are
wrapped in `blankToUndefined` — without it `z.coerce.date()` turns a cleared
date into 1970-01-01.

MDX components offered in the editor (`Callout`, `Figure`) are written as bare
JSX with no import statement, so they must also be registered in
`src/components/mdx/components.ts` and passed to `<Content components={...} />`.

### Content Collection Query Pattern

```typescript
import { getCollection } from 'astro:content';

const posts = await getCollection('blog', ({ data }) => {
  return !data.draft || import.meta.env.DEV;
});

const sorted = posts.sort((a, b) =>
  b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
);
```

### API Route Pattern

```typescript
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    // validate, process, return Response
  } catch {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

## Current Implementation Status

~70% complete. Core infrastructure, design system, and content infrastructure are done.

### Completed

#### Phase 1 — Content Infrastructure

- `src/content.config.ts` — blog + notes collection schemas
- `src/lib/content-utils.ts`, `reading-time.ts`, `related-posts.ts`
- MDX support via `@astrojs/mdx`
- MDX components: `src/components/mdx/Callout.astro`, `Figure.astro`

#### Phase 2 — Design System

- Typography, color palette, dark mode — `src/styles/global.css`
- DaisyUI theming, prose styling
- `ThemeToggle.astro`

#### Phase 3 — Core Blog

- Layouts: `BaseLayout.astro`, `BlogPostLayout.astro`
- Pages: `essays/[...page].astro` (listing + pagination), `essays/[slug].astro`
- Pages: `notes/index.astro`, `notes/[slug].astro`
- Pages: `tags/index.astro`, `tags/[tag].astro`, `series/index.astro`, `series/[series].astro`
- Pages: `about.astro`, `privacy.astro`, `subscribe.astro`, `rss.xml.ts`
- Components: `Header`, `Footer`, `Container`, `Pagination`, `ShareButtons`, `CopyButton`, `TableOfContents`, `RelatedPosts`, `SeriesNav`, `PageBanner`
- Content: 5 blog posts, 4 notes

### Next Priorities

#### Priority 1: Newsletter Integration (Phase 4)

- Create `src/pages/api/subscribe.ts` endpoint
- Create `src/lib/mailerlite.ts` utility
- Add double opt-in flow
- Wire up to existing `subscribe.astro` page

#### Priority 2: Search (Phase 5)

- Install and configure Pagefind
- Create `src/components/SearchBar.astro`
- Add search UI to Header
- Index blog posts and notes

#### Priority 3: Performance & SEO (Phase 6)

- Run Lighthouse audit (target 90+ on all metrics)
- Add Open Graph / Twitter Card meta tags to `BaseLayout.astro`
- Add social preview images
- Preconnect to font CDNs

#### Priority 4: Accessibility (Phase 7)

- Add skip-to-content link
- WCAG 2.1 AA validation
- ARIA labels on interactive elements
- Keyboard navigation + screen reader testing

#### Priority 5: Missing Pages

- `src/pages/404.astro` — custom error page
- Author pages (`/authors/[author]`) + `AuthorByline.astro`

#### Priority 6: Developer Experience

- E2E tests (Playwright)
- Lighthouse CI in CI/CD

## Environment Variables Needed

```env
MAILERLITE_API_KEY=xxx
PUBLIC_SITE_URL=https://...
PUBLIC_PREVIEW_MODE=false
```
