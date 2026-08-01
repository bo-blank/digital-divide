// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// https://astro.build/config
export default defineConfig({
  site: 'https://digital-divide.com',
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
      return !page.includes('/moodboard');
    }
  }), mdx()]
});
