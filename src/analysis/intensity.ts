import { clamp } from '../util';

const EMOTIONAL_KEYWORDS: Record<string, number> = {
  angry: 0.9,
  furious: 1.0,
  upset: 0.7,
  hate: 1.0,
  disappointed: 0.6,
  sorry: 0.2,
  sad: 0.5,
  love: 0.6,
  excited: 0.7,
  'not acceptable': 0.9,
};

export function computeIntensityForMessage(text: string): number {
  if (!text || !text.trim()) return 0;
  const len = text.length;
  const punctMatches = text.match(/[!?.]/g) || [];
  const punctuationDensity = punctMatches.length / Math.max(1, len);

  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  const avgSentenceLen = sentences.reduce((s, a) => s + a.length, 0) / Math.max(1, sentences.length);
  const variance = sentences.length > 1 ? sentences.reduce((s, a) => s + Math.pow(a.length - avgSentenceLen, 2), 0) / sentences.length : 0;
  const sentenceVarianceFactor = Math.min(1, variance / 1000);

  const lower = text.toLowerCase();
  let keywordScore = 0;
  for (const k of Object.keys(EMOTIONAL_KEYWORDS)) {
    if (lower.includes(k)) keywordScore = Math.max(keywordScore, EMOTIONAL_KEYWORDS[k]);
  }

  const capsRatio = (text.replace(/[^A-Z]/g, '').length) / Math.max(1, len);
  const capsFactor = Math.min(1, capsRatio * 5);

  const accusation = /\b(you are|you're|liar|stupid|idiot|shut up|you always)\b/i.test(text) ? 1 : 0;

  const negation = /\b(not|never|no|n't)\b/i.test(text) ? 1 : 0;

  // Combine heuristics
  let score = 0;
  score += punctuationDensity * 3.0; // punctuation matters
  score += sentenceVarianceFactor * 2.0;
  score += keywordScore * 1.5;
  score += capsFactor * 1.2;
  score += accusation * 1.5;

  if (negation) score *= 0.8;

  // Normalize to 0-1
  score = clamp(score / 3.5, 0, 1);
  return score;
}
