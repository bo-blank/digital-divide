import { config, collection, fields, singleton } from '@keystatic/core';
import { block, wrapper } from '@keystatic/core/content-components';

// Keystatic is configured to write exactly the frontmatter that
// src/content.config.ts already validates, so posts authored in the CMS and
// posts hand-written in an editor are the same artefact. Anything added here
// needs a matching field in the Zod schema, and vice versa.

// Cover images live in src/assets so Astro can resize and re-encode them
// (see the note in content.config.ts). Frontmatter references them relative to
// the content file — src/content/blog/*.mdx is two levels below src/ — which
// is the form Astro's `image()` helper resolves.
const COVER_DIRECTORY = 'src/assets/covers';
const COVER_PUBLIC_PATH = '../../assets/covers/';

// Inline figures live under src/ too, so they get the same resizing and
// re-encoding as covers. They need two different public paths for the same
// directory because the two ways an image reaches the page resolve differently:
//
//   - The Figure block writes JSX, and a `src` string prop is just a string.
//     Figure.astro turns it back into an asset with import.meta.glob, which
//     matches on project-root-absolute paths — hence the leading `/src/`.
//   - A plain markdown image in the body is resolved by Astro's remark plugin
//     relative to the content file, two levels below src/, like coverImage.
const FIGURE_DIRECTORY = 'src/assets/figures';
const FIGURE_COMPONENT_PATH = '/src/assets/figures/';
const FIGURE_MARKDOWN_PATH = '../../assets/figures/';

/**
 * The MDX components authors can insert, mirroring src/components/mdx/. Both
 * are passed to <Content /> in the essay and note routes — Keystatic writes
 * bare JSX with no import statement, so the render side has to supply them.
 */
const contentComponents = {
  Callout: wrapper({
    label: 'Callout',
    description: 'An aside for a caveat, warning or aside remark.',
    schema: {
      type: fields.select({
        label: 'Type',
        options: [
          { label: 'Info', value: 'info' },
          { label: 'Warning', value: 'warning' },
          { label: 'Success', value: 'success' },
          { label: 'Error', value: 'error' },
        ],
        defaultValue: 'info',
      }),
      title: fields.text({ label: 'Title', description: 'Optional heading.' }),
    },
  }),
  Figure: block({
    label: 'Figure',
    description: 'An image with an optional caption and credit line.',
    schema: {
      src: fields.image({
        label: 'Image',
        directory: FIGURE_DIRECTORY,
        publicPath: FIGURE_COMPONENT_PATH,
        validation: { isRequired: true },
      }),
      alt: fields.text({
        label: 'Alt text',
        description: 'Required — describes the image for screen readers.',
        validation: { isRequired: true },
      }),
      caption: fields.text({ label: 'Caption' }),
      credit: fields.text({ label: 'Credit' }),
      // No width/height: Figure.astro reads the intrinsic dimensions off the
      // imported asset, so there is nothing for an author to get wrong.
    },
  }),
};

// Where an image dragged straight into the editor body lands. Without this
// Keystatic drops it next to the entry file in src/content/, which puts binary
// assets in the content tree; pointing it at the figures directory keeps every
// inline image in one place. The path is the relative form because these are
// written as plain markdown images, not as the Figure component.
const bodyImageOptions = {
  image: {
    directory: FIGURE_DIRECTORY,
    publicPath: FIGURE_MARKDOWN_PATH,
  },
};

// Tags are slugified by the Zod schema at parse time, so "Digital Culture"
// typed here lands as "digital-culture" and formatTagDisplay restores the
// casing when rendering. Authors don't need to pre-slugify.
const tagsField = fields.array(fields.text({ label: 'Tag' }), {
  label: 'Tags',
  itemLabel: (props) => props.value,
  description: 'Free text — normalised to a slug when the site builds.',
});

/**
 * The editable parts of a standalone page. Shared by the /about and /privacy
 * singletons and matched field-for-field by the `pages` collection in
 * src/content.config.ts.
 *
 * Not every page uses every field — only /about has a tagline and a lead,
 * only /privacy shows an updated date — but the two share a schema so the
 * Zod side stays a single collection. An unused field is left blank and the
 * template simply doesn't render it.
 */
const pageSchema = {
  title: fields.text({
    label: 'Title',
    description: 'The page heading, and the browser tab title.',
    validation: { isRequired: true },
  }),
  description: fields.text({
    label: 'Description',
    multiline: true,
    description: 'Meta description for search results and social previews.',
    validation: { isRequired: true },
  }),
  tagline: fields.text({
    label: 'Tagline',
    description: 'One line under the heading. Used on About; leave blank to omit.',
  }),
  lead: fields.text({
    label: 'Lead paragraph',
    multiline: true,
    description: 'Opening paragraph, set larger than the body. Optional.',
  }),
  updatedDate: fields.date({
    label: 'Last updated',
    description: 'Shown as a "Last updated" line. Used on the privacy policy.',
  }),
  content: fields.mdx({
    label: 'Content',
    components: contentComponents,
    options: bodyImageOptions,
  }),
};

