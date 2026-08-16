import Callout from './Callout.astro';
import Figure from './Figure.astro';

/**
 * Components made available to MDX content at render time.
 *
 * Keystatic inserts these as bare JSX (`<Callout type="info">`) with no import
 * statement in the file, so `<Content />` has to be handed the mapping or the
 * build fails on an undefined component. The keys must match the component
 * names declared in keystatic.config.ts.
 */
export const mdxComponents = { Callout, Figure };
