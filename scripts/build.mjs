import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const siteOrigin = 'https://sittanbon.github.io';
const homeVersion = createHash('sha256')
  .update(readFileSync(join(projectRoot, 'src', 'overview.html')))
  .update(readFileSync(join(projectRoot, 'site.css')))
  .update(readFileSync(join(projectRoot, 'site.js')))
  .update(readFileSync(fileURLToPath(import.meta.url)))
  .digest('hex')
  .slice(0, 10);
const homeHref = `index.html?v=${homeVersion}`;

const pages = [
  {
    source: 'overview.html',
    output: 'index.html',
    title: 'Sittan (Bon) Charoensuwan | AI Implementation & Creative Solutions',
    description: 'Explore Bon’s AI implementation, technology research, creative experiences and practical AI knowledge through a clear portfolio overview.',
  },
  {
    source: 'ai-product-solutions.html',
    output: 'ai-product-solutions.html',
    title: 'AI & Product Solutions | Sittan (Bon) Charoensuwan',
    description: 'Controlled AI pilots, product concepts and independent builds from discovery to adoption.',
  },
  {
    source: 'technology-experience.html',
    output: 'technology-experience.html',
    title: 'Technology Experience | Sittan (Bon) Charoensuwan',
    description: 'IIoT research and roadmap work, nanotechnology research and microcontroller prototypes.',
  },
  {
    source: 'creative-experiences.html',
    output: 'creative-experiences.html',
    title: 'Creative Experiences | Sittan (Bon) Charoensuwan',
    description: 'Client-facing campaigns and interactive experiences connecting brand messages to audience action.',
  },
  {
    source: 'ai-knowledge.html',
    output: 'ai-knowledge.html',
    title: 'AI Knowledge | Sittan (Bon) Charoensuwan',
    description: 'Practical AI guides and Bon’s industry-by-industry Digital Focus viewpoints.',
  },
  {
    source: 'journey.html',
    output: 'journey.html',
    title: 'Career Journey | Sittan (Bon) Charoensuwan',
    description: 'A chronological career across strategy, creative technology, digital products and AI adoption.',
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
  body = body.replaceAll('href="index.html"', `href="${homeHref}"`);
  body = body.replace(/^[\t ]+$/gm, '');
  if (!body.includes('id="main-content"')) {
    body = body.replace('<main ', '<main id="main-content" ');
  }
  if (!body.includes('id="main-content"')) {
    throw new Error(`${page.source}: missing main landmark`);
  }

  const canonical = `${siteOrigin}/${page.output === 'index.html' ? '' : page.output}`;
  const script = scriptMatch ? `\n<script>${scriptMatch[1]}</script>` : '';
  const current = page.output === 'index.html' ? 'home'
    : page.output === 'ai-product-solutions.html' || page.output.endsWith('case-study.html') ? 'ai'
    : page.output === 'technology-experience.html' ? 'technology'
    : page.output === 'creative-experiences.html' ? 'creative'
    : page.output === 'ai-knowledge.html' ? 'knowledge' : 'journey';
  const navItem = (href, label, key) => `<a href="${href}"${current === key ? ' aria-current="page"' : ''}>${label}</a>`;
  const siteHeader = `<header class="site-header"><a class="site-brand" href="${homeHref}" aria-label="Bon — portfolio home"><span class="site-brand-mark">B</span><span>BON</span></a><button class="site-menu-toggle" type="button" aria-controls="site-nav" aria-expanded="false">Menu</button><nav class="site-nav" id="site-nav" aria-label="Main navigation">${navItem('ai-product-solutions.html', 'AI & Product', 'ai')}${navItem('technology-experience.html', 'Technology', 'technology')}${navItem('creative-experiences.html', 'Creative', 'creative')}${navItem('ai-knowledge.html', 'AI Knowledge', 'knowledge')}${navItem('journey.html', 'Journey', 'journey')}<a href="Sittan_Charoensuwan_AI_Implementation_Solutions_Master_CV.pdf" target="_blank" rel="noopener">CV ↗</a><a class="site-nav-contact" href="#site-contact">Contact</a></nav></header><div class="site-progress" aria-hidden="true"><span></span></div>`;
  const siteFooter = `<footer class="site-footer" id="site-contact"><div><p class="site-footer-lead">Have a problem worth rethinking?</p><p>Let’s find the human need, shape the right solution and make it useful in practice.</p></div><div class="site-footer-links"><a href="mailto:sittan.siri@gmail.com">Email Bon ↗</a><a href="https://www.linkedin.com/in/sittan-charoensuwan/" target="_blank" rel="noopener">LinkedIn ↗</a><a href="Sittan_Charoensuwan_AI_Implementation_Solutions_Master_CV.pdf" target="_blank" rel="noopener">Open CV ↗</a></div></footer>`;
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
  <link rel="stylesheet" href="site.css?v=${homeVersion}">
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
  ${siteHeader}
${body.trim()}
  ${siteFooter}${script}
  <script src="site.js?v=${homeVersion}" defer></script>
</body>
</html>
`;
  writeFileSync(join(projectRoot, page.output), html);
  process.stdout.write(`Built ${page.output}\n`);
}
