import { stripTashkeel } from "@/lib/speech";

// Arabic sentence punctuation the speech recognizer never produces but the
// authored dialogue lines do (، ؛ ؟ plus standard ASCII punctuation) —
// stripped so it never counts as a word-mismatch.
const PUNCTUATION_PATTERN = /[،؛؟.,!?]/g;

/**
 * Orthographic variants that Arabic speech recognizers routinely collapse
 * or confuse even when the pronunciation was correct — these are NOT
 * pronunciation differences, they're transcription noise:
 * أ/إ/آ vs ا (hamza forms), ى vs ي (alef maksura), ة vs ه (ta marbuta at
 * word end sounds identical to ha in isolation). Comparing without
 * unifying these first made every correct answer that happened to land on
 * one of these letters register as a false miss.
 */
function normalizeArabic(text: string): string {
  return stripTashkeel(text)
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(PUNCTUATION_PATTERN, " ")
    .trim();
}

function toWords(text: string): string[] {
  return normalizeArabic(text).split(/\s+/).filter(Boolean);
}

function levenshtein(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const dp: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));
  for (let i = 0; i < rows; i++) dp[i][0] = i;
  for (let j = 0; j < cols; j++) dp[0][j] = j;
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[rows - 1][cols - 1];
}

/**
 * How many characters of residual difference still count as "the same
 * word" *after* the hamza/ta-marbuta/alef-maksura normalization above
 * already absorbed the known ASR-noise cases. Deliberately strict — a
 * real wrong letter (e.g. ه heard as ح) is also exactly a 1-character
 * edit, indistinguishable from noise by distance alone, so a lenient
 * threshold here would forgive genuine mistakes instead of just ASR
 * quirks. Only long words get any slack, where one extra/missing letter
 * is more plausibly a recognizer glitch than a real error.
 */
function matchThreshold(word: string): number {
  if (word.length <= 5) return 0;
  if (word.length <= 8) return 1;
  return 2;
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
 *
 * Fuzzy (edit-distance) rather than exact matching on purpose — browser
 * Arabic speech recognition is noisy (misheard letters, dropped hamzas),
 * and exact string equality was flagging correct answers as wrong just
 * because the transcript spelled a word slightly differently.
 */
export function scorePronunciation(target: string, spoken: string): PronunciationScore {
  const targetWords = toWords(target);
  const available = toWords(spoken);

  const words: PronunciationWordResult[] = targetWords.map((word) => {
    const threshold = matchThreshold(word);
    let bestIdx = -1;
    let bestDist = Infinity;
    for (let i = 0; i < available.length; i++) {
      const dist = levenshtein(word, available[i]);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }
    if (bestIdx !== -1 && bestDist <= threshold) {
      available.splice(bestIdx, 1); // consume so repeated target words each need their own match
      return { word, matched: true };
    }
    return { word, matched: false };
  });

  const matchedCount = words.filter((w) => w.matched).length;
  return {
    score: targetWords.length === 0 ? 0 : matchedCount / targetWords.length,
    matchedCount,
    totalCount: targetWords.length,
    words,
  };
}
