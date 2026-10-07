import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { entrySlug, getPublishedPosts } from './content-utils';
import { localeMeta, type Lang } from '../i18n/config';
import { localePath } from '../i18n/routing';
import { useTranslations } from '../i18n/ui';

function escapeXml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * One locale's RSS feed.
 *
 * Each locale gets its own feed at its own URL (/rss.xml, /de/rss.xml) rather
 * than one mixed feed: a reader who subscribes from the German site should not
 * start receiving English essays, and <language> can only name one.
 */
export async function buildFeed(context: APIContext, lang: Lang): Promise<Response> {
  const { t } = useTranslations(lang);
  const posts = await getPublishedPosts(lang);
  const site = context.site ?? new URL('https://digital-divide.com');
  const selfUrl = new URL(localePath(lang, '/rss.xml').slice(1), site).href;

  return rss({
    title: t('rss.title'),
    description: t('rss.description'),
    site,
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
      dc: 'http://purl.org/dc/elements/1.1/',
    },
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.description,
      link: localePath(lang, `/essays/${entrySlug(post.id)}/`),
      categories: post.data.tags,
      // RSS 2.0's <author> must be an email address, which post.data.author
      // isn't — use the Dublin Core name element instead.
      customData: `<dc:creator>${escapeXml(post.data.author)}</dc:creator>`,
    })),
    customData: [
      `<language>${localeMeta[lang].rssLanguage}</language>`,
      `<atom:link href="${selfUrl}" rel="self" type="application/rss+xml"/>`,
      `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    ].join(''),
    stylesheet: '/rss/styles.xsl',
  });
}
