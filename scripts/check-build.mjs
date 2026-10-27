import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { imageVariants } from '../src/data/imageVariants.generated.js';
const dist = new URL('../dist/', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('.vite/manifest.json', dist), 'utf8'));
const entry = Object.keys(manifest).find((key) => manifest[key].isEntry);
const eager = new Set();
function visit(key) {
  if (eager.has(key)) return;
  eager.add(key);
  for (const imported of manifest[key].imports || []) visit(imported);
}
visit(entry);
const files = [...eager].map((key) => manifest[key].file);
assert.ok(!files.some((file) => /PdfDocument|engine-|ProfileViewer|browser-/.test(file)), 'PDF/browser code must remain lazy');
let gzipBytes = 0;
for (const file of files) gzipBytes += gzipSync(await readFile(new URL(file, dist))).length;
assert.ok(gzipBytes < 120 * 1024, `Initial JS exceeds the 120 KiB gzip budget: ${gzipBytes}`);
for (const image of Object.values(imageVariants)) {
  let previous = 0;
  for (const variant of image.variants) {
    assert.ok(variant.width > previous && variant.width <= image.width, 'Responsive images must not upscale');
    previous = variant.width;
    assert.ok((await stat(new URL(variant.src.slice(1), dist))).size > 0, `Missing derivative: ${variant.src}`);
  }
}
console.log(`Build verified: ${(gzipBytes / 1024).toFixed(1)} KiB initial JS gzip; PDF and browser previews remain lazy; ${Object.keys(imageVariants).length} responsive image sets present.`);
