# Sittan (Bon) Charoensuwan portfolio

This repository serves the portfolio at `https://sittanbon.github.io/`. The homepage and three case-study pages are plain static HTML, so GitHub Pages can serve them without a framework or deployment service.

## Edit and build

The editable page fragments are in `src/`. After changing them, run:

```sh
node scripts/build.mjs
node scripts/check.mjs
```

The build creates `index.html` and the three root-level case-study pages. `scripts/check.mjs` validates page structure, embedded JavaScript, local links and assets. The illustrated guide and CV PDF are root-level assets. The existing AI guide sub-sites remain separate and are not changed by this build.

## Content distinctions

The case studies identify delivered work separately from proposed product and workflow designs. Example wireframe numbers are illustrative, not measured outcomes. The finance confidence bands were tested in a pilot. Bon confirmed that exactly 75% goes to human review, a score above 95% receives a green route with human notification and an audit log, and bills above ฿20,000 still require human approval. Project thresholds can vary.

No paid media generation or third-party API is required to run the site. Motion is disabled for visitors who request reduced motion.
