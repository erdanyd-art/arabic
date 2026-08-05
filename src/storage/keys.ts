// Single source of truth for every Sprint 3 localStorage key. Deliberately
// distinct from the existing Zustand persist key `lisan-coach-history`
// (src/store/useAppStore.ts, legacy quiz-mode history) to avoid collision.
export const STORAGE_KEYS = {
  vocabulary: "lisan-coach-vocabulary",
  expressions: "lisan-coach-expressions",
  conversationHistory: "lisan-coach-conversation-history",
  goals: "lisan-coach-goals",
  activeSession: "lisan-coach-active-session",
} as const;
