# Daniel D’Souza portfolio

React/Vite portfolio with Projects, Work, Education, and Memories. Content lives in data arrays, with shared index rows, story sections, galleries, and dialogs.

## Develop

```sh
npm install
npm run dev
```

Local: http://localhost:5173. Responsive images are prepared automatically before the server starts. To prepare newly added images during a running session, use `npm run prepare:images`.

## Add content

See [the content guide](docs/ADDING-CONTENT.md) for fields, examples, photos, multi-role employers, extra sections, and preserved URLs. Start with these files:

- `src/data/projects.js`, `experience.js`, `education.js`, `memories.js`: content
- `src/data/profile.js`: introduction, contact, Resume
- `src/data/projectImages.js`: reusable screenshot objects
- `src/data/navigation.js`: tab labels, order, route metadata

## Check and build

```sh
npm run check
npm run build
```

`check` runs the production build. The build checks content references and generates responsive image sets. `postbuild` verifies the image outputs and initial-JS budget.

## Architecture

| Module | Responsibility |
| --- | --- |
| `lib/routes.js`, `contentCatalog.js` | Central route parsing and indexed content lookup, including aliases |
| `PortfolioIndex` | Renders only the active tab's content |
| `EntryRow`, `EntryTitle`, `DetailPage` | Shared index/story layout |
| `StorySection`, `StorySections`, `BulletList` | Optional narrative sections and plain bullets |
| `ImageGallery`, `GalleryImage`, `useImageCarousel` | Reusable fixed-frame galleries with keyboard/swipe controls |
| `AssetImage`, `prepare-images.mjs` | Responsive, content-hashed WebP derivatives from untouched originals |
| `ProfileViewer`, `PreviewBoundary` | On-demand profile/PDF viewers and failure recovery |
| `ViewerDialog` | Shared centered popup, scroll lock, focus restoration |
| `PdfToolbar`, `lib/pdfControls.js`, `lib/pdfTheme.js` | App-owned PDF toolbar, stable engine state, custom SVGs, portfolio colors |

React is split into a stable vendor chunk for caching between content updates. Profile viewer code is loaded on demand; the larger PDF renderer and WASM remain separate from startup. Only the current gallery slide and immediate neighbors mount images. Generated images and hashed JS/CSS/WASM use immutable cache headers; originals and HTML can revalidate.

The remaining large build chunks belong to EmbedPDF and load only when Resume opens. The maintained renderer handles text selection and local WASM, while an app-owned fixed toolbar handles pages, zoom, rotation, and native Print / Export. Editor menus, sidebars, and floating controls are omitted.

## Hosting

Live: https://kjdfksjdfkjsdfkjshdfjk.zhomander.workers.dev

Deploy updates only when requested:

```sh
npm run build
npx wrangler deploy
```

Wrangler serves `dist/` as static assets. Production GitHub opens directly; the interactive browser helper runs only in local Vite. The official LinkedIn card is temporary, loads only when opened, and can be blocked by browser privacy tools. Phones use direct links.

## Sources and supporting docs

- [Optimization measurements and verification](docs/OPTIMIZATION.md)
- [Asset provenance and licenses](ASSETS.md)
- [LinkedIn investigation](docs/LINKEDIN-INVESTIGATION.md)
- [Editable resume project](resume-jakes-template/README.md)

The resume uses Jake Gutierrez's MIT-licensed template. Its sources and preserved original are outside the public directory; only the final PDF ships. Research probes, QA screenshots, and editable LaTeX are also excluded from the production asset directory.
