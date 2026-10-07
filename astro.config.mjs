// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// The Keystatic admin UI is server-rendered, which a static build rejects
// without an adapter. With `storage: { kind: 'local' }` it edits the working
// tree directly, so it is a local authoring tool with nothing to do in a
// deployed build — loading it only under `astro dev` keeps `npm run build`
// producing the same fully static site as before.
// Switching keystatic.config.ts to GitHub storage to run the admin on the
// deployed site would mean dropping this gate and adding a server adapter.
const isDevServer = process.argv.includes('dev');

// https://astro.build/config
export default defineConfig({
  site: 'https://digital-divide.com',
  // English is the default locale and stays unprefixed, so every URL the site
  // has ever had keeps working untouched; German is served from /de/*, built
  // out of src/pages/de/. The locale list is mirrored in src/i18n/config.ts,
  // which is what the templates import — this block only teaches Astro the
  // routing shape (Astro.currentLocale, the sitemap integration below).
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  // The essays archive moved from /blog to /essays so the URL matches the
  // "Essays" label the nav, the footer and the page heading all already used.
  // These keep the old paths alive: any link, feed item or bookmark pointing
  // at /blog still lands on the right page.
  redirects: {
    '/blog': '/essays',
    '/blog/[slug]': '/essays/[slug]',
    '/blog/test-post': '/essays/welcome-to-digital-divide',
    '/essays/test-post': '/essays/welcome-to-digital-divide',
  },
  vite: {
    plugins: [tailwindcss()]
  },
  markdown: {
    processor: unified({
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'wrap',
            properties: {
              className: ['heading-link'],
            },
          },
        ],
      ],
    }),
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
  // Self-hosted rather than linked from fonts.googleapis.com. Two reasons: the
  // external stylesheet was render-blocking in <head>, and hotlinking Google
  // Fonts leaks reader IPs to Google, which German courts have held to breach
  // GDPR — awkward for a site that ships a privacy policy.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Fraunces',
      cssVariable: '--font-fraunces',
      weights: [400, 500, 600, 700],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'Times New Roman', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Lora',
      cssVariable: '--font-lora',
      weights: [400, 500, 600],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'Times New Roman', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Caveat',
      cssVariable: '--font-caveat',
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Segoe Print', 'Bradley Hand', 'cursive'],
    },
  ],
  integrations: [sitemap({
    filter: (page) => {
      // The Keystatic admin UI and its API are private tooling, not content.
      return !page.includes('/moodboard') && !page.includes('/keystatic');
    },
    // Emits <xhtml:link rel="alternate" hreflang> between /foo and /de/foo for
    // every page that exists in both. This pairs purely on the URL shape, so a
    // German essay with no English counterpart gets no bogus alternate — but it
    // also can't see the translationOf links, which is why the per-page
    // hreflang tags in BaseLayout are computed separately rather than derived
    // from here.
    i18n: {
      defaultLocale: 'en',
      locales: { en: 'en-US', de: 'de-DE' },
    },
  }), mdx(), ...(isDevServer ? [react(), keystatic()] : [])]
});
