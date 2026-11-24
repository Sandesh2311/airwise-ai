import { normalizeAirData, makePrompt, validateAssistantRequest } from './core.js';

const cache = new Map();
const hits = new Map();
const WINDOW_MS = 60_000;
const ASSISTANT_BODY_LIMIT = 16 * 1024;
const send = (res, status, body) => {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' });
  res.end(JSON.stringify(body));
};

function readJsonBody(req, limit = ASSISTANT_BODY_LIMIT) {
  return new Promise(resolve => {
    const declared = Number(req.headers['content-length']);
    if (Number.isFinite(declared) && declared > limit) {
      req.resume();
      resolve({ error: { status: 413, message: 'Assistant request exceeds the 16 KiB limit. Send a shorter message and compact context.' } });
      return;
    }
    const contentType = (req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
    if (contentType !== 'application/json') {
      req.resume();
      resolve({ error: { status: 415, message: 'Content-Type must be application/json.' } });
      return;
    }
    // Vercel's Node runtime may provide the parsed request body directly.
    if (req.body !== undefined) {
      try {
        const raw = typeof req.body === 'string' ? req.body : Buffer.isBuffer(req.body) ? req.body.toString('utf8') : JSON.stringify(req.body);
        if (Buffer.byteLength(raw) > limit) {
          resolve({ error: { status: 413, message: 'Assistant request exceeds the 16 KiB limit. Send a shorter message and compact context.' } });
          return;
        }
        const body = typeof req.body === 'object' && !Buffer.isBuffer(req.body) ? req.body : JSON.parse(raw);
        resolve({ body });
      } catch { resolve({ error: { status: 400, message: 'Malformed JSON request body.' } }); }
      return;
    }
    const chunks = [];
    let size = 0;
    let finished = false;
    const settle = value => {
      if (finished) return;
      finished = true;
      req.removeAllListeners('data');
      req.removeAllListeners('end');
      req.removeAllListeners('error');
      resolve(value);
    };
    req.on('data', chunk => {
      size += chunk.length;
      if (size > limit) {
        settle({ error: { status: 413, message: 'Assistant request exceeds the 16 KiB limit. Send a shorter message and compact context.' } });
        req.resume();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (finished) return;
      try { settle({ body: JSON.parse(Buffer.concat(chunks).toString('utf8')) }); }
      catch { settle({ error: { status: 400, message: 'Malformed JSON request body.' } }); }
    });
    req.on('error', () => settle({ error: { status: 400, message: 'Could not read request body.' } }));
  });
}

async function fetchJson(url, timeout = 9000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { 'user-agent': 'AirWiseAI/1.0' } });
    if (!response.ok) throw new Error(`Provider returned ${response.status}`);
    return await response.json();
  } finally { clearTimeout(timer); }
}

async function fetchGemini(url, options) {
  let lastError;
  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      if (attempt === 0 && response.status >= 500) {
        await response.body?.cancel();
      } else return response;
    } catch (error) {
      lastError = error;
      if (attempt === 1) throw error;
    } finally { clearTimeout(timer); }
    await new Promise(resolve => setTimeout(resolve, 350 * (attempt + 1)));
  }
  throw lastError || new Error('Gemini request failed.');
}

function rateLimit(req) {
  const key = req.socket?.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'local';
  const now = Date.now();
  const old = hits.get(key) || { start: now, count: 0 };
  if (now - old.start > WINDOW_MS) { old.start = now; old.count = 0; }
  old.count++;
  hits.set(key, old);
  return old.count <= 60;
}

