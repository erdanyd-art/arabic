import { useCallback, useMemo, useState } from "react";
import type { ScenarioCategory } from "@/types/conversation";

export interface Savable {
  id: string;
  favorite: boolean;
  savedAt: string;
  scenarioId: ScenarioCategory;
}

export interface SavableStore<T extends Savable> {
  getAll(): T[];
  remove(id: string): void;
  toggleFavorite(id: string): void;
}

/**
 * Search/filter/sort/favorite logic shared by the Vocabulary Notebook and
 * Saved Expressions features — both are "a saved, favoritable, scenario-
 * tagged collection" underneath, so this is the one place that logic
 * lives. Each feature's own hook just supplies its storage service and a
 * domain-specific text matcher.
 */
export function useSavableCollection<T extends Savable>(
  store: SavableStore<T>,
  matchesQuery: (item: T, query: string) => boolean,
) {
  const [items, setItems] = useState<T[]>(() => store.getAll());
  const [query, setQuery] = useState("");
  const [scenarioFilter, setScenarioFilter] = useState<ScenarioCategory | "all">("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const remove = useCallback(
    (id: string) => {
      store.remove(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    },
    [store],
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      store.toggleFavorite(id);
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, favorite: !item.favorite } : item)));
    },
    [store],
  );

  const refresh = useCallback(() => setItems(store.getAll()), [store]);

  // always newest-first (the one sort the brief asks for) — favorites
  // don't get pinned to the top separately, "Favorite" is its own filter.
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((item) => (favoritesOnly ? item.favorite : true))
      .filter((item) => (scenarioFilter === "all" ? true : item.scenarioId === scenarioFilter))
      .filter((item) => (q ? matchesQuery(item, q) : true))
      .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
  }, [items, favoritesOnly, scenarioFilter, query, matchesQuery]);

  return {
    items: visible,
    totalCount: items.length,
    query,
    setQuery,
    scenarioFilter,
    setScenarioFilter,
    favoritesOnly,
    setFavoritesOnly,
    remove,
    toggleFavorite,
    refresh,
  };
}
