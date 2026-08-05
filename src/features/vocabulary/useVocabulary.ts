import { VocabularyStorage } from "@/storage/VocabularyStorage";
import { useSavableCollection } from "@/features/shared/useSavableCollection";
import type { VocabularyEntry } from "@/types/learning";

function matchesQuery(item: VocabularyEntry, query: string): boolean {
  return item.arabic.toLowerCase().includes(query) || item.meaning.toLowerCase().includes(query);
}

export function useVocabulary() {
  return useSavableCollection<VocabularyEntry>(VocabularyStorage, matchesQuery);
}
