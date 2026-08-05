import type { AiProvider, ChatMessage } from "@/types/conversation";
import { EVAL_SEPARATOR } from "@/prompts/system";

// Generic, scenario-agnostic reply lines — the mock provider deliberately
// doesn't know about Scenario objects (AiProvider only sees systemPrompt +
// history, same as the real GrokProvider), so it can't pick a
// scenario-specific bank the way the old standalone mock did. This is a
// fallback/offline path now that Grok is the live default; it just needs
// to produce validly-shaped output so the rest of the pipeline (parsing,
// EvaluationCard, etc.) keeps working without an API key.
const GENERIC_REPLIES: Array<{ text: string; translation: string }> = [
  { text: "أهلاً! هل يمكنك أن تخبرني المزيد؟", translation: "Halo! Bisa cerita lebih lanjut?" },
  { text: "فهمت. ماذا تريد أن تفعل بعد ذلك؟", translation: "Saya paham. Apa yang ingin kamu lakukan selanjutnya?" },
  { text: "هذا جيد جدًا! حاول أن تكمل الجملة.", translation: "Bagus sekali! Coba lanjutkan kalimatnya." },
  { text: "رائع، لنكمل المحادثة.", translation: "Keren, ayo lanjutkan percakapannya." },
];

let cursor = 0;

function buildMockEvaluationJson(userText: string): string {
  const words = userText.trim().split(/\s+/).filter(Boolean).slice(0, 3);
  const evaluation = {
    grammar: { correct: true, note: "Kalimatmu bisa dipahami dengan baik (mode demo, belum dinilai AI sungguhan)." },
    natural: { rewrite: "", note: "Tidak ada koreksi di mode demo." },
    vocabulary: words.map((w) => ({ word: w, meaning: "(mode demo — arti sungguhan muncul saat AI aktif)" })),
    fluency: { note: "Terus berlatih untuk membangun kelancaran." },
    suggestion: "Coba tambahkan satu kalimat lagi untuk memperluas jawabanmu.",
    goalsAddressed: [] as string[],
  };
  return JSON.stringify(evaluation);
}

/**
 * Offline/fallback implementation of `AiProvider` — used when no Grok key
 * is configured, or as a zero-cost path during development. Returns text
 * in the exact same `<reply>\n→ ID: ...\n===EVAL===\n<json>` shape
 * `tutorService.ts` expects from a real provider, so swapping providers
 * never requires touching the parsing logic.
 */
export class MockProvider implements AiProvider {
  async complete(_systemPrompt: string, history: ChatMessage[]): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));

    const lastUserText = [...history].reverse().find((m) => m.role === "user")?.text ?? "";
    const reply = GENERIC_REPLIES[cursor % GENERIC_REPLIES.length];
    cursor += 1;

    return `${reply.text}\n→ ID: ${reply.translation}\n${EVAL_SEPARATOR}\n${buildMockEvaluationJson(lastUserText)}`;
  }
}

export const mockProvider = new MockProvider();
