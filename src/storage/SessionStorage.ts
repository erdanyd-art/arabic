import type { ActiveSessionDraft } from "@/types/learning";
import { createLocalRecordStore } from "./localJsonStore";
import { STORAGE_KEYS } from "./keys";

// The single in-progress session draft. `useConversation.ts`'s `messages`
// is pure React state with no persistence and no start-time concept —
// this is what makes "Continue Last Session" (Dashboard) and an accurate
// `durationSeconds` at finish time possible. One-way sync only: written
// from live conversation state, never read back into useConversation mid
// session (see features/history/useActiveSession.ts).
const store = createLocalRecordStore<ActiveSessionDraft>(STORAGE_KEYS.activeSession);

export const SessionStorage = {
  get: store.get,
  set: store.set,
  clear: store.clear,
};
