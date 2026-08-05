// Thin wrapper around the browser's Web Speech API (SpeechRecognition /
// webkitSpeechRecognition). Kept framework-agnostic on purpose — React
// lifecycle concerns (state, cleanup) live in hooks/useSpeechRecognition.ts,
// this file only knows how to talk to the browser API itself.

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): SpeechRecognitionCtor | undefined {
  if (typeof window === "undefined") return undefined;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export function isSpeechRecognitionSupported(): boolean {
  return typeof getRecognitionCtor() !== "undefined";
}

export interface SpeechRecognizerCallbacks {
  onInterim: (text: string) => void;
  onFinal: (text: string) => void;
  onError: (error: string) => void;
  onEnd: () => void;
}

export interface SpeechRecognizer {
  start: () => void;
  stop: () => void;
  abort: () => void;
}

export function createSpeechRecognizer(callbacks: SpeechRecognizerCallbacks): SpeechRecognizer | null {
  const Ctor = getRecognitionCtor();
  if (!Ctor) return null;

  const recognition = new Ctor();
  recognition.lang = "ar-SA";
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    let finalChunk = "";
    let interimChunk = "";
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const result = event.results[i];
      if (result.isFinal) finalChunk += result[0].transcript;
      else interimChunk += result[0].transcript;
    }
    if (finalChunk) callbacks.onFinal(finalChunk);
    callbacks.onInterim(interimChunk);
  };
  recognition.onerror = (event) => callbacks.onError(event.error);
  recognition.onend = () => callbacks.onEnd();

  return {
    start: () => recognition.start(),
    stop: () => recognition.stop(),
    abort: () => recognition.abort(),
  };
}
