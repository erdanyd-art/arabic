import { useHistory } from "@/features/history/useHistory";
import type { ConversationHistoryEntry } from "@/types/learning";

const DAY_LABELS = ["Sn", "Sl", "Rb", "Km", "Jm", "Sb", "Mg"];

function countsByDay(entries: ConversationHistoryEntry[]): number[] {
  const counts = new Array(7).fill(0) as number[];
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  for (const entry of entries) {
    const finished = new Date(entry.finishedAt);
    const startOfThatDay = new Date(finished.getFullYear(), finished.getMonth(), finished.getDate());
    const daysAgo = Math.round((startOfToday.getTime() - startOfThatDay.getTime()) / 86_400_000);
    if (daysAgo >= 0 && daysAgo < 7) counts[6 - daysAgo] += 1;
  }
  return counts;
}

/** Plain factual view, no streaks or scores — just "how many sessions each of the last 7 days," matching the no-gamification constraint. */
export function WeeklyActivitySection() {
  const { entries } = useHistory();
  if (entries.length === 0) return null;

  const counts = countsByDay(entries);
  const max = Math.max(1, ...counts);
  const total = counts.reduce((sum, c) => sum + c, 0);

  return (
    <section>
      <p className="mb-3 text-[13px] font-semibold text-muted-foreground">
        Kamu sudah latihan {total}x minggu ini
      </p>
      <div className="flex items-end justify-between gap-2 rounded-2xl bg-surface-muted px-4 py-3.5">
        {counts.map((count, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div className="flex h-12 w-full items-end justify-center">
              <div
                className="w-3 rounded-full bg-primary/70"
                style={{ height: count === 0 ? 2 : `${Math.max(15, (count / max) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-muted-foreground">{DAY_LABELS[i]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
