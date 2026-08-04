import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SessionHistoryEntry } from "@/lib/types";

interface AppState {
  history: SessionHistoryEntry[];
  addHistoryEntry: (entry: Omit<SessionHistoryEntry, "id" | "completedAt">) => void;
  clearHistory: () => void;
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
    }),
    { name: "lisan-coach-history" },
  ),
);
