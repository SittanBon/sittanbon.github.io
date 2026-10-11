import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const siteOrigin = 'https://sittanbon.github.io';

const pages = [
  {
    source: 'home.html',
    output: 'index.html',
    title: 'Sittan (Bon) Charoensuwan | AI Implementation & Creative Solutions',
    description: 'Explore Bon’s work across AI implementation, digital products, communication and branding—through real cases, a guided career journey and practical AI resources.',
  },
  {
    source: 'genai-workflow-case-study.html',
    output: 'genai-workflow-case-study.html',
    title: 'GenAI Campaign Workflow | Sittan (Bon) Charoensuwan',
    description: 'A controlled GenAI campaign pilot, four-location rollout and a human-guided creative workflow design.',
  },
  {
    source: 'finance-ai-case-study.html',
    output: 'finance-ai-case-study.html',
    title: 'Finance AI Pilot & Product Concept | Sittan (Bon) Charoensuwan',
    description: 'Receipt OCR pilot, confidence-based human review and a concept for clearer agency finance operations.',
  },
  {
    source: 'event-engagement-case-study.html',
    output: 'event-engagement-case-study.html',
    title: 'QR Event Engagement Case | Sittan (Bon) Charoensuwan',
    description: 'An internal QR event pilot, market licenses and a wider design exploration for audience engagement.',
  },
];

const escapeAttribute = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');

for (const page of pages) {
  const fragment = readFileSync(join(projectRoot, 'src', page.source), 'utf8');
  const styleMatch = fragment.match(/<style>([\s\S]*?)<\/style>/);
  if (!styleMatch) throw new Error(`${page.source}: expected one style block`);

  const scriptMatch = fragment.match(/<script>([\s\S]*?)<\/script>/);
  let body = fragment.replace(styleMatch[0], '');
  if (scriptMatch) body = body.replace(scriptMatch[0], '');
  body = body.replace(/^[\t ]+$/gm, '');
  if (!body.includes('id="main-content"')) {
    body = body.replace('<main ', '<main id="main-content" ');
  }
  if (!body.includes('id="main-content"')) {
    throw new Error(`${page.source}: missing main landmark`);
  }

  const canonical = `${siteOrigin}/${page.output === 'index.html' ? '' : page.output}`;
  const script = scriptMatch ? `\n<script>${scriptMatch[1]}</script>` : '';
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#f7f4ed">
  <meta name="description" content="${escapeAttribute(page.description)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeAttribute(page.title)}">
  <meta property="og:description" content="${escapeAttribute(page.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${siteOrigin}/hero-guide-journey-man.png">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <title>${page.title}</title>
  <style>
    html { scroll-behavior: smooth; }
    body { margin: 0; background: #f7f4ed; }
    .site-skip { position: absolute; top: -60px; left: 12px; z-index: 1000; padding: 10px 14px; background: #111113; color: #fff; font: 600 14px system-ui, sans-serif; }
    .site-skip:focus { top: 12px; }
    @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
  </style>
  <style>${styleMatch[1]}</style>
</head>
<body>
  <a class="site-skip" href="#main-content">Skip to content</a>
${body.trim()}${script}
</body>
</html>
`;
  writeFileSync(join(projectRoot, page.output), html);
  process.stdout.write(`Built ${page.output}\n`);
}
