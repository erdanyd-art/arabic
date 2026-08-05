import { Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface GoalsProgressBadgeProps {
  completed: number;
  total: number;
  className?: string;
}

/** Compact "goals X/Y" indicator reused in the session header, history cards, and the dashboard. */
export function GoalsProgressBadge({ completed, total, className }: GoalsProgressBadgeProps) {
  if (total === 0) return null;
  return (
    <div className={className}>
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
        <Target className="h-3 w-3" />
        <span>
          {completed}/{total} tujuan
        </span>
      </div>
      <Progress value={(completed / total) * 100} className="mt-1 h-1 w-16" />
    </div>
  );
}
