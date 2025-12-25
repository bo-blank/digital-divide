# Claude Code Instructions for Digital Divide

## Project Overview
Astro 5.x blog platform styled after The New Yorker. Uses Tailwind CSS 4.x, TypeScript strict mode, and MailerLite for newsletters.

## Key Files
- `ROADMAP.md` - Implementation phases and tasks
- `.claude/rules.md` - Detailed coding guidelines

## Quick Reference

### Tech Stack
- **Framework:** Astro 5.16.6
- **Styling:** Tailwind CSS 4.1.17 + Typography plugin
- **Content:** Astro Content Collections (MDX)
- **Newsletter:** MailerLite API
- **Search:** Pagefind (static)

### Design Tokens
```
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
```
Components:  src/components/PascalCase.astro
Layouts:     src/layouts/PascalCase.astro
Pages:       src/pages/kebab-case.astro
Utilities:   src/lib/kebab-case.ts
Content:     src/content/{collection}/*.mdx
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
~2% complete. Start with Phase 1 (Content Infrastructure) per ROADMAP.md.

## Environment Variables Needed
```
MAILERLITE_API_KEY=xxx
PUBLIC_SITE_URL=https://...
PUBLIC_PREVIEW_MODE=false
```
