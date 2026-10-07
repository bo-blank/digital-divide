import type { APIContext } from 'astro';
import { buildFeed } from '../lib/feed';

export async function GET(context: APIContext) {
  return buildFeed(context, 'en');
}
