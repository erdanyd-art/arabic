import type { SendMessageInput, TutorProvider, TutorReply } from "@/types/conversation";

const TRANSLATION_MARKER = "→ ID:";

function parseReply(raw: string): TutorReply {
  const idx = raw.indexOf(TRANSLATION_MARKER);
  if (idx === -1) return { text: raw.trim() };
  return {
    text: raw.slice(0, idx).trim(),
    translation: raw.slice(idx + TRANSLATION_MARKER.length).trim(),
  };
}

interface GrokApiError extends Error {
  kind: "network" | "upstream" | "quota";
}

/**
 * Real AI tutor backed by xAI's Grok API via the local proxy server
 * (server/index.js — the key never reaches the browser). Implements the
 * same `TutorProvider` interface as `MockTutorProvider`, so swapping the
 * default in `useConversation` is the only change needed anywhere.
 *
 * The interface is Promise-based (one final reply, not a stream of
 * chunks) to match `TutorProvider` exactly — so internally this consumes
 * the backend's SSE stream itself and resolves once the full reply has
 * arrived, rather than exposing partial tokens to the caller.
 */
export class GrokTutorProvider implements TutorProvider {
  async sendMessage({ scenario, history }: SendMessageInput): Promise<TutorReply> {
    const res = await fetch("/api/grok/chat/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenario: scenario.description,
        messages: history.map((m) => ({ role: m.role, text: m.text })),
      }),
    });

    if (!res.ok || !res.body) {
      const body = await res.json().catch(() => ({}));
      const kind: GrokApiError["kind"] = res.status === 429 || res.status === 402 ? "quota" : "upstream";
      const err = new Error(body.message || "Permintaan ke Grok gagal.") as GrokApiError;
      err.kind = kind;
      throw err;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let accumulated = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const events = buffer.split("\n\n");
      buffer = events.pop() ?? "";

      for (const evt of events) {
        const line = evt.split("\n").find((l) => l.startsWith("data:"));
        if (!line) continue;
        const jsonStr = line.slice(5).trim();
        if (!jsonStr || jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          // Reasoning models emit `delta.reasoning_content` (internal
          // chain-of-thought) ahead of the real `delta.content` — only the
          // latter is the actual reply meant to be shown/spoken.
          const chunk = parsed?.choices?.[0]?.delta?.content;
          if (typeof chunk === "string") accumulated += chunk;
        } catch {
          // partial/malformed chunk — skip, next chunk usually completes it
        }
      }
    }

    if (!accumulated.trim()) {
      const err = new Error("Grok tidak memberikan balasan.") as GrokApiError;
      err.kind = "upstream";
      throw err;
    }

    return parseReply(accumulated);
  }
}

export const grokTutorProvider = new GrokTutorProvider();