export default config({
  // Local storage reads and writes the working tree directly. Switching to
  // GitHub mode later only changes this block.
  storage: { kind: 'local' },
  ui: {
    brand: { name: 'Digital Divide' },
  },
  collections: {
    blog: collection({
      label: 'Essays',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'publishDate'],
      schema: {
        // The slug half of this field is the filename, which is also the URL
        // segment under /essays — existing files keep their current slugs.
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
          slug: {
            label: 'Slug',
            description: 'The URL segment under /essays.',
          },
        }),
        description: fields.text({
          label: 'Description',
          multiline: true,
          description: 'Used in listings, the RSS feed and social previews.',
          validation: { isRequired: true },
        }),
        publishDate: fields.date({
          label: 'Publish date',
          validation: { isRequired: true },
        }),
        updatedDate: fields.date({ label: 'Updated date' }),
        author: fields.text({ label: 'Author', defaultValue: 'Anonymous' }),
        draft: fields.checkbox({
          label: 'Draft',
          description: 'Drafts are visible in dev and excluded from builds.',
          defaultValue: false,
        }),
        tags: tagsField,
        series: fields.text({
          label: 'Series',
          description: 'Groups posts under /series. Leave blank for none.',
        }),
        coverImage: fields.object(
          {
            src: fields.image({
              label: 'Image',
              directory: COVER_DIRECTORY,
              publicPath: COVER_PUBLIC_PATH,
              validation: { isRequired: true },
            }),
            alt: fields.text({
              label: 'Alt text',
              description: 'Describes the image for screen readers.',
              validation: { isRequired: true },
            }),
            caption: fields.text({ label: 'Caption' }),
            position: fields.text({
              label: 'Focal point',
              description: 'CSS object-position, e.g. "center 100%".',
            }),
          },
          {
            label: 'Cover image',
            // Both halves are required together. Keystatic can't express "alt is
            // required only when src is set" — fields.object validates its
            // children unconditionally, and fields.conditional would serialise
            // as { discriminant, value }, a frontmatter shape no hand-written
            // post uses. So the CMS asks for a cover on every essay rather than
            // letting one through with an image and no alt text, which the Zod
            // schema rejects at load time anyway. The schema stays lenient, so
            // a hand-written post can still omit the cover entirely.
          }
        ),
        content: fields.mdx({
          label: 'Content',
          components: contentComponents,
          options: bodyImageOptions,
        }),
      },
    }),

    notes: collection({
      label: 'Notes',
      slugField: 'title',
      path: 'src/content/notes/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'publishDate'],
      schema: {
        title: fields.slug({
          name: { label: 'Title', validation: { isRequired: true } },
          slug: {
            label: 'Slug',
            description: 'The URL segment under /notes.',
          },
        }),
        publishDate: fields.date({
          label: 'Publish date',
          validation: { isRequired: true },
        }),
        updatedDate: fields.date({ label: 'Updated date' }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        tags: tagsField,
        // Drives the sticky-note colour in the notes listing.
        color: fields.select({
          label: 'Colour',
          options: [
            { label: 'Yellow', value: 'yellow' },
            { label: 'Pink', value: 'pink' },
            { label: 'Blue', value: 'blue' },
            { label: 'Green', value: 'green' },
            { label: 'Purple', value: 'purple' },
            { label: 'Orange', value: 'orange' },
          ],
          defaultValue: 'yellow',
        }),
        content: fields.mdx({
          label: 'Content',
          components: contentComponents,
          options: bodyImageOptions,
        }),
      },
    }),
  },

  // Singletons rather than a `pages` collection: /about and /privacy are
  // hand-written routes, so the CMS must not be able to create a third page
  // that has nowhere to render. The path deliberately has no trailing slash —
  // that makes Keystatic write a flat `about.mdx` instead of `about/index.mdx`,
  // which is the shape Astro's glob loader turns into the id `about`.
  singletons: {
    about: singleton({
      label: 'About page',
      path: 'src/content/pages/about',
      format: { contentField: 'content' },
      entryLayout: 'content',
      // The hero photograph on /about stays in the .astro file: it's an
      // `import` of a fixed asset that the layout positions by hand, not
      // something an editor needs to swap.
      schema: pageSchema,
    }),

    privacy: singleton({
      label: 'Privacy policy',
      path: 'src/content/pages/privacy',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: pageSchema,
    }),
  },
});
