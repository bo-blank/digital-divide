# Digital Divide - Coding Guidelines

## Project Context
Astro 5.x blog platform with Tailwind CSS 4.x, TypeScript strict mode, and MailerLite integration. Inspired by The New Yorker's refined aesthetic.

---

## Astro-Specific Rules

### File Naming
- Components: `PascalCase.astro` (e.g., `PostCard.astro`)
- Layouts: `PascalCase.astro` in `src/layouts/`
- Pages: `kebab-case.astro` or `[param].astro` for dynamic routes
- Utilities: `kebab-case.ts` in `src/lib/`

### Component Structure
```astro
---
// 1. Imports (Astro components, then npm packages, then local)
import BaseLayout from '../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';
import { formatDate } from '../lib/utils';

// 2. Props interface
interface Props {
  title: string;
  description?: string;
}

// 3. Props destructuring with defaults
const { title, description = '' } = Astro.props;

// 4. Data fetching / logic
const posts = await getCollection('blog');
---

<!-- 5. Template -->
<BaseLayout {title}>
  <article>
    <slot />
  </article>
</BaseLayout>

<style>
  /* 6. Scoped styles (prefer Tailwind classes instead) */
</style>
```

### Content Collections
- Always use `getCollection()` from `astro:content`
- Filter drafts in production: `filter: ({ data }) => !data.draft || import.meta.env.DEV`
- Sort by date descending: `.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf())`

### Dynamic Routes
```astro
// src/pages/blog/[slug].astro
export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}
```

---

## TypeScript Rules

### Strict Mode
- No `any` types - use `unknown` and narrow
- Always define interfaces for props and data structures
- Use `satisfies` for type checking object literals

### Type Imports
```typescript
// Prefer type imports when only using types
import type { CollectionEntry } from 'astro:content';
```

### Utility Types
```typescript
// Content collection entry type
type BlogPost = CollectionEntry<'blog'>;

// Infer props from Astro component
type Props = astroHTML.JSX.HTMLAttributes;
```

---

## Tailwind CSS Rules

### Class Order
Follow this order for readability:
1. Layout (`flex`, `grid`, `block`)
2. Positioning (`relative`, `absolute`)
3. Box model (`w-`, `h-`, `p-`, `m-`)
4. Typography (`text-`, `font-`, `leading-`)
5. Visual (`bg-`, `border-`, `shadow-`)
6. Interactive (`hover:`, `focus:`)
7. Responsive (`sm:`, `md:`, `lg:`)

### Design System Colors
Use CSS custom properties defined in `global.css`:
```css
/* Light mode */
--color-bg: #FAFAF8;
--color-text: #1A1A1A;
--color-accent: #A8BCA1;      /* sage green */
--color-secondary: #D4A5A5;   /* dusty rose */
--color-tertiary: #B4C5E4;    /* periwinkle */
```

### Typography Scale
- Headings: `font-heading` (Fraunces)
- Body: `font-body` (Lora)
- UI elements: `font-sans` (Inter)

### Prose Styling
Use `@tailwindcss/typography` for article content:
```astro
<article class="prose prose-lg prose-neutral dark:prose-invert max-w-none">
  <slot />
</article>
```

---

## Accessibility Requirements

### Every Interactive Element
- Must be keyboard accessible
- Must have visible focus state
- Must have accessible name (label, aria-label, or aria-labelledby)

### Images
```astro
<!-- Always include alt text -->
<Image src={coverImage} alt={imageAlt} />

<!-- Decorative images -->
<Image src={divider} alt="" role="presentation" />
```

### Forms
```astro
<label for="email">Email address</label>
<input
  type="email"
  id="email"
  name="email"
  required
  aria-describedby="email-hint"
/>
<p id="email-hint" class="text-sm text-gray-600">We'll never share your email.</p>
```

### Skip Link
Include in BaseLayout:
```astro
<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4">
  Skip to content
</a>
```

---

## Component Patterns

### Loading States
```astro
<button disabled={isLoading} class="relative">
  <span class:list={[{ 'opacity-0': isLoading }]}>Submit</span>
  {isLoading && (
    <span class="absolute inset-0 flex items-center justify-center">
      <LoadingSpinner />
    </span>
  )}
</button>
```

