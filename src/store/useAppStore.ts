import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SessionHistoryEntry } from "@/lib/types";
import type { ScenarioCategory } from "@/types/conversation";

interface AppState {
  history: SessionHistoryEntry[];
  addHistoryEntry: (entry: Omit<SessionHistoryEntry, "id" | "completedAt">) => void;
  clearHistory: () => void;
  /** Which AI Speaking scenario was picked most recently — only the id + timestamp are stored, not a snapshot, so Home always reflects current scenario metadata (title/difficulty/duration) from `data/scenarios.ts`. */
  lastAiScenarioId: ScenarioCategory | null;
  lastAiScenarioAt: string | null;
  setLastAiScenario: (scenarioId: ScenarioCategory) => void;

  /** Display name only — no accounts, no auth. Set once via OnboardingDialog, used to personalize the homepage greeting. */
  userName: string | null;
  setUserName: (name: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      history: [],
      addHistoryEntry: (entry) =>
        set((state) => ({
          history: [
            {
              ...entry,
              id: crypto.randomUUID(),
              completedAt: new Date().toISOString(),
            },
            ...state.history,
          ].slice(0, 20),
        })),
      clearHistory: () => set({ history: [] }),

      lastAiScenarioId: null,
      lastAiScenarioAt: null,
      setLastAiScenario: (scenarioId) =>
        set({ lastAiScenarioId: scenarioId, lastAiScenarioAt: new Date().toISOString() }),

      userName: null,
      setUserName: (name) => set({ userName: name?.trim() || null }),
    }),
    { name: "lisan-coach-history" },
  ),
);
