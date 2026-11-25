import { healthAdvice, compactAssistantContext, recentAssistantHistory, validateQuestion } from '/src/core.js';
import { extractLiveCity } from '/src/knowledge-base.js';
import { resolveAssistantResponse } from '/src/hybrid-assistant.js';
let selected = null;
let air = null;
let searchTimer;
let searchVersion = 0;
let airVersion = 0;
let assistantPending = false;
let chatHistory = [];
const $=id=>document.getElementById(id);
const safe=(value)=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function setError(message = '') {
  const notice = $('error');
  notice.textContent = message;
  notice.hidden = !message;
}
async function getJson(url, options) {
  const response = await fetch(url, options);
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('The server returned an unexpected response.');
  }
  if (!response.ok) throw new Error(data?.error || 'Request failed.');
  return data;
}

function placeLabel(location) {
  return [location.name, location.admin1, location.country].filter(Boolean).join(', ');
}

function lookupCity(city) {
  return getJson('/api/geocode?' + new URLSearchParams({ q: city }));
}

function fetchAir(location) {
  return getJson('/api/air?' + new URLSearchParams({ lat: location.latitude, lon: location.longitude }));
}

function selectLocation(location) {
  clearTimeout(searchTimer);
  searchVersion++;
  selected = location;
  air = null;
  $('placeName').textContent = placeLabel(location);
  $('searchResults').replaceChildren();
  $('searchStatus').textContent = '';
  return loadAir();
}

async function searchCity() {
  clearTimeout(searchTimer);
  const version = ++searchVersion;
  const query = $('citySearch').value.trim();
  const resultsElement = $('searchResults');
  const status = $('searchStatus');
  resultsElement.replaceChildren();
  if (query.length < 2) {
    status.textContent = 'Enter at least two characters.';
    return;
  }

  status.textContent = 'Searching…';
  try {
    const results = await lookupCity(query);
    if (version !== searchVersion) return;
    if (!results.length) {
      status.textContent = 'No matching locations found. Try another city.';
      return;
    }
    status.textContent = 'Select a result to load air quality.';
    for (const location of results) {
      const button = document.createElement('button');
      button.className = 'result-item';
      button.type = 'button';
      button.textContent = placeLabel(location);
      button.onclick = () => selectLocation(location);
      resultsElement.append(button);
    }
  } catch (error) {
    if (version === searchVersion) status.textContent = error.message;
  }
}

