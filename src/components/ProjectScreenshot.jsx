import AssetImage from './AssetImage.jsx';
import ImageGallery from './ImageGallery.jsx';
import { getGalleryImages, getScreenshotStyle } from '../lib/galleryImages.js';

export default function ProjectScreenshot({ project, preview = false, loading }) {
  const images = getGalleryImages(project);
  if (!preview) return <ImageGallery key={project.slug} images={images} label={project.title} />;
  const cover = images.find((image) => image.src);
  return cover ? <AssetImage className="project-thumbnail" sizes="(max-width: 600px) calc(100vw - 48px), 250px" style={getScreenshotStyle(cover)} src={cover.src} alt={cover.alt || project.title} width={cover.width} height={cover.height} loading={loading} /> : null;
}
