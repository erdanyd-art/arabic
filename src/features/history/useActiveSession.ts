import { useCallback, useEffect, useRef } from "react";
import { SessionStorage } from "@/storage/SessionStorage";
import type { ChatMessage, ScenarioCategory } from "@/types/conversation";

/**
 * One-way sync: live conversation state -> SessionStorage's single draft
 * record. Never reads back into useConversation mid-session (avoids
 * stale-overwrite loops) — this is what gives `finishSession` an accurate
 * `startedAt` (useConversation itself has no concept of session start) and
 * lets the Dashboard offer "Continue Last Session".
 */
export function useActiveSession(scenarioId: ScenarioCategory | undefined, messages: ChatMessage[]) {
  const startedAtRef = useRef<string | null>(null);

  useEffect(() => {
    if (!scenarioId) return;
    const existing = SessionStorage.get();
    startedAtRef.current =
      existing && existing.scenarioId === scenarioId ? existing.startedAt : new Date().toISOString();
    // only re-stamp when the scenario itself changes, not on every message
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioId]);

  useEffect(() => {
    if (!scenarioId || !startedAtRef.current) return;
    SessionStorage.set({ scenarioId, startedAt: startedAtRef.current, messages });
  }, [scenarioId, messages]);

  const clear = useCallback(() => {
    startedAtRef.current = null;
    SessionStorage.clear();
  }, []);

  return { startedAt: startedAtRef, clear };
}
