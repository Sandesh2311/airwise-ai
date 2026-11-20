import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeAirData, validateQuestion, healthAdvice, POLLUTANTS, makePrompt } from '../src/core.js';

const sample={current:{time:'2026-11-20T10:00',pm2_5:12.34,pm10:30,us_aqi:62,european_aqi:18,ozone:null},hourly:{time:['2026-11-20T10:00','2026-11-20T11:00'],pm2_5:[12,13],pm10:[30,32],us_aqi:[62,65],european_aqi:[18,20]}};
test('normalizes supported pollutant readings and keeps AQI scales distinct',()=>{const n=normalizeAirData(sample,{latitude:28.6,longitude:77.2});assert.equal(n.pollutants.pm2_5.value,12.34);assert.equal(n.pollutants.ozone.value,null);assert.equal(n.index.name,'US AQI');assert.equal(n.europeanIndex.name,'European AQI');assert.equal(n.status,'modelled');assert.equal(n.hourly.length,2);});
test('rejects missing provider current data',()=>assert.throws(()=>normalizeAirData({hourly:{}}),/Invalid/));
test('handles missing pollutant and malformed hourly values',()=>{const n=normalizeAirData({current:{time:'bad',pm10:'bad'},hourly:{time:['nonsense'],pm10:['x']} });assert.equal(n.pollutants.pm10.value,null);assert.equal(n.observedAt,null);assert.equal(n.hourly.length,0);assert.equal(n.index,null);});
test('validates empty and oversized city assistant questions',()=>{assert.equal(validateQuestion('').ok,false);assert.equal(validateQuestion('hello').ok,true);assert.equal(validateQuestion('x'.repeat(1001)).ok,false);});
test('health advice is cautious with missing data and profile context',()=>{assert.equal(healthAdvice(null).level,'Data unavailable');const a=healthAdvice({value:151,category:'Unhealthy'},'outdoor-worker');assert.equal(a.level,'Unhealthy');assert.ok(a.tips.length>2);});
test('prompt grounds the model in actual context and user question',()=>{const p=makePrompt('Walk today?',{city:'Delhi'});assert.match(p,/Delhi/);assert.match(p,/Walk today/);});
test('pollutant definitions include units',()=>{assert.equal(POLLUTANTS.pm2_5.unit,'µg/m³');assert.ok(POLLUTANTS.ozone.description);});
