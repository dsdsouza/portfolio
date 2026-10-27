import { imageVariants } from '../data/imageVariants.generated.js';

// One image policy for portraits, logos, cards, and galleries. Original assets
// remain the source of truth; unknown/new paths still render before regeneration.
export default function AssetImage({ src, alt = '', sizes = '100vw', loading = 'lazy', width, height, ...props }) {
  const image = imageVariants[src];
  return <img {...props} src={src} alt={alt} draggable={false} decoding="async" loading={loading}
    width={width || image?.width} height={height || image?.height}
    srcSet={image?.variants.map((variant) => `${variant.src} ${variant.width}w`).join(', ')} sizes={sizes} />;
}
