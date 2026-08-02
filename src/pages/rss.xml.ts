import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts } from '../lib/content-utils';

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  const site = context.site ?? new URL('https://digital-divide.com');
  const selfUrl = new URL('rss.xml', site).href;

  return rss({
    title: 'Digital Divide',
    description: 'Essays exploring technology, culture, and the spaces between.',
    site,
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
      dc: 'http://purl.org/dc/elements/1.1/',
    },
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.description,
      link: `/essays/${post.id}/`,
      categories: post.data.tags,
      // RSS 2.0's <author> must be an email address, which post.data.author
      // isn't — use the Dublin Core name element instead.
      customData: `<dc:creator>${escapeXml(post.data.author)}</dc:creator>`,
    })),
    customData: [
      `<language>en-us</language>`,
      `<atom:link href="${selfUrl}" rel="self" type="application/rss+xml"/>`,
      `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    ].join(''),
    stylesheet: '/rss/styles.xsl',
  });
}