### Error Handling
```typescript
try {
  const response = await fetch('/api/subscribe', { method: 'POST', body });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Subscription failed');
  }
} catch (err) {
  // Always show user-friendly message
  setError(err instanceof Error ? err.message : 'Something went wrong');
}
```

### Dark Mode Toggle
```astro
<script>
  // Check system preference and stored preference
  const theme = localStorage.getItem('theme') ??
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  document.documentElement.classList.toggle('dark', theme === 'dark');
</script>
```

---

## API Routes (MailerLite)

### Structure
```typescript
// src/pages/api/subscribe.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    // Validate
    if (!data.email || !isValidEmail(data.email)) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Call MailerLite API
    const result = await addSubscriber(data.email);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Subscribe error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
```

### Environment Variables
```typescript
// Access server-side env vars
const MAILERLITE_API_KEY = import.meta.env.MAILERLITE_API_KEY;

// Public env vars (client-accessible)
const SITE_URL = import.meta.env.PUBLIC_SITE_URL;
```

---

## Content Schema

### Blog Post Frontmatter
```yaml
---
title: "Post Title"
description: "Brief description for SEO and previews"
publishDate: 2025-01-15
updatedDate: 2025-01-16  # optional
author: "author-slug"
draft: false
tags: ["tag1", "tag2"]
series: "series-slug"  # optional
coverImage: "./cover.jpg"
coverImageAlt: "Description of the image"
---
```

### Schema Definition
```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string().max(100),
    description: z.string().max(200),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('default'),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    series: z.string().optional(),
    coverImage: image().optional(),
    coverImageAlt: z.string().optional(),
  }),
});

export const collections = { blog };
```

---

## Performance

### Image Optimization
```astro
import { Image } from 'astro:assets';

<Image
  src={coverImage}
  alt={coverImageAlt}
  widths={[400, 800, 1200]}
  sizes="(max-width: 768px) 100vw, 800px"
  loading="lazy"
  decoding="async"
/>
```

### Avoid Client-Side JS When Possible
- Prefer Astro components over React/Vue
- Use `<script>` for small interactions, not full frameworks
- Use `is:inline` for critical scripts that must block

### View Transitions
```astro
---
import { ViewTransitions } from 'astro:transitions';
---
<head>
  <ViewTransitions />
</head>

<!-- Persistent elements -->
<header transition:persist>...</header>

<!-- Named transitions for morphing -->
<h1 transition:name={`post-${slug}`}>{title}</h1>
```

---

## File Organization

```
src/
├── components/
│   ├── mdx/           # MDX-specific components
│   ├── ui/            # Reusable UI primitives
│   └── *.astro        # Feature components
├── content/
│   ├── blog/          # Blog posts (.md, .mdx)
│   ├── notes/         # Short notes
│   └── config.ts      # Collection schemas
├── data/
│   └── authors.json   # Author data
├── layouts/
│   ├── BaseLayout.astro
│   └── BlogPost.astro
├── lib/
│   ├── content-utils.ts
│   ├── mailerlite.ts
│   └── reading-time.ts
├── pages/
│   ├── api/           # API routes
│   ├── blog/          # Blog pages
│   └── index.astro
└── styles/
    ├── global.css
    └── print.css
```

---

## Common Pitfalls to Avoid

1. **Don't use `client:load` unnecessarily** - Most components don't need client JS
2. **Don't hardcode colors** - Use CSS custom properties for theming
3. **Don't forget `alt` on images** - Schema should enforce this
4. **Don't use `innerHTML`** - Use Astro's `set:html` directive if needed
5. **Don't skip error boundaries** - Wrap async operations in try/catch
6. **Don't ignore TypeScript errors** - Fix them, don't suppress
7. **Don't create components for one-time use** - Inline is fine
8. **Don't over-abstract early** - Wait for patterns to emerge

---

## Testing Expectations

### Before Committing
1. Run `npm run build` - must complete without errors
2. Run `npm run preview` - manually test key pages
3. Check browser console - no errors or warnings
4. Test dark mode toggle
5. Test on mobile viewport (Chrome DevTools)

### Accessibility Checks
- Run Lighthouse accessibility audit (aim for 100)
- Tab through all interactive elements
- Test with reduced motion preference enabled
