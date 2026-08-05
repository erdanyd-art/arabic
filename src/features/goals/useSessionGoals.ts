import { useMemo } from "react";
import type { ChatMessage, Scenario } from "@/types/conversation";

/**
 * Live, in-session goal progress — folds `evaluation.goalsAddressed` over
 * the running conversation. No storage involved (that's GoalStorage's job,
 * a cross-session mastery log written once when the session finishes) —
 * this is purely derived state so the checklist updates immediately as
 * each tutor turn arrives.
 */
export function useSessionGoals(scenario: Scenario, messages: ChatMessage[]) {
  const completedIds = useMemo(() => {
    const validIds = new Set(scenario.objectives.map((o) => o.id));
    const completed = new Set<string>();
    for (const message of messages) {
      for (const id of message.evaluation?.goalsAddressed ?? []) {
        if (validIds.has(id)) completed.add(id);
      }
    }
    return completed;
  }, [scenario, messages]);

  const total = scenario.objectives.length;
  return {
    completedIds,
    completedCount: completedIds.size,
    total,
    isComplete: total > 0 && completedIds.size === total,
  };
}
