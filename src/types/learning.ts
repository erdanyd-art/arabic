import type { ChatMessage, Difficulty, ScenarioCategory, VocabularyNote } from "./conversation";

// Sprint 3 — Learning System. Kept separate from `types/conversation.ts`
// (the live AI turn contract) and `lib/types.ts` (legacy quiz-mode history)
// on purpose: `VocabularyEntry` below is a *saved notebook entry*, not the
// same thing as `VocabularyNote` (a per-message Evaluation field it's
// sourced from); `ConversationHistoryEntry` is a completed AI session
// record, not the same thing as the legacy `SessionHistoryEntry`.

export type ReviewStatus = "remembered" | "review-later";

export interface VocabularyEntry {
  id: string;
  arabic: string;
  meaning: string;
  example?: string;
  scenarioId: ScenarioCategory;
  savedAt: string;
  favorite: boolean;
  reviewStatus?: ReviewStatus;
  lastReviewedAt?: string;
}

export interface SavedExpression {
  id: string;
  arabic: string;
  translation: string;
  scenarioId: ScenarioCategory;
  savedAt: string;
  favorite: boolean;
  reviewStatus?: ReviewStatus;
  lastReviewedAt?: string;
}

export interface GoalCompletionRecord {
  id: string;
  scenarioId: ScenarioCategory;
  objectiveId: string;
  sessionId: string;
  completedAt: string;
}

export interface SessionSummary {
  scenarioId: ScenarioCategory;
  durationSeconds: number;
  messageCount: number;
  vocabularyLearned: VocabularyNote[];
  grammarObservations: string[];
  strengths: string[];
  areasForImprovement: string[];
  suggestedNextScenarioId: ScenarioCategory;
}

export interface ConversationHistoryEntry {
  id: string;
  scenarioId: ScenarioCategory;
  scenarioTitle: string;
  difficulty: Difficulty;
  startedAt: string;
  finishedAt: string;
  durationSeconds: number;
  messageCount: number;
  messages: ChatMessage[];
  objectivesCompleted: string[];
  objectivesTotal: number;
  summary: SessionSummary;
}

/** The single in-progress session draft — see storage/SessionStorage.ts. */
export interface ActiveSessionDraft {
  scenarioId: ScenarioCategory;
  startedAt: string;
  messages: ChatMessage[];
}
