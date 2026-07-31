# Digital Divide Blog - Roadmap to Substack-like Platform

## Project Vision

Transform this minimal Astro.js site into a feature-rich publishing platform inspired by Substack's functionality and The New Yorker's refined aesthetic. Focus on elegant typography, generous whitespace, subtle pastel accents, and a clean reading experience for long-form essays and short updates.

---

## Success Criteria by Phase

| Phase | Complete When |
| --------- | ------------------ |
| **Phase 1** | Content renders at `/blog/test-post`, reading time displays, drafts hidden in prod |
| **Phase 2** | Typography matches design system, dark mode toggles correctly, all layouts responsive |
| **Phase 3** | Blog archive paginated, ToC generates, related posts appear, RSS validates |
| **Phase 4** | Newsletter signup works end-to-end with MailerLite, double opt-in confirmed |
| **Phase 5** | Search returns relevant results, homepage shows featured/recent content |
| **Phase 6** | Lighthouse performance 90+, all meta tags render, social previews work |
| **Phase 7** | WCAG 2.1 AA audit passes, View Transitions smooth, all E2E tests green |
| **Phase 8** | Site deployed to production, all checklist items verified |

---

## Phase 1: Foundation & Content Infrastructure

### 1.1 Content Collections Setup

**Goal:** Establish a flexible content management system using Astro Content Collections

**Tasks:**

- Create `src/content/config.ts` to define content schemas
- Set up two content collections:
- `blog/` - Long-form essays with rich metadata
- `notes/` - Short updates/quick thoughts
- Define content schemas with fields:
- Core: title, description, publishDate, author, draft status
- Taxonomy: tags, series, category
- Media: coverImage
- Create sample content in each collection type

**MDX Support:**

- Install `@astrojs/mdx` integration
- Configure MDX in `astro.config.mjs`
- Create reusable MDX components (Callout, CodeBlock, Figure, etc.)

**Draft Preview System:**

- Environment variable for preview mode (`PUBLIC_PREVIEW_MODE`)
- Development-only draft visibility with visual indicator
- Preview URL generation for sharing drafts

**Files to create:**

- `src/content/config.ts`
- `src/content/blog/` (directory)
- `src/content/notes/` (directory)
- `src/components/mdx/Callout.astro`
- `src/components/mdx/Figure.astro`

### 1.2 Type-Safe Data Layer

**Goal:** Create utility functions for content querying and filtering

**Tasks:**

- Build helper functions for fetching posts by series, tags, date
- Create sorting utilities (newest first, by popularity)
- Implement draft filtering for production builds
- Add reading time calculation utility

**Content Scheduling:**

- `publishDate` handling for future-dated posts
- Build-time filtering of unpublished content (posts with future dates)
- Optional: scheduled builds via hosting platform (Vercel cron, GitHub Actions)

**Files to create:**

- `src/lib/content-utils.ts`
- `src/lib/reading-time.ts`

---

## Phase 2: Design System & Visual Identity

### 2.1 Typography System

**Goal:** Implement New Yorker-inspired serif typography with Tailwind

**Tasks:**

- Install Google Fonts: Fraunces (headings), Lora (body), Inter (UI elements)
- Configure Tailwind with custom font families
- Define typographic scale (h1-h6, body, captions)
- Set up prose classes with generous line-height (1.7-1.8)
- Configure hyphenation and text rendering optimization

**Files to modify:**

- `src/styles/global.css`
- `tailwind.config.mjs` (to be created)

### 2.2 Color Palette & Dark Mode

**Goal:** Define a minimal color scheme with pastel accents and full dark mode support

**Tasks:**

