/**
 * Renders the site-wide fallback social card to public/og-default.png.
 *
 * Pages without a cover image previously fell back to a text-only card, and the
 * only photo on the site is square, so it could not stand in for a 1200x630
 * slot. This draws a branded card from the design tokens instead.
 *
 * Run with `npm run og`. The two variable fonts are fetched into a temp dir and
 * exposed to librsvg through a throwaway fontconfig file, so nothing here has
 * to be committed beyond the resulting PNG.
 */
import { mkdtemp, writeFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import sharp from 'sharp';

const execFileAsync = promisify(execFile);

const FONTS = {
  'Fraunces.ttf':
    'https://github.com/google/fonts/raw/main/ofl/fraunces/Fraunces%5BSOFT%2CWONK%2Copsz%2Cwght%5D.ttf',
  'Lora.ttf': 'https://github.com/google/fonts/raw/main/ofl/lora/Lora%5Bwght%5D.ttf',
};

// Mirrors src/styles/global.css. Kept as literals because this runs outside
// Vite and so cannot read the stylesheet's custom properties.
const BG = '#FAFAF8';
const INK = '#1A1A1A';
const MUTED = '#6B7280';
const ACCENT = '#0F766E';

const WIDTH = 1200;
const HEIGHT = 630;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}"/>
  <rect x="90" y="196" width="96" height="5" fill="${ACCENT}"/>
  <text x="90" y="330" font-family="Fraunces" font-size="104" fill="${INK}">Digital Divide</text>
  <text x="90" y="404" font-family="Lora" font-size="36" fill="${MUTED}" font-style="italic">Essays on technology and humanity</text>
  <rect x="0" y="${HEIGHT - 16}" width="${WIDTH}" height="16" fill="${ACCENT}"/>
</svg>`;

const dir = await mkdtemp(join(tmpdir(), 'dd-og-'));
try {
  await Promise.all(
    Object.entries(FONTS).map(async ([name, url]) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${name}: ${res.status} ${res.statusText}`);
      await writeFile(join(dir, name), Buffer.from(await res.arrayBuffer()));
    })
  );

  const conf = join(dir, 'fonts.conf');
  await writeFile(
    conf,
    `<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig><dir>${dir}</dir><cachedir>${join(dir, 'cache')}</cachedir></fontconfig>`
  );

  // sharp reads fontconfig once per process, so the render is delegated to a
  // child that starts with FONTCONFIG_FILE already set.
  const render = join(dir, 'render.mjs');
  await writeFile(
    render,
    `import sharp from ${JSON.stringify(import.meta.resolve('sharp'))};
await sharp(Buffer.from(process.argv[2])).png({ compressionLevel: 9 }).toFile(process.argv[3]);`
  );

  const out = 'public/og-default.png';
  await execFileAsync(process.execPath, [render, svg, out], {
    env: { ...process.env, FONTCONFIG_FILE: conf },
  });

  const { width, height } = await sharp(out).metadata();
  const { size } = await stat(out);
  console.log(`wrote ${out} — ${width}x${height}, ${Math.round(size / 1024)}KB`);
} finally {
  await rm(dir, { recursive: true, force: true });
}
