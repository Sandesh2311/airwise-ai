import test from 'node:test';
import assert from 'node:assert/strict';
import { KNOWLEDGE_BASE, SUGGESTED_QUESTIONS, getSuggestedAnswer, matchKnowledgeBase, isLiveAirQuestion, extractLiveCity } from '../src/knowledge-base.js';
import { resolveAssistantResponse, LIVE_UNAVAILABLE, AI_UNAVAILABLE } from '../src/hybrid-assistant.js';

test('catalog covers 30+ questions and every current interface suggestion', () => {
  assert.ok(KNOWLEDGE_BASE.length >= 30);
  assert.equal(SUGGESTED_QUESTIONS.length, 3);
  for (const question of SUGGESTED_QUESTIONS) assert.ok(getSuggestedAnswer(question)?.answer, question);
});
test('exact normalization, case, punctuation and common spelling variations match', () => {
  assert.equal(matchKnowledgeBase(' WHAT IS AQI?! ')?.entry.id, 'aqi-basics');
  assert.equal(matchKnowledgeBase('Explain PM 2.5 simply')?.entry.id, 'pm25');
  assert.equal(matchKnowledgeBase('What causes polution?')?.entry.id, 'pollution-causes');
});
test('keyword and Hinglish matching return relevant answers', () => {
  assert.equal(matchKnowledgeBase('PM2.5 vs PM10 farq')?.entry.id, 'pm-comparison');
  assert.equal(matchKnowledgeBase('Bachchon ko pollution se kaise bachayein?')?.entry.id, 'children');
  assert.equal(matchKnowledgeBase('वायु प्रदूषण क्या है')?.entry.id, 'pollution-causes');
});
test('unrelated questions do not receive an offline answer', () => {
  assert.equal(matchKnowledgeBase('Explain quantum entanglement in detail'), null);
});
test('suggested questions answer offline without invoking providers', async () => {
  for (const question of SUGGESTED_QUESTIONS) {
    let calls = 0;
    const result = await resolveAssistantResponse(question, { suggested: true, callGemini: async () => { calls++; }, answerLive: async () => { calls++; } });
    assert.equal(result.provider, 'Knowledge Base');
    assert.equal(calls, 0);
  }
});
test('strong offline answer works without Gemini key or request', async () => {
  let calls = 0;
  const result = await resolveAssistantResponse('What is PM2.5?', { callGemini: async () => { calls++; throw Error(); } });
  assert.equal(result.provider, 'Knowledge Base');
  assert.match(result.answer, /2.5/);
  assert.equal(calls, 0);
});
test('unknown custom question uses and labels Gemini', async () => {
  assert.deepEqual(await resolveAssistantResponse('Explain an unusual atmospheric topic', { callGemini: async () => ({ answer: 'Generated explanation' }) }), { answer: 'Generated explanation', provider: 'Gemini' });
});
test('Gemini failure uses relevant offline fallback or transparent unavailable response', async () => {
  const relevant = await resolveAssistantResponse('air purifier HEPA filter CADR room', { callGemini: async () => { throw Error('offline'); } });
  assert.equal(relevant.provider, 'Knowledge Base');
  const unknown = await resolveAssistantResponse('Explain quantum entanglement', { callGemini: async () => { throw Error('offline'); } });
  assert.equal(unknown.provider, 'Unavailable');
  assert.equal(unknown.answer, AI_UNAVAILABLE);
});
test('current AQI questions require live data and cannot fabricate/fall through', async () => {
  assert.equal(isLiveAirQuestion('current AQI in Delhi'), true);
  assert.equal(isLiveAirQuestion('Delhi AQI'), true);
  assert.equal(isLiveAirQuestion('Delhi ka AQI abhi kya hai'), true);
  assert.equal(isLiveAirQuestion('Where can I find a current official CPCB AQI?'), false);
  assert.equal(extractLiveCity('Delhi ka AQI abhi kya hai'), 'delhi');
  let geminiCalls = 0;
  const failed = await resolveAssistantResponse('current AQI in Delhi', { callGemini: async () => { geminiCalls++; return { answer: 'AQI 42' }; }, answerLive: async () => { throw Error('provider unavailable'); } });
  assert.equal(failed.answer, LIVE_UNAVAILABLE);
  assert.equal(failed.provider, 'Live Data');
  assert.equal(geminiCalls, 0);
  assert.deepEqual(await resolveAssistantResponse('current AQI in Delhi', { answerLive: async () => ({ answer: 'Delhi: US AQI 42 from provider.' }) }), { answer: 'Delhi: US AQI 42 from provider.', provider: 'Live Data' });
});
