import { useCallback, useRef, useState } from "react";
import { mockTutorProvider } from "@/services/mockTutor";
import { createArabicUtterance, stopSpeaking as stopTts } from "@/lib/speech";
import type { ChatMessage, Scenario, TutorProvider } from "@/types/conversation";

export type ConversationStatus = "idle" | "thinking" | "speaking" | "error";
export type ConversationErrorKind = "network" | "quota" | "upstream" | "unknown";

interface ConversationError {
  kind: ConversationErrorKind;
  message: string;
}

function newId() {
  return crypto.randomUUID();
}

/**
 * Orchestrates a scenario-based conversation against a `TutorProvider`.
 * Defaults to `mockTutorProvider` — pass a different provider (e.g. a
 * future `GeminiTutorProvider`) to swap the brain behind the exact same
 * UI with no other code changes.
 */
export function useConversation(scenario: Scenario | null, provider: TutorProvider = mockTutorProvider) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<ConversationStatus>("idle");
  const [error, setError] = useState<ConversationError | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const lastUserTextRef = useRef<string>("");

  const speak = useCallback((id: string, text: string) => {
    stopTts();
    setSpeakingId(id);
    setStatus("speaking");
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSpeakingId(null);
      setStatus("idle");
      return;
    }
    const utterance = createArabicUtterance(text, { rate: 0.9 });
    utterance.onend = () => {
      setSpeakingId(null);
      setStatus("idle");
    };
    utterance.onerror = () => {
      setSpeakingId(null);
      setStatus("idle");
    };
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopTutorSpeaking = useCallback(() => {
    stopTts();
    setSpeakingId(null);
    setStatus("idle");
  }, []);

  const replay = useCallback(
    (id: string) => {
      if (speakingId === id) return; // guard against double playback
      const target = messages.find((m) => m.id === id);
      if (target) speak(id, target.text);
    },
    [messages, speak, speakingId],
  );

  const sendMessage = useCallback(
    async (userText: string) => {
      const trimmed = userText.trim();
      if (!trimmed || !scenario) return;
      lastUserTextRef.current = trimmed;
      setError(null);

      const userMsg: ChatMessage = { id: newId(), role: "user", text: trimmed, timestamp: Date.now() };
      setMessages((prev) => [...prev, userMsg]);
      setStatus("thinking");

      try {
        const history = [...messages, userMsg];
        const reply = await provider.sendMessage({ scenario, history, message: trimmed });
        const tutorMsg: ChatMessage = {
          id: newId(),
          role: "tutor",
          text: reply.text,
          translation: reply.translation,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, tutorMsg]);
        setError(null);
        speak(tutorMsg.id, tutorMsg.text);
      } catch (err) {
        setMessages((prev) =>
          prev.map((m) => (m.id === userMsg.id ? { ...m, failed: true } : m)),
        );
        const kind = (err as { kind?: ConversationErrorKind })?.kind ?? "unknown";
        const providerMessage = err instanceof Error ? err.message : undefined;
        const message =
          kind === "quota"
            ? "Kuota AI habis untuk saat ini. Coba lagi nanti."
            : kind === "network"
              ? "Gagal terhubung ke AI. Periksa koneksi internetmu."
              : (providerMessage ?? "Tutor gagal merespons. Coba lagi?");
        setError({ kind, message });
        setStatus("error");
      }
    },
    [messages, provider, scenario, speak],
  );

  const retryLast = useCallback(() => {
    if (!lastUserTextRef.current) return;
    setMessages((prev) => {
      // drop the trailing failed user message, then resend it fresh
      const lastUserIdx = [...prev].reverse().findIndex((m) => m.role === "user" && m.failed);
      if (lastUserIdx === -1) return prev;
      const next = [...prev];
      next.splice(next.length - 1 - lastUserIdx, 1);
      return next;
    });
    sendMessage(lastUserTextRef.current);
  }, [sendMessage]);

  const clear = useCallback(() => {
    stopTts();
    setMessages([]);
    setStatus("idle");
    setError(null);
    setSpeakingId(null);
  }, []);

  const downloadTranscript = useCallback(
    (format: "md" | "txt") => {
      if (messages.length === 0) return;
      const lines = messages.map((m) => {
        const speaker = m.role === "user" ? "Kamu" : "Tutor";
        const body = format === "md" ? `**${speaker}:** ${m.text}` : `${speaker}: ${m.text}`;
        return m.translation ? `${body}\n${format === "md" ? "> " : "   "}${m.translation}` : body;
      });
      const content = lines.join("\n\n");
      const blob = new Blob([content], { type: format === "md" ? "text/markdown" : "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `percakapan.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    },
    [messages],
  );

  return {
    messages,
    status,
    error,
    speakingId,
    sendMessage,
    retryLast,
    clear,
    downloadTranscript,
    stopTutorSpeaking,
    replay,
  };
}
