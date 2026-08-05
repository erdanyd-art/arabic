import type { SavedExpression, ReviewStatus } from "@/types/learning";
import { createLocalStore } from "./localJsonStore";
import { STORAGE_KEYS } from "./keys";

const store = createLocalStore<SavedExpression>(STORAGE_KEYS.expressions);

function isDuplicate(arabic: string, scenarioId: string, existing: SavedExpression[]): boolean {
  return existing.some((e) => e.arabic === arabic && e.scenarioId === scenarioId);
}

export const ExpressionStorage = {
  getAll: store.getAll,
  remove: store.remove,

  save(entry: Omit<SavedExpression, "id" | "savedAt" | "favorite">): SavedExpression | null {
    const existing = store.getAll();
    if (isDuplicate(entry.arabic, entry.scenarioId, existing)) return null;
    const saved: SavedExpression = {
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
