# Asset sources

- `public/assets/projects/boilerplate/boilerplate-icon.png`: unaltered official [Boilerplate apple-touch icon](https://boilerplate.select/apple-icon.png?002eec57762a96c2), linked by its live project homepage.
- `public/assets/projects/boilerplate/landing-page.jpg`: unaltered [Boilerplate Devpost gallery](https://devpost.com/software/boilerplate-3mxhbv), [original image](https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/005/686/511/datas/original.jpg).
- `public/assets/projects/volunteer-management/legacy-volunteer-dashboard.jpg`: unaltered `public/assets/VolunteerManagementImage.jpg` from [Daniel’s reference repository](https://github.com/dsdsouza/dsdsouza.github.io).
- `public/assets/projects/sustainable-landcare/native-chat-home.jpg`: unaltered `public/assets/SustainableLandcareHubImage.jpg` from the same repository.
- `public/assets/fonts/figtree-variable.ttf`: Figtree, served locally. Obtained from [Google Fonts](https://fonts.google.com/specimen/Figtree). The SIL Open Font License is included in `public/assets/licenses/figtree-ofl.txt`.
- `public/assets/documents/Daniel D'Souza Resume.pdf`: current one-page resume rebuilt from the supplied resume and updated portfolio facts using Jake Gutierrez’s MIT-licensed resume template. Editable source: `resume-jakes-template/main.tex`; preserved original: `resume-jakes-template/original-resume.pdf`.
- `public/assets/organizations/rewild-long-island-logo.webp` and `rtx.jpg`: unaltered organization logos from the reference repository’s `public/assets/rewildlogo.webp` and `rtxlogo.jpg`.
- `public/assets/organizations/designatronics-logo.png`: official [Designatronics favicon](https://www.designatronics.com/favicon.ico), extracted to PNG without resizing or changing the artwork.
- `public/assets/organizations/stony-brook-university-logo.png`: official [Stony Brook University apple-touch icon](https://www.stonybrook.edu/commcms/_resources/favicon/apple-touch-icon.png).

Image origin notes are embedded in supported image formats, with a neighboring provenance file for WebP. No generated or stock project imagery is used.

- `public/assets/organizations/northport-high-school-logo.png`: unaltered official [Northport High School header logo](https://nhs.northport.k12.ny.us/_MASTER/common_pics/header_logo.png), linked by its [homepage](https://nhs.northport.k12.ny.us/).

- `public/assets/portraits/daniel-dsouza-linkedin.jpg`: unaltered 400 × 400 LinkedIn profile portrait from the exact signed `media.licdn.com` URL supplied by the user on 2026-10-26. The full original URL is embedded in the JPEG provenance. Cached locally so the signed URL’s expiry does not affect the site.

## Memories

- `public/assets/memories/sbuhacks-2026/boilerplate-award-announcement.webp`: unmodified SBUHacks winner-announcement photo supplied by the user on 2026-10-26. Source: https://media.discordapp.net/attachments/1561505817457332284/1563993343891865720/IMG_5628.jpg?ex=6ae0f74e&is=6adfa5ce&hm=262c2016df5c3669bec8e0a3c0b247f719e58d2f39ccc28354b72205f4a0f88d&=&format=webp&width=1152&height=1536
- Additional memory tiles are labeled UI placeholders, not real or generated event photos.

## Additional project screenshots — October 26, 2026

Boilerplate screenshots are the original images from its [Devpost gallery](https://devpost.com/software/boilerplate-3mxhbv), saved without altering the image content:

- `public/assets/projects/boilerplate/teacher-class-workloads.jpg`: https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/005/687/784/datas/original.jpg
- `public/assets/projects/boilerplate/pip-study-planning.jpg`: https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/005/687/785/datas/original.jpg
- `public/assets/projects/boilerplate/student-workload-dashboard.jpg`: https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/005/687/786/datas/original.jpg

ReWild screenshots were supplied directly by the user and are saved unmodified:

- `public/assets/projects/volunteer-management/volunteer-home-dashboard.webp`: https://media.discordapp.net/attachments/1561502591362531390/1564420555422302280/image.png?ex=6ae133ad&is=6adfe22d&hm=4717afe80948857b342276b93fbce711f37dd52aafb089c78638f83eaf901d53&=&format=webp&quality=lossless
- `public/assets/projects/volunteer-management/chapter-volunteer-browser.webp`: https://media.discordapp.net/attachments/1561502591362531390/1564420689539104899/image.png?ex=6ae133cd&is=6adfe24d&hm=161a34056fbd8997b35ea996abf95db97fea39758f124802d83c84ffe4b19c43&=&format=webp&quality=lossless

The award announcement remains in Memories only. All shipping images now live under `public/assets/`, grouped into projects, organizations, portraits, memories, and icons. Fonts and PDF retain their existing paths.

- `public/assets/memories/sbuhacks-2026/sbuhacks-2026-event-logo.png`: original 300×300 event thumbnail from [SBUHacks 2026 on Devpost](https://sbuhacks-2026.devpost.com/), fetched from its `og:image`: https://d112y698adiu2z.cloudfront.net/photos/production/challenge_thumbnails/005/491/851/datas/large.png. Used only for the memory index thumbnail.

Responsive WebP derivatives under `public/assets/generated/` are generated from these originals by `npm run prepare:images`. They use descriptive source names, a content hash, and their width. They introduce no new imagery; originals remain the source of truth.
