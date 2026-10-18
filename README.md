# Sittan (Bon) Charoensuwan portfolio

This repository serves the portfolio at `https://sittanbon.github.io/`. The site is plain static HTML, so GitHub Pages can serve it without a framework or deployment service.

## Site map

- `index.html` — short overview, verified-project routes, and four field doors.
- `ai-product-solutions.html` — delivered GenAI rollout, finance and QR pilots/concepts, independent builds. This is the parent for the three detailed case-study pages.
- `technology-experience.html` — IIoT research/roadmap, academic nanotechnology research and microcontroller prototypes.
- `creative-experiences.html` — client-facing creative and interactive work, with industry-only client labels. It links to the canonical QR product case rather than duplicating it.
- `ai-knowledge.html` — three live guides plus the interactive Digital Focus viewpoint matrix.
- `journey.html` — dated career chronology and CV route. Employer names appear here and in the CV, not on project/client pages.

The shared navigation reaches every field, Journey, CV and Contact. Case breadcrumbs return to AI & Product. `src/home.html` is the preserved earlier long-homepage fragment; `src/overview.html` is now the homepage source.

## Edit and build

The editable page fragments are in `src/`. After changing them, run:

```sh
node scripts/build.mjs
node scripts/check.mjs
```

The build creates the homepage, four field pages, Journey, and the three root-level case-study pages. `scripts/check.mjs` validates page structure, embedded JavaScript, local links and assets. `site.css` and `site.js` provide shared navigation, responsive layout and motion. The illustrated guide and CV PDF are root-level assets. The existing AI guide sub-sites remain separate and are not changed by this build.

## Content distinctions

The case studies identify delivered work separately from proposed product and workflow designs. Example wireframe numbers are illustrative, not measured outcomes. The finance confidence bands were tested in a pilot. Bon confirmed that exactly 75% goes to human review, a score above 95% receives a green route with human notification and an audit log, and bills above ฿20,000 still require human approval. Project thresholds can vary.

No paid media generation or third-party API is required to run the site. Motion is disabled for visitors who request reduced motion.

## Publication notes

The Creative page uses selected public project visuals with Bon's approval; descriptions use industry labels, although the original images contain visible client branding. The flagship figures are presented as Bon-reported project evidence, not independently published raw datasets. Illustrative wireframes are labelled as concepts rather than deployed interfaces.
