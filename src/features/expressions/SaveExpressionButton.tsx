import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ExpressionStorage } from "@/storage/ExpressionStorage";
import type { ScenarioCategory } from "@/types/conversation";

interface SaveExpressionButtonProps {
  arabic: string;
  translation?: string;
  scenarioId: ScenarioCategory;
}

/** Bookmarks a tutor reply into Saved Expressions (storage/ExpressionStorage.ts). Sits in ChatBubble's tutor action row, next to Replay/Copy. */
export function SaveExpressionButton({ arabic, translation, scenarioId }: SaveExpressionButtonProps) {
  const [saved, setSaved] = useState(false);

  function handleSave() {
    if (saved) return;
    const result = ExpressionStorage.save({
      arabic,
      translation: translation ?? "",
      scenarioId,
    });
    setSaved(true);
    toast(result ? "Ungkapan disimpan" : "Ungkapan ini sudah tersimpan");
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-6 px-1.5 text-[11px] text-muted-foreground disabled:opacity-100"
      onClick={handleSave}
      disabled={saved}
      aria-label={saved ? "Ungkapan tersimpan" : "Simpan ungkapan ini"}
    >
      {saved ? <BookmarkCheck className="h-3 w-3 text-primary" /> : <Bookmark className="h-3 w-3" />}
      {saved ? "Tersimpan" : "Simpan"}
    </Button>
  );
}
