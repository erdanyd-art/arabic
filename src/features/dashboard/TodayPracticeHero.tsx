import { Check } from "lucide-react";
import { GoalStorage } from "@/storage/GoalStorage";
import { DIFFICULTY_LABEL } from "@/types/conversation";
import { cn } from "@/lib/utils";
import { useTodayScenario } from "./useTodayScenario";

/**
 * The heart of the app — one continuous typographic block, not a bordered
 * card with an <hr>. Its own larger radius + tint (not the standard
 * rounded-lg/shadow-resting used everywhere else) is deliberate: this is
 * the one thing on the page that should look unlike anything around it.
 * Objectives read from GoalStorage's cross-session log — real progress,
 * not a static mockup checklist.
 */
export function TodayPracticeHero() {
  const { scenario, isSuggested } = useTodayScenario();
  const completedIds = GoalStorage.getCompletedObjectiveIds(scenario.id);

  return (
    <section className="rounded-xl bg-primary-muted/40 p-7">
      <p className="text-sm font-semibold text-primary">
        {isSuggested ? "Misi hari ini" : "Lanjutkan misi"}
      </p>

      <div className="mt-2 flex items-center gap-3">
        <span className="text-3xl leading-none" aria-hidden="true">
          {scenario.icon}
        </span>
        <h2 className="text-[26px] font-extrabold leading-tight tracking-tight text-foreground">
          {scenario.title}
        </h2>
      </div>

      <div className="mt-1.5 flex items-center gap-3 text-sm text-muted-foreground">
        <span>{DIFFICULTY_LABEL[scenario.difficulty]}</span>
        <span className="h-1 w-1 rounded-full bg-border" />
        <span>{scenario.estimatedMinutes} menit</span>
      </div>

      {scenario.objectives.length > 0 && (
        <ul className="mt-6 space-y-3">
          {scenario.objectives.map((objective) => {
            const done = completedIds.has(objective.id);
            return (
              <li key={objective.id} className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors",
                    done ? "border-success bg-success text-success-foreground" : "border-foreground/25 bg-transparent",
                  )}
                >
                  {done && <Check className="h-3 w-3" strokeWidth={3} />}
                </span>
                <span className={cn("text-[15px]", done ? "text-foreground" : "text-foreground/70")}>
                  {objective.label}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
