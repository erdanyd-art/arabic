import type { VoiceGender } from "@/lib/types";

// Arabic combining diacritics (tashkeel/harakat) — fathatan, dammatan,
// kasratan, fatha, damma, kasra, shadda, sukun, superscript alef, Quranic
// annotation marks, etc. Many system TTS voices have no real Arabic voice
// installed and fall back to a generic engine that doesn't know how to
// pronounce these combining marks — instead of skipping them it reads each
// one out as a stray "dot" sound. Stripping them leaves the base letters,
// which every fallback voice can at least attempt to sound out.
//
// Built via `new RegExp` from a plain-ASCII \u-escape string on purpose —
// a regex *literal* with real combining-mark glyphs pasted inside the
// character class is unreliable to author/review (adjacent combining
// marks are visually indistinguishable and can silently merge unrelated
// ranges together). Escapes keep every boundary explicit and diffable.
// Ranges: U+0610-061A (honorifics), U+064B-065F (diacritics), U+0670
// (superscript alef), U+06D6-06DC / U+06DF-06E4 / U+06E7-06E8 / U+06EA-06ED
// (Quranic annotation signs).
const TASHKEEL_PATTERN = new RegExp(
  "[\\u0610-\\u061A\\u064B-\\u065F\\u0670\\u06D6-\\u06DC\\u06DF-\\u06E4\\u06E7-\\u06E8\\u06EA-\\u06ED]",
  "g",
);

export function stripTashkeel(text: string): string {
  return text.replace(TASHKEEL_PATTERN, "");
}

// The Web Speech API does not expose a real "gender" field on
// SpeechSynthesisVoice — this is a best-effort guess from known voice
// names shipped by major OS/browser TTS engines. It will not recognize
// every voice, and many systems (a stock macOS install, for example) only
// ship a single Arabic voice at all, in which case no guess can help —
// see `getArabicVoiceAvailability` for surfacing that limitation honestly
// instead of silently doing nothing.
const FEMALE_VOICE_NAME_HINTS = ["hoda", "salma", "laila", "amira", "zeina", "fatima", "noor", "female"];
const MALE_VOICE_NAME_HINTS = ["maged", "majed", "naayf", "nayef", "tarik", "hamed", "male"];

function guessVoiceGender(voice: SpeechSynthesisVoice): VoiceGender | null {
  const name = voice.name.toLowerCase();
  if (FEMALE_VOICE_NAME_HINTS.some((hint) => name.includes(hint))) return "wanita";
  if (MALE_VOICE_NAME_HINTS.some((hint) => name.includes(hint))) return "pria";
  return null;
}

function listArabicVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return [];
  return window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith("ar"));
}

interface VoicePick {
  voice: SpeechSynthesisVoice | null;
  matchedPreference: boolean;
  /** true when a *different* voice exists that could satisfy the other gender — i.e. the mismatch is fixable in principle, not a hard platform limit. */
  alternativeExists: boolean;
}

function pickArabicVoice(preferred?: VoiceGender): VoicePick {
  const voices = listArabicVoices();
  if (voices.length === 0) return { voice: null, matchedPreference: false, alternativeExists: false };

  if (preferred) {
    const match = voices.find((v) => guessVoiceGender(v) === preferred);
    if (match) return { voice: match, matchedPreference: true, alternativeExists: false };
  }

  return {
    voice: voices[0],
    matchedPreference: !preferred,
    alternativeExists: voices.length > 1,
  };
}

/** Call this to decide whether to warn the user their gender preference can't be honored on this device/browser. */
export function getArabicVoiceAvailability(preferred: VoiceGender) {
  const { matchedPreference, alternativeExists, voice } = pickArabicVoice(preferred);
  return {
    honored: matchedPreference,
    hasVoiceAtAll: voice !== null,
    // Only one Arabic voice total (or none) → nothing switching the toggle
    // could ever do; more than one but none matched the guess → a real gap
    // in our heuristic, not the platform.
    isPlatformLimit: voice !== null && !alternativeExists,
  };
}

let voicesReadyResolvers: Array<() => void> = [];
let voicesReady = false;

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  const markReady = () => {
    voicesReady = true;
    voicesReadyResolvers.forEach((resolve) => resolve());
    voicesReadyResolvers = [];
  };
  if (window.speechSynthesis.getVoices().length > 0) markReady();
  window.speechSynthesis.addEventListener("voiceschanged", markReady);
}

/** Resolves once the browser has actually populated its voice list (Chrome/Safari report an empty list synchronously on first load). */
export function whenVoicesReady(): Promise<void> {
  if (voicesReady || typeof window === "undefined" || !("speechSynthesis" in window)) {
    return Promise.resolve();
  }
  return new Promise((resolve) => voicesReadyResolvers.push(resolve));
}

interface ArabicUtteranceOptions {
  rate?: number;
  gender?: VoiceGender;
}

export function createArabicUtterance(
  text: string,
  { rate = 0.85, gender }: ArabicUtteranceOptions = {},
): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(stripTashkeel(text));
  utterance.lang = "ar-SA";
  utterance.rate = rate;
  const { voice } = pickArabicVoice(gender);
  if (voice) {
    try {
      utterance.voice = voice;
    } catch {
      // Some browsers reject a voice object that doesn't come straight from
      // their own getVoices() list. Falling back to just `lang` still lets
      // the browser pick a sensible default instead of failing to speak.
    }
  }
  return utterance;
}

export function speakArabic(text: string, options?: ArabicUtteranceOptions) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(createArabicUtterance(text, options));
}

export function stopSpeaking() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
}

export function isSpeechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
