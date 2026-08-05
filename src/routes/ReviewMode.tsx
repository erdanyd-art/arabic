import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { useReviewDeck } from "@/features/review/useReviewDeck";
import { Flashcard } from "@/features/review/Flashcard";
import { ReviewDeckEmptyState } from "@/features/review/ReviewDeckEmptyState";
import { ReviewAllCaughtUp } from "@/features/review/ReviewAllCaughtUp";
import { ReviewCompleteScreen } from "@/features/review/ReviewCompleteScreen";

export function ReviewMode() {
  const navigate = useNavigate();
  const { total, hasSavedContent, index, current, isDone, revealed, reveal, mark, rememberedCount, laterCount } =
    useReviewDeck();

  return (
    <AppShell>
      <TopBar title="Ulas" subtitle={total > 0 && !isDone ? `${index + 1}/${total}` : undefined} />
      {total === 0 ? (
        hasSavedContent ? <ReviewAllCaughtUp /> : <ReviewDeckEmptyState />
      ) : isDone ? (
        <ReviewCompleteScreen remembered={rememberedCount} later={laterCount} onFinish={() => navigate("/")} />
      ) : (
        <div className="flex flex-1 flex-col gap-4">
          <Flashcard front={current.front} back={current.back} revealed={revealed} onReveal={reveal} />
          {revealed && (
            <div className="flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => mark("review-later")}>
                Ulas lagi nanti
              </Button>
              <Button className="flex-1" onClick={() => mark("remembered")}>
                Sudah hafal
              </Button>
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
