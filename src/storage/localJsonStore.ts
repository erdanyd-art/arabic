// Generic localStorage-backed persistence primitives. Every Sprint 3
// storage service (VocabularyStorage, ExpressionStorage, HistoryStorage,
// GoalStorage) is a thin domain wrapper around `createLocalStore` — this is
// the one place that knows how to talk to `window.localStorage` safely
// (corrupted JSON, quota exceeded, Safari private mode never throw into the
// UI, they just degrade to an empty collection).

function readRaw(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeRaw(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // quota exceeded / private-mode storage disabled — silently drop
  }
}

export interface LocalStore<T extends { id: string }> {
  getAll(): T[];
  setAll(items: T[]): void;
  add(item: T): void;
  remove(id: string): void;
  update(id: string, patch: Partial<T>): void;
  clear(): void;
}

/** For collections — vocabulary, expressions, history, goal completions. */
export function createLocalStore<T extends { id: string }>(key: string): LocalStore<T> {
  function getAll(): T[] {
    const raw = readRaw(key);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }
  function setAll(items: T[]): void {
    writeRaw(key, JSON.stringify(items));
  }
  function add(item: T): void {
    setAll([item, ...getAll()]);
  }
  function remove(id: string): void {
    setAll(getAll().filter((item) => item.id !== id));
  }
  function update(id: string, patch: Partial<T>): void {
    setAll(getAll().map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }
  function clear(): void {
    setAll([]);
  }
  return { getAll, setAll, add, remove, update, clear };
}

export interface LocalRecordStore<T> {
  get(): T | null;
  set(value: T): void;
  clear(): void;
}

/** For a single draft record — the in-progress session (SessionStorage). */
export function createLocalRecordStore<T>(key: string): LocalRecordStore<T> {
  function get(): T | null {
    const raw = readRaw(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }
  function set(value: T): void {
    writeRaw(key, JSON.stringify(value));
  }
  function clear(): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
  return { get, set, clear };
}