function drawGauge(index){const gauge=$('gauge');if(!index){gauge.style.background='conic-gradient(#dce5e8 0deg 360deg)';gauge.setAttribute('aria-label','Air quality index unavailable');return;}const max=index.name==='US AQI'?300:100;const angle=Math.min(index.value/max,1)*360;let color=index.value>150?'#d66a58':index.value>100?'#e3a537':'#17a887';gauge.style.background=`conic-gradient(${color} ${angle}deg,#dce5e8 ${angle}deg 360deg)`;gauge.setAttribute('aria-label',`${index.name} ${index.value}, ${index.category}`);}
function updateAdvice(){const profile=$('profile').value;const data=healthAdvice(air?.index,profile);$('adviceTitle').textContent=data.level==='Data unavailable'?'Air quality guidance is limited':`General guidance · ${data.level}`;$('adviceList').replaceChildren(...data.tips.map(t=>{const li=document.createElement('li');li.textContent=t;return li;}));}
function render(){if(!air)return;const idx=air.index||air.europeanIndex;$('sourceBadge').textContent=air.status==='modelled'?'MODELLED DATA':'SOURCE';$('indexName').textContent=idx?.name||'AQI unavailable';$('indexValue').textContent=idx?.value??'—';$('category').textContent=idx?.category||'Index unavailable';$('category').className=`category ${!idx?'neutral':idx.value>150?'bad':idx.value>100?'warn':''}`;$('summary').textContent=idx?`Current ${idx.name} reading`:'Pollutant concentrations only';$('indexExplanation').textContent=air.index?'This is the US AQI supplied by Open-Meteo, not India’s National AQI.':air.europeanIndex?'US AQI is unavailable; European AQI is shown separately.':'No AQI index was supplied for this time.';drawGauge(idx);$('coords').textContent=`${air.location.latitude.toFixed(3)}, ${air.location.longitude.toFixed(3)}`;$('updated').textContent=air.observedAt?`Provider time ${air.observedAt}${air.timezone?` · ${air.timezone}`:''}`:'Timestamp unavailable';$('sourceUpdated').textContent=air.observedAt||'Not available';$('provider').textContent=air.provider+' · modelled';const grid=$('pollutants');grid.replaceChildren();for(const p of Object.values(air.pollutants)){if(p.value===null)continue;const div=document.createElement('div');div.className='pollutant';div.title=p.description;div.innerHTML=`<span>${safe(p.label)}</span><strong>${safe(Number(p.value.toFixed(1)))}</strong><small>${safe(p.unit)}</small>`;grid.append(div);}if(!grid.children.length){grid.innerHTML='<p class="muted">No pollutant concentrations available.</p>';}$('sourceBadge').className='badge blue';drawChart(air.hourly);updateAdvice();}
function drawChart(hours){const chart=$('chart');chart.replaceChildren();if(!hours?.length){chart.setAttribute('aria-label','Forecast chart unavailable');chart.innerHTML='<div class="empty">Forecast will appear when available.</div>';return;}const data=hours.filter((_,i)=>i%4===0).slice(0,36),values=data.flatMap(x=>[x.pm2_5,x.pm10]).filter(Number.isFinite);if(!values.length){chart.setAttribute('aria-label','Pollutant forecast values unavailable');chart.innerHTML='<div class="empty">Pollutant forecast values unavailable.</div>';return;}const max=Math.max(...values,1),w=800,h=180,pad=25;const poly=key=>data.map((x,i)=>`${pad+i*(w-2*pad)/Math.max(data.length-1,1)},${h-pad-(Number.isFinite(x[key])?x[key]:0)/max*(h-2*pad)}`).join(' ');const labels=data.map((x,i)=>i%Math.max(1,Math.floor(data.length/6))===0?`<text x="${pad+i*(w-2*pad)/Math.max(data.length-1,1)}" y="${h-3}" text-anchor="middle">${safe(new Date(x.time).toLocaleDateString(undefined,{month:'short',day:'numeric'}))}</text>`:'').join('');chart.innerHTML=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Modelled hourly PM2.5 and PM10 forecast over up to five days"><g stroke="#edf1f4" stroke-width="1"><path d="M25 25H780M25 65H780M25 105H780M25 145H780"/></g><polyline fill="none" stroke="#19a88c" stroke-width="3" points="${poly('pm2_5')}"/><polyline fill="none" stroke="#60bce7" stroke-width="3" points="${poly('pm10')}"/><g fill="#81909e" font-size="10">${labels}</g></svg>`;chart.setAttribute('aria-label',`Forecast chart with ${data.length} selected time points. PM2.5 and PM10 are model estimates.`);}
async function loadAir() {
  if (!selected) return;
  const version = ++airVersion;
  setError();
  $('loading').hidden = false;
  try {
    const data = await fetchAir(selected);
    if (version !== airVersion) return;
    air = data;
    render();
  } catch (error) {
    if (version !== airVersion) return;
    air = null;
    setError(error.message);
    $('sourceBadge').textContent = 'UNAVAILABLE';
    $('sourceBadge').className = 'badge';
    $('indexValue').textContent = '—';
    $('indexName').textContent = 'Data unavailable';
    $('category').textContent = 'Unavailable';
    $('category').className = 'category neutral';
    $('summary').textContent = 'Current conditions unavailable';
    $('indexExplanation').textContent = 'An index will appear when provider data is available.';
    $('coords').textContent = 'Coordinates unavailable';
    $('updated').textContent = 'Timestamp unavailable';
    $('sourceUpdated').textContent = 'Not available';
    $('pollutants').innerHTML = '<p class="muted">Provider data could not be loaded. Try refreshing.</p>';
    drawGauge(null);
    drawChart([]);
    updateAdvice();
  } finally {
    if (version === airVersion) $('loading').hidden = true;
  }
}

function addMessage(text, kind, provider = '') {
  const message = document.createElement('div');
  message.className = kind === 'user' ? 'user-message' : 'assistant-message';
  if (kind === 'user') {
    message.textContent = text;
  } else {
    const icon = document.createElement('span');
    icon.className = 'bot-icon';
    icon.textContent = '?';
    icon.setAttribute('aria-hidden', 'true');
    const paragraph = document.createElement('p');
    if (provider) {
      const label = document.createElement('strong');
      label.className = 'message-source';
      label.textContent = provider;
      paragraph.append(label, document.createElement('br'));
    }
    const body = document.createElement('span');
    body.textContent = text;
    paragraph.append(body);
    message.append(icon, paragraph);
  }
  const messages = $('chatMessages');
  messages.append(message);
  messages.scrollTop = messages.scrollHeight;
}
async function liveAnswer(question) {
  const city = extractLiveCity(question);
  const location = city ? (await lookupCity(city))[0] : selected;
  if (!location) throw new Error('No live-data location match');
  const data = await fetchAir(location);
  const place = placeLabel(location) || 'Selected location';
  const timestamp = [data.observedAt, data.timezone].filter(Boolean).join(' ');
  const lines = [`${place} · modelled Open-Meteo data${data.observedAt ? ` (${timestamp})` : ''}.`];
  const indices = [data.index, data.europeanIndex].filter(Boolean);
  for (const index of indices) lines.push(index.name + ': ' + index.value + ' (' + index.category + ').');
  if (!indices.length) lines.push('The provider did not supply an AQI index for this reading.');
  lines.push('These are modelled US/European indices, not CPCB National AQI or a station observation.');
  return { answer: lines.join(' ') };
}

const assistantStatus = {
  Gemini: 'Generated by Gemini using available location context.',
  'Knowledge Base': 'Answered from the offline Knowledge Base.',
  'Live Data': 'Answered from current provider data.',
  Unavailable: 'Advanced AI is unavailable; no reliable offline answer matched.'
};

async function ask(question, { suggested = false } = {}) {
  const message = String(question ?? '').trim();
  if (!message || assistantPending) return;
  const validation = validateQuestion(message);
  if (!validation.ok) {
    addMessage(validation.error, 'assistant');
    return;
  }

  assistantPending = true;
  const input = $('question');
  const form = $('chatForm');
  const sendButton = form?.querySelector('button[type="submit"]') || form?.querySelector('button');
  const status = $('aiStatus');
  try {
    if (sendButton) sendButton.disabled = true;
    addMessage(message, 'user');
    if (input) input.value = '';
    if (status) status.textContent = 'AirWise is preparing a grounded answer…';

    const result = await resolveAssistantResponse(message, {
      suggested,
      answerLive: liveAnswer,
      callGemini: question => getJson('/api/assistant', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          question,
          history: recentAssistantHistory(chatHistory, question),
          context: compactAssistantContext({ location: selected, air, forecast: air?.hourly?.slice(0, 24) })
        })
      })
    });

    addMessage(result.answer, 'assistant', result.provider);
    if (result.provider === 'Gemini') {
      chatHistory = [
        ...chatHistory,
        { role: 'user', content: message.slice(0, 600) },
        { role: 'assistant', content: result.answer.slice(0, 600) }
      ].slice(-6);
    }
    if (status) status.textContent = assistantStatus[result.provider];
  } catch (error) {
    addMessage(error.message, 'assistant', 'Unavailable');
    if (status) status.textContent = 'Assistant request failed.';
  } finally {
    assistantPending = false;
    if (sendButton) sendButton.disabled = false;
  }
}

