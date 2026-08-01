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
```

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
