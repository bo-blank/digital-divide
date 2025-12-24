# Digital Divide Blog - Roadmap to Substack-like Platform

## Project Vision
Transform this minimal Astro.js site into a feature-rich publishing platform inspired by Substack's functionality and The New Yorker's refined aesthetic. Focus on elegant typography, generous whitespace, subtle pastel accents, and a clean reading experience for long-form essays and short updates.

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

**Files to create:**
- `src/content/config.ts`
- `src/content/blog/` (directory)
- `src/content/notes/` (directory)

### 1.2 Type-Safe Data Layer
**Goal:** Create utility functions for content querying and filtering

**Tasks:**
- Build helper functions for fetching posts by series, tags, date
- Create sorting utilities (newest first, by popularity)
- Implement draft filtering for production builds
- Add reading time calculation utility

**Files to create:**
- `src/lib/content-utils.ts`
- `src/lib/reading-time.ts`

---

## Phase 2: Design System & Visual Identity

### 2.1 Typography System
**Goal:** Implement New Yorker-inspired serif typography with Tailwind

**Tasks:**
- Install Google Fonts: Crimson Pro (headings), Lora (body), Inter (UI elements)
- Configure Tailwind with custom font families
- Define typographic scale (h1-h6, body, captions)
- Set up prose classes with generous line-height (1.7-1.8)
- Configure hyphenation and text rendering optimization

**Files to modify:**
- `src/styles/global.css`
- `tailwind.config.mjs` (to be created)

### 2.2 Color Palette
**Goal:** Define a minimal color scheme with pastel accents

**Tasks:**
- Define core colors:
  - Background: Warm off-white (#FAFAF8)
  - Text: Deep charcoal (#1A1A1A)
  - Accent: Muted sage green (#A8BCA1)
  - Secondary: Dusty rose (#D4A5A5)
  - Tertiary: Soft periwinkle (#B4C5E4)
- Configure Tailwind color variables
- Set up dark mode considerations (optional)

**Files to modify:**
- `tailwind.config.mjs`
- `src/styles/global.css`

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

**Files to create:**
- `src/layouts/BlogPost.astro`
- `src/components/TableOfContents.astro`
- `src/components/ShareButtons.astro`

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

**Files to create:**
- `src/pages/blog/index.astro`
- `src/pages/blog/[...page].astro` (pagination)
- `src/pages/blog/[slug].astro` (individual posts)
- `src/pages/notes/index.astro`
- `src/pages/notes/[slug].astro`
- `src/components/PostCard.astro`
- `src/components/Pagination.astro`

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

## Phase 4: Engagement Features

### 4.1 Newsletter Subscription (MailerLite)
**Goal:** Collect email subscribers with a simple, elegant form

**Tasks:**
- Integrate with MailerLite API for subscriber management
- Create subscribe form component with:
  - Email input with validation
  - Privacy-conscious messaging
  - Inline and floating variants
- Add subscribe CTA to:
  - Homepage hero
  - Blog post footer
  - Dedicated `/subscribe` page
- Implement API route for MailerLite form submission

**Files to create:**
- `src/components/SubscribeForm.astro`
- `src/pages/subscribe.astro`
- `src/pages/api/subscribe.ts` (API route for MailerLite)

### 4.2 Author Profiles
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

---

## Phase 5: Notes/Short Posts
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

## Phase 6: Email Newsletter Integration (MailerLite)

### 6.1 Email Template Design
**Goal:** Create HTML email templates matching site aesthetic

**Tasks:**
- Design responsive HTML email template for MailerLite
- Match typography and color palette
- Support both plain text and HTML versions
- Add unsubscribe and preference links
- Test across email clients (Gmail, Outlook, Apple Mail)

**Files to create:**
- `src/emails/newsletter-template.html`
- `src/lib/email-generator.ts`

### 6.2 Newsletter Sending System
**Goal:** Send new posts to subscribers via MailerLite

**Tasks:**
- Integrate with MailerLite API for campaign creation
- Create webhook/API route to trigger sends on publish
- Add email preview functionality
- Implement scheduling (optional)
- Use MailerLite's subscriber management features

**Files to create:**
- `src/pages/api/send-newsletter.ts`
- `src/lib/mailerlite.ts`

---

## Phase 7: Discovery & Navigation

### 7.1 Search Functionality
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

### 7.2 Enhanced Homepage
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

### 7.3 About & Static Pages
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

## Phase 8: Performance & SEO

### 8.1 Image Optimization
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

### 8.2 SEO & Metadata
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

**Files to create:**
- `src/components/SEO.astro`
- `public/robots.txt`
- `src/pages/rss.xml.ts`

### 8.3 Analytics & Monitoring
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

## Phase 9: Polish & Details

### 9.1 Artsy Design Details
**Goal:** Add subtle touches that elevate the design

**Tasks:**
- Design custom dropcaps for first paragraph
- Add decorative dividers between sections
- Create pull quotes styling
- Design elegant blockquote treatment
- Add subtle hover states and transitions
- Implement smooth page transitions (View Transitions API)

**Files to modify:**
- `src/styles/global.css`
- `src/layouts/BlogPost.astro`

### 9.2 Accessibility
**Goal:** Ensure the site is usable by everyone

**Tasks:**
- Audit with axe DevTools or Lighthouse
- Add proper ARIA labels to all interactive elements
- Ensure keyboard navigation works everywhere
- Test with screen readers
- Verify color contrast ratios (WCAG AA minimum)
- Add skip-to-content link

**Files to audit/modify:**
- All component and layout files

### 9.3 Print Stylesheet
**Goal:** Beautiful printed articles (very New Yorker)

**Tasks:**
- Create print-specific CSS
- Remove navigation and UI chrome
- Optimize typography for paper
- Add page break controls
- Include URL at end of printed page

**Files to create:**
- `src/styles/print.css`

---

## Phase 10: Deployment & Launch

### 10.1 Build Configuration
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

### 10.2 Hosting & Domain
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

### 10.3 Launch Checklist
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
- **Fonts:** Crimson Pro (headings), Lora (body), Inter (UI)
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
6. `src/layouts/BlogPost.astro` - Post reading experience
7. `src/pages/blog/index.astro` - Blog archive
8. `src/components/SubscribeForm.astro` - Newsletter signup
9. `src/pages/index.astro` - Homepage redesign
10. `src/components/Header.astro` - Navigation

### Medium Priority (Enhancement)
11. `src/pages/series/[series].astro` - Series collections
12. `src/pages/authors/[author].astro` - Author profiles
13. `src/components/SEO.astro` - Metadata management
14. `src/pages/rss.xml.ts` - RSS feed
15. `src/lib/mailerlite.ts` - MailerLite integration

---

## Estimated Scope

**Minimal Viable Blog (Phases 1-3):** ~20-25 hours
- Core content system, design system, basic blog functionality

**Feature-Complete Platform (Phases 1-7):** ~50-65 hours
- All content types, newsletter with MailerLite, search, email integration

**Polished Launch (All Phases):** ~80-100 hours
- Everything above plus performance optimization, analytics, accessibility audit

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

---

## Next Steps

1. **Review this roadmap** - Adjust priorities based on your timeline
2. **Set up MailerLite account** - Create API keys for integration
3. **Start with Phase 1** - Set up content collections with sample posts
4. **Design in parallel** - Begin Phase 2 while content infrastructure builds
5. **Iterate visually** - Get the typography and spacing feeling right early

Ready to start building? We'll tackle this systematically, phase by phase.
