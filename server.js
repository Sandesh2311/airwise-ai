import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleApiRequest } from './src/api-handler.js';

const root = fileURLToPath(new URL('.', import.meta.url));
try {
  const envText = await readFile(join(root, '.env'), 'utf8');
  for (const line of envText.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^(?:"([^"]*)"|'([^']*)')$/, '$1$2');
  }
} catch { /* Environment variables may be supplied directly by the host. */ }

const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.json': 'application/json' };
const staticHeaders = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'content-security-policy': "default-src 'self'; connect-src 'self' https://air-quality-api.open-meteo.com https://geocoding-api.open-meteo.com https://generativelanguage.googleapis.com; style-src 'self'; script-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"
};

async function handleRequest(req, res) {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname.startsWith('/api/')) return handleApiRequest(req, res);
  if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
  let pathname;
  try { pathname = normalize(decodeURIComponent(url.pathname)).replaceAll('\\', '/'); }
  catch { res.writeHead(400); return res.end('Bad request'); }
  if (pathname === '/' || pathname === '\\') pathname = '/index.html';
  if (pathname === '/favicon.ico') pathname = '/favicon.svg';
  const relativePath = pathname.replace(/^[/\\]+/, '');
  let file = resolve(root, 'public', relativePath);
  const publicRelative = relative(resolve(root, 'public'), file);
  if (publicRelative.startsWith(`..${sep}`) || publicRelative === '..' || resolve(file) === resolve(root, 'public')) {
    res.writeHead(404); return res.end('Not found');
  }
  try {
    let data;
    try { data = await readFile(file); }
    catch (error) {
      if (!pathname.startsWith('/src/')) throw error;
      file = resolve(root, 'src', relativePath.slice(`src${sep}`.length));
      const sourceRelative = relative(resolve(root, 'src'), file);
      if (sourceRelative.startsWith(`..${sep}`) || sourceRelative === '..') throw error;
      data = await readFile(file);
    }
    res.writeHead(200, { 'content-type': mime[extname(file)] || 'application/octet-stream', ...staticHeaders });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch { res.writeHead(404); res.end('Not found'); }
}

export function createServer() { return http.createServer(handleRequest); }

const invoked = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  const server = createServer();
  const port = Number(process.env.PORT) || 3000;
  server.listen(port, () => console.log(`AirWise AI available at http://localhost:${port}`));
}
