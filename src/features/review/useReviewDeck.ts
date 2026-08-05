import { useState } from "react";
import { VocabularyStorage } from "@/storage/VocabularyStorage";
import { ExpressionStorage } from "@/storage/ExpressionStorage";
import type { ReviewStatus } from "@/types/learning";
import type { ScenarioCategory } from "@/types/conversation";

export interface Flashcard {
  id: string;
  kind: "vocabulary" | "expression";
  front: string;
  back: string;
  scenarioId: ScenarioCategory;
}

function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildDeck(): Flashcard[] {
  const vocab: Flashcard[] = VocabularyStorage.getAll()
    .filter((e) => e.reviewStatus !== "remembered")
    .map((e) => ({ id: e.id, kind: "vocabulary", front: e.arabic, back: e.meaning, scenarioId: e.scenarioId }));
  const expressions: Flashcard[] = ExpressionStorage.getAll()
    .filter((e) => e.reviewStatus !== "remembered")
    .map((e) => ({ id: e.id, kind: "expression", front: e.arabic, back: e.translation, scenarioId: e.scenarioId }));
  return shuffle([...vocab, ...expressions]);
}

/**
 * Lightweight flashcard review — no spaced-repetition scheduling. Session
 * progress (index/counters) is ephemeral component state, reset every
 * visit; only `reviewStatus` on each entry persists (via
 * VocabularyStorage/ExpressionStorage), which is also what keeps
 * "remembered" cards out of the deck on the next visit.
 */
export function useReviewDeck() {
  const [deck] = useState<Flashcard[]>(buildDeck);
  // Distinguishes "nothing saved yet" from "everything's already
  // remembered" — both leave `deck` empty but deserve very different
  // empty-state copy (one's a nudge to save words, the other's a win).
  const [hasSavedContent] = useState(
    () => VocabularyStorage.getAll().length + ExpressionStorage.getAll().length > 0,
  );
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [rememberedCount, setRememberedCount] = useState(0);
  const [laterCount, setLaterCount] = useState(0);

  const current = deck[index];
  const isDone = deck.length > 0 && index >= deck.length;

  function reveal() {
    setRevealed(true);
  }

  function mark(status: ReviewStatus) {
    if (!current) return;
    const storage = current.kind === "vocabulary" ? VocabularyStorage : ExpressionStorage;
    storage.setReviewStatus(current.id, status);
    if (status === "remembered") setRememberedCount((c) => c + 1);
    else setLaterCount((c) => c + 1);
    setRevealed(false);
    setIndex((i) => i + 1);
  }

  return {
    total: deck.length,
    hasSavedContent,
    index,
    current,
    isDone,
    revealed,
    reveal,
    mark,
    rememberedCount,
    laterCount,
  };
}
