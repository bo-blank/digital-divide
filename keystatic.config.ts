import { config, collection, fields } from '@keystatic/core';
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

// Inline figures go to public/ instead: Figure.astro takes `src` as a plain
// string and hands it to <Image> with explicit dimensions, which only works
// for a served URL, not a src/assets import.
const FIGURE_DIRECTORY = 'public/images/figures';
const FIGURE_PUBLIC_PATH = '/images/figures/';

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
        publicPath: FIGURE_PUBLIC_PATH,
        validation: { isRequired: true },
      }),
      alt: fields.text({
        label: 'Alt text',
        description: 'Required — describes the image for screen readers.',
        validation: { isRequired: true },
      }),
      caption: fields.text({ label: 'Caption' }),
      credit: fields.text({ label: 'Credit' }),
      width: fields.integer({ label: 'Width', defaultValue: 800 }),
      height: fields.integer({ label: 'Height', defaultValue: 450 }),
    },
  }),
};

// Tags are slugified by the Zod schema at parse time, so "Digital Culture"
// typed here lands as "digital-culture" and formatTagDisplay restores the
// casing when rendering. Authors don't need to pre-slugify.
const tagsField = fields.array(fields.text({ label: 'Tag' }), {
  label: 'Tags',
  itemLabel: (props) => props.value,
  description: 'Free text — normalised to a slug when the site builds.',
});

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
            }),
            alt: fields.text({
              label: 'Alt text',
              description: 'Required whenever an image is set.',
            }),
            caption: fields.text({ label: 'Caption' }),
            position: fields.text({
              label: 'Focal point',
              description: 'CSS object-position, e.g. "center 100%".',
            }),
          },
          {
            label: 'Cover image',
            description: 'Leave the image empty for a post with no cover.',
          }
        ),
        content: fields.mdx({
          label: 'Content',
          components: contentComponents,
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
        }),
      },
    }),
  },
});