const info=[['PM2.5','Fine particles ≤2.5 µm. Sources include combustion, traffic and fires. Fine particles can reach deep into the lungs. Lower concentrations generally mean less particle exposure; this app displays µg/m³ without assigning India AQI bands.','Reduce exposure near traffic and smoke; check local updates.'],['PM10','Particles ≤10 µm, including road dust, pollen and construction dust. Can irritate the airways. Concentration is reported in µg/m³.','Avoid dusty areas and keep windows closed during nearby dust events.'],['NO₂','Combustion gas commonly associated with road traffic and fuel burning. Can affect respiratory health.','Choose routes away from heavy traffic when practical.'],['SO₂','Gas from burning sulphur-containing fuels and some industrial processes. Can irritate airways.','Follow local air quality updates during elevated readings.'],['CO','Colourless gas from incomplete combustion, including engines and heaters. High exposures are dangerous. Outdoor regional estimates are not indoor safety monitors.','Maintain combustion appliances safely; never rely on this app for CO alarms.'],['O₃','Ground-level ozone forms in sunlight from other emissions; it is different from protective ozone high in the atmosphere.','Consider reducing strenuous outdoor activity when local ozone readings are high.']];
for(const [name,body,tip]of info){const c=document.createElement('article');c.className='edu-card';c.innerHTML=`<h3>${safe(name)}</h3><p>${safe(body)}</p><strong>Practical step</strong><p>${safe(tip)}</p>`;$('pollutantInfo').append(c);}
const citySearch = $('citySearch');
$('searchBtn').onclick = searchCity;
citySearch.addEventListener('keydown', event => {
  if (event.key !== 'Enter') return;
  event.preventDefault();
  searchCity();
});
citySearch.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchVersion++;
  $('searchResults').replaceChildren();
  $('searchStatus').textContent = '';
  if (citySearch.value.trim().length >= 2) searchTimer = setTimeout(searchCity, 350);
});

$('refresh').onclick = loadAir;
$('profile').onchange = updateAdvice;
$('chatForm').onsubmit = event => {
  event.preventDefault();
  ask($('question').value);
};
document.querySelectorAll('.chip').forEach(button => {
  button.onclick = () => ask(button.textContent, { suggested: true });
});

$('locate').onclick = () => {
  const status = $('searchStatus');
  if (!navigator.geolocation) {
    status.textContent = 'Geolocation is not supported by this browser.';
    return;
  }
  clearTimeout(searchTimer);
  const version = ++searchVersion;
  status.textContent = 'Requesting location permission…';
  navigator.geolocation.getCurrentPosition(position => {
    if (version !== searchVersion) return;
    const { latitude, longitude } = position.coords;
    selectLocation({ name: 'Your location', country: '', latitude, longitude });
  }, error => {
    if (version !== searchVersion) return;
    status.textContent = error.code === 1
      ? 'Location permission was denied. Search for a city instead.'
      : 'Could not determine your location. Try searching for a city.';
  }, { timeout: 10000, maximumAge: 300000 });
};

const menu = $('menu');
const navigation = document.querySelector('.topbar nav');
menu.onclick = () => {
  const open = navigation.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
};
navigation.querySelectorAll('a').forEach(link => {
  link.onclick = () => {
    navigation.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
  };
});
