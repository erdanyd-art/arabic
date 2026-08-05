import { HistoryStorage } from "@/storage/HistoryStorage";
import { GoalStorage } from "@/storage/GoalStorage";
import { SessionStorage } from "@/storage/SessionStorage";
import { computeSessionSummary } from "@/features/summary/computeSessionSummary";
import type { ChatMessage, Scenario } from "@/types/conversation";
import type { ConversationHistoryEntry } from "@/types/learning";

interface FinishSessionInput {
  scenario: Scenario;
  messages: ChatMessage[];
  startedAt: string;
}

/**
 * Ends the active session: computes the deterministic summary, archives
 * the transcript to HistoryStorage, records which goals were completed
 * (GoalStorage), and clears the in-progress draft (SessionStorage). Called
 * from AiSpeakingSession's "Selesai" button.
 */
export function finishSession({ scenario, messages, startedAt }: FinishSessionInput): ConversationHistoryEntry {
  const finishedAt = new Date().toISOString();
  const durationSeconds = Math.max(
    0,
    Math.round((new Date(finishedAt).getTime() - new Date(startedAt).getTime()) / 1000),
  );

  const validObjectiveIds = new Set(scenario.objectives.map((o) => o.id));
  const objectivesCompleted = new Set<string>();
  for (const message of messages) {
    for (const id of message.evaluation?.goalsAddressed ?? []) {
      if (validObjectiveIds.has(id)) objectivesCompleted.add(id);
    }
  }

  // Must read history for "recently practiced" before writing this session into it.
  const recentScenarioIds = HistoryStorage.getAll()
    .slice(0, 5)
    .map((entry) => entry.scenarioId);

  const summary = computeSessionSummary({
    scenario,
    messages,
    durationSeconds,
    objectivesCompleted: objectivesCompleted.size,
    objectivesTotal: scenario.objectives.length,
    recentScenarioIds,
  });

  const entry: ConversationHistoryEntry = {
    id: crypto.randomUUID(),
    scenarioId: scenario.id,
    scenarioTitle: scenario.title,
    difficulty: scenario.difficulty,
    startedAt,
    finishedAt,
    durationSeconds,
    messageCount: messages.length,
    messages,
    objectivesCompleted: [...objectivesCompleted],
    objectivesTotal: scenario.objectives.length,
    summary,
  };

  HistoryStorage.add(entry);
  GoalStorage.recordCompletions(scenario.id, [...objectivesCompleted], entry.id);
  SessionStorage.clear();

  return entry;
}
