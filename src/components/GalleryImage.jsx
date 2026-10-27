import AssetImage from './AssetImage.jsx';
export default function GalleryImage({ photo, loading = 'lazy', style }) {
  return photo.src ? <AssetImage sizes="(max-width: 848px) calc(100vw - 48px), 800px" style={style} src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading={loading} /> : null;
}
