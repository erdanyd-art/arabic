import { ExpressionStorage } from "@/storage/ExpressionStorage";
import { useSavableCollection } from "@/features/shared/useSavableCollection";
import type { SavedExpression } from "@/types/learning";

function matchesQuery(item: SavedExpression, query: string): boolean {
  return item.arabic.toLowerCase().includes(query) || item.translation.toLowerCase().includes(query);
}

export function useExpressions() {
  return useSavableCollection<SavedExpression>(ExpressionStorage, matchesQuery);
}
