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
- **i18n:** English (default, unprefixed) + German at `/de/*` — strings in `src/i18n/ui.ts`
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
Page bodies: src/components/pages/PascalCase.astro   (shared by both locales)
Layouts:     src/layouts/PascalCase.astro
Routes (en): src/pages/kebab-case.astro              (thin wrappers)
Routes (de): src/pages/de/kebab-case.astro           (mirror of the above)
Utilities:   src/lib/kebab-case.ts
i18n:        src/i18n/{config,routing,ui}.ts
Content:     src/content/{collection}/*.mdx          (English)
             src/content/{collection}/de/*.mdx       (German)
Config:      src/content.config.ts  (not src/content/config.ts — Astro 7 moved it)
CMS:         keystatic.config.ts    (project root)
```

### Keystatic

The admin UI lives at `/keystatic` and edits `src/content/` in the working tree
(`storage: { kind: 'local' }`). Because those routes are server-rendered and the
site ships as a static build, `astro.config.mjs` loads the `react()` and
`keystatic()` integrations only under `astro dev`. Running the admin on the
deployed site would mean switching to GitHub storage and adding an adapter.

Collections cover `blog`/`blogDe` and `notes`/`notesDe`, built by one factory
per kind so the two locales cannot drift (labels are suffixed `(EN)`/`(DE)`).
The one thing the factory cannot take a parameter for is `parseSlugForSort`'s
`import.meta.glob` — Vite resolves the specifier at build time, so each locale's
call is written out at the call site. Note `*` does not cross a `/`, so the
English globs do not pick up `de/`.

**The depth gotcha:** `coverImage.src` and body-image paths are written into
frontmatter *verbatim* — Keystatic does not resolve them against the entry's
path. German content sits one directory deeper, so it needs `../../../assets/…`
where English needs `../../`. That is what `depthPrefix(lang)` is for; getting
it wrong writes a path pointing outside `src/` and fails the build.

The standalone pages `/about` and `/privacy` are Keystatic **singletons** writing to `src/content/pages/*.mdx`,
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

`translationOf` is offered only on the German collections: the link is declared
in one direction (a German entry names the English slug it translates), so on an
English entry the field would only be a place to introduce a contradiction.

The tag vocabulary is deliberately **not** duplicated per locale — see the i18n
section above.

Every other field in `keystatic.config.ts` must have a counterpart in
`src/content.config.ts`. Keystatic clears an optional field by writing `null` or
`""` rather than dropping the key, so optional fields in the Zod schema are
wrapped in `blankToUndefined` — without it `z.coerce.date()` turns a cleared
date into 1970-01-01.

MDX components offered in the editor (`Callout`, `Figure`) are written as bare
JSX with no import statement, so they must also be registered in
`src/components/mdx/components.ts` and passed to `<Content components={...} />`.

### Internationalisation

English is the default locale and is **unprefixed** (`/essays`); German is served
from `/de/*`. Astro's `i18n.routing.prefixDefaultLocale` is `false`, so no
existing English URL moved when German was added — nothing under `src/pages/`
outside `de/` changed shape, and no redirects were needed.

**Locale is a directory, not a frontmatter field.** German content lives in a
`de/` subdirectory of the same collection (`src/content/blog/de/*.mdx`). The
glob loaders already use `**` patterns, so this needed no new collection —
`CollectionEntry<'blog'>` is still one type and no component prop changed. The
cost is that an entry's `id` carries the prefix (`de/der-hinweis`), so:

> **Use `entrySlug(post.id)`, never `post.id`, in an href or a getStaticPaths
> param.** The raw id builds `/de/essays/de/der-hinweis`, which renders fine and
> 404s from every link on the site. `entryLang(id)` is the matching reader.

Three modules, none of which import `astro:content` (so `content.config.ts` and
`keystatic.config.ts` can use them):

- `src/i18n/config.ts` — the locale table: date/OG/RSS codes, words-per-minute.
- `src/i18n/routing.ts` — `localePath(lang, path)` builds every internal href.
  **Nothing else may hardcode `/de`.** For the default locale it returns its
  argument byte-for-byte, which is what keeps English output identical.
- `src/i18n/ui.ts` — ~160 strings. `en` is the source of truth and `de` is typed
  `Record<keyof typeof en, string>`, so a missing German key is a compile error.
  `t('key', vars)` interpolates `{name}`; `plural('key', n)` picks `_one`/`_other`.
  Sentences with values in them are whole keys — never concatenate a translated
  fragment with a value, because German word order differs.

**Page bodies are shared.** Each route's markup lives in
`src/components/pages/*.astro` taking a `lang` prop; `src/pages/**` and
`src/pages/de/**` are wrappers that do nothing but scope `getStaticPaths` to a
locale and render the body. A design change is made once.

**Two traps that already bit once:**

1. `Header.astro` is `transition:persist`, keyed `header-${lang}`. A bare
   `transition:persist` keys on element position, which is identical in both
   trees — so `/essays` → `/de/essays` would keep the English header on a German
   page with no re-render to fix it.
2. Translated slugs differ (`the-tell` / `der-hinweis`), so **no route may
   assume the same path exists in the other locale.** The essay, note, tag,
   series and paginated-essay pages all compute their own `alternates` and pass
   them to `BaseLayout`; only routes that genuinely exist in both (`/about`,
   `/subscribe`, …) use its `alternatesForPath` default. Those alternates feed
   both the `hreflang` tags and the language switcher, so the two cannot
   disagree. A page with no counterpart links to the other locale's home page
   rather than inventing a URL.

Translations are linked by a `translationOf` frontmatter field on the German
entry naming the English slug (`findTranslation` in `content-utils.ts`).

**Tag slugs are shared across locales; only labels are translated.** A German
essay carries the same `social-media` slug, so `/tags/social-media` and
`/de/tags/social-media` are the same topic and pair for `hreflang` with no
mapping. The labels come from `src/data/tags/*.yaml` (`name:` + `de:`), read by
`getTagLabeller(lang)` in `lib/tag-labels.ts` — call it once in a component's
frontmatter, then use the returned sync function in the markup. Every tag render
site goes through it; `formatTagDisplay` is now only the fallback for a slug
with no vocabulary entry.

Two consequences worth remembering: adding a language means adding a field to
the tags YAML schema **and** to `keystatic.config.ts`, and `/tags` sorts and
groups by the *label*, not the slug — grouping by slug files "Werbung" under A.

Strings inside `<script>` blocks cannot come from a template expression; they
are passed in on `data-` attributes (`Header` menu labels, `CopyButton`,
`SubscribePage`, `LanguageSwitcher`).

**Never style or match by URL shape.** `global.css` used to pill tag links with
`a[href^="/tags/"]`, a prefix match against the default locale — so every German
pill at `/de/tags/...` silently fell through it and rendered as bare text, and
the `:not([href^="/tags/"])` guards on the nav hover rule stopped excluding
anything. Tag links now carry `.tag` (pill) or `.tag-link` (header trending),
and the CSS matches those. Anything keyed on a path prefix is a latent
locale bug: `alternatesForPath` was the same mistake in a different file.

**Deployment gap:** `src/pages/de/404.astro` builds to `/de/404.html`, but a
static host serves the root `/404.html` for every miss. Routing `/de/*` misses
to the German page needs a host rule (Netlify `_redirects`, Vercel rewrite).
Until then the root 404 carries a "Deutsch" button to `/de/`.

### Content Collection Query Pattern

Every `content-utils` and `related-posts` export takes a locale:

```typescript
import { getPublishedPosts, entrySlug } from '../lib/content-utils';
import { localePath } from '../i18n/routing';

// Already sorted newest-first, drafts and future dates filtered.
const posts = await getPublishedPosts(lang);

const href = localePath(lang, `/essays/${entrySlug(posts[0].id)}`);
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
- Content: 5 blog posts, 4 notes (English)

#### Phase 3b — German locale

- `src/i18n/{config,routing,ui}.ts` — locale table, URL builder, ~160 strings
- Shared page bodies in `src/components/pages/`, thin route wrappers in
  `src/pages/` and `src/pages/de/`
- `LanguageSwitcher.astro`, per-page `hreflang`, sitemap `i18n` alternates
- German feed at `/de/rss.xml`; Keystatic `blogDe`/`notesDe`/`aboutDe`/`privacyDe`
- **All content translated:** 6 essays, 4 notes, `/de/about`, `/de/privacy`.
  Every English entry has a German counterpart linked by `translationOf`, so
  `hreflang` and the language switcher pair up across all of them.
- Series names are translated too ("Future of Work" / "Zukunft der Arbeit"),
  which changes the slug — so `SeriesPage.astro` finds a series' counterpart
  through its posts' `translationOf` links rather than by URL.
- **`/de/privacy` is a faithful translation of the English policy, not a
  German-market one.** A GDPR policy additionally needs the Verantwortlicher and
  their contact details, the Rechtsgrundlage per purpose, Speicherdauer, and the
  Beschwerderecht bei einer Aufsichtsbehörde. None of that exists in the English
  source to translate. Have it reviewed before launching in the EU.

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
