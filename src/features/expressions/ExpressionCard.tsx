import { Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getScenario } from "@/data/scenarios";
import { formatShortDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { SavedExpression } from "@/types/learning";

interface ExpressionCardProps {
  entry: SavedExpression;
  onToggleFavorite: (id: string) => void;
  onRemove: (id: string) => void;
}

export function ExpressionCard({ entry, onToggleFavorite, onRemove }: ExpressionCardProps) {
  const scenario = getScenario(entry.scenarioId);

  return (
    <div className="flex items-start justify-between gap-3 py-3.5">
      <div className="min-w-0 flex-1">
        <p lang="ar" dir="rtl" className="font-arabic text-left text-lg leading-snug text-foreground">
          {entry.arabic}
        </p>
        {entry.translation && <p className="mt-0.5 text-sm text-muted-foreground">{entry.translation}</p>}
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          {scenario.icon} {scenario.title} · {formatShortDate(entry.savedAt)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => onToggleFavorite(entry.id)}
          aria-label={entry.favorite ? "Hapus dari favorit" : "Tandai favorit"}
        >
          <Star className={cn("h-4 w-4", entry.favorite ? "fill-accent text-accent" : "text-muted-foreground")} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => onRemove(entry.id)}
          aria-label="Hapus ungkapan"
          className="text-muted-foreground hover:text-danger"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
