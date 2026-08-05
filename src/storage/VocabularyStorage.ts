import type { VocabularyEntry, ReviewStatus } from "@/types/learning";
import { createLocalStore } from "./localJsonStore";
import { STORAGE_KEYS } from "./keys";

const store = createLocalStore<VocabularyEntry>(STORAGE_KEYS.vocabulary);

function isDuplicate(arabic: string, scenarioId: string, existing: VocabularyEntry[]): boolean {
  return existing.some((e) => e.arabic === arabic && e.scenarioId === scenarioId);
}

export const VocabularyStorage = {
  getAll: store.getAll,
  remove: store.remove,

  /** No-ops if this exact word was already saved for this scenario, so tapping "save" twice never creates a duplicate row. */
  save(entry: Omit<VocabularyEntry, "id" | "savedAt" | "favorite">): VocabularyEntry | null {
    const existing = store.getAll();
    if (isDuplicate(entry.arabic, entry.scenarioId, existing)) return null;
    const saved: VocabularyEntry = {
      ...entry,
      id: crypto.randomUUID(),
      savedAt: new Date().toISOString(),
      favorite: false,
    };
    store.add(saved);
    return saved;
  },

  toggleFavorite(id: string): void {
    const entry = store.getAll().find((e) => e.id === id);
    if (entry) store.update(id, { favorite: !entry.favorite });
  },

  setReviewStatus(id: string, status: ReviewStatus): void {
    store.update(id, { reviewStatus: status, lastReviewedAt: new Date().toISOString() });
  },
};
