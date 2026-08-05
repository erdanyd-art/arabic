import { useCallback, useState } from "react";
import { HistoryStorage } from "@/storage/HistoryStorage";
import type { ConversationHistoryEntry } from "@/types/learning";

export function useHistory() {
  const [entries, setEntries] = useState<ConversationHistoryEntry[]>(() => HistoryStorage.getAll());

  const remove = useCallback((id: string) => {
    HistoryStorage.remove(id);
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const refresh = useCallback(() => setEntries(HistoryStorage.getAll()), []);

  return { entries, remove, refresh };
}