async function api(req, res, url) {
  if (!rateLimit(req)) return send(res, 429, { error: 'Too many requests. Please try again shortly.' });
  const path = url.pathname;
  if (path === '/api/health') return send(res, 200, { status: 'ok' });
  if (path === '/api/geocode') {
    const q = (url.searchParams.get('q') || '').trim();
    if (q.length < 2 || q.length > 80 || /[<>]/.test(q)) return send(res, 400, { error: 'Enter a city name between 2 and 80 characters.' });
    const key = `geo:${q.toLowerCase()}`;
    if (cache.has(key) && cache.get(key).until > Date.now()) return send(res, 200, cache.get(key).data);
    try {
      const data = await fetchJson(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=en&format=json`);
      const results = (data.results || []).filter(x => Number.isFinite(x.latitude) && Number.isFinite(x.longitude)).map(x => ({ name: x.name, country: x.country, admin1: x.admin1, latitude: x.latitude, longitude: x.longitude }));
      cache.set(key, { data: results, until: Date.now() + 3600000 });
      return send(res, 200, results);
    } catch { return send(res, 502, { error: 'City search is temporarily unavailable. Please retry.' }); }
  }
  if (path === '/api/air') {
    const lat = Number(url.searchParams.get('lat'));
    const lon = Number(url.searchParams.get('lon'));
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) return send(res, 400, { error: 'Valid coordinates are required.' });
    const key = `air:${lat.toFixed(2)}:${lon.toFixed(2)}`;
    if (cache.has(key) && cache.get(key).until > Date.now()) return send(res, 200, cache.get(key).data);
    const params = new URLSearchParams({ latitude: String(lat), longitude: String(lon), current: 'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi,european_aqi', hourly: 'pm10,pm2_5,us_aqi,european_aqi', timezone: 'auto', forecast_days: '5' });
    try {
      const raw = await fetchJson(`https://air-quality-api.open-meteo.com/v1/air-quality?${params}`);
      const data = normalizeAirData(raw, { latitude: lat, longitude: lon });
      cache.set(key, { data, until: Date.now() + 10 * 60_000 });
      return send(res, 200, data);
    } catch { return send(res, 502, { error: 'Air quality data is temporarily unavailable. Please retry.' }); }
  }
  if (path === '/api/assistant' && req.method === 'POST') {
    const parsed = await readJsonBody(req);
    if (parsed.error) return send(res, parsed.error.status, { error: parsed.error.message });
    const validation = validateAssistantRequest(parsed.body);
    if (!validation.ok) return send(res, validation.status, { error: validation.error });
    if (!process.env.GEMINI_API_KEY) return send(res, 503, { error: 'AI assistant is unavailable because a Gemini API key is not configured.', unavailable: true });
    const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
    try {
      const response = await fetchGemini(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: makePrompt(validation.value.question, validation.value.context, validation.value.history) }] }], generationConfig: { maxOutputTokens: 450 } })
      });
      if (response.status === 429) return send(res, 429, { error: 'Gemini is temporarily rate-limited. Please wait a moment and try again.' });
      if (response.status === 401 || response.status === 403) return send(res, 502, { error: 'Gemini rejected the configured API key. Check GEMINI_API_KEY and its Gemini API access.' });
      if (response.status === 404) return send(res, 502, { error: `Gemini model “${model}” is unavailable. Check GEMINI_MODEL.` });
      if (response.status >= 500) return send(res, 502, { error: `Gemini returned a temporary upstream error (HTTP ${response.status}). Please retry shortly.` });
      if (!response.ok) return send(res, 502, { error: 'Gemini rejected the request. Check the configured model and request settings.' });
      let data;
      try { data = await response.json(); }
      catch { return send(res, 502, { error: 'Gemini returned an invalid response. Please retry.' }); }
      const answer = data.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('').trim();
      if (typeof answer !== 'string' || !answer || answer.length > 4000) return send(res, 502, { error: 'Gemini returned no usable text. Please retry.' });
      return send(res, 200, { answer, provider: 'Gemini' });
    } catch (error) {
      return send(res, error?.name === 'AbortError' ? 504 : 502, { error: error?.name === 'AbortError' ? 'Gemini took too long to respond. Please retry.' : 'AirWise could not reach Gemini. Check the network and try again.' });
    }
  }
  return send(res, 404, { error: 'Not found.' });
}

export async function handleApiRequest(req, res) {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (!url.pathname.startsWith('/api/')) return send(res, 404, { error: 'Not found.' });
    return await api(req, res, url);
  } catch {
    if (!res.headersSent) return send(res, 500, { error: 'Request could not be completed.' });
    return res.end();
  }
}
