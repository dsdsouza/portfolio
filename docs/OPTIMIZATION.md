# Optimization notes

## Changes

- Content, navigation, and route resolution are centralized. New entries use the existing list and detail components.
- Only the selected index panel mounts its content. Gallery images mount for the current and adjacent slides.
- Profile previews load on demand. The PDF engine and its WebAssembly stay outside the initial JavaScript graph.
- Raster originals generate cached WebP variants automatically before development and builds. Shared image rendering supplies responsive sources, dimensions, lazy loading, and portrait priority.
- React has a separate cached vendor chunk. Hashed build files and generated image variants receive immutable cache headers.
- Optional story sections reuse one renderer; empty sections stay hidden.
- Content validation checks IDs, aliases, links, assets, technologies, emails, and custom sections. Build validation checks image derivatives, the lazy loading boundary, and the startup size budget.

## Measured production build

- Initial JavaScript: 81.2 KiB compressed with gzip; enforced budget: 120 KiB.
- Responsive image sets: 17.
- ReWild logo: 174,542-byte original; 1,210-byte 48px variant.
- Boilerplate landing page: 79,869-byte original; 15,894-byte 480px variant.
- Native plant chat: 240,208-byte original; 15,976-byte 480px variant.

Image comparisons measure individual file sizes, not total page traffic or a speed score. Originals remain available and untouched. Variants never upscale originals.

## Verification and limits

`npm run check` runs content validation, the production build, and post-build checks. Automated test suites have been removed at the user’s request. Production navigation, the Work list, ReWild detail, return navigation, and the Memories list were smoke tested in Brave. The remaining visual checks were interrupted by native window/capture issues; the PDF controls were not re-verified during this optimization pass.

Chrome DevTools performance tooling was unavailable, so no Lighthouse or Core Web Vitals result is claimed. The PDF engine remains a large optional dependency and is downloaded only when Resume opens. Third-party LinkedIn availability remains outside the app's control.

See [Adding content](ADDING-CONTENT.md) for the editing workflow.
