import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Script } from 'node:vm';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pages = [
  'index.html',
  'ai-product-solutions.html',
  'technology-experience.html',
  'creative-experiences.html',
  'ai-knowledge.html',
  'skills.html',
  'journey.html',
  'genai-workflow-case-study.html',
  'finance-ai-case-study.html',
  'event-engagement-case-study.html',
];

let checkedLinks = 0;
for (const page of pages) {
  const html = readFileSync(join(root, page), 'utf8');
  const h1Count = [...html.matchAll(/<h1\b/gi)].length;
  if (h1Count !== 1) throw new Error(`${page}: expected one h1, found ${h1Count}`);
  if (!html.includes('<main id="main-content"')) throw new Error(`${page}: no main landmark`);
  if (!html.includes('rel="canonical"')) throw new Error(`${page}: no canonical URL`);
  if (html.includes('href="index.html"') || !html.includes('href="index.html?v=')) {
    throw new Error(`${page}: Home links must request the current overview build`);
  }

  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  const duplicate = ids.find((id, index) => ids.indexOf(id) !== index);
  if (duplicate) throw new Error(`${page}: duplicate id ${duplicate}`);
  const idSet = new Set(ids);

  for (const [, code] of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
    new Script(code, { filename: page });
  }

  for (const [, target] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (/^(?:https?:|mailto:|tel:|data:)/i.test(target)) continue;
    const [filePart, fragment] = target.split('#');
    const targetFile = filePart.split('?')[0] || page;
    if (!existsSync(join(root, targetFile))) throw new Error(`${page}: missing ${targetFile}`);
    if (fragment && targetFile.endsWith('.html')) {
      const targetIds = targetFile === page
        ? idSet
        : new Set([...readFileSync(join(root, targetFile), 'utf8').matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
      if (!targetIds.has(fragment)) throw new Error(`${page}: missing #${fragment} in ${targetFile}`);
    }
    checkedLinks += 1;
  }
  process.stdout.write(`Checked ${page}\n`);
}
process.stdout.write(`Validated ${checkedLinks} local links/assets and all embedded scripts.\n`);
