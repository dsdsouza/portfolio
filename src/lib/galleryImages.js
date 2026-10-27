export function getGalleryImages(entry) {
  return entry.images || (entry.image ? [{ src: entry.image, alt: entry.imageAlt || entry.title, width: entry.imageWidth, height: entry.imageHeight, caption: entry.screenshotNote }] : []);
}
export function getCoverImage(entry) {
  return getGalleryImages(entry).find((image) => image.src);
}

// Preserve the full horizontal interface on ultrawide screenshots. Taller
// captures use the frame's top-aligned crop; all frames retain the same size.
export function getScreenshotStyle(image) {
  return image.width / image.height > 16 / 9
    ? { objectFit: 'contain', objectPosition: 'center' }
    : undefined;
}
