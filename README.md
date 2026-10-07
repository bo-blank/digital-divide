# Digital Divide

A personal blog and publishing platform — long-form essays and short notes — styled after *The New Yorker*, in English and German. Built with Astro 7 and Tailwind CSS 4.

> **Status: Work in progress.** The site is under active development and not yet publicly launched.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Astro 7](https://astro.build) (static site generation) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) + [DaisyUI 5](https://daisyui.com) + Typography plugin |
| Content | Astro Content Collections (MDX) |
| CMS | [Keystatic](https://keystatic.com) (local, dev only) |
| i18n | English (default, unprefixed) · German at `/de/*` |
| Typography | Fraunces (headings) · Lora (body) · Inter (UI) · Caveat (notes) — self-hosted |
| Newsletter | MailerLite (planned) |
| Search | Pagefind (planned) |
| Language | TypeScript (strict) |

## Features

- **Essays** with cover images, reading time, table of contents, series navigation, related posts and share buttons
- **Notes** — short posts rendered as paper cards
- **Tags and series** index pages, paginated essay listing, RSS feeds (`/rss.xml`, `/de/rss.xml`), sitemap with `hreflang` alternates
- **German locale** — all content translated; translations are linked so the language switcher and `hreflang` tags pair up per page
- **Dark mode** via CSS custom properties

## Design

Warm off-white backgrounds, deep charcoal text, and pastel accents (sage green, dusty rose, periwinkle). Fonts are committed under `src/assets/fonts/` (OFL licensed) rather than loaded from Google Fonts, so builds need no network access and no visitor data goes to a third party.

## Getting Started

```bash
npm install
npm run dev        # http://localhost:4321
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server, including the Keystatic admin |
| `npm run build` | Static production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run og` | Regenerate the fallback social card `public/og-default.png` (downloads fonts, so needs network access) |

No environment variables are required yet. Once the newsletter integration lands, it will need:

```env
MAILERLITE_API_KEY=
PUBLIC_SITE_URL=
PUBLIC_PREVIEW_MODE=false
```

## Editing Content

Run `npm run dev` and open [`/keystatic`](http://localhost:4321/keystatic). The admin writes MDX straight into `src/content/` in the working tree, so changes are committed like any other file. It covers essays and notes in both languages, the About and Privacy pages, and the tag vocabulary. Keystatic is loaded only under `astro dev` — it is not part of the deployed site.

Content can also be edited by hand:

```text
src/content/blog/*.mdx         # English essays
src/content/blog/de/*.mdx      # German essays (translationOf: <english-slug>)
src/content/notes/…            # same layout for notes
src/content/pages/…            # About and Privacy
src/data/tags/*.yaml           # tag labels (name + de)
```

Posts marked `draft: true` and posts with a future publish date are visible in dev and left out of production builds.

## Project Structure

```text
src/
├── assets/           # Cover images, figures, self-hosted fonts
├── components/       # Reusable Astro components
│   ├── mdx/          # Components available inside MDX (Callout, Figure)
│   └── pages/        # Page bodies shared by both locales
├── content/          # Essays, notes and pages (MDX); German under de/
├── data/tags/        # Tag vocabulary and translated labels
├── i18n/             # Locale config, URL builder, UI strings
├── layouts/          # Page layouts
├── lib/              # Content queries and utilities
├── pages/            # English routes (thin wrappers)
│   └── de/           # German routes (mirror of the above)
├── styles/           # Global CSS and design tokens
└── content.config.ts # Collection schemas
keystatic.config.ts   # CMS configuration
```

## Development Notes

- `/moodboard` — dev-only page for visual reference; redirects to home in production
- Run `npm run build` before committing — the build must pass
- Internal links go through `localePath()` and `entrySlug()` — never hardcode `/de` or use a raw entry id in a URL. See [CLAUDE.md](CLAUDE.md) for the full i18n and Keystatic conventions.
- **Deployment:** a static host serves the root `404.html` for every miss, so routing `/de/*` misses to the German 404 page needs a host rewrite rule.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for the full implementation plan. Next up: newsletter integration, Pagefind search, SEO and accessibility passes, and deployment.
