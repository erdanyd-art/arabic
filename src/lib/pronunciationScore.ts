import { stripTashkeel } from "@/lib/speech";

// Arabic sentence punctuation the speech recognizer never produces but the
// authored dialogue lines do (، ؛ ؟ plus standard ASCII punctuation) —
// stripped so it never counts as a word-mismatch.
const PUNCTUATION_PATTERN = /[،؛؟.,!?]/g;

function normalizeWords(text: string): string[] {
  return stripTashkeel(text)
    .replace(PUNCTUATION_PATTERN, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export interface PronunciationWordResult {
  word: string;
  matched: boolean;
}

export interface PronunciationScore {
  /** 0-1 — share of the target line's words actually heard in the recognized speech. */
  score: number;
  matchedCount: number;
  totalCount: number;
  words: PronunciationWordResult[];
}

/**
 * Compares what the browser's speech recognizer heard against a fixed
 * target line — the right kind of "evaluation" for a repeat-after-me
 * drill (did you say the right words), as opposed to the AI Speaking
 * Coach's grammar/vocabulary evaluation, which only makes sense for
 * freely-composed sentences. Deterministic, local, no AI call: a fixed
 * target has one right answer, so a text-similarity check is both cheaper
 * and more reliable here than asking a model to judge it.
 */
export function scorePronunciation(target: string, spoken: string): PronunciationScore {
  const targetWords = normalizeWords(target);
  const spokenWords = normalizeWords(spoken);
  const available = [...spokenWords];

  const words: PronunciationWordResult[] = targetWords.map((word) => {
    const idx = available.indexOf(word);
    if (idx === -1) return { word, matched: false };
    available.splice(idx, 1); // consume so repeated target words each need their own match
    return { word, matched: true };
  });

  const matchedCount = words.filter((w) => w.matched).length;
  return {
    score: targetWords.length === 0 ? 0 : matchedCount / targetWords.length,
    matchedCount,
    totalCount: targetWords.length,
    words,
  };
}
