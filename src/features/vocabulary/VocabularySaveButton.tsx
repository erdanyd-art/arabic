import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { VocabularyStorage } from "@/storage/VocabularyStorage";
import type { VocabularyNote } from "@/types/conversation";
import type { ScenarioCategory } from "@/types/conversation";

interface VocabularySaveButtonProps {
  word: VocabularyNote;
  example: string;
  scenarioId: ScenarioCategory;
}

/** Saves one word from an EvaluationCard's vocabulary list into the persistent Vocabulary Notebook (storage/VocabularyStorage.ts). */
export function VocabularySaveButton({ word, example, scenarioId }: VocabularySaveButtonProps) {
  const [saved, setSaved] = useState(false);

  function handleSave() {
    if (saved) return;
    const result = VocabularyStorage.save({
      arabic: word.word,
      meaning: word.meaning,
      example,
      scenarioId,
    });
    setSaved(true);
    toast(result ? "Kosakata disimpan ke catatan" : "Kosakata ini sudah ada di catatan");
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={handleSave}
      disabled={saved}
      aria-label={saved ? "Kosakata tersimpan" : "Simpan kosakata"}
      className="h-5 w-5 shrink-0 text-muted-foreground disabled:opacity-100"
    >
      {saved ? <BookmarkCheck className="h-3 w-3 text-primary" /> : <Bookmark className="h-3 w-3" />}
    </Button>
  );
}
