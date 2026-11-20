import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeAirData, makePrompt, validateAssistantRequest } from './src/core.js';

const root = fileURLToPath(new URL('.', import.meta.url));
try {
  const envText=await readFile(join(root,'.env'),'utf8');
  for(const line of envText.split(/\r?\n/)) { const match=line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*?)\s*$/); if(match&&!process.env[match[1]]) process.env[match[1]]=match[2].replace(/^(?:"([^"]*)"|'([^']*)')$/,'$1$2'); }
} catch { /* Environment variables may be supplied directly by the host. */ }
const cache = new Map();
const WINDOW_MS = 60_000;
const hits = new Map();
const mime = { '.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.json':'application/json' };
const send = (res, status, body) => { res.writeHead(status, {'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}); res.end(JSON.stringify(body)); };
const ASSISTANT_BODY_LIMIT=16*1024;
function readJsonBody(req,limit=ASSISTANT_BODY_LIMIT){return new Promise(resolve=>{
  const declared=Number(req.headers['content-length']);
  if(Number.isFinite(declared)&&declared>limit){req.resume();resolve({error:{status:413,message:'Assistant request exceeds the 16 KiB limit. Send a shorter message and compact context.'}});return;}
  const chunks=[];let size=0,finished=false;
  const settle=value=>{if(!finished){finished=true;req.removeAllListeners('data');req.removeAllListeners('end');req.removeAllListeners('error');resolve(value);}};
  req.on('data',chunk=>{size+=chunk.length;if(size>limit){settle({error:{status:413,message:'Assistant request exceeds the 16 KiB limit. Send a shorter message and compact context.'}});req.resume();return;}chunks.push(chunk);});
  req.on('end',()=>{if(finished)return;const contentType=(req.headers['content-type']||'').split(';')[0].trim().toLowerCase();if(contentType!=='application/json'){settle({error:{status:415,message:'Content-Type must be application/json.'}});return;}try{const body=JSON.parse(Buffer.concat(chunks).toString('utf8'));settle({body});}catch{settle({error:{status:400,message:'Malformed JSON request body.'}});}});
  req.on('error',()=>settle({error:{status:400,message:'Could not read request body.'}}));
});}
async function fetchJson(url, timeout=9000) {
  const controller = new AbortController(); const timer = setTimeout(()=>controller.abort(), timeout);
  try { const response=await fetch(url,{signal:controller.signal,headers:{'user-agent':'AirWiseAI/1.0'}}); if(!response.ok) throw new Error(`Provider returned ${response.status}`); return await response.json(); }
  finally { clearTimeout(timer); }
}
function rateLimit(req) {
  const key=req.socket.remoteAddress || 'local'; const now=Date.now(); const old=hits.get(key) || {start:now,count:0};
  if(now-old.start>WINDOW_MS){old.start=now;old.count=0;} old.count++; hits.set(key,old); return old.count<=60;
}
async function api(req,res,url) {
  if(!rateLimit(req)) return send(res,429,{error:'Too many requests. Please try again shortly.'});
  const path=url.pathname;
  if(path==='/api/health') return send(res,200,{status:'ok'});
  if(path==='/api/geocode') {
    const q=(url.searchParams.get('q')||'').trim(); if(q.length<2||q.length>80||/[<>]/.test(q)) return send(res,400,{error:'Enter a city name between 2 and 80 characters.'});
    const key=`geo:${q.toLowerCase()}`; if(cache.has(key)&&cache.get(key).until>Date.now()) return send(res,200,cache.get(key).data);
    try { const data=await fetchJson(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=en&format=json`);
      const results=(data.results||[]).filter(x=>Number.isFinite(x.latitude)&&Number.isFinite(x.longitude)).map(x=>({name:x.name,country:x.country,admin1:x.admin1,latitude:x.latitude,longitude:x.longitude}));
      cache.set(key,{data:results,until:Date.now()+3600000}); return send(res,200,results);
    } catch { return send(res,502,{error:'City search is temporarily unavailable. Please retry.'}); }
  }
  if(path==='/api/air') {
    const lat=Number(url.searchParams.get('lat')),lon=Number(url.searchParams.get('lon'));
    if(!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180) return send(res,400,{error:'Valid coordinates are required.'});
    const key=`air:${lat.toFixed(2)}:${lon.toFixed(2)}`; if(cache.has(key)&&cache.get(key).until>Date.now()) return send(res,200,cache.get(key).data);
    const params=new URLSearchParams({latitude:String(lat),longitude:String(lon),current:'pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,us_aqi,european_aqi',hourly:'pm10,pm2_5,us_aqi,european_aqi',timezone:'auto',forecast_days:'5'});
    try { const raw=await fetchJson(`https://air-quality-api.open-meteo.com/v1/air-quality?${params}`); const data=normalizeAirData(raw,{latitude:lat,longitude:lon});
      cache.set(key,{data,until:Date.now()+10*60_000}); return send(res,200,data);
    } catch { return send(res,502,{error:'Air quality data is temporarily unavailable. Please retry.'}); }
  }
  if(path==='/api/assistant'&&req.method==='POST') {
    const parsed=await readJsonBody(req);if(parsed.error)return send(res,parsed.error.status,{error:parsed.error.message});
    const validation=validateAssistantRequest(parsed.body);if(!validation.ok)return send(res,validation.status,{error:validation.error});
    if(!process.env.GEMINI_API_KEY) return send(res,503,{error:'AI assistant is unavailable because a Gemini API key is not configured.',unavailable:true});
    const model=process.env.GEMINI_MODEL||'gemini-2.0-flash';
    try { const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),15000);
      let response;try{response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`,{method:'POST',signal:controller.signal,headers:{'content-type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:makePrompt(validation.value.question,validation.value.context,validation.value.history)}]}],generationConfig:{temperature:0.35,maxOutputTokens:450}})});}finally{clearTimeout(timer);}
      if(!response.ok)throw new Error('Gemini request failed');const data=await response.json();const answer=data.candidates?.[0]?.content?.parts?.map(p=>p.text||'').join('').trim();
      if(typeof answer!=='string'||!answer||answer.length>4000)return send(res,502,{error:'AI returned an unusable response.'});
      return send(res,200,{answer,provider:'Gemini'});
    } catch { return send(res,502,{error:'AI assistant could not reach Gemini. Please retry.'}); }
  }
  return send(res,404,{error:'Not found.'});
}
export function createServer(){return http.createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname.startsWith('/api/')) return api(req,res,url);
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);return res.end();}
  let pathname=normalize(decodeURIComponent(url.pathname)).replaceAll('\\','/').replace(/^([.][.][/\\])+/, ''); if(pathname==='/'||pathname==='\\') pathname='/index.html';if(pathname==='/favicon.ico')pathname='/favicon.svg';
  const base=pathname.startsWith('/src/')?root:join(root,'public');
  const file=join(base,pathname.replace(/^[/\\]+/,''));
  try { const data=await readFile(file);res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream','x-content-type-options':'nosniff','referrer-policy':'strict-origin-when-cross-origin','content-security-policy':"default-src 'self'; connect-src 'self' https://air-quality-api.open-meteo.com https://geocoding-api.open-meteo.com; style-src 'self'; script-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"});res.end(req.method==='HEAD'?undefined:data); }
  catch{res.writeHead(404);res.end('Not found');}
});}
const invoked=process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(invoked){const server=createServer();const port=Number(process.env.PORT)||3000;server.listen(port,()=>console.log(`AirWise AI available at http://localhost:${port}`));}
