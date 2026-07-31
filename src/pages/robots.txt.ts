import type { APIContext } from 'astro';

/**
 * Generated rather than a static public/robots.txt so the Sitemap line is
 * derived from `site` in astro.config.mjs and cannot drift from it.
 *
 * /moodboard is deliberately NOT disallowed: it already serves
 * <meta name="robots" content="noindex">, and blocking the crawl would stop
 * that tag from ever being read, which is what actually keeps it out of the
 * index. It is excluded from the sitemap in astro.config.mjs.
 */
export async function GET(context: APIContext) {
  const site = context.site ?? new URL('https://digital-divide.com');
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${new URL('sitemap-index.xml', site).href}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
