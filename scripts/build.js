import { access, copyFile, mkdir, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vercelHandler from '../api/[...path].js';

const root = fileURLToPath(new URL('../', import.meta.url));
const publicDir = path.join(root, 'public');
const required = [
  'server.js', 'api/[...path].js', 'vercel.json', 'src/core.js', 'src/api-handler.js', 'src/knowledge-base.js', 'src/hybrid-assistant.js',
  'public/index.html', 'public/styles.css', 'public/app.js',
  'public/favicon.svg', 'README.md'
];
for (const file of required) await access(path.join(root, file));

const vercel = JSON.parse(await readFile(path.join(root, 'vercel.json'), 'utf8'));
if (vercel.framework !== null || vercel.outputDirectory !== 'public' || vercel.buildCommand !== 'npm run build' || vercel.functions?.['api/[...path].js']?.maxDuration !== 30) {
  throw new Error('Vercel must use Other, run the project build, publish public/, and give the API function a 30-second duration.');
}
if (typeof vercelHandler !== 'function') throw new Error('The Vercel API entry point must have a default function export.');

// Walk local browser dependencies from every HTML entry point. Any dependency
// under /src/ is copied into public/ so it is included in Vercel's static output.
const htmlFiles = [];
async function findHtml(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) await findHtml(fullPath);
    else if (entry.isFile() && entry.name.endsWith('.html')) htmlFiles.push(fullPath);
  }
}
await findHtml(publicDir);
if (!htmlFiles.length) throw new Error('No HTML entry points found in public/.');

const queue = htmlFiles.map(file => `/${path.relative(publicDir, file).replaceAll(path.sep, '/')}`);
const visited = new Set();
const copied = new Set();
const external = value => /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(value);

function resolveBrowserPath(specifier, importer) {
  const clean = specifier.split(/[?#]/, 1)[0];
  if (!clean || external(clean)) return null;
  const resolved = clean.startsWith('/') ? path.posix.normalize(clean) : path.posix.resolve(path.posix.dirname(importer), clean);
  if (!resolved.startsWith('/') || resolved === '/..' || resolved.startsWith('/../')) {
    throw new Error(`Browser dependency escapes the site root: ${specifier} from ${importer}`);
  }
  return resolved;
}

function localSource(browserPath) {
  const relative = browserPath.slice(1).split('/').join(path.sep);
  return browserPath.startsWith('/src/') ? path.join(root, 'src', relative.slice(`src${path.sep}`.length)) : path.join(publicDir, relative);
}

function referencesFrom(text, browserPath) {
  const refs = [];
  const add = value => { const resolved = resolveBrowserPath(value, browserPath); if (resolved) refs.push(resolved); };
  if (browserPath.endsWith('.html')) {
    for (const tag of text.matchAll(/<(?:script|link|img|source|video|audio|iframe)\b[^>]*>/gi)) {
      for (const attr of tag[0].matchAll(/\b(?:src|href|poster)\s*=\s*(["'])(.*?)\1/gi)) add(attr[2]);
    }
  }
  if (browserPath.endsWith('.js') || browserPath.endsWith('.mjs')) {
    const importPattern = /(?:\bimport\s+(?:[^'";]*?\s+from\s*)?|\bexport\s+[^'";]*?\s+from\s*)["']([^"']+)["']|\bimport\s*\(\s*["']([^"']+)["']\s*\)|\bnew\s+URL\(\s*["']([^"']+)["']\s*,\s*import\.meta\.url\s*\)/g;
    for (const match of text.matchAll(importPattern)) add(match[1] || match[2] || match[3]);
    if (/\bimport\s*\(\s*(?!["'])/.test(text)) throw new Error(`Non-literal dynamic import cannot be verified: ${browserPath}`);
  }
  if (browserPath.endsWith('.css')) {
    for (const match of text.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)|@import\s+["']([^"']+)["']/g)) add(match[1] || match[2]);
  }
  return refs;
}

while (queue.length) {
  const browserPath = queue.shift();
  if (visited.has(browserPath)) continue;
  visited.add(browserPath);
  const source = localSource(browserPath);
  try { await access(source); }
  catch { throw new Error(`Missing browser dependency ${browserPath} (referenced locally in the frontend).`); }
  const contents = await readFile(source, 'utf8');
  for (const dependency of referencesFrom(contents, browserPath)) queue.push(dependency);
  if (browserPath.startsWith('/src/')) {
    const output = path.join(publicDir, browserPath.slice(1).split('/').join(path.sep));
    await mkdir(path.dirname(output), { recursive: true });
    await copyFile(source, output);
    copied.add(browserPath);
  }
}

for (const module of ['/src/core.js', '/src/knowledge-base.js', '/src/hybrid-assistant.js']) {
  if (!visited.has(module) || !copied.has(module)) throw new Error(`Required browser module is not included in the production output: ${module}`);
  await access(path.join(publicDir, module.slice(1).split('/').join(path.sep)));
}

console.log(`Build check passed: ${htmlFiles.length} HTML entry point(s), ${visited.size} local browser asset(s), and Vercel function export verified.`);
if (copied.size) console.log(`Prepared production browser modules: ${[...copied].join(', ')}`);
