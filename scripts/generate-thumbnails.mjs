// Renders page 1 of every PDF in certificates/ to certificates/thumbs/<name>.webp.
// Usage: npm run thumbs            (skips thumbnails newer than their PDF)
//        npm run thumbs -- --force (regenerates everything)
import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createCanvas } from '@napi-rs/canvas';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(root, 'certificates');
const outDir = path.join(srcDir, 'thumbs');
const TARGET_WIDTH = 800; // ~2x the rendered card width
const QUALITY = 80;
const force = process.argv.includes('--force');

async function isFresh(pdf, thumb) {
  try {
    return (await stat(thumb)).mtimeMs >= (await stat(pdf)).mtimeMs;
  } catch {
    return false;
  }
}

async function render(pdfPath, outPath) {
  const data = new Uint8Array(await readFile(pdfPath));
  const doc = await getDocument({ data, verbosity: 0 }).promise;
  const page = await doc.getPage(1);
  const base = page.getViewport({ scale: 1 });
  const viewport = page.getViewport({ scale: TARGET_WIDTH / base.width });

  const canvas = createCanvas(Math.round(viewport.width), Math.round(viewport.height));
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport, canvas }).promise;

  await writeFile(outPath, await canvas.encode('webp', QUALITY));
  await doc.destroy();
  return `${canvas.width}x${canvas.height}`;
}

await mkdir(outDir, { recursive: true });
const pdfs = (await readdir(srcDir)).filter((f) => f.toLowerCase().endsWith('.pdf'));

for (const file of pdfs) {
  const pdfPath = path.join(srcDir, file);
  const outPath = path.join(outDir, file.replace(/\.pdf$/i, '.webp'));
  if (!force && (await isFresh(pdfPath, outPath))) {
    console.log(`skip   ${file}`);
    continue;
  }
  const size = await render(pdfPath, outPath);
  console.log(`render ${file} -> thumbs/${path.basename(outPath)} (${size})`);
}
