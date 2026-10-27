import { useImageCarousel } from '../lib/useImageCarousel.js';
import GalleryImage from './GalleryImage.jsx';
import { getScreenshotStyle } from '../lib/galleryImages.js';

function GalleryArrow({ direction, disabled, onClick }) {
  const previous = direction === 'previous';
  return <button type="button" className={`gallery-arrow gallery-arrow--${direction}`} disabled={disabled} onClick={onClick} aria-label={previous ? 'Previous image' : 'Next image'}>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d={previous ? 'm12 4-6 6 6 6' : 'm8 4 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </button>;
}

export default function ImageGallery({ images: entries = [], label, fit = 'crop' }) {
  const images = entries.filter((image) => image.src);
  const { railRef, index, go, onScroll, onKeyDown } = useImageCarousel(images.length);
  if (!images.length) return null;
  const current = images[index];
  return <figure className="project-figure detail-gallery" aria-label={`${label} image gallery`} aria-roledescription="carousel">
    <div className="gallery-stage">
      <div className="detail-gallery-rail" ref={railRef} tabIndex={0} role="region" aria-label="Images. Swipe or use left and right arrow keys." onScroll={onScroll} onKeyDown={onKeyDown}>
        {images.map((image, number) => <div className="detail-gallery-slide" key={image.src || number} role="group" aria-label={`Image ${number + 1} of ${images.length}`}>
          {Math.abs(number - index) <= 1 && <GalleryImage photo={image} style={fit === 'contain' ? { objectFit: 'contain', objectPosition: 'center' } : getScreenshotStyle(image)} loading={number === index ? 'eager' : 'lazy'} />}
        </div>)}
      </div>
      {images.length > 1 && <>
        <GalleryArrow direction="previous" disabled={index === 0} onClick={() => go(index - 1)} />
        <GalleryArrow direction="next" disabled={index === images.length - 1} onClick={() => go(index + 1)} />
      </>}
    </div>
    <figcaption className="gallery-footer">
      <span>{current.caption}</span>
      <span className="gallery-position" role="status" aria-live="polite" aria-atomic="true">{index + 1} / {images.length}</span>
    </figcaption>
  </figure>;
}
