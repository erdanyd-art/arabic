import type { ConversationHistoryEntry } from "@/types/learning";
import { createLocalStore } from "./localJsonStore";
import { STORAGE_KEYS } from "./keys";

const MAX_ENTRIES = 50;

const store = createLocalStore<ConversationHistoryEntry>(STORAGE_KEYS.conversationHistory);

export const HistoryStorage = {
  /** Newest-first — every write already prepends (see localJsonStore.add), this just documents the contract. */
  getAll(): ConversationHistoryEntry[] {
    return store.getAll();
  },

  getById(id: string): ConversationHistoryEntry | undefined {
    return store.getAll().find((e) => e.id === id);
  },

  add(entry: ConversationHistoryEntry): void {
    store.add(entry);
    const all = store.getAll();
    if (all.length > MAX_ENTRIES) store.setAll(all.slice(0, MAX_ENTRIES));
  },

  remove: store.remove,
};
