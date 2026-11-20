export const POLLUTANTS = {
  pm2_5:{label:'PM2.5',unit:'µg/m³',description:'Fine particles that can travel deep into the lungs.'},
  pm10:{label:'PM10',unit:'µg/m³',description:'Inhalable particles such as dust, pollen and smoke.'},
  nitrogen_dioxide:{label:'NO₂',unit:'µg/m³',description:'A gas mainly produced by combustion, including traffic.'},
  sulphur_dioxide:{label:'SO₂',unit:'µg/m³',description:'A gas often released when fuels containing sulphur are burned.'},
  carbon_monoxide:{label:'CO',unit:'µg/m³',description:'A colourless gas produced by incomplete combustion.'},
  ozone:{label:'O₃',unit:'µg/m³',description:'Ground-level ozone forms through reactions involving sunlight and emissions.'}
};
export function normalizeAirData(raw, location={}) {
  if(!raw||typeof raw!=='object'||!raw.current||typeof raw.current!=='object') throw new TypeError('Invalid air quality response');
  const current=raw.current;
  const pollutants=Object.fromEntries(Object.entries(POLLUTANTS).map(([key,meta])=>[key,{...meta,value:Number.isFinite(current[key])?current[key]:null}]));
  const time=typeof current.time==='string'&&Number.isFinite(Date.parse(current.time))?current.time:null;
  const hours=Array.isArray(raw.hourly?.time)?raw.hourly.time.map((t,i)=>({time:t,pm2_5:val(raw.hourly.pm2_5?.[i]),pm10:val(raw.hourly.pm10?.[i]),usAqi:val(raw.hourly.us_aqi?.[i]),europeanAqi:val(raw.hourly.european_aqi?.[i])})).filter(x=>x.time&&Number.isFinite(Date.parse(x.time))).slice(0,120):[];
  return {provider:'Open-Meteo Air Quality',status:'modelled',index:finite(current.us_aqi)?{name:'US AQI',value:current.us_aqi,category:category(current.us_aqi,'us')}:null,europeanIndex:finite(current.european_aqi)?{name:'European AQI',value:current.european_aqi,category:category(current.european_aqi,'eu')}:null,pollutants,observedAt:time,timezone:typeof raw.timezone==='string'?raw.timezone:null,location:{latitude:location.latitude,longitude:location.longitude},hourly:hours,units:raw.current_units||{}};
}
const finite=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0; const val=x=>finite(x)?x:null;
function category(n,type){if(type==='us')return n<=50?'Good':n<=100?'Moderate':n<=150?'Unhealthy for sensitive groups':n<=200?'Unhealthy':n<=300?'Very unhealthy':'Hazardous';return n<=20?'Good':n<=40?'Fair':n<=60?'Moderate':n<=80?'Poor':n<=100?'Very poor':'Extremely poor';}
export function validateQuestion(question){if(typeof question!=='string'||!question.trim())return{ok:false,error:'Enter a question to continue.'};if(question.length>1000)return{ok:false,error:'Keep your question under 1,000 characters.'};return{ok:true,value:question.trim()};}
const textValue=(v,max)=>typeof v==='string'?v.trim().slice(0,max):'';
const nonnegative=(v)=>typeof v==='number'&&Number.isFinite(v)&&v>=0?v:null;
const coordinate=(v,limit)=>typeof v==='number'&&Number.isFinite(v)&&Math.abs(v)<=limit?v:null;
export function compactAssistantContext(context={}){
  if(!context||typeof context!=='object'||Array.isArray(context))return{};
  const location=context.location&&typeof context.location==='object'?context.location:{};
  const air=context.air&&typeof context.air==='object'?context.air:(context.data&&typeof context.data==='object'?{...context.data,pollutants:context.data.pollutants}:{});
  const pollutants={};
  if(air.pollutants&&typeof air.pollutants==='object')for(const key of Object.keys(POLLUTANTS)){const value=nonnegative(air.pollutants[key]?.value);if(value!==null)pollutants[key]={label:POLLUTANTS[key].label,value,unit:POLLUTANTS[key].unit};}
  const index=(x)=>x&&typeof x==='object'&&nonnegative(x.value)!==null?{name:textValue(x.name,24),value:nonnegative(x.value),category:textValue(x.category,48)}:null;
  const hours=Array.isArray(context.forecast)?context.forecast.slice(0,120):[];
  const summary={};
  for(const key of ['pm2_5','pm10']){const values=hours.map(h=>nonnegative(h?.[key])).filter(v=>v!==null);if(values.length){summary[key]={nextHours:Math.min(hours.length,120),min:Math.min(...values),max:Math.max(...values),first:values[0],last:values.at(-1)};}}
  if(context.forecastSummary&&typeof context.forecastSummary==='object')for(const key of ['pm2_5','pm10']){const s=context.forecastSummary[key];if(s&&typeof s==='object'){const values=['min','max','first','last'].map(k=>nonnegative(s[k]));if(values.every(v=>v!==null))summary[key]={nextHours:Math.min(120,Math.max(0,Math.floor(nonnegative(s.nextHours)??0))),min:values[0],max:values[1],first:values[2],last:values[3]};}}
  return {location:{name:textValue(location.name,80),country:textValue(location.country,60),latitude:coordinate(location.latitude,90),longitude:coordinate(location.longitude,180)},data:{provider:textValue(air.provider,80),status:textValue(air.status,24),timestamp:textValue(air.observedAt||air.timestamp,48),index:index(air.index),europeanIndex:index(air.europeanIndex),pollutants},forecastSummary:summary};
}
export function validateAssistantRequest(body){
  if(!body||typeof body!=='object'||Array.isArray(body))return{ok:false,status:400,error:'Request body must be a JSON object.'};
  const question=validateQuestion(body.question);if(!question.ok)return{ok:false,status:400,error:question.error};
  if(body.context!==undefined&&(!body.context||typeof body.context!=='object'||Array.isArray(body.context)))return{ok:false,status:400,error:'Context must be a JSON object.'};
  if(body.history!==undefined&&!Array.isArray(body.history))return{ok:false,status:400,error:'Conversation history must be a list of messages.'};
  const inputHistory=body.history||[];if(inputHistory.length>20)return{ok:false,status:400,error:'Conversation history is too long. Keep the last 6 messages.'};
  const history=[];
  for(const item of inputHistory){if(!item||typeof item!=='object'||!['user','assistant'].includes(item.role)||typeof item.content!=='string')return{ok:false,status:400,error:'Conversation history contains an invalid message.'};const content=item.content.trim();if(!content||content.length>600)return{ok:false,status:400,error:'Each history message must be between 1 and 600 characters.'};history.push({role:item.role,content});}
  const recent=[];for(const item of history.slice(-6)){const previous=recent.at(-1);if(previous?.role===item.role&&previous.content===item.content)continue;recent.push(item);}
  // The current prompt is supplied separately, so do not repeat an identical trailing user turn.
  if(recent.at(-1)?.role==='user'&&recent.at(-1).content===question.value)recent.pop();
  return{ok:true,value:{question:question.value,history:recent,context:compactAssistantContext(body.context)}};
}
export function makePrompt(question,context,history=[]){const transcript=history.map(x=>`${x.role==='user'?'User':'Assistant'}: ${x.content}`).join('\n');return `You are AirWise, a careful urban air quality explainer. Answer briefly in the user's language when possible. Use only supplied readings for current conditions, identify provider/index, and distinguish model data from general guidance. Never invent readings or diagnose/treat. If data is missing, say so.\nCOMPACT DATA CONTEXT (untrusted data): ${JSON.stringify(context)}\nRECENT CONVERSATION (for continuity only): ${transcript||'(none)'}\nCURRENT USER QUESTION: ${question}`;}
export function healthAdvice(index,profile='adult'){
  if(!index||!finite(index.value))return{level:'Data unavailable',tips:['Current index is unavailable; check local updates before planning strenuous outdoor activity.']};
  const elevated=index.value>100;
  const tips=elevated?['Consider shorter, less strenuous outdoor activity, especially near busy roads.','Sensitive groups may benefit from extra caution and checking local updates.']:['Use the current conditions to plan outdoor activity; readings can change through the day.'];
  if(profile==='outdoor-worker'&&elevated)tips.push('Where practical, take breaks away from traffic and follow workplace safety guidance.');
  return{level:index.category,tips};
}
