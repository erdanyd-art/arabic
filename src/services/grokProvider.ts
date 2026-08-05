import type { AiProvider, ChatMessage } from "@/types/conversation";

interface GrokApiError extends Error {
  kind: "network" | "upstream" | "quota";
}

/**
 * Lowest layer of the AI stack: raw text in, raw text out, via xAI's Grok
 * API through the local proxy server (server/index.js — the API key never
 * reaches the browser). Knows nothing about personas, scenarios, or
 * evaluation JSON — that's services/tutorService.ts's job, one layer up.
 *
 * The interface is Promise-based (one final string, not a stream of
 * chunks): this consumes the backend's SSE stream itself and resolves
 * once the full reply has arrived.
 */
export class GrokProvider implements AiProvider {
  async complete(systemPrompt: string, history: ChatMessage[]): Promise<string> {
    const res = await fetch("/api/grok/chat/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemPrompt,
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
          // latter is the actual output meant to be parsed/shown.
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

    return accumulated;
  }
}

export const grokProvider = new GrokProvider();
