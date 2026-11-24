import { FALLBACK_MATCH_THRESHOLD, getSuggestedAnswer, isLiveAirQuestion, matchKnowledgeBase } from './knowledge-base.js';

export const LIVE_UNAVAILABLE = 'I cannot provide a current AQI reading because live air-quality data is unavailable. Please try again later or check an official local monitoring source.';
export const AI_UNAVAILABLE = 'Advanced AI assistance is temporarily unavailable, and I could not find a reliable offline answer. Please try again later.';

export async function resolveAssistantResponse(question, { suggested = false, callGemini, answerLive } = {}) {
  if (suggested) {
    const item = getSuggestedAnswer(question);
    if (item) return { answer: item.answer, provider: 'Knowledge Base' };
  }
  if (isLiveAirQuestion(question)) {
    try {
      const result = await answerLive?.(question);
      if (result && typeof result.answer === 'string' && result.answer) return { ...result, provider: 'Live Data' };
    } catch { /* No stale KB or Gemini answer may substitute for missing live readings. */ }
    return { answer: LIVE_UNAVAILABLE, provider: 'Live Data' };
  }
  const match = matchKnowledgeBase(question);
  if (match) return { answer: match.entry.answer, provider: 'Knowledge Base' };
  try {
    const result = await callGemini?.(question);
    if (result && typeof result.answer === 'string' && result.answer.trim()) return { answer: result.answer, provider: 'Gemini' };
  } catch { /* Use relevant offline guidance if Gemini is unavailable. */ }
  const fallback = matchKnowledgeBase(question, { threshold: FALLBACK_MATCH_THRESHOLD });
  if (fallback) return { answer: fallback.entry.answer, provider: 'Knowledge Base' };
  return { answer: AI_UNAVAILABLE, provider: 'Unavailable' };
}
