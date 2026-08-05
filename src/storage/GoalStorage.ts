import type { GoalCompletionRecord } from "@/types/learning";
import type { ScenarioCategory } from "@/types/conversation";
import { createLocalStore } from "./localJsonStore";
import { STORAGE_KEYS } from "./keys";

// Cross-session mastery log — distinct from the live, in-session progress
// tracked by features/goals/useSessionGoals.ts (which reads straight off
// the current conversation's messages, no storage involved) and from
// HistoryStorage (which snapshots per-session completion, not a running
// log across all time). This is what would let a future "which goals have
// I ever completed in this scenario" view exist without recomputing from
// every past transcript.
const store = createLocalStore<GoalCompletionRecord>(STORAGE_KEYS.goals);

export const GoalStorage = {
  recordCompletions(scenarioId: ScenarioCategory, objectiveIds: string[], sessionId: string): void {
    if (objectiveIds.length === 0) return;
    const now = new Date().toISOString();
    const records: GoalCompletionRecord[] = objectiveIds.map((objectiveId) => ({
      id: crypto.randomUUID(),
      scenarioId,
      objectiveId,
      sessionId,
      completedAt: now,
    }));
    store.setAll([...records, ...store.getAll()]);
  },

  getCompletedObjectiveIds(scenarioId: ScenarioCategory): Set<string> {
    return new Set(store.getAll().filter((r) => r.scenarioId === scenarioId).map((r) => r.objectiveId));
  },
};
