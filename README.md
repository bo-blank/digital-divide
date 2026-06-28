# Digital Divide

A personal blog and publishing platform — long-form essays and short notes — styled after *The New Yorker*. Built with Astro 5 and Tailwind CSS 4.

> **Status: Work in progress.** The site is under active development and not yet publicly launched.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Astro 7](https://astro.build) (static site generation) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) + [DaisyUI 5](https://daisyui.com) |
| Content | Astro Content Collections (MDX) |
| Typography | Fraunces (headings) · Lora (body) · Inter (UI) |
| Newsletter | MailerLite |
| Search | Pagefind (planned) |
| Language | TypeScript (strict) |

## Design

Warm off-white backgrounds, deep charcoal text, and pastel accents (sage green, dusty rose, periwinkle). Full dark mode support via CSS custom properties.

## Getting Started

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and fill in your values before enabling newsletter features:

```env
MAILERLITE_API_KEY=
PUBLIC_SITE_URL=
PUBLIC_PREVIEW_MODE=false
```

## Project Structure

```text
src/
├── components/     # Reusable Astro components
├── content/        # Blog posts and notes (MDX)
├── layouts/        # Page layouts
├── lib/            # Utility functions
├── pages/          # File-based routing
└── styles/         # Global CSS
```

## Development Notes

- `/moodboard` — dev-only page for visual reference; redirects to home in production
- Draft posts are visible in dev mode and hidden from production builds
- Run `npm run build` before committing — the build must pass

## Roadmap

See [ROADMAP.md](ROADMAP.md) for the full implementation plan across eight phases: content infrastructure, design system, blog features, newsletter, search, SEO, accessibility, and deployment.
