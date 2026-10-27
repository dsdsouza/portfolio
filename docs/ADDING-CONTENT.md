# Adding portfolio content

Run `npm install`, then `npm run dev`. Edit the data files below; array order controls display order. Entries get routes automatically. You do not need to edit page components when adding an entry.

| Content | File | Address |
| --- | --- | --- |
| Projects | `src/data/projects.js` | `#/projects/<slug>` |
| Work/employers and teams | `src/data/experience.js` | `#/experience/<id>` |
| Schools | `src/data/education.js` | `#/education` |
| Memories | `src/data/memories.js` | `#/memories/<id>` |
| Introduction, contact, Resume | `src/data/profile.js` | Header / popups |
| Project screenshot galleries | `src/data/projectImages.js` | Shared by any entry referencing them |

Use unique lowercase hyphenated IDs. Keep technology names consistent (`TypeScript`, `PostgreSQL`, `Google Cloud Platform`) and put each technology in its own array item. These arrays can power future filters. Use empty arrays or omit optional sections instead of inserting placeholders.

## Projects

Copy an existing project in `projects.js`. Minimum fields are `slug`, `title`, and `summary`. Available fields:

```js
{
  slug: 'project-name',
  title: 'Project name',
  summary: 'A short description for the list.',
  organization: 'Organization or event',
  period: 'October 2026',
  role: 'Your role',
  logo: '/assets/projects/project-name/icon.png',
  overview: 'The problem and what the application does.',
  contribution: 'Your specific contribution.',
  work: ['A concrete contribution.', 'Another contribution.'],
  technologies: ['React', 'TypeScript'],
  images: [{ src: '/assets/projects/project-name/dashboard.webp', alt: 'What is visible.', width: 1280, height: 720, caption: 'Dashboard.' }],
  links: [{ label: 'Source code', href: 'https://github.com/owner/repository' }],
  sections: [{ title: 'Results', text: 'Verified outcomes.', items: ['Optional supporting detail.'] }],
}
```

`recognition` and `outcome` are also supported. Extra `sections` render in order using the same styles; empty ones disappear. Keep contribution bullets as plain sentences.

## Work and multiple roles

A standalone work entry has `id`, `organization`, `website`, `role`, `period`, `summary`, and optional `location`, `logo`, `details`, `leadership`, `skills`, `technologies`, and `sections`. Bullet fields are string arrays.

To group teams under one employer, add a `roles` array. Each role has `id`, `title` (team name), `role`, `period`, `summary`, `details`, `leadership`, `skills`, and `technologies`. Each team renders the same shared sections. Add `location` when it differs from the employer. An `aliases` array on the employer preserves old work URLs after merging entries.

## Education

Use `id`, `school`, `website`, and `period`; add `degree` and `logo` when available. `facts` takes `{ label, value }` objects. Set `detailsLabel` to customize the disclosure label and `sections` to add titled paragraphs/bullet lists inside it. Empty disclosures are not rendered.

## Memories

Use `id`, `title`, `period`, `description`, `experience`, and `photos`. `experience` is one first-person paragraph. `thumbnail` is an optional image object for the list. Photos use the same image object shape as project galleries; existing project image objects can be reused without copying files. Memories display the full image within a fixed frame.

## Images and other assets

Put originals in `public/assets/` under `projects/<slug>/`, `memories/<id>/`, `organizations/`, or `portraits/`. Keep descriptive lowercase filenames and record sources in `ASSETS.md`. Resume files belong in `assets/documents/` and fonts/licenses in their respective folders.

`npm run prepare:images` generates WebP sizes with content-hashed names. It runs automatically before dev/build and skips unchanged files. New images added during a running dev session need this command once. Never edit the generated files or manifest. Originals stay untouched. Animated image files are kept as originals.

`AssetImage` supplies dimensions, responsive source sets, lazy loading, and disabled dragging. Use it for new image surfaces. Project crops and thumbnail framing share `getScreenshotStyle`; memory detail galleries use `fit="contain"`. Do not alter all image CSS to fix one photo.

## Checks and deployment

Run `npm run check` before shipping. It validates content and local assets, then creates the production build. The build also verifies a 120 KiB gzip initial-JS budget and that PDF/browser code stays lazy.

`npm run build` creates `dist/`. Deploy updates only when requested using `npx wrangler deploy`. The configured project is `kjdfksjdfkjsdfkjshdfjk`. Production GitHub opens directly because the interactive Chromium helper is local only. Phones use direct profile/PDF/email links. The official LinkedIn badge is temporary and may fail when visitors block its scripts.
