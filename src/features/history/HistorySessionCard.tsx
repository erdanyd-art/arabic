import { MessageCircle } from "lucide-react";
import { getScenario } from "@/data/scenarios";
import { DIFFICULTY_LABEL } from "@/types/conversation";
import { formatDuration, formatShortDate } from "@/lib/date";
import { GoalsProgressBadge } from "@/features/goals/GoalsProgressBadge";
import type { ConversationHistoryEntry } from "@/types/learning";

interface HistorySessionCardProps {
  entry: ConversationHistoryEntry;
  onOpen: (id: string) => void;
}

export function HistorySessionCard({ entry, onOpen }: HistorySessionCardProps) {
  const scenario = getScenario(entry.scenarioId);

  return (
    <button
      type="button"
      onClick={() => onOpen(entry.id)}
      className="flex w-full items-center gap-3 py-3.5 text-left transition-colors hover:bg-surface-muted"
    >
      <span className="text-xl" aria-hidden="true">
        {scenario.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{entry.scenarioTitle}</p>
        <p className="text-xs text-muted-foreground">
          {formatShortDate(entry.finishedAt)} · {DIFFICULTY_LABEL[entry.difficulty]} · {formatDuration(entry.durationSeconds)}
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
          <MessageCircle className="h-3 w-3" /> {entry.messageCount} pesan · {entry.summary.vocabularyLearned.length} kosakata
        </p>
      </div>
      <GoalsProgressBadge completed={entry.objectivesCompleted.length} total={entry.objectivesTotal} className="shrink-0" />
    </button>
  );
}