- Define core colors:
- Background: Warm off-white (#FAFAF8)
- Text: Deep charcoal (#1A1A1A)
- Accent: Muted sage green (#A8BCA1)
- Secondary: Dusty rose (#D4A5A5)
- Tertiary: Soft periwinkle (#B4C5E4)
- Configure Tailwind color variables using CSS custom properties

**Dark Mode Implementation:**

- Define dark mode color palette (inverted with appropriate contrast)
- System preference detection (`prefers-color-scheme: dark`)
- Theme toggle component with localStorage persistence
- Configure Tailwind dark mode (class strategy for manual toggle)
- Smooth transition between themes
- Respect `prefers-reduced-motion` for theme transitions

**Files to modify:**

- `tailwind.config.mjs`
- `src/styles/global.css`

**Files to create:**

- `src/components/ThemeToggle.astro`

### 2.3 Layout Components

**Goal:** Build reusable layout primitives

**Tasks:**

- Create `BaseLayout.astro` - Master layout with metadata, fonts
- Create `Container.astro` - Max-width container with generous margins
- Create `Header.astro` - Minimalist site navigation
- Create `Footer.astro` - Simple footer with links
- Implement responsive design (mobile-first)

**Files to create:**

- `src/layouts/BaseLayout.astro`
- `src/components/Container.astro`
- `src/components/Header.astro`
- `src/components/Footer.astro`

---

## Phase 3: Core Blog Features

### 3.1 Blog Post Template

**Goal:** Design the reading experience for long-form content

**Tasks:**

- Create `BlogPost.astro` layout with:
- Serif headline with generous top margin
- Author byline with date and reading time
- Cover image with caption support
- Optimized prose styling (Tailwind typography)
- Series indicator if post is part of a collection
- Implement Table of Contents for long articles
- Add social share buttons (minimal, icon-only)
- Add "Subscribe" CTA at bottom of post

**Code Syntax Highlighting:**

- Configure Shiki (built into Astro) with custom theme
- Style code blocks to match design system
- Add copy-to-clipboard button for code blocks
- Support line highlighting and line numbers
- Create `<CodeBlock>` MDX component for enhanced features

**Heading Anchor Links:**

- Auto-generate heading IDs using rehype-slug
- Add anchor links on hover (rehype-autolink-headings)
- Smooth scroll-to-anchor behavior
- Optional: URL hash updates on scroll (Intersection Observer)

**Image Captions:**

- `<figure>` and `<figcaption>` styling for prose
- Create `<Figure>` MDX component with alt text enforcement
- Support image attribution/credits

**Files to create:**

- `src/layouts/BlogPost.astro`
- `src/components/TableOfContents.astro`
- `src/components/ShareButtons.astro`
- `src/components/CopyButton.astro`

### 3.2 Blog Archive & Listing Pages

**Goal:** Display posts in an elegant, scannable format

**Tasks:**

- Create `/blog` index page with:
- Featured post (latest or pinned)
- Chronological list of posts with excerpts
- Pagination (10-15 posts per page)
- Create `/notes` page for short updates
- Implement filtering by tag and series
- Add RSS feed generation

**Related Posts:**

- Algorithm for related posts (by shared tags, same series, or recent)
- "You might also like" component at post footer
- Configurable number of related posts (default: 3)
- Fallback to recent posts if no strong matches

**Files to create:**

- `src/pages/blog/index.astro`
- `src/pages/blog/[...page].astro` (pagination)
- `src/pages/blog/[slug].astro` (individual posts)
- `src/pages/notes/index.astro`
- `src/pages/notes/[slug].astro`
- `src/components/PostCard.astro`
- `src/components/Pagination.astro`
- `src/components/RelatedPosts.astro`
- `src/lib/related-posts.ts`

### 3.3 Taxonomies (Tags & Series)

**Goal:** Organize content by topic and thematic collections

**Tasks:**

- Create tag archive pages (`/tags/[tag]`)
- Create series pages (`/series/[series]`)
- Build tag cloud or list component
- Add breadcrumb navigation for series
- Display "Next in series" navigation on posts

**Files to create:**

- `src/pages/tags/index.astro`
- `src/pages/tags/[tag].astro`
- `src/pages/series/index.astro`
- `src/pages/series/[series].astro`
- `src/components/SeriesNav.astro`
- `src/components/TagList.astro`

---

## Phase 4: Newsletter System (MailerLite)

### 4.1 Subscriber Management

**Goal:** Collect email subscribers with a simple, elegant form and GDPR compliance

**Tasks:**

- Integrate with MailerLite API for subscriber management
- Create subscribe form component with:
- Email input with client-side validation
- Privacy-conscious messaging
- Inline and floating variants
- Add subscribe CTA to:
- Homepage hero
- Blog post footer
- Dedicated `/subscribe` page
- Implement API route for MailerLite form submission

**GDPR Compliance & Double Opt-in:**

- Double opt-in confirmation flow via MailerLite
- GDPR compliance checkbox ("I agree to receive emails...")
- Link to privacy policy in form
- Clear unsubscribe instructions

**Form Error Handling:**

- Client-side validation with inline error messages
- Server error handling (rate limits, API failures, duplicate emails)
- Loading states during submission (spinner, disabled button)
- Toast/notification system for success/error feedback
- Honeypot field for spam prevention

**Files to create:**

- `src/components/SubscribeForm.astro`
- `src/components/Toast.astro`
- `src/pages/subscribe.astro`
- `src/pages/api/subscribe.ts`
- `src/lib/mailerlite.ts`

### 4.2 Email Templates & Campaigns

**Goal:** Create HTML email templates matching site aesthetic and send newsletters

**Tasks:**

- Design responsive HTML email template for MailerLite
- Match typography and color palette (inline CSS for email clients)
- Support both plain text and HTML versions
- Add unsubscribe and preference links
- Test across email clients (Gmail, Outlook, Apple Mail)

**Newsletter Sending:**

- Integrate with MailerLite API for campaign creation
- Create admin/webhook route to trigger sends on publish (optional)
- Add email preview functionality
- Use MailerLite's built-in scheduling features

**Files to create:**

- `src/emails/newsletter-template.html`
- `src/lib/email-generator.ts`
- `src/pages/api/send-newsletter.ts` (optional)

### 4.3 Author Profiles

**Goal:** Support single or multiple authors with bio pages

**Tasks:**

- Create author data structure (JSON or frontmatter)
- Build author profile pages (`/authors/[author]`)
- Add author byline component with photo and bio
- List all posts by author on profile page
- Add social links (Twitter, website, etc.)

**Files to create:**

- `src/data/authors.json`
- `src/pages/authors/[author].astro`
- `src/components/AuthorByline.astro`
- `src/components/AuthorCard.astro`

### 4.4 Notes/Short Posts

**Goal:** Quick, Twitter-like updates with minimal chrome

**Tasks:**

- Create `Note.astro` layout (minimal, no cover image)
- Display notes in stream format on `/notes`
- Add timestamp and optional title
- Support threading or replies (optional)
- Allow embedding media (images, videos)

**Files to create:**

- `src/layouts/Note.astro`
- `src/components/NoteCard.astro`

---

## Phase 5: Discovery & Navigation

### 5.1 Search Functionality

**Goal:** Allow readers to search all content

**Tasks:**

- Choose search solution:
- **Option A:** Pagefind (static, privacy-friendly) - Recommended
- **Option B:** Fuse.js (client-side)
- **Option C:** Algolia (hosted, powerful)
- Implement search UI component
- Add search to header/navigation
- Create `/search` results page
- Index all content types (blog, notes)

**Files to create:**

- `src/components/SearchBar.astro`
- `src/pages/search.astro`
- `src/lib/search.ts`

### 5.2 Enhanced Homepage

**Goal:** Curate the best entry point for new readers

**Tasks:**

- Design homepage with:
- Hero section with site description
- Featured/pinned post
- Recent posts (3-5)
- Latest notes (2-3)
- Newsletter signup CTA
- Series/collections showcase
- Add smooth scroll animations
- Implement lazy loading for images

**Files to modify:**

- `src/pages/index.astro`
- `src/components/Hero.astro` (to be created)
- `src/components/FeaturedPost.astro` (to be created)

### 5.3 About & Static Pages

**Goal:** Tell the story behind the publication

**Tasks:**

- Create `/about` page (publication mission and story)
- Create `/archive` page (chronological list of all posts)
- Create `/privacy` and `/terms` pages
- Create custom 404 page with navigation

**Files to create:**

- `src/pages/about.astro`
- `src/pages/archive.astro`
- `src/pages/privacy.astro`
- `src/pages/404.astro`

---

## Phase 6: Performance & SEO

### 6.1 Image Optimization

**Goal:** Fast loading images without sacrificing quality

**Tasks:**

- Configure Astro Image component for all images
- Set up responsive image sizes
- Implement blur-up placeholder technique
- Add WebP/AVIF format conversion
- Configure CDN (optional - Cloudflare, Vercel)

**Files to modify:**

- `astro.config.mjs`
- All layout components using images

### 6.2 SEO & Metadata

**Goal:** Maximize discoverability and social sharing

**Tasks:**

- Create SEO component with:
- Dynamic meta tags (title, description)
- Open Graph tags for social media
- Twitter Card support
- Canonical URLs
- Structured data (JSON-LD for articles)
- Generate sitemap (already configured)
- Create `robots.txt`
- Add RSS feed with full content

**Automated OG Image Generation:**

- Set up Satori or @vercel/og for dynamic social images
- Design template matching site aesthetic (typography, colors)
- Generate images at build time for each post
- Include post title, author, and site branding
- Test previews with social media debuggers

**Files to create:**

- `src/components/SEO.astro`
- `src/pages/og/[...slug].png.ts` (OG image endpoint)
- `public/robots.txt`
- `src/pages/rss.xml.ts`

### 6.3 Analytics & Monitoring

**Goal:** Understand readership without invading privacy

**Tasks:**

- Choose analytics solution:
- **Option A:** Plausible (privacy-focused, paid)
- **Option B:** Fathom (simple, privacy-focused, paid)
- **Option C:** Umami (self-hosted, free)
- **Option D:** Google Analytics 4 (free, but privacy concerns)
- Implement tracking script
- Set up custom events (newsletter signups, shares)
- Add cookie consent banner if required

**Files to modify:**

- `src/layouts/BaseLayout.astro`
- `src/components/CookieConsent.astro` (optional)

---

## Phase 7: Polish & Details

### 7.1 Artsy Design Details

**Goal:** Add subtle touches that elevate the design

**Tasks:**

- Design custom dropcaps for first paragraph
- Add decorative dividers between sections
- Create pull quotes styling
- Design elegant blockquote treatment
- Add subtle hover states and transitions

**View Transitions Implementation:**

- Import `astro:transitions` in BaseLayout
- Add `<ViewTransitions />` component to head
- Define transition animations (fade, slide) for page navigation
- Add `transition:name` attributes to persistent elements:
- Header (persists across pages)
- Footer (persists across pages)
- Post titles (morph to full article view)
- Configure `transition:animate` for content areas
- Handle fallbacks for unsupported browsers (graceful degradation)
- Respect `prefers-reduced-motion` (disable animations)

**Files to modify:**

- `src/styles/global.css`
- `src/layouts/BaseLayout.astro`
- `src/layouts/BlogPost.astro`
- `src/components/Header.astro`

### 7.2 Accessibility

**Goal:** Ensure the site is usable by everyone (WCAG 2.1 AA compliance)

**Tasks:**

- Audit with axe DevTools or Lighthouse
- Add proper ARIA labels to all interactive elements
- Ensure keyboard navigation works everywhere
- Test with screen readers (VoiceOver, NVDA)
- Verify color contrast ratios (WCAG AA minimum: 4.5:1 for text)
- Add skip-to-content link

**Specific Accessibility Checklist:**

- [ ] Focus management for modals/dropdowns (trap focus, return focus on close)
- [ ] Respect `prefers-reduced-motion` (disable animations system-wide)
- [ ] Form label associations (all inputs have associated labels)
- [ ] Error announcements for screen readers (aria-live regions)
- [ ] Touch target sizes (44x44px minimum for mobile)
- [ ] Heading hierarchy validation (no skipped levels)
- [ ] Alt text on all images (enforce in content schema)
- [ ] Visible focus indicators (outline or custom focus ring)
- [ ] Link text is descriptive (avoid "click here")
- [ ] Language attribute on `<html>` element
- [ ] Sufficient line spacing (1.5x minimum for body text)

**Files to audit/modify:**

- All component and layout files
- `src/content/config.ts` (add alt text validation)

### 7.3 Print Stylesheet

**Goal:** Beautiful printed articles (very New Yorker)

**Tasks:**

- Create print-specific CSS
- Remove navigation and UI chrome
- Optimize typography for paper
- Add page break controls
- Include URL at end of printed page

**Files to create:**

- `src/styles/print.css`

### 7.4 Testing Strategy

**Goal:** Ensure quality and prevent regressions

**Visual Regression Testing:**

- Set up Percy or Chromatic for visual snapshots
- Configure CI integration for PR previews
- Define critical pages for visual testing (homepage, blog post, subscribe)

**End-to-End Testing:**

- Set up Playwright for E2E tests
- Test critical user flows:
- Newsletter subscription (form submit, success/error states)
- Navigation between pages
- Search functionality
- Dark mode toggle
- Run tests on CI before deploy

**Accessibility Testing Automation:**

- Integrate axe-core into test suite
- Fail builds on a11y violations
- Generate accessibility reports

**Files to create:**

- `playwright.config.ts`
- `tests/e2e/` (directory)
- `.github/workflows/test.yml` (or equivalent CI config)

---

## Phase 8: Deployment & Launch

### 8.1 Build Configuration

**Goal:** Optimize production build

**Tasks:**

- Configure Astro for static site generation
- Set up environment variables for MailerLite API
- Enable compression and minification
- Test build locally
- Verify all dynamic routes generate correctly

**Files to modify:**

- `astro.config.mjs`
- `.env.example` (to be created)

### 8.2 Hosting & Domain

**Goal:** Deploy to production

**Tasks:**

- Choose hosting platform:
- **Option A:** Vercel (recommended - zero config)
- **Option B:** Netlify (great DX)
- **Option C:** Cloudflare Pages (fast, cheap)
- **Option D:** GitHub Pages (free)
- Set up custom domain
- Configure SSL certificate
- Set up deployment from git repository
- Add deployment previews for branches

### 8.3 Launch Checklist

**Goal:** Ensure everything works before going public

**Tasks:**

- [ ] Test all pages and routes
- [ ] Verify newsletter signup works with MailerLite
- [ ] Check RSS feed validates
- [ ] Verify sitemap generates correctly
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit (aim for 90+ scores)
- [ ] Check social media previews (Twitter, Facebook, LinkedIn)
- [ ] Set up email forwarding (if custom domain)
- [ ] Write launch announcement post
- [ ] Share with friends for feedback
- [ ] Set up regular backup strategy

---

## Technology Stack Summary

### Core

- **Framework:** Astro 5.x (static site generation)
- **Styling:** Tailwind CSS 4.x with Typography plugin
- **Content:** Astro Content Collections (Markdown/MDX)
- **TypeScript:** Strict mode enabled

### Integrations

- **Email Service:** MailerLite (subscriber management & newsletter delivery)
- **Search:** Pagefind (static, privacy-friendly)
- **Analytics:** Plausible or Umami (privacy-focused)
- **Images:** Astro Image with Sharp

### Design

- **Fonts:** Fraunces (headings), Lora (body), Inter (UI)
- **Colors:** Warm neutrals with sage, rose, and periwinkle accents
- **Layout:** Max-width 720px prose, generous margins
- **Approach:** Mobile-first, progressively enhanced

---

## Critical Files to Create/Modify

### Immediate Priority (Foundation)

1. `src/content/config.ts` - Content collections schema
2. `tailwind.config.mjs` - Custom design tokens
3. `src/layouts/BaseLayout.astro` - Master layout
4. `src/styles/global.css` - Typography and color system
5. `src/pages/blog/[slug].astro` - Blog post pages

### High Priority (Core Features)

1. `src/layouts/BlogPost.astro` - Post reading experience
2. `src/pages/blog/index.astro` - Blog archive
3. `src/components/SubscribeForm.astro` - Newsletter signup
4. `src/pages/index.astro` - Homepage redesign
5. `src/components/Header.astro` - Navigation

### Medium Priority (Enhancement)

 1. `src/pages/series/[series].astro` - Series collections
 2. `src/pages/authors/[author].astro` - Author profiles
 3. `src/components/SEO.astro` - Metadata management
 4. `src/pages/rss.xml.ts` - RSS feed
 5. `src/lib/mailerlite.ts` - MailerLite integration

---

## Future Ideas (Deferred)

### Photo Essays

- Full-width image galleries with captions
- Lightbox functionality
- Multiple layout modes (grid, panoramic, stacked)
- EXIF data display

### Comments System

- Giscus (GitHub Discussions)
- Utterances (GitHub Issues)
- Webmention integration

### Progressive Web App (PWA)

- Service worker for offline reading of saved articles
- Web app manifest for installability
- Install prompt handling
- Offline fallback page with cached content

### Internationalization (i18n)

- Astro i18n routing setup (`/en/`, `/es/`, etc.)
- Content collections per locale
- Language switcher component in header
- RTL language support (Arabic, Hebrew)
- Date/time localization

### Content Migration Tools

- Import scripts for common platforms:
- WordPress (WXR format)
- Ghost (JSON export)
- Medium (export zip)
- Substack (export)
- Frontmatter normalization utility
- Image migration and optimization
- Redirect mapping for SEO preservation

---

## Next Steps

**Status (2026-07-31):** Phases 1-3 are complete. Phases 6 and 7 are partially
done. The list below is the concrete remaining work, ordered by impact, based
on a full audit of the codebase.

Recently closed (all merged to `main`): Astro upgraded to 7.1.6 and all
dependency advisories resolved; the daisyUI theme repaired (it had been written
against v4 variable names and was silently inert); element defaults moved into
`@layer base` so utility classes can override them; WCAG AA contrast on links,
buttons and page banners in both themes; reading time, nested anchors, the copy
button and the duplicate post landmark fixed; dark-mode flash eliminated;
future-dated posts no longer published; canonical URLs, OG images and article
metadata added; a 404 page and `robots.txt` created; series and tag URLs
slugified.

### NS.1 Newsletter — MailerLite (Phase 4)

**Goal:** Make the subscribe form actually work

`subscribe.astro` POSTs to `/api/subscribe`, which does not exist. The site
also has no adapter and builds fully static, so an API route cannot run even
once written — every signup on that page fails silently. Decide the hosting
approach first.

The footer form is a separate case: it is `action="/subscribe" method="get"`,
so it navigates rather than subscribing. That works, but the email the reader
typed arrives as a query string that `subscribe.astro` never reads, so they
have to type it a second time.

**Tasks:**

- Choose one: add an adapter (Netlify / Vercel / Node) and keep the API route,
  or post directly to a hosted MailerLite form endpoint and drop the route
- Create `src/lib/mailerlite.ts` and `src/pages/api/subscribe.ts`
- Double opt-in flow and a confirmation page
- Server-side email validation; keep the existing honeypot field
- Surface failures in the UI rather than only `console.error`
- Add `role="status"` / `role="alert"` to the form's result messages — they are
  currently toggled silently, and the form hides itself on submit, so screen
  reader users get no feedback at all
- Prefill the subscribe field from `?email=` so the footer hand-off is not a
  dead end

**Files to create:** `src/lib/mailerlite.ts`, `src/pages/api/subscribe.ts`
**Files to modify:** `astro.config.mjs`, `src/pages/subscribe.astro`, `src/components/Footer.astro`

### NS.2 Images & fonts (Phase 6.1)

**Goal:** Stop shipping oversized assets and third-party font requests

**Tasks:**

- Replace `passthroughImageService()` in `astro.config.mjs` — it disables all
  optimisation, so nothing is resized or converted
- `public/images/Divide gap person.jpg` is 5000x5000 and 766KB, served
  full-size on `/about`. Resize, convert, and rename it (the filename contains
  spaces, which is why the built path does too)
- Add a default 1200x630 OG image. Pages without a cover image currently fall
  back to a text-only social card; the existing photo is square and unusable
  for this
- Self-host Fraunces / Lora / Inter / Caveat instead of linking Google Fonts.
  Two reasons: the stylesheet is render-blocking in `<head>`, and hotlinking
  Google Fonts has been held to breach GDPR in German courts — relevant given
  the site ships a privacy policy
- Consider hosting the Unsplash cover images locally; all five posts hotlink them

**Files to modify:** `astro.config.mjs`, `src/layouts/BaseLayout.astro`, `src/pages/about.astro`

### NS.3 Remaining accessibility (Phase 7.2)

**Goal:** Finish WCAG 2.1 AA

**Tasks:**

- `--color-secondary` (3.99:1) and `--color-tertiary` (3.79:1) still fail AA for
  text. `#B04545` brings secondary to 5.32:1. Affects the "Trending" label,
  draft badges and the subscribe feature icons
- The collapsed mobile menu uses `max-h-0 opacity-0`, neither of which removes
  it from the tab order — five invisible links are focusable on mobile.
  Add `hidden`/`inert` or toggle `visibility`
- The menu button's `aria-label` is hardcoded "Open menu" and never updates, so
  it announces "Open menu, expanded" when it is the close action. It also needs
  `aria-controls`
- `Footer.astro` uses `<h6>` for its column titles, skipping h3-h5 on all 40
  pages. Should be `<h2>`
- Add `aria-label` to the unlabelled `<nav>` landmarks (main nav, trending
  topics, and three in the footer)
- Add `aria-hidden="true"` to decorative SVGs in `Header.astro`, `index.astro`
  and `subscribe.astro`
- `Footer.astro` has an orphan `<label>` with no `for`, conflicting with the
  input's `aria-label`
- `subscribe.astro` nests a link inside a `<label>`, so clicking the privacy
  link also toggles the consent checkbox
- Notes have an optional `title`, so an untitled note renders with no `<h1>`

### NS.4 Correctness & consistency

**Goal:** Close the remaining logic bugs found in the audit

**Tasks:**

- Dates are formatted with `toLocaleDateString` and no `timeZone` in nine
  places. `publishDate` is a date-only value parsed as UTC midnight, so
  building in a US timezone shifts every displayed date back a day while the
  `<time datetime>` attribute still says the original. Extract one shared
  `formatDate()` using `timeZone: 'UTC'`
- `src/content/blog/test-post.mdx` is real content ("Welcome to Digital
  Divide") published at `/blog/test-post/`. Rename the file and add a redirect
- `/series` and `/series/*` are unreachable from the UI — no header or footer
  link, and `SeriesNav` only renders when a series has more than one post
- `formatTagDisplay` is duplicated verbatim in `tags/index.astro` and
  `Header.astro`. Move to `src/lib/`
- Remove dead exports: `getPostsByTag`, `getPostsByCategory`, `getAllCategories`
  (`content-utils.ts`) and `getAdjacentSeriesPosts` (`related-posts.ts`).
  `category` is in the schema and set on every post but no route surfaces it —
  either build `/categories` or drop the field
- `getRelatedPosts` has no minimum score, so unrelated posts appear under
  "You might also like". Add a threshold or an explicit recency fallback
- RSS: add `<atom:link rel="self">` and `lastBuildDate`; `<author>` must be an
  email address per RSS 2.0, so use `<dc:creator>` for a name. Consider
  `content:encoded` for full-text, and syndicating notes
- `Pagination.astro` builds `/blog/2` while Astro emits `/blog/2/`, costing a
  redirect hop on hosts that enforce trailing slashes
- `BlogPostLayout` renders the ToC wrapper when there are more than 3 headings,
  but `TableOfContents` only renders content for more than 2 h2/h3 — a post
  with 4 h4s gets an empty box
- Decide on `PageBanner`: the `banner` variant accepts `src`/`alt` and silently
  discards them. Either drop the props at the two call sites or render the
  image. The teal strip currently looks deliberate

### NS.5 Search (Phase 5.1)

**Goal:** Make the archive navigable as it grows

Not started. See Phase 5.1 for the full task list — install Pagefind, add
`SearchBar.astro`, wire it into the header.

### NS.6 Project hygiene

**Goal:** Keep docs and tooling honest

**Tasks:**

- Add `check`, `lint` and `format` scripts to `package.json`. CLAUDE.md
  requires a passing build before commits but provides no lint or typecheck
  entry point
- `README.md` says "Astro 5" in prose and "Astro 7" in its table, and
  references a `.env.example` that does not exist — add it
- README and CLAUDE.md both describe the palette as sage / dusty rose /
  periwinkle; the implemented tokens are teal / red / blue
- This roadmap's "Critical Files" section references `tailwind.config.mjs`
  (Tailwind 4 is CSS-first — it does not exist) and `src/content/config.ts`
  (Astro 7 moved it to `src/content.config.ts`)
- Author pages (Phase 4.3) and `AuthorByline.astro` are still unbuilt, though
  `author` is populated on every post
- E2E tests and Lighthouse CI (Phase 7.4) are still unbuilt
